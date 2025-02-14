# Docker 镜像构建与分发指南

## 1. 构建镜像

在项目根目录下运行以下命令构建镜像：

```bash
docker build -t apk-sign-checker .
```

## 2. 镜像标记

### 使用 Docker Hub

1. 标记镜像（替换 `your-username` 为您的 Docker Hub 用户名）：
```bash
docker tag apk-sign-checker your-username/apk-sign-checker:latest
```

2. 登录 Docker Hub：
```bash
docker login
```

3. 推送镜像：
```bash
docker push your-username/apk-sign-checker:latest
```

### 使用私有镜像仓库

1. 标记镜像（替换 `registry-url` 为您的私有仓库地址）：
```bash
docker tag apk-sign-checker registry-url/apk-sign-checker:latest
```

2. 推送镜像：
```bash
docker push registry-url/apk-sign-checker:latest
```

## 3. 在其他机器上使用

### 使用 Docker Hub

```bash
# 拉取镜像
docker pull your-username/apk-sign-checker:latest

# 运行容器
docker run -d -p 3000:3000 your-username/apk-sign-checker:latest
```

### 使用私有镜像仓库

```bash
# 拉取镜像
docker pull registry-url/apk-sign-checker:latest

# 运行容器
docker run -d -p 3000:3000 registry-url/apk-sign-checker:latest
```

## 4. 使用 docker-compose

在其他机器上，您也可以使用项目中的 docker-compose.yml 文件来运行服务：

1. 克隆项目或复制 docker-compose.yml 文件
2. 运行以下命令：
```bash
docker-compose up -d
```

## 注意事项

- 确保目标机器已安装 Docker
- 如果使用私有仓库，确保目标机器已配置相应的认证信息
- 默认端口为 3000，可以根据需要修改映射端口
- 容器启动后，可以通过 `http://localhost:3000` 访问服务