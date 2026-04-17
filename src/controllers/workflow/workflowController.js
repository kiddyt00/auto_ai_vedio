const workflowService = require('../../services/workflow/workflowService');
const artifactService = require('../../services/artifactService');

const workflowController = {
  // 创建工作流
  createWorkflow: async (req, res) => {
    try {
      const { article } = req.body;
      
      if (!article) {
        return res.status(400).json({ error: 'Article is required' });
      }
      
      const result = await workflowService.createWorkflow(article);
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 执行工作流
  executeWorkflow: async (req, res) => {
    try {
      const { workflowId, article, imageModel, scriptModel, audioModel, videoModel, characterData } = req.body;
      
      if (!workflowId || !article) {
        return res.status(400).json({ error: 'Workflow ID and article are required' });
      }
      
      const result = await workflowService.executeWorkflow(workflowId, {
        article,
        imageModel: imageModel || 'stable-diffusion',
        scriptModel: scriptModel || 'gpt-4',
        audioModel: audioModel || 'elevenlabs',
        videoModel: videoModel || 'sora',
        characterData
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 重新执行步骤
  reexecuteStep: async (req, res) => {
    try {
      const { workflowId, stepNumber, options } = req.body;
      
      if (!workflowId || !stepNumber) {
        return res.status(400).json({ error: 'Workflow ID and step number are required' });
      }
      
      const result = await workflowService.reexecuteStep(workflowId, stepNumber, options || {});
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 获取工作流状态
  getWorkflowStatus: async (req, res) => {
    try {
      const { workflowId } = req.params;
      
      if (!workflowId) {
        return res.status(400).json({ error: 'Workflow ID is required' });
      }
      
      const result = await workflowService.getWorkflowStatus(workflowId);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 选择中间制品
  selectArtifact: async (req, res) => {
    try {
      const { artifactId } = req.body;
      
      if (!artifactId) {
        return res.status(400).json({ error: 'Artifact ID is required' });
      }
      
      const result = artifactService.selectArtifact(artifactId);
      
      if (!result) {
        return res.status(404).json({ error: 'Artifact not found' });
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 重新生成中间制品
  regenerateArtifact: async (req, res) => {
    try {
      const { artifactId, newOutput } = req.body;
      
      if (!artifactId || !newOutput) {
        return res.status(400).json({ error: 'Artifact ID and new output are required' });
      }
      
      const result = artifactService.regenerateArtifact(artifactId, newOutput);
      
      if (!result) {
        return res.status(404).json({ error: 'Artifact not found' });
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 获取中间制品
  getArtifact: async (req, res) => {
    try {
      const { artifactId } = req.params;
      
      if (!artifactId) {
        return res.status(400).json({ error: 'Artifact ID is required' });
      }
      
      const result = artifactService.getArtifact(artifactId);
      
      if (!result) {
        return res.status(404).json({ error: 'Artifact not found' });
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 获取步骤的所有中间制品
  getArtifactsByStep: async (req, res) => {
    try {
      const { stepName } = req.params;
      
      if (!stepName) {
        return res.status(400).json({ error: 'Step name is required' });
      }
      
      const result = artifactService.getArtifactsByStep(stepName);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // 获取工作流的所有中间制品
  getArtifactsByWorkflow: async (req, res) => {
    try {
      const { workflowId } = req.params;
      
      if (!workflowId) {
        return res.status(400).json({ error: 'Workflow ID is required' });
      }
      
      const result = artifactService.getArtifactsByWorkflow(workflowId);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = workflowController;