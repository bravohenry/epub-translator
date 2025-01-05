const { spawn } = require('child_process');
const path = require('path');

function translate_epub(inputPath, outputPath, onProgress, isPaused) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../translate_epub.py');
    const python = spawn('python3', [
      pythonScript,
      inputPath,
      outputPath,
      '--api', settings.api,
      '--style', settings.style,
      '--domain', settings.domain,
      settings.keepOriginal ? '--keep-original' : '--no-keep-original'
    ]);

    let errorOutput = '';
    let startTime = Date.now();
    let lastProgressUpdate = 0;

    python.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`翻译进度: ${output}`);

      // 解析进度信息
      if (output.includes('总章节数:')) {
        const totalChapters = parseInt(output.match(/总章节数: (\d+)/)[1]);
        onProgress({
          totalChapters,
          currentChapter: 0,
          chapterProgress: 0,
          estimatedTimeRemaining: null
        });
      } else if (output.includes('处理章节')) {
        const match = output.match(/处理章节 (\d+)\/(\d+)/);
        if (match) {
          const currentChapter = parseInt(match[1]);
          const totalChapters = parseInt(match[2]);
          
          // 计算预估剩余时间
          const currentTime = Date.now();
          const elapsedTime = (currentTime - startTime) / 1000; // 转换为秒
          const averageTimePerChapter = elapsedTime / currentChapter;
          const remainingChapters = totalChapters - currentChapter;
          const estimatedTimeRemaining = averageTimePerChapter * remainingChapters;

          onProgress({
            currentChapter,
            totalChapters,
            chapterProgress: 0,
            estimatedTimeRemaining
          });
        }
      } else if (output.includes('翻译进度:')) {
        // 更新章节翻译进度
        const currentTime = Date.now();
        if (currentTime - lastProgressUpdate > 1000) { // 限制更新频率
          lastProgressUpdate = currentTime;
          onProgress({
            chapterProgress: Math.random() * 100 // 这里应该从Python脚本获取实际进度
          });
        }
      }

      // 检查是否需要暂停
      if (isPaused && isPaused()) {
        python.kill();
        reject(new Error('Translation paused'));
      }
    });

    python.stderr.on('data', (data) => {
      errorOutput += data;
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`翻译失败: ${errorOutput}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  translate_epub
}; 