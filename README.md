# APK签名验证工具 (APK Signature Checker)

一个简单易用的APK签名验证工具，支持本地文件和在线APK的签名验证。

A simple and easy-to-use APK signature verification tool that supports signature verification for both local files and online APKs.

## 功能特点 (Features)

- 支持本地APK文件验证
- 支持HTTP/HTTPS链接APK验证
- 文件大小限制为500MB
- 自动端口分配
- 美观的Web界面
- 详细的签名信息输出

## 系统要求 (Requirements)

- Node.js (v12.0.0 或更高版本)
- Android SDK Build Tools (需要 apksigner 工具)

## 安装步骤 (Installation)

1. 克隆仓库：
```bash
git clone [repository-url]
cd apk-sign-checker
```

2. 安装依赖：
```bash
npm install
```

3. 确保系统中已安装 Android SDK Build Tools 并将 apksigner 添加到系统环境变量中。

## 使用方法 (Usage)

1. 启动服务器：
```bash
npm start
```

2. 打开浏览器访问：`http://localhost:3000`

3. 选择验证方式：
   - 点击"选择文件"按钮上传本地APK文件
   - 或在输入框中粘贴APK的HTTP/HTTPS下载链接

4. 点击"验证签名"按钮开始验证

## 技术栈 (Tech Stack)

- 前端：原生HTML/CSS/JavaScript
- 后端：Node.js + Express
- 文件处理：Multer
- 签名验证：Android SDK apksigner

## 注意事项 (Notes)

- 确保上传的文件为有效的APK文件
- 在线APK链接必须是直接下载链接
- 服务器会自动清理上传的临时文件
- 如果默认端口(3000)被占用，系统会自动尝试下一个可用端口

## 许可证 (License)

MIT License