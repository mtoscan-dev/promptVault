export function classifyPrompt(content: string): string[] {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('code') || lowerContent.includes('function') || lowerContent.includes('programming')) {
    tags.push('coding');
  }
  if (lowerContent.includes('write') || lowerContent.includes('essay') || lowerContent.includes('article')) {
    tags.push('writing');
  }
  if (lowerContent.includes('analyze') || lowerContent.includes('analysis') || lowerContent.includes('data')) {
    tags.push('analysis');
  }
  if (lowerContent.includes('creative') || lowerContent.includes('story') || lowerContent.includes('imagine')) {
    tags.push('creative');
  }
  if (lowerContent.includes('translate') || lowerContent.includes('language')) {
    tags.push('translation');
  }
  if (lowerContent.includes('summarize') || lowerContent.includes('summary') || lowerContent.includes('tldr')) {
    tags.push('summary');
  }
  if (lowerContent.includes('debug') || lowerContent.includes('fix') || lowerContent.includes('error')) {
    tags.push('debugging');
  }
  if (lowerContent.includes('explain') || lowerContent.includes('teach') || lowerContent.includes('learn')) {
    tags.push('education');
  }
  if (lowerContent.includes('api') || lowerContent.includes('integration') || lowerContent.includes('backend')) {
    tags.push('api');
  }
  if (lowerContent.includes('ui') || lowerContent.includes('design') || lowerContent.includes('frontend')) {
    tags.push('frontend');
  }
  
  return tags.length > 0 ? tags : ['general'];
}
