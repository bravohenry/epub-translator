# ePub Bilingual Translator

<div align="center">
  <img src="public/icon.png" alt="ePub Translator" width="128" height="128">
  <h1>ePub Translator</h1>
  <p>优雅的ePub电子书双语翻译工具</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license">
  <img src="https://img.shields.io/badge/platform-macOS-lightgrey.svg" alt="platform">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</p>

<div align="center">
  <a href="README.md">English</a> | <a href="README_CN.md">简体中文</a>
</div>

<div align="center">
  <img src="screenshots/app.png" alt="Screenshot" width="800">
</div>

## 背景

随着中国AI公司如DeepSeek的崛起及其先进的大语言模型(LLMs)的发展，高质量的翻译服务变得前所未有的平价和便捷。DeepSeek的LLMs在理解上下文和保持长文本翻译一致性方面表现出色，特别适合书籍和文档的翻译工作。

本项目正是基于这些技术进步，打造了一个优雅、用户友好的工具，帮助读者跨越语言障碍获取知识。通过支持多种翻译API和提供灵活的配置选项，我们旨在提供卓越的双语阅读体验，同时将成本降至最低。

相比传统的翻译服务：
- 更低的成本：DeepSeek API的价格仅为OpenAI的1/10
- 更好的质量：专门针对中英互译优化的模型
- 更快的速度：并行处理多个章节，支持断点续传
- 更好的体验：保留原书排版，支持多种翻译风格

## ✨ 特性

- 🎯 多种翻译API支持
  - DeepSeek API（推荐，性价比最高）
  - OpenAI API
  - Google Translate API
- 🎨 优雅的Linear风格界面
- 📚 完美保持原书的格式和样式
- 🔄 实时翻译进度显示
- ⚡ 支持暂停和继续翻译
- 🛠️ 丰富的翻译配置选项
  - 翻译风格（直译/意译/平衡）
  - 专业领域（通用/技术/文学/商业/学术）
  - 双语对照模式

## 🚀 快速开始

### 系统要求

- macOS 10.15+
- Node.js 16+
- Python 3.9+
- npm 7+

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/epub-translator.git
cd epub-translator
```

2. 安装依赖：
```bash
# 安装Node.js依赖
npm install

# 安装Python依赖
pip3 install -r requirements.txt
```

### 使用方法

1. 启动应用：
```bash
npm start
```

2. 在设置中配置翻译API和密钥：
   - 选择翻译API（推荐使用DeepSeek）
   - 配置对应的API密钥
   - 选择翻译风格和专业领域

3. 选择要翻译的ePub文件
4. 点击"Start Translation"开始翻译
5. 翻译完成后，可以在原文件所在目录找到生成的双语版本

## 📦 技术栈

- 前端
  - React 18
  - Vite
  - Tailwind CSS
  - Linear UI Design
- 后端
  - Electron
  - Python
  - ebooklib

## 🤝 贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解更多细节

## 👨‍💻 作者

<table>
  <tr>
    <td align="center">
      <a href="https://bravohenry.com">
        <img src="https://github.com/yourusername.png" width="100px;" alt="Henry Huang"/><br />
        <sub><b>Henry Huang</b></sub>
      </a>
    </td>
  </tr>
</table>

- 网站：[bravohenry.com](https://bravohenry.com)
- 邮箱：[bravohenry@msn.com](mailto:bravohenry@msn.com)

## 🙏 致谢

特别感谢：

- [DeepSeek](https://deepseek.com) - 提供高性价比的翻译API
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ebooklib](https://github.com/aerkalov/ebooklib) 