const modelService = require('../services/modelService');

const modelController = {
  // 列出所有模型
  listModels: async (req, res) => {
    try {
      const models = await modelService.listModels();
      res.status(200).json(models);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 配置模型
  configureModel: async (req, res) => {
    try {
      const { modelName, config } = req.body;
      
      if (!modelName || !config) {
        return res.status(400).json({ error: 'Model name and config are required' });
      }
      
      const updatedModel = await modelService.configureModel(modelName, config);
      res.status(200).json(updatedModel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = modelController;