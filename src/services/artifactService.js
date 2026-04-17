const { v4: uuidv4 } = require('uuid');

const artifactService = {
  // 中间制品存储
  artifacts: {},
  
  // 为步骤创建多个版本的中间制品
  createArtifacts: (stepName, inputs, outputs, count = 3) => {
    const artifacts = [];
    
    for (let i = 0; i < count; i++) {
      const artifact = {
        id: uuidv4(),
        stepName,
        inputs,
        output: outputs[i] || outputs[0], // 如果没有足够的输出，使用第一个
        version: i + 1,
        totalVersions: count,
        status: 'pending', // pending, selected, rejected
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      artifactService.artifacts[artifact.id] = artifact;
      artifacts.push(artifact);
    }
    
    return artifacts;
  },
  
  // 获取中间制品
  getArtifact: (artifactId) => {
    return artifactService.artifacts[artifactId];
  },
  
  // 获取步骤的所有中间制品
  getArtifactsByStep: (stepName) => {
    return Object.values(artifactService.artifacts).filter(artifact => artifact.stepName === stepName);
  },
  
  // 获取工作流的所有中间制品
  getArtifactsByWorkflow: (workflowId) => {
    return Object.values(artifactService.artifacts).filter(artifact => artifact.workflowId === workflowId);
  },
  
  // 选择中间制品
  selectArtifact: (artifactId) => {
    const artifact = artifactService.artifacts[artifactId];
    if (artifact) {
      // 首先将该步骤的所有制品标记为rejected
      const stepArtifacts = artifactService.getArtifactsByStep(artifact.stepName);
      stepArtifacts.forEach(a => {
        if (a.id !== artifactId) {
          a.status = 'rejected';
          a.updatedAt = new Date().toISOString();
        }
      });
      
      // 然后将选中的制品标记为selected
      artifact.status = 'selected';
      artifact.updatedAt = new Date().toISOString();
      
      return artifact;
    }
    return null;
  },
  
  // 重新生成中间制品
  regenerateArtifact: (artifactId, newOutput) => {
    const artifact = artifactService.artifacts[artifactId];
    if (artifact) {
      const newArtifact = {
        id: uuidv4(),
        stepName: artifact.stepName,
        inputs: artifact.inputs,
        output: newOutput,
        version: artifact.version + 100, // 避免版本冲突
        totalVersions: artifact.totalVersions + 1,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      artifactService.artifacts[newArtifact.id] = newArtifact;
      return newArtifact;
    }
    return null;
  },
  
  // 关联中间制品到工作流
  associateWithWorkflow: (artifactId, workflowId) => {
    const artifact = artifactService.artifacts[artifactId];
    if (artifact) {
      artifact.workflowId = workflowId;
      artifact.updatedAt = new Date().toISOString();
      return artifact;
    }
    return null;
  }
};

module.exports = artifactService;