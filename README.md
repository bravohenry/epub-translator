# ePub Bilingual Translator

<div align="center">
  <img src="public/icon.png" alt="ePub Translator" width="128" height="128">
  <h1>ePub Translator</h1>
  <p>An elegant bilingual translation tool for ePub books</p>
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

## Background

With the rise of Chinese AI companies like DeepSeek and their advanced Large Language Models (LLMs), high-quality translation has become more accessible and affordable than ever before. DeepSeek's LLMs demonstrate exceptional performance in understanding context and maintaining consistency in long-form content translation, making them particularly suitable for translating books and documents.

This project leverages these technological advancements to create an elegant, user-friendly tool that helps readers access literature across language barriers. By supporting multiple translation APIs and offering flexible configuration options, we aim to provide a superior bilingual reading experience while keeping the costs minimal.

## ✨ Features

- 🎯 Multiple Translation API Support
  - DeepSeek API (Recommended)
  - OpenAI API
  - Google Translate API
- 🎨 Elegant Linear-style Interface
- 📚 Perfect Preservation of Original Formatting
- 🔄 Real-time Translation Progress
- ⚡ Pause & Resume Support
- 🛠️ Rich Translation Options
  - Translation Styles (Literal/Free/Balanced)
  - Domain Expertise (General/Technical/Literary/Business/Academic)
  - Bilingual Display Mode

## 🚀 Getting Started

### Prerequisites

- macOS 10.15+
- Node.js 16+
- Python 3.9+
- npm 7+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/epub-translator.git
cd epub-translator
```

2. Install dependencies:
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip3 install -r requirements.txt
```

### Usage

1. Start the application:
```bash
npm start
```

2. Configure translation settings:
   - Choose translation API (DeepSeek/OpenAI/Google)
   - Set up API key
   - Select translation style and domain

3. Select an ePub file
4. Click "Start Translation"
5. Find the bilingual version in the same directory as the original file

## 📦 Tech Stack

- Frontend
  - React 18
  - Vite
  - Tailwind CSS
  - Linear UI Design
- Backend
  - Electron
  - Python
  - ebooklib

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👨‍💻 Author

<table align="left">
  <tr>
    <td>
      <a href="https://bravohenry.com">
        <img src="https://github.com/yourusername.png" width="100px;" alt="Henry Huang"/><br />
        <sub><b>Henry Huang</b></sub>
      </a>
    </td>
  </tr>
</table>

<br clear="left"/>
<br/>

- Website: [bravohenry.com](https://bravohenry.com)
- Email: [bravohenry@msn.com](mailto:bravohenry@msn.com)

## 🙏 Acknowledgments

Special thanks to:

- [DeepSeek](https://deepseek.com) for their exceptional LLMs
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ebooklib](https://github.com/aerkalov/ebooklib) 