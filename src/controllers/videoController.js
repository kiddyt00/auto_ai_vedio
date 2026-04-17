const videoService = require('../services/videoService');

const videoController = {
  // 生成视频
  generateVideo: async (req, res) => {
    try {
      const { prompt, model, duration, resolution } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      const video = await videoService.generateVideo({
        prompt,
        model: model || 'default',
        duration: duration || 30,
        resolution: resolution || '1920x1080'
      });
      
      res.status(200).json(video);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 获取视频详情
  getVideo: async (req, res) => {
    try {
      const { id } = req.params;
      const video = await videoService.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      res.status(200).json(video);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 列出所有视频
  listVideos: async (req, res) => {
    try {
      const videos = await videoService.listVideos();
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 删除视频
  deleteVideo: async (req, res) => {
    try {
      const { id } = req.params;
      await videoService.deleteVideo(id);
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = videoController;