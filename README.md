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
- 支持Docker部署

## 系统要求 (Requirements)

### 本地部署
- Node.js (v12.0.0 或更高版本)
- Android SDK Build Tools (需要 apksigner 工具)

### Docker部署
- Docker 19.03.0+
- Docker Compose 1.27.0+ (可选)

## 安装和部署

### 方式一：本地部署 (Local Installation)

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

### 方式二：Docker部署 (Docker Installation)

1. 使用Docker Compose（推荐）：
```bash
# 克隆仓库
git clone [repository-url]
cd apk-sign-checker

# 启动服务
docker-compose up -d
```

2. 使用Docker命令：
```bash
# 构建镜像
docker build -t apk-sign-checker .

# 运行容器
docker run -d -p 3000:3000 apk-sign-checker
```

## 使用方法 (Usage)

1. 访问服务：
   - 本地部署：启动服务 `npm start` 后访问
   - Docker部署：容器启动后直接访问
   浏览器打开：`http://localhost:3000`

2. 选择验证方式：
   - 点击"选择文件"按钮上传本地APK文件
   - 或在输入框中粘贴APK的HTTP/HTTPS下载链接

3. 点击"验证签名"按钮开始验证

## 技术栈 (Tech Stack)

- 前端：原生HTML/CSS/JavaScript
- 后端：Node.js + Express
- 文件处理：Multer
- 签名验证：Android SDK apksigner
- 容器化：Docker

## 注意事项 (Notes)

- 确保上传的文件为有效的APK文件
- 在线APK链接必须是直接下载链接
- 服务器会自动清理上传的临时文件
- 如果默认端口(3000)被占用，系统会自动尝试下一个可用端口
- Docker部署时请确保端口3000未被占用，或修改端口映射

## 许可证 (License)

MIT License