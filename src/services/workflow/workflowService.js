const { v4: uuidv4 } = require('uuid');
const articleService = require('../article/articleService');
const audioService = require('../audio/audioService');
const videoService = require('../videoService');
const characterService = require('../characterService');
const artifactService = require('../artifactService');

const workflowService = {
  // 创建工作流
  createWorkflow: async (article, options = {}) => {
    const workflowId = uuidv4();
    
    console.log('Creating workflow...');
    
    return {
      workflowId,
      article,
      status: 'created',
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  // 执行完整工作流
  executeWorkflow: async (workflowId, options = {}) => {
    const { article, imageModel = 'stable-diffusion', scriptModel = 'gpt-4', audioModel = 'elevenlabs', videoModel = 'sora', characterData, artifactCount = 3 } = options;
    
    console.log('Executing workflow...');
    console.log('Character data:', characterData);
    console.log('Artifact count:', artifactCount);
    
    const steps = [];
    let currentStep = 1;
    let characterId = null;
    
    // 步骤0：创建人物特征（如果提供）
    if (characterData) {
      console.log(`Step ${currentStep}: Creating character`);
      try {
        const character = characterService.createCharacter(characterData);
        characterId = character.id;
        console.log('Created character:', character);
        steps.push({
          stepId: uuidv4(),
          stepNumber: currentStep++,
          name: 'create_character',
          status: 'completed',
          result: character,
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error creating character:', error);
      }
    }
    
    // 步骤1：文章生图
    console.log(`Step ${currentStep}: Generating images from article`);
    const imageOptions = { model: imageModel };
    if (characterId) {
      imageOptions.characterPrompt = characterService.generateCharacterPrompt(characterId);
      console.log('Character prompt for images:', imageOptions.characterPrompt);
    }
    
    // 生成多个版本的图片
    const imageResults = [];
    for (let i = 0; i < artifactCount; i++) {
      const imageResult = await articleService.generateImagesFromArticle(article, imageOptions);
      imageResults.push(imageResult);
    }
    
    // 创建中间制品
    const imageArtifacts = artifactService.createArtifacts('generate_images', { article, imageOptions }, imageResults, artifactCount);
    // 关联到工作流
    imageArtifacts.forEach(artifact => artifactService.associateWithWorkflow(artifact.id, workflowId));
    
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_images',
      status: 'completed',
      result: imageResults[0], // 默认使用第一个结果
      artifacts: imageArtifacts,
      createdAt: new Date().toISOString()
    });
    
    // 步骤2：文章生成脚本
    console.log(`Step ${currentStep}: Generating script from article`);
    const scriptOptions = { model: scriptModel };
    if (characterId) {
      scriptOptions.characterPrompt = characterService.generateCharacterPrompt(characterId);
      console.log('Character prompt for script:', scriptOptions.characterPrompt);
    }
    
    // 生成多个版本的脚本
    const scriptResults = [];
    for (let i = 0; i < artifactCount; i++) {
      const scriptResult = await articleService.generateScriptFromArticle(article, scriptOptions);
      scriptResults.push(scriptResult);
    }
    
    // 创建中间制品
    const scriptArtifacts = artifactService.createArtifacts('generate_script', { article, scriptOptions }, scriptResults, artifactCount);
    // 关联到工作流
    scriptArtifacts.forEach(artifact => artifactService.associateWithWorkflow(artifact.id, workflowId));
    
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_script',
      status: 'completed',
      result: scriptResults[0], // 默认使用第一个结果
      artifacts: scriptArtifacts,
      createdAt: new Date().toISOString()
    });
    
    // 步骤3：文章生成分镜
    console.log(`Step ${currentStep}: Generating storyboard from article`);
    const storyboardOptions = { model: scriptModel };
    if (characterId) {
      storyboardOptions.characterPrompt = characterService.generateCharacterPrompt(characterId);
      console.log('Character prompt for storyboard:', storyboardOptions.characterPrompt);
    }
    
    // 生成多个版本的分镜
    const storyboardResults = [];
    for (let i = 0; i < artifactCount; i++) {
      const storyboardResult = await articleService.generateStoryboardFromArticle(article, storyboardOptions);
      storyboardResults.push(storyboardResult);
    }
    
    // 创建中间制品
    const storyboardArtifacts = artifactService.createArtifacts('generate_storyboard', { article, storyboardOptions }, storyboardResults, artifactCount);
    // 关联到工作流
    storyboardArtifacts.forEach(artifact => artifactService.associateWithWorkflow(artifact.id, workflowId));
    
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_storyboard',
      status: 'completed',
      result: storyboardResults[0], // 默认使用第一个结果
      artifacts: storyboardArtifacts,
      createdAt: new Date().toISOString()
    });
    
    // 步骤4：文生音频
    console.log(`Step ${currentStep}: Generating audio from script`);
    
    // 生成多个版本的音频
    const audioResults = [];
    for (let i = 0; i < artifactCount; i++) {
      const audioResult = await audioService.generateAudioFromText(scriptResults[i].script, { model: audioModel });
      audioResults.push(audioResult);
    }
    
    // 创建中间制品
    const audioArtifacts = artifactService.createArtifacts('generate_audio', { script: scriptResults[0].script, audioModel }, audioResults, artifactCount);
    // 关联到工作流
    audioArtifacts.forEach(artifact => artifactService.associateWithWorkflow(artifact.id, workflowId));
    
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_audio',
      status: 'completed',
      result: audioResults[0], // 默认使用第一个结果
      artifacts: audioArtifacts,
      createdAt: new Date().toISOString()
    });
    
    // 步骤5：生成视频
    console.log(`Step ${currentStep}: Generating video`);
    
    // 生成多个版本的视频
    const videoResults = [];
    for (let i = 0; i < artifactCount; i++) {
      let videoPrompt = `Create a video based on the script: ${scriptResults[i].script.substring(0, 500)}...`;
      if (characterId) {
        const consistencyPrompt = characterService.getConsistencyPrompt(characterId);
        videoPrompt += `\n\n${consistencyPrompt}`;
        console.log('Consistency prompt for video:', consistencyPrompt);
      }
      const videoResult = await videoService.generateVideo({
        prompt: videoPrompt,
        model: videoModel,
        duration: 60,
        resolution: '1920x1080'
      });
      videoResults.push(videoResult);
    }
    
    // 创建中间制品
    const videoArtifacts = artifactService.createArtifacts('generate_video', { script: scriptResults[0].script, videoModel }, videoResults, artifactCount);
    // 关联到工作流
    videoArtifacts.forEach(artifact => artifactService.associateWithWorkflow(artifact.id, workflowId));
    
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_video',
      status: 'completed',
      result: videoResults[0], // 默认使用第一个结果
      artifacts: videoArtifacts,
      createdAt: new Date().toISOString()
    });
    
    console.log('Workflow completed with characterId:', characterId);
    console.log('Total steps:', steps.length);
    
    return {
      workflowId,
      status: 'completed',
      characterId,
      steps,
      totalSteps: steps.length,
      updatedAt: new Date().toISOString()
    };
  },
  
  // 重新执行某个步骤
  reexecuteStep: async (workflowId, stepNumber, options = {}) => {
    console.log(`Re-executing step ${stepNumber}...`);
    
    // 模拟重新执行步骤
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      workflowId,
      stepNumber,
      status: 'completed',
      updatedAt: new Date().toISOString()
    };
  },
  
  // 获取工作流状态
  getWorkflowStatus: async (workflowId) => {
    console.log(`Getting workflow status for ${workflowId}...`);
    
    // 模拟获取工作流状态
    return {
      workflowId,
      status: 'completed',
      steps: [
        { stepNumber: 1, name: 'generate_images', status: 'completed' },
        { stepNumber: 2, name: 'generate_script', status: 'completed' },
        { stepNumber: 3, name: 'generate_storyboard', status: 'completed' },
        { stepNumber: 4, name: 'generate_audio', status: 'completed' },
        { stepNumber: 5, name: 'generate_video', status: 'completed' }
      ],
      updatedAt: new Date().toISOString()
    };
  }
};

module.exports = workflowService;