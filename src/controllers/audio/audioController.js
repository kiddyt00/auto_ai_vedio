const audioService = require('../../services/audio/audioService');

const audioController = {
  // 文生音频
  generateAudio: async (req, res) => {
    try {
      const { text, model, voice, language } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }
      
      const result = await audioService.generateAudioFromText(text, {
        model: model || 'elevenlabs',
        voice: voice || 'default',
        language: language || 'zh'
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 音频编辑
  editAudio: async (req, res) => {
    try {
      const { audioId, trimStart, trimEnd, volume } = req.body;
      
      if (!audioId) {
        return res.status(400).json({ error: 'Audio ID is required' });
      }
      
      const result = await audioService.editAudio(audioId, {
        trimStart: trimStart || 0,
        trimEnd: trimEnd || 0,
        volume: volume || 1.0
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = audioController;