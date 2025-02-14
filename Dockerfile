# 使用Node.js官方镜像作为基础镜像
FROM node:18-slim

# 安装必要的依赖
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# 下载并安装Android SDK命令行工具
WORKDIR /opt
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip \
    && unzip commandlinetools-linux-9477386_latest.zip \
    && rm commandlinetools-linux-9477386_latest.zip \
    && mkdir -p android-sdk/cmdline-tools \
    && mv cmdline-tools android-sdk/cmdline-tools/latest

# 设置环境变量
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/build-tools/33.0.0

# 安装Android SDK build-tools
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} "build-tools;33.0.0"

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 创建上传目录并设置权限
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# 设置卷挂载点
VOLUME ["/app"]

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]