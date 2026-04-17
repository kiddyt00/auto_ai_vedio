const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outputDir = config.video.outputDir;
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const videoService = {
  // 生成视频
  generateVideo: async (params) => {
    const { prompt, model, duration, resolution } = params;
    
    // 生成唯一ID
    const videoId = uuidv4();
    const outputPath = path.join(outputDir, `${videoId}.mp4`);
    
    // 模拟视频生成过程
    // 实际项目中这里会调用AI模型API
    console.log(`Generating video with prompt: ${prompt}`);
    console.log(`Using model: ${model}`);
    console.log(`Duration: ${duration} seconds`);
    console.log(`Resolution: ${resolution}`);
    
    // 模拟生成过程延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 创建模拟视频文件
    fs.writeFileSync(outputPath, 'Mock video content');
    
    const video = {
      id: videoId,
      prompt,
      model,
      duration,
      resolution,
      outputPath,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return video;
  },
  
  // 获取视频详情
  getVideo: async (id) => {
    // 模拟从数据库获取视频信息
    const video = {
      id,
      prompt: 'A beautiful sunset over the ocean',
      model: 'sora',
      duration: 30,
      resolution: '1920x1080',
      outputPath: path.join(outputDir, `${id}.mp4`),
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return video;
  },
  
  // 列出所有视频
  listVideos: async () => {
    // 模拟视频列表
    const videos = [
      {
        id: '1',
        prompt: 'A beautiful sunset over the ocean',
        model: 'sora',
        duration: 30,
        resolution: '1920x1080',
        status: 'completed',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        prompt: 'A cat playing with a ball',
        model: 'stable-diffusion',
        duration: 15,
        resolution: '1080x720',
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
    
    return videos;
  },
  
  // 删除视频
  deleteVideo: async (id) => {
    const videoPath = path.join(outputDir, `${id}.mp4`);
    
    // 模拟删除视频文件
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
    
    console.log(`Deleted video with id: ${id}`);
  }
};

module.exports = videoService;