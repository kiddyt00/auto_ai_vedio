const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

// 配置对象
const config = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },
  
  // 数据库配置
  database: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/auto_ai_vedio'
  },
  
  // AI模型配置
  ai: {
    textModel: process.env.TEXT_MODEL || 'gpt-4',
    imageModel: process.env.IMAGE_MODEL || 'stable-diffusion',
    videoModel: process.env.VIDEO_MODEL || 'sora',
    apiKey: process.env.AI_API_KEY || ''
  },
  
  // 视频处理配置
  video: {
    outputDir: process.env.VIDEO_OUTPUT_DIR || './output',
    maxDuration: process.env.VIDEO_MAX_DURATION || 60,
    defaultResolution: process.env.VIDEO_DEFAULT_RESOLUTION || '1920x1080'
  },
  
  // 安全配置
  security: {
    secretKey: process.env.SECRET_KEY || 'your-secret-key',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '*'
  }
};

// 导出配置
module.exports = config;