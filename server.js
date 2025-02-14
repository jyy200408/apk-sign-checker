const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const https = require('https');
const url = require('url');
const app = express();

// 文件清理配置
const UPLOADS_DIR = 'uploads';
const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1GB
const FILE_MAX_AGE = 24 * 60 * 60 * 1000; // 24小时
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1小时

// 确保上传目录存在
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// 获取目录总大小（字节）
function getDirectorySize(directoryPath) {
    let totalSize = 0;
    const files = fs.readdirSync(directoryPath);
    
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            totalSize += stats.size;
        }
    });
    
    return totalSize;
}

// 清理旧文件
function cleanupOldFiles() {
    const now = Date.now();
    const files = fs.readdirSync(UPLOADS_DIR);
    
    files.forEach(file => {
        const filePath = path.join(UPLOADS_DIR, file);
        const stats = fs.statSync(filePath);
        
        // 删除超过24小时的文件
        if (now - stats.atime.getTime() > FILE_MAX_AGE) {
            try {
                fs.unlinkSync(filePath);
                console.log(`已删除过期文件: ${file}`);
            } catch (err) {
                console.error(`删除文件失败: ${file}`, err);
            }
        }
    });
}

// 检查并维持存储空间限制
function enforceStorageLimit() {
    const totalSize = getDirectorySize(UPLOADS_DIR);
    if (totalSize > MAX_TOTAL_SIZE * 0.9) { // 当使用空间超过90%时
        const files = fs.readdirSync(UPLOADS_DIR)
            .map(file => {
                const filePath = path.join(UPLOADS_DIR, file);
                const stats = fs.statSync(filePath);
                return { path: filePath, atime: stats.atime };
            })
            .sort((a, b) => a.atime - b.atime); // 按访问时间排序
        
        // 从最旧的文件开始删除，直到空间足够
        while (getDirectorySize(UPLOADS_DIR) > MAX_TOTAL_SIZE * 0.7) { // 删除到70%以下
            if (files.length === 0) break;
            const oldestFile = files.shift();
            try {
                fs.unlinkSync(oldestFile.path);
                console.log(`已删除最旧文件: ${path.basename(oldestFile.path)}`);
            } catch (err) {
                console.error(`删除文件失败: ${path.basename(oldestFile.path)}`, err);
            }
        }
    }
}

// 定期清理任务
setInterval(() => {
    console.log('开始执行定期清理...');
    cleanupOldFiles();
    enforceStorageLimit();
}, CLEANUP_INTERVAL);

// 启动时执行一次清理
cleanupOldFiles();
enforceStorageLimit();

const upload = multer({
    dest: UPLOADS_DIR,
    limits: {
        fileSize: 500 * 1024 * 1024, // 限制文件大小为500MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.toLowerCase().endsWith('.apk')) {
            cb(new Error('请选择有效的APK文件'));
            return;
        }
        cb(null, true);
    }
});

app.use(express.json());
app.use(express.static(__dirname));

app.post('/verify', upload.single('apk'), (req, res) => {
    if (!req.file && !req.body.url) {
        return res.status(400).json({ error: '请提供APK文件或有效的HTTPS链接' });
    }

    if (req.body.url) {
        const fileUrl = req.body.url;
        if (!fileUrl.toLowerCase().startsWith('http://') && !fileUrl.toLowerCase().startsWith('https://')) {
            return res.status(400).json({ error: '请提供有效的HTTP或HTTPS链接' });
        }
        if (!fileUrl.toLowerCase().endsWith('.apk')) {
            return res.status(400).json({ error: '链接必须指向APK文件' });
        }

        const fileName = path.join(UPLOADS_DIR, path.basename(url.parse(fileUrl).pathname));
        const file = fs.createWriteStream(fileName);

        const protocol = fileUrl.toLowerCase().startsWith('https://') ? https : require('http');
        protocol.get(fileUrl, (response) => {
            if (response.statusCode !== 200) {
                return res.status(400).json({ error: `下载失败: HTTP ${response.statusCode}` });
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close(() => {
                    verifyApkSignature(fileName, res);
                });
            });
        }).on('error', (err) => {
            fs.unlink(fileName, () => {});
            return res.status(500).json({ error: `下载文件时出错: ${err.message}` });
        });
        return;
    }

    const apkPath = req.file.path;
    if (!req.file.originalname.toLowerCase().endsWith('.apk')) {
        fs.unlinkSync(apkPath);
        return res.status(400).json({ error: '请选择有效的APK文件' });
    }

    verifyApkSignature(apkPath, res);
});

function verifyApkSignature(apkPath, res) {
    const command = `apksigner verify -v --print-certs "${apkPath}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('执行命令出错:', error);
            if (stderr.includes('FileNotFoundException')) {
                return res.status(404).json({ error: '无法访问APK文件，请确保文件存在且有读取权限' });
            }
            return res.status(500).json({ error: '验证签名时出错', details: stderr });
        }
        res.json({ output: stdout });
    });
}

function startServer(port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port)
            .once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`端口 ${port} 已被占用，尝试使用端口 ${port + 1}`);
                    server.close();
                    resolve(startServer(port + 1));
                } else {
                    reject(err);
                }
            })
            .once('listening', () => {
                console.log(`服务器运行在 http://localhost:${port}`);
                resolve(server);
            });
    });
}

startServer(3000).catch(err => {
    console.error('启动服务器失败:', err);
    process.exit(1);
});