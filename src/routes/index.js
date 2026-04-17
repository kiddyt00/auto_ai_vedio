const express = require('express');
const router = express.Router();

// 导入控制器
const videoController = require('../controllers/videoController');
const modelController = require('../controllers/modelController');
const templateController = require('../controllers/templateController');

// 视频生成相关路由
router.post('/video/generate', videoController.generateVideo);
router.get('/video/:id', videoController.getVideo);
router.get('/videos', videoController.listVideos);
router.delete('/video/:id', videoController.deleteVideo);

// 模型管理相关路由
router.get('/models', modelController.listModels);
router.post('/models/configure', modelController.configureModel);

// 模板管理相关路由
router.get('/templates', templateController.listTemplates);
router.post('/templates/create', templateController.createTemplate);
router.get('/template/:id', templateController.getTemplate);

module.exports = router;