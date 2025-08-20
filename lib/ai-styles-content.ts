// ALL AI-Generated Styles for Grid 2.0 - Combined Original + New
// Total: 20 unique AI-generated styles

import type { ContentGraph } from '@/types/section-system';
import type { Tone } from '@/types/section-system';

export interface AIStyleComplete {
  id: string;
  name: string;
  philosophy: string;
  tone: Tone;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  content: ContentGraph;
  uniqueFeatures: string[];
}

// Legacy export for backward compatibility
export const AI_STYLES_CONTENT = {} as Record<string, any>;

export const ALL_AI_STYLES_COMBINED: AIStyleComplete[] = [
  // ========== ORIGINAL 8 AI STYLES ==========
  {
    id: 'quantum-nebula',
    name: 'Quantum Nebula Emporium',
    philosophy: 'Where Pixels Dance with the Cosmos',
    tone: 'playful',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      background: '#0A0A1A'
    },
    content: {
      hero: {
        headline: 'ENTER THE VORTEX OF ABSURD CREATIVITY',
        subheadline: 'Where pixels dance with the cosmos and every click spawns new galaxies',
        bullets: [
          'Interactive particle ecosystems that react to your soul',
          'Temporal glitch portals to alternate design universes',
          'Emotional AI hosts that morph with your energy'
        ]
      },
      features: {
        headline: 'Cosmic Design Features',
        subheadline: 'Experience design that transcends reality',
        items: [
          'Nebula-powered content generation',
          'Quantum entangled user interfaces',
          'Stardust animation frameworks'
        ]
      },
      cta: {
        headline: 'Launch Into the Design Universe',
        description: 'Ready to dance with cosmic creativity? Enter the nebula.',
        primaryAction: { label: 'Enter the Vortex', href: '/cosmic' }
      }
    },
    uniqueFeatures: [
      'Every click spawns a new galaxy of animated particles',
      'Temporal portals to cyberpunk alternate timelines',
      'AI host named "Nebula" that morphs with your mood'
    ]
  },
  {
    id: 'deepseek-enigma',
    name: 'DeepSeek Enigma',
    philosophy: 'Where logic transcends reality',
    tone: 'bold',
    colors: {
      primary: '#0080FF',
      secondary: '#4B0082',
      background: '#0A0A0A'
    },
    content: {
      hero: {
        headline: 'THINK DEEPER THAN REALITY',
        subheadline: 'Where logic transcends the boundaries of conventional design',
        bullets: [
          'Quantum reasoning engine for impossible solutions',
          'Paradox resolution systems that defy physics',
          'Mind-bending navigation through logical dimensions'
        ]
      },
      features: {
        headline: 'Enigmatic Capabilities',
        subheadline: 'Logic so deep it creates new realities',
        items: [
          'Recursive thought algorithms',
          'Paradox-solving interface patterns',
          'Reality-bending user experiences'
        ]
      },
      cta: {
        headline: 'Transcend Logical Boundaries',
        description: 'Ready to think beyond the possible? Dive into the enigma.',
        primaryAction: { label: 'Think Deeper', href: '/enigma' }
      }
    },
    uniqueFeatures: [
      'Quantum reasoning engine that solves impossible problems',
      'Paradox resolution system that defies conventional logic',
      'Mind-bending navigation through dimensional interfaces'
    ]
  },
  {
    id: 'thunder-goat',
    name: 'Cosmic Thunder Goat Interactive',
    philosophy: 'Where Chaos Meets Brilliance',
    tone: 'creative',
    colors: {
      primary: '#FF00F6',
      secondary: '#8B00FF',
      background: '#1A001A'
    },
    content: {
      hero: {
        headline: 'WELCOME TO THE GLITCH DIMENSION',
        subheadline: 'Where chaos meets brilliance and reality becomes beautifully broken',
        bullets: [
          'Thunder-powered quantum processors',
          'Goat-approved user interfaces',
          'Cosmic chaos generators'
        ]
      },
      features: {
        headline: 'Chaotic Brilliance Features',
        subheadline: 'Where madness meets method',
        items: [
          'Reality glitch generators',
          'Thunder storm animations',
          'Goat AI assistants'
        ]
      },
      cta: {
        headline: 'Embrace the Beautiful Chaos',
        description: 'Let the Thunder Goat guide you through digital madness',
        primaryAction: { label: 'Summon the Goat', href: '/chaos' }
      }
    },
    uniqueFeatures: [
      'Thunder effects that shake the entire viewport',
      'Goat bleating sound effects on every click',
      'Chaos meter that increases with user interaction'
    ]
  },
  {
    id: 'voidwhisper',
    name: 'VOIDWHISPER',
    philosophy: 'CHAOS BIRTHS CLARITY',
    tone: 'playful',
    colors: {
      primary: '#FF00FF',
      secondary: '#000000',
      background: '#FFFFFF'
    },
    content: {
      hero: {
        headline: 'ABANDON ALL BORING EXPECTATIONS',
        subheadline: 'Where chaos births clarity and digital unicorns program your very soul',
        bullets: [
          'Soul-programming algorithms',
          'Digital unicorn companions',
          'Void-powered creativity engines'
        ]
      },
      features: {
        headline: 'Soul-Programming Features',
        subheadline: 'When chaos becomes your creative compass',
        items: [
          'Whispers from the digital void',
          'Unicorn-driven development',
          'Chaos clarification systems'
        ]
      },
      cta: {
        headline: 'Let Chaos Clarify Your Vision',
        description: 'The void whispers your name. Will you answer?',
        primaryAction: { label: 'Enter the Void', href: '/whisper' }
      }
    },
    uniqueFeatures: [
      'Whisper effects that follow your cursor',
      'Random void portals that appear and disappear',
      'Digital unicorns that gallop across the screen'
    ]
  },
  {
    id: 'psychedelic-cafe',
    name: 'Galactic Psychedelic Café',
    philosophy: 'Time, Space, and Flavors Collide',
    tone: 'retro',
    colors: {
      primary: '#FF69B4',
      secondary: '#FFA500',
      background: '#2F004F'
    },
    content: {
      hero: {
        headline: 'Welcome to the Galactic Psychedelic Café!',
        subheadline: 'Where time, space, and flavors create impossible experiences',
        bullets: [
          'Interdimensional coffee brewing',
          'Time-traveling menu items',
          'Psychedelic flavor explosions'
        ]
      },
      features: {
        headline: 'Interdimensional Café Features',
        subheadline: 'Every sip is an adventure through impossible realities',
        items: [
          'Quantum coffee generators',
          'Time-loop breakfast specials',
          'Galactic smoothie blenders'
        ]
      },
      cta: {
        headline: 'Taste the Impossible',
        description: 'Your table across dimensions awaits',
        primaryAction: { label: 'Enter the Café', href: '/cafe' }
      }
    },
    uniqueFeatures: [
      'Coffee steam that forms galaxy patterns',
      'Menu items that change based on time of day',
      'Psychedelic color shifts with every scroll'
    ]
  },
  {
    id: 'glitchgizzard',
    name: 'GlitchGizzard & the Quantum Jellyfish',
    philosophy: 'Reality is a slow-loading JPEG',
    tone: 'playful',
    colors: {
      primary: '#FFD9FF',
      secondary: '#DDA0DD',
      background: '#1C0033'
    },
    content: {
      hero: {
        headline: 'Careful—your future déjà vu is already buffering here',
        subheadline: 'Reality loads slowly, but the glitches are worth the wait',
        bullets: [
          'Pre-loaded future memories',
          'Buffering reality engines',
          'Quantum jellyfish companions'
        ]
      },
      features: {
        headline: 'Quantum Glitch Features',
        subheadline: 'Where buffering becomes beautiful',
        items: [
          'Déjà vu generators',
          'Reality loading bars',
          'Jellyfish navigation systems'
        ]
      },
      cta: {
        headline: 'Buffer Into Tomorrow',
        description: 'Your future is loading... 98% complete',
        primaryAction: { label: 'Load Reality', href: '/buffer' }
      }
    },
    uniqueFeatures: [
      'Loading bars that never quite reach 100%',
      'Jellyfish that swim across the screen',
      'Glitch effects that reveal future content'
    ]
  },
  {
    id: 'glm-air-flow',
    name: 'GLM Air Flow',
    philosophy: 'Breathe in the digital atmosphere',
    tone: 'modern',
    colors: {
      primary: '#00FFCC',
      secondary: '#40E0D0',
      background: '#001A33'
    },
    content: {
      hero: {
        headline: 'BREATHE THE DIGITAL OXYGEN',
        subheadline: 'Where data flows like air and interfaces breathe with life',
        bullets: [
          'Atmospheric data streams',
          'Breathing interface rhythms',
          'Digital wind currents'
        ]
      },
      features: {
        headline: 'Atmospheric Features',
        subheadline: 'Feel the digital breeze',
        items: [
          'Air flow visualizations',
          'Breathing animations',
          'Wind-powered interactions'
        ]
      },
      cta: {
        headline: 'Take a Deep Digital Breath',
        description: 'The atmosphere is ready for you',
        primaryAction: { label: 'Breathe In', href: '/flow' }
      }
    },
    uniqueFeatures: [
      'Breathing animations that sync with scroll',
      'Particle effects that flow like air currents',
      'Wind sound effects on hover'
    ]
  },
  {
    id: 'quantum-quokka',
    name: 'Quantum Quokka Inc.',
    philosophy: 'Reality Melts, Imagination Bakes',
    tone: 'creative',
    colors: {
      primary: '#FF66CC',
      secondary: '#CC66FF',
      background: '#330033'
    },
    content: {
      hero: {
        headline: 'WHERE REALITY MELTS AND IMAGINATION BAKES',
        subheadline: 'Quantum quokkas guide you through melting realities and baking dreams',
        bullets: [
          'Reality melting protocols',
          'Imagination baking ovens',
          'Quokka quantum guides'
        ]
      },
      features: {
        headline: 'Quantum Baking Features',
        subheadline: 'Fresh imagination, served daily',
        items: [
          'Reality melting points',
          'Dream baking temperatures',
          'Quokka quality control'
        ]
      },
      cta: {
        headline: 'Start Baking Your Reality',
        description: 'The quokkas are preheating the imagination ovens',
        primaryAction: { label: 'Begin Baking', href: '/bake' }
      }
    },
    uniqueFeatures: [
      'Melting animations on scroll',
      'Quokka guides that follow your cursor',
      'Baking timer countdowns for loading'
    ]
  },

  // ========== NEW 12 AI STYLES ==========
  {
    id: 'neon-ghost',
    name: 'Neon Ghost Protocol',
    philosophy: 'Bleeding-edge chaos meets sleek dystopian elegance in neon-drenched data storms',
    tone: 'modern',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      background: '#0A0A1A'
    },
    content: {
      hero: {
        headline: 'HACK THE MATRIX OF REALITY',
        subheadline: 'Where digital rain meets neon dreams and every click rewrites the code of existence',
        bullets: [
          'Neural interfaces that sync with your thoughts',
          'Holographic UI that exists between dimensions',
          'Quantum encryption for your digital soul'
        ]
      },
      features: {
        headline: 'Cyberpunk Arsenal',
        subheadline: 'Tools forged in the neon underground',
        items: [
          'Ghost protocol stealth mode',
          'Neural jack direct interface',
          'Quantum firewall protection'
        ]
      },
      cta: {
        headline: 'Jack Into The System',
        description: 'The ghost in the machine awaits your consciousness',
        primaryAction: { label: 'Enter The Grid', href: '/matrix' }
      }
    },
    uniqueFeatures: [
      'Neon rain effect that responds to mouse movement',
      'Glitch transitions between sections',
      'ASCII art easter eggs in the console'
    ]
  },
  {
    id: 'zen-ethereal',
    name: 'Ethereal Zen Garden',
    philosophy: 'Digital spaces that mirror the tranquility and balance of nature\'s masterpieces',
    tone: 'zen',
    colors: {
      primary: '#4A5568',
      secondary: '#68D391',
      background: '#F7FAFC'
    },
    content: {
      hero: {
        headline: 'Find Your Digital Inner Peace',
        subheadline: 'Where every pixel breathes with mindful intention and conscious design',
        bullets: [
          'Harmonious flow of information',
          'Balanced composition in every view',
          'Mindful interactions that respect your time'
        ]
      },
      features: {
        headline: 'Elements of Tranquility',
        subheadline: 'Features that nurture digital wellbeing',
        items: [
          'Breathing space in every layout',
          'Natural flow navigation',
          'Peaceful micro-interactions'
        ]
      },
      cta: {
        headline: 'Begin Your Journey to Balance',
        description: 'Step into a space where technology serves serenity',
        primaryAction: { label: 'Enter The Garden', href: '/zen' }
      }
    },
    uniqueFeatures: [
      'Ambient particle effects like floating cherry blossoms',
      'Smooth, meditative scroll animations',
      'Sound design with nature elements'
    ]
  },
  {
    id: 'retro-arcade',
    name: 'Pixel Paradise Arcade',
    philosophy: 'Every interaction should feel like inserting a quarter into your favorite cabinet',
    tone: 'retro',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      background: '#1A1A2E'
    },
    content: {
      hero: {
        headline: 'INSERT COIN TO START',
        subheadline: 'High scores, pixel perfect design, and that sweet CRT glow',
        bullets: [
          '8-bit aesthetics with 64-bit power',
          'Arcade physics for every interaction',
          'Leaderboards for everything'
        ]
      },
      features: {
        headline: 'Power-Ups Included',
        subheadline: 'Level up your web experience',
        items: [
          'Combo multipliers for navigation',
          'Achievement unlocks for exploration',
          'Boss battles with boring design'
        ]
      },
      cta: {
        headline: 'Ready Player One?',
        description: 'Your high score awaits in this digital arcade',
        primaryAction: { label: 'Press Start', href: '/play' }
      }
    },
    uniqueFeatures: [
      'Scanline effects and CRT monitor simulation',
      'Chiptune soundtrack that adapts to user actions',
      'Hidden Konami code functionality'
    ]
  },
  {
    id: 'dark-academia',
    name: 'Nocturne Arcana Library',
    philosophy: 'Where forgotten scrolls whisper secrets and shadows guard ancient knowledge',
    tone: 'elegant',
    colors: {
      primary: '#8B4513',
      secondary: '#DAA520',
      background: '#1C1C1C'
    },
    content: {
      hero: {
        headline: 'Unlock Forbidden Knowledge',
        subheadline: 'Ancient wisdom meets modern mysticism in halls of digital academia',
        bullets: [
          'Scrolls of infinite wisdom',
          'Candlelit navigation paths',
          'Encrypted ancient languages'
        ]
      },
      features: {
        headline: 'Scholarly Enchantments',
        subheadline: 'Tools blessed by centuries of learning',
        items: [
          'Grimoire documentation system',
          'Alchemical data transformation',
          'Runic encryption protocols'
        ]
      },
      cta: {
        headline: 'The Library Awaits',
        description: 'Join the secret society of digital scholars',
        primaryAction: { label: 'Enter The Archives', href: '/library' }
      }
    },
    uniqueFeatures: [
      'Parchment texture overlays on content',
      'Candlelight flicker animations',
      'Latin text that translates on hover'
    ]
  },
  {
    id: 'solar-punk',
    name: 'Sunrise Symphony',
    philosophy: 'Sustainable innovation creates a thriving, eco-conscious digital future',
    tone: 'nature',
    colors: {
      primary: '#10B981',
      secondary: '#F59E0B',
      background: '#FEFCE8'
    },
    content: {
      hero: {
        headline: 'Grow Your Digital Garden',
        subheadline: 'Where technology blooms in harmony with nature\'s rhythms',
        bullets: [
          'Carbon-negative hosting',
          'Solar-powered interactions',
          'Regenerative design patterns'
        ]
      },
      features: {
        headline: 'Sustainable Tech Ecosystem',
        subheadline: 'Features that give back more than they take',
        items: [
          'Green energy optimization',
          'Biodegradable code patterns',
          'Symbiotic user relationships'
        ]
      },
      cta: {
        headline: 'Plant Your Digital Seed',
        description: 'Join the revolution of regenerative technology',
        primaryAction: { label: 'Start Growing', href: '/plant' }
      }
    },
    uniqueFeatures: [
      'Live plant growth animations tied to user engagement',
      'Solar position affects color temperature',
      'Carbon offset counter for page visits'
    ]
  },
  {
    id: 'vaporwave-dreams',
    name: 'Digital Sunset Mall',
    philosophy: 'Nostalgia crashes into digital decay creating beautiful glitch poetry',
    tone: 'creative',
    colors: {
      primary: '#FF71CE',
      secondary: '#B967FF',
      background: '#05FFA1'
    },
    content: {
      hero: {
        headline: 'ａｅｓｔｈｅｔｉｃ　ｏｖｅｒｌｏａｄ',
        subheadline: 'Lost in digital malls where Windows 95 dreams never died',
        bullets: [
          'Ｆｕｌｌ　ｗｉｄｔｈ　ｔｅｘｔ',
          'Glitch art generators',
          'Mall fountain ambience'
        ]
      },
      features: {
        headline: 'Vaporwave Utilities',
        subheadline: 'Tools from a timeline that never was',
        items: [
          'Roman bust generators',
          'Palm tree databases',
          'Arizona tea authentication'
        ]
      },
      cta: {
        headline: 'Ｅｎｔｅｒ　ｔｈｅ　Ｍａｌｌ',
        description: 'Your nostalgic future awaits in the digital plaza',
        primaryAction: { label: 'Ｖｉｂｅ　Ｃｈｅｃｋ', href: '/mall' }
      }
    },
    uniqueFeatures: [
      'VHS tracking errors on scroll',
      'Elevator music that gets progressively more distorted',
      'Random Japanese text overlays'
    ]
  },
  {
    id: 'brutalist-concrete',
    name: 'Concrete Monolith',
    philosophy: 'Raw, unapologetic digital concrete that commands respect through presence',
    tone: 'bold',
    colors: {
      primary: '#2D3748',
      secondary: '#E53E3E',
      background: '#EDF2F7'
    },
    content: {
      hero: {
        headline: 'BRUTALLY HONEST DESIGN',
        subheadline: 'No decoration. No apologies. Just raw digital concrete.',
        bullets: [
          'MASSIVE TYPE THAT SCREAMS',
          'CONCRETE BLOCK LAYOUTS',
          'IMPOSING GEOMETRIC FORMS'
        ]
      },
      features: {
        headline: 'STRUCTURAL INTEGRITY',
        subheadline: 'Built to last a thousand digital years',
        items: [
          'REINFORCED GRID SYSTEMS',
          'MONOLITHIC COMPONENTS',
          'FORTRESS-LEVEL SECURITY'
        ]
      },
      cta: {
        headline: 'ENTER THE MONOLITH',
        description: 'For those who appreciate raw power',
        primaryAction: { label: 'BREACH THE WALLS', href: '/fortress' }
      }
    },
    uniqueFeatures: [
      'Concrete texture overlays on all surfaces',
      'Harsh shadows and stark contrasts',
      'Sound effects like echoing footsteps'
    ]
  },
  {
    id: 'memphis-party',
    name: 'Geometric Playground',
    philosophy: 'Where serious design goes to have a really good time',
    tone: 'playful',
    colors: {
      primary: '#F687B3',
      secondary: '#FBB6CE',
      background: '#FED7E2'
    },
    content: {
      hero: {
        headline: 'Shapes Gone Wild! 🎉',
        subheadline: 'Primary colors partying with impossible geometry since forever',
        bullets: [
          'Squiggles that wiggle',
          'Triangles doing backflips',
          'Circles that refuse to be round'
        ]
      },
      features: {
        headline: 'Playful Chaos Features',
        subheadline: 'Tools that take themselves hilariously seriously',
        items: [
          'Pattern generators gone rogue',
          'Color combinations that shouldn\'t work',
          'Shapes that defy description'
        ]
      },
      cta: {
        headline: 'Join The Shape Party!',
        description: 'Warning: May cause spontaneous joy',
        primaryAction: { label: 'Let\'s Get Geometric!', href: '/party' }
      }
    },
    uniqueFeatures: [
      'Shapes that dance to mouse movement',
      'Random pattern explosions on click',
      'Confetti cannons for achievements'
    ]
  },
  {
    id: 'cosmic-void',
    name: 'Void Whisper Station',
    philosophy: 'Embrace the beautiful terror of infinite digital darkness',
    tone: 'bold',
    colors: {
      primary: '#6B46C1',
      secondary: '#1E293B',
      background: '#020617'
    },
    content: {
      hero: {
        headline: 'THE VOID GAZES BACK',
        subheadline: 'Where impossible geometry meets existential dread in perfect harmony',
        bullets: [
          'Non-Euclidean navigation paths',
          'Whispers from digital dimensions',
          'Reality glitches you can touch'
        ]
      },
      features: {
        headline: 'Eldritch Technologies',
        subheadline: 'Tools that shouldn\'t exist but do',
        items: [
          'Void portal generators',
          'Sanity checking algorithms',
          'Dimension folding interfaces'
        ]
      },
      cta: {
        headline: 'Embrace The Cosmic Horror',
        description: 'Some knowledge cannot be unlearned',
        primaryAction: { label: 'Enter The Void', href: '/void' }
      }
    },
    uniqueFeatures: [
      'Tentacle animations in dark corners',
      'Text that becomes illegible when stared at',
      'Ambient whispers in the background audio'
    ]
  },
  {
    id: 'cottage-comfort',
    name: 'Digital Cottage Haven',
    philosophy: 'Handcrafted pixels with the warmth of fresh-baked cookies',
    tone: 'warm',
    colors: {
      primary: '#92400E',
      secondary: '#D97706',
      background: '#FEF3C7'
    },
    content: {
      hero: {
        headline: 'Welcome to Your Cozy Corner',
        subheadline: 'Where every pixel feels like a warm hug from grandma',
        bullets: [
          'Hand-stitched interfaces',
          'Homemade component recipes',
          'Garden-fresh color palettes'
        ]
      },
      features: {
        headline: 'Cottage Comforts',
        subheadline: 'Digital tools with analog soul',
        items: [
          'Recipe card layouts',
          'Knitted pattern backgrounds',
          'Pressed flower decorations'
        ]
      },
      cta: {
        headline: 'Come In For Tea',
        description: 'Your digital hearth awaits',
        primaryAction: { label: 'Enter The Cottage', href: '/home' }
      }
    },
    uniqueFeatures: [
      'Seasonal decorations that change with real seasons',
      'Flour dust particle effects',
      'Crackling fireplace sounds'
    ]
  },
  {
    id: 'maximalist-chaos',
    name: 'Everything Everywhere',
    philosophy: 'Why choose when you can have it all, all at once, forever',
    tone: 'creative',
    colors: {
      primary: '#FF0080',
      secondary: '#00FF80',
      background: '#8000FF'
    },
    content: {
      hero: {
        headline: 'MORE IS MORE IS MORE IS MORE',
        subheadline: 'Minimalism is dead, long live the explosion of everything',
        bullets: [
          'Every color that exists',
          'All the animations simultaneously',
          'Patterns on patterns on patterns'
        ]
      },
      features: {
        headline: 'MAXIMUM EVERYTHING',
        subheadline: 'Features that refuse to be ignored',
        items: [
          'Sensory overload optimization',
          'Baroque complexity generators',
          'Infinite scroll in all directions'
        ]
      },
      cta: {
        headline: 'EMBRACE THE CHAOS',
        description: 'Your retinas will thank you (eventually)',
        primaryAction: { label: 'EVERYTHING NOW!', href: '/all' }
      }
    },
    uniqueFeatures: [
      'Every element has at least 3 animations',
      'Color shifts every 3 seconds',
      'Parallax in 17 different directions'
    ]
  },
  {
    id: 'glitch-reality',
    name: 'Reality.exe Error',
    philosophy: 'Beauty emerges from corruption, art from digital decay',
    tone: 'modern',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      background: '#000000'
    },
    content: {
      hero: {
        headline: 'ERROR: SUCCESS NOT FOUND',
        subheadline: 'When systems fail beautifully, art emerges from the chaos',
        bullets: [
          'Corrupted data streams',
          'Buffer overflow aesthetics',
          'Memory leak waterfalls'
        ]
      },
      features: {
        headline: '//FEATURES_CORRUPTED',
        subheadline: 'Functionality through dysfunction',
        items: [
          'Datamoshing interfaces',
          'Pixel sorting algorithms',
          'Compression artifact galleries'
        ]
      },
      cta: {
        headline: 'SEGMENTATION FAULT',
        description: 'Core dumped. Beauty extracted.',
        primaryAction: { label: '[CLICK_ERROR]', href: '/crash' }
      }
    },
    uniqueFeatures: [
      'Random pixel corruption on hover',
      'Audio glitches synchronized to scrolling',
      'Blue screen of death easter eggs'
    ]
  }
];

// Export metadata for StyleShowcaseGrid
export const AI_STYLE_METADATA_COMBINED = ALL_AI_STYLES_COMBINED.map(style => ({
  value: style.tone,
  name: style.name,
  description: style.philosophy,
  colors: style.colors,
  aiStyleId: style.id
}));

// Export content map for quick lookup
export const AI_STYLES_CONTENT_MAP_COMBINED = ALL_AI_STYLES_COMBINED.reduce((acc, style) => {
  acc[style.id] = {
    name: style.name,
    philosophy: style.philosophy,
    colors: style.colors,
    content: style.content,
    uniqueFeatures: style.uniqueFeatures
  };
  return acc;
}, {} as Record<string, any>);

// Update legacy export with all styles
Object.assign(AI_STYLES_CONTENT, AI_STYLES_CONTENT_MAP_COMBINED);