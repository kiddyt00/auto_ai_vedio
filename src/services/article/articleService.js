const { v4: uuidv4 } = require('uuid');
const aiService = require('../aiService');

const articleService = {
  // 文章生图
  generateImagesFromArticle: async (article, options = {}) => {
    const { model = 'stable-diffusion', count = 3, style = 'realistic', characterPrompt } = options;
    
    console.log('Generating images from article...');
    
    // 提取文章关键词或关键句子
    const keySentences = article.split('. ').filter(s => s.length > 20).slice(0, count);
    
    // 为每个关键句子生成图片
    const images = [];
    for (const sentence of keySentences) {
      let prompt = `Based on this content: ${sentence}. Style: ${style}`;
      if (characterPrompt) {
        prompt += `\n\nCharacter: ${characterPrompt}`;
      }
      const imageResult = await aiService.generateImage(prompt, model);
      
      images.push({
        id: uuidv4(),
        prompt,
        imageUrl: imageResult.imageUrl,
        sentence,
        model,
        style,
        characterPrompt,
        createdAt: new Date().toISOString()
      });
    }
    
    return {
      articleId: uuidv4(),
      article,
      images,
      total: images.length,
      characterPrompt,
      createdAt: new Date().toISOString()
    };
  },
  
  // 文章生成脚本
  generateScriptFromArticle: async (article, options = {}) => {
    const { model = 'gpt-4', format = 'video', characterPrompt } = options;
    
    console.log('Generating script from article...');
    
    let prompt = `Convert the following article into a ${format} script. Include scene descriptions, dialogue (if appropriate), and visual cues.\n\nArticle:\n${article}`;
    if (characterPrompt) {
      prompt += `\n\nCharacter: ${characterPrompt}`;
    }
    
    const textResult = await aiService.generateText(prompt, model);
    
    return {
      scriptId: uuidv4(),
      article,
      script: textResult.generatedText,
      model,
      format,
      characterPrompt,
      createdAt: new Date().toISOString()
    };
  },
  
  // 文章生成分镜
  generateStoryboardFromArticle: async (article, options = {}) => {
    const { model = 'gpt-4', scenes = 5, characterPrompt } = options;
    
    console.log('Generating storyboard from article...');
    
    let prompt = `Create a storyboard for a video based on the following article. Include ${scenes} scenes with detailed descriptions of each scene, camera angles, and visual elements.\n\nArticle:\n${article}`;
    if (characterPrompt) {
      prompt += `\n\nCharacter: ${characterPrompt}`;
    }
    
    const textResult = await aiService.generateText(prompt, model);
    
    // 解析分镜内容
    const storyboardScenes = textResult.generatedText.split('Scene').filter(s => s.trim().length > 0).map((scene, index) => ({
      sceneId: uuidv4(),
      sceneNumber: index + 1,
      content: scene.trim(),
      createdAt: new Date().toISOString()
    }));
    
    return {
      storyboardId: uuidv4(),
      article,
      scenes: storyboardScenes,
      totalScenes: storyboardScenes.length,
      model,
      characterPrompt,
      createdAt: new Date().toISOString()
    };
  }
};

module.exports = articleService;