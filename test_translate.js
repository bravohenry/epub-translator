const { translate_epub } = require('./src/main/translate-wrapper');
const path = require('path');

// 测试设置
const testSettings = {
  api: 'deepseek',
  style: 'balanced',
  domain: 'general',
  targetLanguage: 'zh',
  keepOriginal: true,
  apiKeys: {
    deepseek: 'sk-6ea58f4f724c4d33963cbbb04bae0464'
  }
};

// 使用实际的epub文件路径
const inputPath = '/Users/henry/PARA/[01] Projects/2025-SCAD/702 Innovation Past Present Future/Diffusion of Innovations, 5th Edition (Everett M. Rogers) (Z-Library).epub';

console.log('开始测试翻译功能...');
console.log('测试设置:', {
  ...testSettings,
  apiKeys: {
    deepseek: `${testSettings.apiKeys.deepseek.substring(0, 4)}...${testSettings.apiKeys.deepseek.slice(-4)}`
  }
});

// 测试翻译函数
translate_epub(
  inputPath,
  testSettings,
  (progress) => {
    console.log('翻译进度:', progress);
  },
  () => false
)
.then(outputPath => {
  console.log('翻译成功，输出文件:', outputPath);
})
.catch(err => {
  console.error('翻译失败:', err.message);
}); 