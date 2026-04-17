const { v4: uuidv4 } = require('uuid');
const articleService = require('../article/articleService');
const audioService = require('../audio/audioService');
const videoService = require('../videoService');
const characterService = require('../characterService');

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
    const { article, imageModel = 'stable-diffusion', scriptModel = 'gpt-4', audioModel = 'elevenlabs', videoModel = 'sora', characterData } = options;
    
    console.log('Executing workflow...');
    
    const steps = [];
    let currentStep = 1;
    let characterId = null;
    
    // 步骤0：创建人物特征（如果提供）
    if (characterData) {
      console.log(`Step ${currentStep}: Creating character`);
      const character = characterService.createCharacter(characterData);
      characterId = character.id;
      steps.push({
        stepId: uuidv4(),
        stepNumber: currentStep++,
        name: 'create_character',
        status: 'completed',
        result: character,
        createdAt: new Date().toISOString()
      });
    }
    
    // 步骤1：文章生图
    console.log(`Step ${currentStep}: Generating images from article`);
    const imageOptions = { model: imageModel };
    if (characterId) {
      imageOptions.characterPrompt = characterService.generateCharacterPrompt(characterId);
    }
    const imageResult = await articleService.generateImagesFromArticle(article, imageOptions);
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_images',
      status: 'completed',
      result: imageResult,
      createdAt: new Date().toISOString()
    });
    
    // 步骤2：文章生成脚本
    console.log(`Step ${currentStep}: Generating script from article`);
    const scriptOptions = { model: scriptModel };
    if (characterId) {
      scriptOptions.characterPrompt = characterService.generateCharacterPrompt(characterId);
    }
    const scriptResult = await articleService.generateScriptFromArticle(article, scriptOptions);
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_script',
      status: 'completed',
      result: scriptResult,
      createdAt: new Date().toISOString()
    });
    
    // 步骤3：文章生成分镜
    console.log(`Step ${currentStep}: Generating storyboard from article`);
    const storyboardOptions = { model: scriptModel };
    if (characterId) {
      storyboardOptions.characterPrompt = characterService.generateCharacterPrompt(characterId);
    }
    const storyboardResult = await articleService.generateStoryboardFromArticle(article, storyboardOptions);
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_storyboard',
      status: 'completed',
      result: storyboardResult,
      createdAt: new Date().toISOString()
    });
    
    // 步骤4：文生音频
    console.log(`Step ${currentStep}: Generating audio from script`);
    const audioResult = await audioService.generateAudioFromText(scriptResult.script, { model: audioModel });
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_audio',
      status: 'completed',
      result: audioResult,
      createdAt: new Date().toISOString()
    });
    
    // 步骤5：生成视频
    console.log(`Step ${currentStep}: Generating video`);
    let videoPrompt = `Create a video based on the script: ${scriptResult.script.substring(0, 500)}...`;
    if (characterId) {
      videoPrompt += `\n\n${characterService.getConsistencyPrompt(characterId)}`;
    }
    const videoResult = await videoService.generateVideo({
      prompt: videoPrompt,
      model: videoModel,
      duration: 60,
      resolution: '1920x1080'
    });
    steps.push({
      stepId: uuidv4(),
      stepNumber: currentStep++,
      name: 'generate_video',
      status: 'completed',
      result: videoResult,
      createdAt: new Date().toISOString()
    });
    
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