const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function translate_epub(inputPath, settings, onProgress, isPaused) {
  return new Promise((resolve, reject) => {
    try {
      // 检查Python是否可用
      const pythonVersion = require('child_process').execSync('python3 --version').toString();
      console.log('Python版本:', pythonVersion);

      // 生成输出路径
      const outputPath = inputPath.replace('.epub', '_bilingual.epub');
      
      const pythonScript = path.join(__dirname, '../../translate_epub.py');
      
      // 检查脚本是否存在
      if (!fs.existsSync(pythonScript)) {
        throw new Error(`翻译脚本不存在: ${pythonScript}`);
      }
      
      // 检查输入文件是否存在
      if (!fs.existsSync(inputPath)) {
        throw new Error(`输入文件不存在: ${inputPath}`);
      }
      
      // 检查API Key
      const apiKey = settings.apiKeys[settings.api];
      if (!apiKey) {
        throw new Error('未配置API密钥，请在设置中配置API密钥');
      }

      // 创建新的环境变量对象
      const env = Object.assign({}, process.env, {
        TRANSLATOR_API_KEY: apiKey,
        TRANSLATOR_TARGET_LANG: settings.targetLanguage || 'zh'
      });

      // 构建命令行参数
      const args = [
        pythonScript,
        inputPath,
        outputPath
      ];

      // 添加可选参数
      if (settings.api) args.push('--api', settings.api);
      if (settings.style) args.push('--style', settings.style);
      if (settings.domain) args.push('--domain', settings.domain);
      if (settings.keepOriginal) {
        args.push('--keep-original');
      } else {
        args.push('--no-keep-original');
      }

      console.log('启动翻译进程:', {
        script: pythonScript,
        args: args,
        env: {
          TRANSLATOR_API_KEY: `${apiKey.substring(0, 4)}...${apiKey.slice(-4)}`,
          TRANSLATOR_TARGET_LANG: env.TRANSLATOR_TARGET_LANG
        }
      });

      // 创建进程
      const python = spawn('python3', args, {
        env: env,
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.dirname(pythonScript)  // 设置工作目录为脚本所在目录
      });

      let errorOutput = '';
      let stdoutBuffer = '';
      let processStarted = false;

      // 设置超时检查
      const timeout = setTimeout(() => {
        if (!processStarted) {
          python.kill();
          reject(new Error('翻译进程启动超时'));
        }
      }, 5000);

      python.stdout.on('data', (data) => {
        processStarted = true;
        const text = data.toString();
        
        // 将新数据添加到缓冲区
        stdoutBuffer += text;
        
        // 尝试从缓冲区中提取完整的JSON对象
        let newlineIndex;
        while ((newlineIndex = stdoutBuffer.indexOf('\n')) !== -1) {
          const line = stdoutBuffer.substring(0, newlineIndex);
          stdoutBuffer = stdoutBuffer.substring(newlineIndex + 1);
          
          if (line.trim()) {
            try {
              const progress = JSON.parse(line);
              console.log('解析到进度:', progress);
              
              // 根据进度类型计算总体进度
              if (progress.status === 'translating') {
                if (progress.total_chapters) {
                  // 更新总体进度
                  const totalProgress = {
                    status: 'translating',
                    currentChapter: progress.current_chapter,
                    totalChapters: progress.total_chapters,
                    chapterProgress: progress.chapter_progress || 0
                  };
                  if (onProgress) {
                    onProgress(totalProgress);
                  }
                } else if (progress.chapter_progress) {
                  // 更新章节进度
                  if (onProgress) {
                    onProgress(progress);
                  }
                }
              } else {
                // 其他状态直接传递
                if (onProgress) {
                  onProgress(progress);
                }
              }
            } catch (err) {
              console.log('非JSON输出:', line);
            }
          }
        }

        if (isPaused && isPaused()) {
          console.log('翻译被暂停');
          python.kill();
          reject(new Error('翻译已暂停'));
        }
      });

      python.stderr.on('data', (data) => {
        processStarted = true;
        const text = data.toString();
        
        // 忽略ebooklib的警告信息
        if (text.includes('UserWarning') || text.includes('FutureWarning')) {
          console.log('忽略警告:', text);
          return;
        }
        
        errorOutput += text;
        console.error('Python错误:', text);
      });

      python.on('close', (code) => {
        clearTimeout(timeout);
        console.log('翻译进程退出，代码:', code);
        
        // 处理缓冲区中剩余的数据
        if (stdoutBuffer.trim()) {
          try {
            const progress = JSON.parse(stdoutBuffer);
            if (onProgress) {
              onProgress(progress);
            }
          } catch (err) {
            console.log('最后的非JSON输出:', stdoutBuffer);
          }
        }
        
        if (code !== 0) {
          console.error('错误输出:', errorOutput);
          reject(new Error(`翻译失败: ${errorOutput}`));
        } else {
          resolve(outputPath);
        }
      });

      python.on('error', (err) => {
        clearTimeout(timeout);
        console.error('启动Python进程失败:', err);
        reject(new Error(`启动翻译进程失败: ${err.message}`));
      });

    } catch (err) {
      console.error('翻译包装器错误:', err);
      reject(err);
    }
  });
}

module.exports = {
  translate_epub
}; 