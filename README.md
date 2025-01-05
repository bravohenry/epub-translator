# ePub Bilingual Translator

一个优雅的ePub电子书双语翻译工具，支持多种翻译API，可以将英文ePub图书转换为英汉对照的双语版本。

## 特性

- 🎯 支持多种翻译API（DeepSeek、OpenAI、Google）
- 🎨 优雅的Linear风格界面
- 📚 保持原书的格式和样式
- 🔄 实时翻译进度显示
- ⚡ 支持暂停和继续翻译
- 🛠️ 可配置的翻译选项
  - 翻译风格（直译、意译、平衡）
  - 专业领域（通用、技术、文学、商业、学术）
  - 是否保留原文

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/epub-translator.git
cd epub-translator
```

2. 安装依赖：
```bash
npm install        # 安装Node.js依赖
pip3 install -r requirements.txt  # 安装Python依赖
```

## 使用方法

1. 启动应用：
```bash
npm start
```

2. 在设置中配置翻译API和密钥
3. 选择要翻译的ePub文件
4. 点击"Start Translation"开始翻译
5. 翻译完成后，可以在原文件所在目录找到生成的双语版本

## 翻译API支持

- DeepSeek API（推荐）
- OpenAI API
- Google Translate API

## 开发

- 前端：React + Vite
- 后端：Electron + Python
- UI：Tailwind CSS + Linear Design

## 贡献

欢迎提交Issue和Pull Request！

## 作者

Henry Huang
- Website: [bravohenry.com](https://bravohenry.com)
- Email: [bravohenry@msn.com](mailto:bravohenry@msn.com)

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情 