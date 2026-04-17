const templateService = require('../services/templateService');

const templateController = {
  // 列出所有模板
  listTemplates: async (req, res) => {
    try {
      const templates = await templateService.listTemplates();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 创建模板
  createTemplate: async (req, res) => {
    try {
      const { name, description, config } = req.body;
      
      if (!name || !config) {
        return res.status(400).json({ error: 'Template name and config are required' });
      }
      
      const template = await templateService.createTemplate({
        name,
        description: description || '',
        config
      });
      
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 获取模板详情
  getTemplate: async (req, res) => {
    try {
      const { id } = req.params;
      const template = await templateService.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      res.status(200).json(template);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = templateController;