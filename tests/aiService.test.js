const aiService = require('../src/services/aiService');

// 测试文本生成功能
test('generateText should return a text object', async () => {
  const prompt = 'Write a short story about AI';
  const model = 'gpt-4';
  
  const result = await aiService.generateText(prompt, model);
  
  expect(result).toHaveProperty('model', model);
  expect(result).toHaveProperty('prompt', prompt);
  expect(result).toHaveProperty('generatedText');
  expect(result).toHaveProperty('timestamp');
});

// 测试图像生成功能
test('generateImage should return an image object', async () => {
  const prompt = 'A beautiful cat';
  const model = 'stable-diffusion';
  
  const result = await aiService.generateImage(prompt, model);
  
  expect(result).toHaveProperty('model', model);
  expect(result).toHaveProperty('prompt', prompt);
  expect(result).toHaveProperty('imageUrl');
  expect(result).toHaveProperty('timestamp');
});

// 测试视频生成功能
test('generateVideo should return a video object', async () => {
  const prompt = 'A cat playing with a ball';
  const model = 'sora';
  
  const result = await aiService.generateVideo(prompt, model);
  
  expect(result).toHaveProperty('model', model);
  expect(result).toHaveProperty('prompt', prompt);
  expect(result).toHaveProperty('videoUrl');
  expect(result).toHaveProperty('timestamp');
});

// 测试语音合成功能
test('generateAudio should return an audio object', async () => {
  const text = 'Hello, this is a test';
  const model = 'elevenlabs';
  
  const result = await aiService.generateAudio(text, model);
  
  expect(result).toHaveProperty('model', model);
  expect(result).toHaveProperty('text', text);
  expect(result).toHaveProperty('audioUrl');
  expect(result).toHaveProperty('timestamp');
});