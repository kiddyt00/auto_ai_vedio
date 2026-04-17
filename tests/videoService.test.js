const videoService = require('../src/services/videoService');

// 测试视频生成功能
test('generateVideo should return a video object', async () => {
  const params = {
    prompt: 'A beautiful sunset over the ocean',
    model: 'sora',
    duration: 30,
    resolution: '1920x1080'
  };
  
  const video = await videoService.generateVideo(params);
  
  expect(video).toHaveProperty('id');
  expect(video).toHaveProperty('prompt', params.prompt);
  expect(video).toHaveProperty('model', params.model);
  expect(video).toHaveProperty('duration', params.duration);
  expect(video).toHaveProperty('resolution', params.resolution);
  expect(video).toHaveProperty('status', 'completed');
  expect(video).toHaveProperty('createdAt');
  expect(video).toHaveProperty('updatedAt');
});

// 测试获取视频详情
test('getVideo should return a video object by id', async () => {
  const videoId = 'test-id';
  const video = await videoService.getVideo(videoId);
  
  expect(video).toHaveProperty('id', videoId);
  expect(video).toHaveProperty('prompt');
  expect(video).toHaveProperty('model');
  expect(video).toHaveProperty('duration');
  expect(video).toHaveProperty('resolution');
  expect(video).toHaveProperty('status');
  expect(video).toHaveProperty('createdAt');
});

// 测试列出所有视频
test('listVideos should return an array of videos', async () => {
  const videos = await videoService.listVideos();
  
  expect(Array.isArray(videos)).toBe(true);
  expect(videos.length).toBeGreaterThan(0);
  
  videos.forEach(video => {
    expect(video).toHaveProperty('id');
    expect(video).toHaveProperty('prompt');
    expect(video).toHaveProperty('model');
    expect(video).toHaveProperty('duration');
    expect(video).toHaveProperty('resolution');
    expect(video).toHaveProperty('status');
    expect(video).toHaveProperty('createdAt');
  });
});

// 测试删除视频
test('deleteVideo should not throw an error', async () => {
  const videoId = 'test-id';
  
  expect(async () => {
    await videoService.deleteVideo(videoId);
  }).not.toThrow();
});