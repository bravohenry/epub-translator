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
  <img src="screenshots/app.png" alt="Screenshot" width="800">
</div>

## ✨ 特性

- 🎯 多种翻译API支持
  - DeepSeek API（推荐）
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
   - 选择翻译API（DeepSeek/OpenAI/Google）
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

- Website: [bravohenry.com](https://bravohenry.com)
- Email: [bravohenry@msn.com](mailto:bravohenry@msn.com)

## 🙏 致谢

感谢以下开源项目：

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ebooklib](https://github.com/aerkalov/ebooklib)
- [DeepSeek](https://deepseek.com) 