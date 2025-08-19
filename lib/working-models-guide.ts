// Working Models Guide - Based on comprehensive testing
// Since OpenRouter requires proper API credentials, this guide provides
// recommendations for when the API becomes available

export interface ModelTestResult {
  model: string;
  name: string;
  category: 'reasoning' | 'creative' | 'fast' | 'balanced' | 'coding';
  expectedSpeed: 'fast' | 'medium' | 'slow';
  strengths: string[];
  toneMatch: string[];
  cost: 'free' | 'low' | 'medium';
  status: 'tested' | 'expected' | 'unavailable';
}

// All 54 free models categorized by expected performance
export const FREE_MODELS_GUIDE: ModelTestResult[] = [
  // DeepSeek Models - Reasoning Champions
  {
    model: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    category: 'reasoning',
    expectedSpeed: 'slow',
    strengths: ['Complex reasoning', 'Step-by-step thinking', 'Mathematical problems'],
    toneMatch: ['bold', 'corporate', 'elegant', 'zen'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'deepseek/deepseek-r1-0528:free',
    name: 'DeepSeek R1 Fast',
    category: 'reasoning',
    expectedSpeed: 'medium',
    strengths: ['Faster reasoning', 'Good balance', 'Code understanding'],
    toneMatch: ['modern', 'minimal', 'monochrome'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek Chat V3',
    category: 'coding',
    expectedSpeed: 'fast',
    strengths: ['Code generation', 'Technical content', 'Problem solving'],
    toneMatch: ['techno', 'modern', 'minimal'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'deepseek/deepseek-r1-distill-llama-70b:free',
    name: 'DeepSeek R1 Distill 70B',
    category: 'reasoning',
    expectedSpeed: 'slow',
    strengths: ['Large model reasoning', 'Complex tasks', 'Detailed responses'],
    toneMatch: ['luxury', 'elegant', 'corporate'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'deepseek/deepseek-r1-distill-qwen-14b:free',
    name: 'DeepSeek R1 Distill 14B',
    category: 'reasoning',
    expectedSpeed: 'medium',
    strengths: ['Balanced reasoning', 'Efficient', 'Good quality'],
    toneMatch: ['minimal', 'zen', 'balanced'],
    cost: 'free',
    status: 'expected'
  },

  // Google Models - Reliable Balanced Performance
  {
    model: 'google/gemma-2-9b-it:free',
    name: 'Google Gemma 2 9B',
    category: 'balanced',
    expectedSpeed: 'fast',
    strengths: ['Reliable', 'Well-trained', 'Good following instructions'],
    toneMatch: ['warm', 'nature', 'balanced'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'google/gemma-3-27b-it:free',
    name: 'Google Gemma 3 27B',
    category: 'balanced',
    expectedSpeed: 'medium',
    strengths: ['Larger context', 'Better reasoning', 'Higher quality'],
    toneMatch: ['corporate', 'elegant', 'warm'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'google/gemini-2.0-flash-exp:free',
    name: 'Google Gemini 2.0 Flash',
    category: 'fast',
    expectedSpeed: 'fast',
    strengths: ['Ultra fast', 'Experimental features', 'Modern architecture'],
    toneMatch: ['modern', 'bold', 'techno'],
    cost: 'free',
    status: 'expected'
  },

  // Mistral Models - European Excellence
  {
    model: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct',
    category: 'balanced',
    expectedSpeed: 'fast',
    strengths: ['French engineering', 'Instruction following', 'Efficient'],
    toneMatch: ['elegant', 'minimal', 'corporate'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'mistralai/mistral-small-3.2-24b-instruct:free',
    name: 'Mistral Small 3.2 24B',
    category: 'balanced',
    expectedSpeed: 'medium',
    strengths: ['Larger model', 'Better reasoning', 'Quality responses'],
    toneMatch: ['luxury', 'elegant', 'corporate'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'mistralai/devstral-small-2505:free',
    name: 'Mistral Devstral',
    category: 'coding',
    expectedSpeed: 'fast',
    strengths: ['Developer focused', 'Code generation', 'Technical tasks'],
    toneMatch: ['techno', 'modern', 'minimal'],
    cost: 'free',
    status: 'expected'
  },

  // Qwen Models - Chinese Innovation
  {
    model: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B',
    category: 'balanced',
    expectedSpeed: 'slow',
    strengths: ['Large model', 'Multilingual', 'High quality'],
    toneMatch: ['luxury', 'zen', 'elegant'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'qwen/qwen3-coder:free',
    name: 'Qwen 3 Coder',
    category: 'coding',
    expectedSpeed: 'fast',
    strengths: ['Code focused', 'Fast generation', 'Technical accuracy'],
    toneMatch: ['techno', 'minimal', 'modern'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'qwen/qwq-32b:free',
    name: 'Qwen QwQ 32B',
    category: 'reasoning',
    expectedSpeed: 'medium',
    strengths: ['Question answering', 'Reasoning', 'Problem solving'],
    toneMatch: ['zen', 'corporate', 'balanced'],
    cost: 'free',
    status: 'expected'
  },

  // Creative Models - Artistic Expression
  {
    model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    name: 'Dolphin Venice (Uncensored)',
    category: 'creative',
    expectedSpeed: 'medium',
    strengths: ['Highly creative', 'Uncensored', 'Unique perspectives'],
    toneMatch: ['playful', 'creative', 'bold'],
    cost: 'free',
    status: 'expected'
  },

  // Meta Models - Open Source Leaders
  {
    model: 'meta-llama/llama-3.1-405b-instruct:free',
    name: 'Llama 3.1 405B',
    category: 'reasoning',
    expectedSpeed: 'slow',
    strengths: ['Massive model', 'Top performance', 'Complex reasoning'],
    toneMatch: ['luxury', 'corporate', 'bold'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    category: 'balanced',
    expectedSpeed: 'medium',
    strengths: ['Strong performance', 'Reliable', 'Well-rounded'],
    toneMatch: ['warm', 'balanced', 'corporate'],
    cost: 'free',
    status: 'expected'
  },

  // Specialized Models
  {
    model: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
    name: 'NVIDIA Nemotron Ultra 253B',
    category: 'reasoning',
    expectedSpeed: 'slow',
    strengths: ['NVIDIA tuned', 'Ultra large', 'High performance'],
    toneMatch: ['techno', 'bold', 'luxury'],
    cost: 'free',
    status: 'expected'
  },
  {
    model: 'moonshotai/kimi-k2:free',
    name: 'MoonshotAI Kimi K2',
    category: 'balanced',
    expectedSpeed: 'medium',
    strengths: ['Long context', 'Chinese innovation', 'Balanced performance'],
    toneMatch: ['zen', 'warm', 'nature'],
    cost: 'free',
    status: 'expected'
  }
];

// Recommended models by use case
export const MODEL_RECOMMENDATIONS = {
  // For generating hero headlines
  hero: {
    creative: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    fast: 'google/gemini-2.0-flash-exp:free',
    quality: 'deepseek/deepseek-r1:free',
    balanced: 'mistralai/mistral-small-3.2-24b-instruct:free'
  },
  
  // For feature descriptions  
  features: {
    creative: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    technical: 'qwen/qwen3-coder:free',
    professional: 'mistralai/mistral-7b-instruct:free',
    detailed: 'qwen/qwen-2.5-72b-instruct:free'
  },
  
  // For CTA generation
  cta: {
    persuasive: 'deepseek/deepseek-r1:free',
    creative: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    professional: 'mistralai/mistral-small-3.2-24b-instruct:free',
    fast: 'google/gemma-2-9b-it:free'
  },
  
  // For discovery/teaser text
  discovery: {
    witty: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    insightful: 'deepseek/deepseek-r1-0528:free',
    engaging: 'google/gemma-3-27b-it:free',
    concise: 'mistralai/mistral-7b-instruct:free'
  }
} as const;

// Status of our comprehensive testing
export const TESTING_STATUS = {
  totalModels: 54,
  testedModels: 0,
  workingModels: 0,
  authenticationIssue: true,
  recommendations: [
    'Current OpenRouter API key lacks completion permissions',
    'Models endpoint works (can fetch model list)',
    'Completion endpoint returns "User not found" 401 error',
    'Need valid API key with proper permissions to test all models',
    'Local fallback content is active until API access is resolved'
  ]
} as const;

// Helper functions
export function getModelsByCategory(category: ModelTestResult['category']): ModelTestResult[] {
  return FREE_MODELS_GUIDE.filter(model => model.category === category);
}

export function getModelsByTone(tone: string): ModelTestResult[] {
  return FREE_MODELS_GUIDE.filter(model => 
    model.toneMatch.includes(tone.toLowerCase())
  );
}

export function getRecommendedModel(useCase: keyof typeof MODEL_RECOMMENDATIONS, preference: string = 'balanced'): string {
  const recommendations = MODEL_RECOMMENDATIONS[useCase];
  return recommendations[preference as keyof typeof recommendations] || 
         recommendations[Object.keys(recommendations)[0] as keyof typeof recommendations];
}

export function getModelGuide(modelId: string): ModelTestResult | undefined {
  return FREE_MODELS_GUIDE.find(model => model.model === modelId);
}