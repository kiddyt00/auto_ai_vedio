const { v4: uuidv4 } = require('uuid');

const characterService = {
  // 人物特征存储
  characters: {},
  
  // 创建人物特征
  createCharacter: (characterData) => {
    const characterId = uuidv4();
    const character = {
      id: characterId,
      ...characterData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    characterService.characters[characterId] = character;
    return character;
  },
  
  // 获取人物特征
  getCharacter: (characterId) => {
    return characterService.characters[characterId];
  },
  
  // 更新人物特征
  updateCharacter: (characterId, characterData) => {
    const character = characterService.characters[characterId];
    if (character) {
      characterService.characters[characterId] = {
        ...character,
        ...characterData,
        updatedAt: new Date().toISOString()
      };
      return characterService.characters[characterId];
    }
    return null;
  },
  
  // 生成人物描述提示词
  generateCharacterPrompt: (characterId) => {
    const character = characterService.characters[characterId];
    if (!character) {
      return '';
    }
    
    const { name, age, gender, appearance, clothing, personality } = character;
    let prompt = '';
    
    if (name) prompt += `Name: ${name}. `;
    if (age) prompt += `Age: ${age}. `;
    if (gender) prompt += `Gender: ${gender}. `;
    if (appearance) prompt += `Appearance: ${appearance}. `;
    if (clothing) prompt += `Clothing: ${clothing}. `;
    if (personality) prompt += `Personality: ${personality}. `;
    
    return prompt;
  },
  
  // 确保人物一致性的提示词
  getConsistencyPrompt: (characterId) => {
    const character = characterService.characters[characterId];
    if (!character) {
      return '';
    }
    
    return `Ensure consistency with the following character throughout the entire video: ${characterService.generateCharacterPrompt(characterId)}`;
  }
};

module.exports = characterService;