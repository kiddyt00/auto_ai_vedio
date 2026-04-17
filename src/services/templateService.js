const { v4: uuidv4 } = require('uuid');

const templateService = {
  // 列出所有模板
  listTemplates: async () => {
    // 模拟模板列表
    const templates = [
      {
        id: '1',
        name: 'Corporate Presentation',
        description: 'Professional corporate presentation template',
        config: {
          resolution: '1920x1080',
          duration: 60,
          style: 'corporate',
          background: 'business'
        },
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Social Media Short',
        description: 'Short video template for social media',
        config: {
          resolution: '1080x1080',
          duration: 15,
          style: 'vibrant',
          background: 'dynamic'
        },
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Product Demo',
        description: 'Product demonstration template',
        config: {
          resolution: '1920x1080',
          duration: 30,
          style: 'clean',
          background: 'minimal'
        },
        createdAt: new Date().toISOString()
      }
    ];
    
    return templates;
  },
  
  // 创建模板
  createTemplate: async (templateData) => {
    const { name, description, config } = templateData;
    
    const template = {
      id: uuidv4(),
      name,
      description,
      config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Created template:', template);
    return template;
  },
  
  // 获取模板详情
  getTemplate: async (id) => {
    // 模拟获取模板
    const template = {
      id,
      name: 'Corporate Presentation',
      description: 'Professional corporate presentation template',
      config: {
        resolution: '1920x1080',
        duration: 60,
        style: 'corporate',
        background: 'business'
      },
      createdAt: new Date().toISOString()
    };
    
    return template;
  }
};

module.exports = templateService;