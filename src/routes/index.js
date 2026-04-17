const express = require('express');
const router = express.Router();

// 导入控制器
const videoController = require('../controllers/videoController');
const modelController = require('../controllers/modelController');
const templateController = require('../controllers/templateController');
const articleController = require('../controllers/article/articleController');
const audioController = require('../controllers/audio/audioController');
const workflowController = require('../controllers/workflow/workflowController');

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

// 文章处理相关路由
router.post('/article/generate-images', articleController.generateImages);
router.post('/article/generate-script', articleController.generateScript);
router.post('/article/generate-storyboard', articleController.generateStoryboard);

// 音频处理相关路由
router.post('/audio/generate', audioController.generateAudio);
router.post('/audio/edit', audioController.editAudio);

// 工作流管理相关路由
router.post('/workflow/create', workflowController.createWorkflow);
router.post('/workflow/execute', workflowController.executeWorkflow);
router.post('/workflow/reexecute-step', workflowController.reexecuteStep);
router.get('/workflow/:workflowId/status', workflowController.getWorkflowStatus);

// 中间制品管理相关路由
router.post('/artifact/select', workflowController.selectArtifact);
router.post('/artifact/regenerate', workflowController.regenerateArtifact);
router.get('/artifact/:artifactId', workflowController.getArtifact);
router.get('/artifacts/step/:stepName', workflowController.getArtifactsByStep);
router.get('/artifacts/workflow/:workflowId', workflowController.getArtifactsByWorkflow);

module.exports = router;