// lib/ai-styles-content.ts
// Unique content for each AI-generated style

import type { ContentGraph } from '@/types/section-system';

export interface AIStyleContent {
  name: string;
  philosophy: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  content: ContentGraph;
  uniqueFeatures: string[];
}

export const AI_STYLES_CONTENT: Record<string, AIStyleContent> = {
  'quantum-nebula': {
    name: 'Quantum Nebula Emporium',
    philosophy: 'Where Pixels Dance with the Cosmos',
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

  'deepseek-enigma': {
    name: 'DeepSeek Enigma',
    philosophy: 'Where logic transcends reality',
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

  'thunder-goat': {
    name: 'Cosmic Thunder Goat Interactive',
    philosophy: 'Where Chaos Meets Brilliance and Reality Glitches Out',
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
          '3D glitch mode that distorts reality like broken VHS',
          'Thunder Goat AI that bleats wisdom in haiku form',
          'Reality sliders from 0% sense to 100% comprehension'
        ]
      },
      features: {
        headline: 'Chaotic Brilliance Features', 
        subheadline: 'Where madness meets method',
        items: [
          'VHS-style reality distortion effects',
          'Haiku-speaking AI assistant',
          'Adjustable reality comprehension levels'
        ]
      },
      cta: {
        headline: 'Embrace the Beautiful Chaos',
        description: 'Ready to let chaos spark your brilliance? Enter the thunder.',
        primaryAction: { label: 'Glitch Reality', href: '/thunder' }
      }
    },
    uniqueFeatures: [
      'Website distorts like broken VHS tape when scrolling',
      'Thunder Goat AI assistant speaks only in wisdom haikus',
      'Reality slider adjusts how much sense content makes'
    ]
  },

  'voidwhisper': {
    name: 'VOIDWHISPER',
    philosophy: 'WHERE CHAOS BIRTHS CLARITY AND UNICORNS PROGRAM YOUR SOUL',
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
          'Mood-responsive typography that screams joy, whispers sorrow',
          'Reverse gravity navigation - swipe down to go up',
          'Living background organisms that evolve into features'
        ]
      },
      features: {
        headline: 'Soul-Programming Features',
        subheadline: 'When chaos becomes your creative compass',
        items: [
          'Emotionally reactive typography systems',
          'Physics-defying navigation mechanics',
          'Digital organisms that grow into functionality'
        ]
      },
      cta: {
        headline: 'Let Chaos Clarify Your Vision',
        description: 'Ready for unicorns to program your soul? Enter the void.',
        primaryAction: { label: 'Birth Clarity', href: '/void' }
      }
    },
    uniqueFeatures: [
      'Typography screams when happy, whispers Ancient Greek when sad',
      'Buttons flee from cursor like shy housecats',
      'Background organisms evolve into website features over time'
    ]
  },

  'psychedelic-cafe': {
    name: 'Galactic Psychedelic Café',
    philosophy: 'Where Time, Space, and Flavors Collide',
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
          'Interactive quantum VR experiences through impossible realities',
          'Cosmic jukebox that dances to distant galaxy frequencies',
          'Weightless dining tables suspended among nebulae'
        ]
      },
      features: {
        headline: 'Interdimensional Café Features',
        subheadline: 'Every sip is an adventure through impossible realities',
        items: [
          'Quantum VR reality dining experiences',
          'Galaxy-frequency mood music systems',
          'Anti-gravity dining environments'
        ]
      },
      cta: {
        headline: 'Taste the Impossible',
        description: 'Ready to dine among stars? Enter our cosmic café.',
        primaryAction: { label: 'Enter Café', href: '/cosmic-cafe' }
      }
    },
    uniqueFeatures: [
      'Dive into impossible realities with every menu interaction',
      'Ambient music dances to tunes of distant galaxies',
      'Weightless tables let you dine floating among nebulae'
    ]
  },

  'glitchgizzard': {
    name: 'GlitchGizzard & the Quantum Jellyfish',
    philosophy: 'Reality is just a slow-loading JPEG—refresh until the universe crashes',
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
          'Micro-burrito generator 3D-prints snackable poems',
          'Reverse nostalgia filter shows tomorrows regrets today',
          'Cosmic hiccup button shares interdimensional sneezes globally'
        ]
      },
      features: {
        headline: 'Quantum Glitch Features',
        subheadline: 'Where buffering becomes beautiful',
        items: [
          'Poetry-generating micro-burrito systems',
          'Time-reversed nostalgia visualization',
          'Globally synchronized cosmic hiccups'
        ]
      },
      cta: {
        headline: 'Buffer Into Tomorrow',
        description: 'Ready to refresh reality? Let the universe crash beautifully.',
        primaryAction: { label: 'Crash Universe', href: '/glitch' }
      }
    },
    uniqueFeatures: [
      '3D-prints snackable poems directly into your USB-C port',
      'Shows tomorrow\'s regrets in sepia-tone GIFs before you make them',
      'Cosmic hiccup shared across every open browser tab worldwide'
    ]
  },

  'glm-air-flow': {
    name: 'GLM Air Flow',
    philosophy: 'Breathe in the digital atmosphere',
    colors: {
      primary: '#00FFCC',
      secondary: '#40E0D0',
      background: '#001A33'
    },
    content: {
      hero: {
        headline: 'FLOAT INTO THE FUTURE',
        subheadline: 'Breathe in the digital atmosphere where data flows like wind',
        bullets: [
          'Atmospheric pressure responsive design that breathes',
          'Cloud-based everything that floats weightlessly',
          'Weightless UX that defies digital gravity'
        ]
      },
      features: {
        headline: 'Atmospheric Design Features',
        subheadline: 'Where digital meets atmospheric physics',
        items: [
          'Pressure-responsive interface adaptation',
          'Cloud-native weightless interactions',
          'Gravity-defying user experience flows'
        ]
      },
      cta: {
        headline: 'Breathe Digital Air',
        description: 'Ready to float in digital atmosphere? Take a deep breath.',
        primaryAction: { label: 'Inhale Digital', href: '/air-flow' }
      }
    },
    uniqueFeatures: [
      'Design responds to atmospheric pressure changes',
      'Everything floats in cloud-based weightless environment',
      'UX that literally defies digital gravity laws'
    ]
  },

  'quantum-quokka': {
    name: 'Quantum Quokka Inc.',
    philosophy: 'Where Reality Melts and Imagination Bakes',
    colors: {
      primary: '#FF66CC',
      secondary: '#CC66FF',
      background: '#330033'
    },
    content: {
      hero: {
        headline: 'Welcome to the Quantum Quokka Circus!',
        subheadline: 'Where reality melts into imagination and bakes into pure joy',
        bullets: [
          'Chaos-engine navigation based on your mood and browser history',
          'Dream weaver integration transforms sleep into interactive pages',
          'Quantum quokka biofeedback adjusts reality in real-time'
        ]
      },
      features: {
        headline: 'Reality-Melting Features',
        subheadline: 'Step right up and lose yourself in the absurd',
        items: [
          'Mood-based navigation chaos engines',
          'Dream-to-webpage transformation systems',
          'Biofeedback reality adjustment algorithms'
        ]
      },
      cta: {
        headline: 'Join the Quantum Circus',
        description: 'Ready to melt reality and bake imagination? Step right up!',
        primaryAction: { label: 'Enter Circus', href: '/quokka-circus' }
      }
    },
    uniqueFeatures: [
      'Navigation changes based on your mood and browsing history',
      'Upload dreams to create unique personalized pages',
      'Biofeedback adjusts colors and layout based on heart rate'
    ]
  }
};