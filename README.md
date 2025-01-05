# ePub Bilingual Translator

一个优雅的ePub电子书双语翻译工具，支持多种翻译API，提供专业的翻译效果。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 特性

- 🎯 支持多种翻译API（DeepSeek、OpenAI、Google）
- 📚 保留原文的排版和格式
- 🔄 实时翻译进度显示
- ⏸️ 支持暂停/继续翻译
- 💾 自动保存翻译进度
- 🎨 现代化的Linear风格界面
- 🌈 多种翻译风格选择
- 📊 专业领域支持

## 🚀 快速开始

### 系统要求

- macOS 10.15+
- Node.js 16+
- npm 7+

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/epub-translator.git

# 进入项目目录
cd epub-translator

# 安装依赖
npm install

# 启动应用
npm start
```

### 使用方法

1. 启动应用后，点击"Browse"选择要翻译的ePub文件
2. 在设置中配置翻译API和相关选项：
   - 选择翻译API（DeepSeek/OpenAI/Google）
   - 配置API密钥
   - 选择翻译风格（直译/意译/平衡）
   - 选择专业领域
   - 设置是否保留原文
3. 点击"Start Translation"开始翻译
4. 翻译完成后，可以在输出目录找到双语版本的电子书

## 🛠️ 技术栈

- Electron - 跨平台桌面应用框架
- React - 用户界面库
- Tailwind CSS - 样式框架
- Vite - 构建工具
- Python - 翻译核心功能

## 📦 项目结构

```
epub-translator/
├── src/
│   ├── main/              # Electron主进程
│   │   ├── main.js        # 主进程入口
│   │   └── translate-wrapper.js  # Python脚本包装器
│   └── renderer/          # 渲染进程
│       ├── components/    # React组件
│       ├── styles/        # 样式文件
│       └── index.jsx      # 渲染进程入口
├── public/               # 静态资源
├── scripts/             # 构建脚本
├── translate_epub.py    # Python翻译脚本
├── package.json        # 项目配置
└── README.md          # 项目文档
```

## 🔧 配置说明

### 翻译API配置

- DeepSeek API
  - 获取地址：[DeepSeek官网](https://deepseek.com)
  - 支持功能：AI翻译

- OpenAI API
  - 获取地址：[OpenAI官网](https://openai.com)
  - 支持模型：GPT-3.5/GPT-4

- Google Translate API
  - 获取地址：[Google Cloud Console](https://console.cloud.google.com)
  - 需要启用Cloud Translation API

### 翻译风格

- 直译：忠实原文，适合技术文档
- 意译：通顺优美，适合文学作品
- 平衡：在准确性和流畅性之间取得平衡

### 专业领域

- 通用：适用于大多数内容
- 技术：技术文档、专业书籍
- 文学：小说、散文等文学作品
- 商业：商业文档、管理书籍
- 学术：学术论文、研究报告

## 📝 翻译效果

翻译后的电子书将保持原有的排版格式，并在每段文本下方添加对应的翻译。支持以下功能：

- 保留原文格式和样式
- 智能段落识别
- 专业术语准确翻译
- 上下文相关性翻译
- 多种翻译风格选择

## 🔄 开发指南

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 构建应用
npm run build

# 打包应用
npm run package
```

### 目录说明

- `src/main/`: Electron主进程相关代码
- `src/renderer/`: React应用相关代码
- `src/renderer/components/`: React组件
- `public/`: 静态资源文件
- `scripts/`: 构建和辅助脚本

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解更多细节

## 🤝 贡献指南

欢迎提交问题和改进建议！提交PR之前请确保：

1. 更新测试用例
2. 更新文档
3. 遵循现有的代码风格
4. 添加相应的注释

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至：[your-email@example.com]
- 访问主页：[your-website.com]

## 🙏 致谢

感谢以下开源项目：

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ebooklib](https://github.com/aerkalov/ebooklib)
- [DeepSeek](https://deepseek.com) 