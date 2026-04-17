const articleService = require('../../services/article/articleService');

const articleController = {
  // 文章生图
  generateImages: async (req, res) => {
    try {
      const { article, model, count, style } = req.body;
      
      if (!article) {
        return res.status(400).json({ error: 'Article is required' });
      }
      
      const result = await articleService.generateImagesFromArticle(article, {
        model: model || 'stable-diffusion',
        count: count || 3,
        style: style || 'realistic'
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 文章生成脚本
  generateScript: async (req, res) => {
    try {
      const { article, model, format } = req.body;
      
      if (!article) {
        return res.status(400).json({ error: 'Article is required' });
      }
      
      const result = await articleService.generateScriptFromArticle(article, {
        model: model || 'gpt-4',
        format: format || 'video'
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 文章生成分镜
  generateStoryboard: async (req, res) => {
    try {
      const { article, model, scenes } = req.body;
      
      if (!article) {
        return res.status(400).json({ error: 'Article is required' });
      }
      
      const result = await articleService.generateStoryboardFromArticle(article, {
        model: model || 'gpt-4',
        scenes: scenes || 5
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = articleController;