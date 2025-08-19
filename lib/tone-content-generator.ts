// lib/tone-content-generator.ts
// Generate tone-specific content for each personality

import type { ContentGraph, Tone } from '@/types/section-system';
import { creativeContent } from '@/lib/creative-content';

export function generateToneSpecificContent(tone: Tone): ContentGraph {
  // Use creative content generator for more hilarious text
  const heroContent = creativeContent.generateHeroContent(tone);
  const features = creativeContent.generateFeatureContent(tone);
  const ctaContent = creativeContent.generateCTAContent(tone);
  
  // Build content graph with creative content
  const contentByTone: Record<Tone, ContentGraph> = {
    minimal: {
      hero: {
        headline: 'Simple. Clean. Effective.',
        subheadline: 'A minimalist approach to maximum impact.',
        bullets: [
          'Zero complexity',
          'Pure functionality',
          'Essential features only',
        ],
      },
      features: {
        headline: 'Core Features',
        subheadline: 'Everything essential. Nothing more.',
        items: [
          'Clean interface',
          'Fast performance',
          'Simple workflow',
        ],
      },
      cta: {
        headline: 'Get Started',
        description: 'Simple setup. No complications.',
        primaryAction: { label: 'Start Now', href: '/start' },
      },
    },
    
    bold: {
      hero: {
        headline: 'DISRUPT THE STATUS QUO',
        subheadline: 'Revolutionary technology that demolishes limitations and redefines what\'s possible.',
        bullets: [
          '10X PERFORMANCE GAINS',
          'BREAKTHROUGH INNOVATION',
          'UNSTOPPABLE MOMENTUM',
        ],
      },
      features: {
        headline: 'GAME-CHANGING CAPABILITIES',
        subheadline: 'Features that leave the competition in the dust',
        items: [
          'BLAZING FAST EXECUTION',
          'REVOLUTIONARY AI ENGINE',
          'UNMATCHED SCALABILITY',
        ],
      },
      cta: {
        headline: 'SEIZE YOUR ADVANTAGE NOW',
        description: 'Join the revolution. Dominate your market.',
        disclaimer: 'Limited time offer - Act fast',
        primaryAction: { label: 'DOMINATE NOW', href: '/start' },
        secondaryAction: { label: 'Learn More', href: '/features' },
      },
    },
    
    playful: {
      hero: {
        headline: '🚀 Zoom Into The Future!',
        subheadline: 'Where serious tech meets seriously fun! Build amazing things while having a blast.',
        bullets: [
          '✨ Magical automation',
          '🎯 Hit targets effortlessly',
          '🎉 Celebrate every deploy',
        ],
      },
      features: {
        headline: '🎨 Features That Spark Joy',
        subheadline: 'Tools so delightful, you\'ll forget you\'re working',
        items: [
          '🌈 Colorful dashboards',
          '🎮 Gamified workflows',
          '🦄 Unicorn-level magic',
        ],
      },
      cta: {
        headline: '🎊 Ready to Party?',
        description: 'Jump in! The water\'s warm and the vibes are immaculate.',
        disclaimer: '100% fun guaranteed',
        primaryAction: { label: '🚀 Let\'s Go!', href: '/start' },
        secondaryAction: { label: '✨ See Magic', href: '/demo' },
      },
    },
    
    corporate: {
      hero: {
        headline: 'Enterprise-Grade Solutions for Modern Business',
        subheadline: 'Trusted by Fortune 500 companies to deliver mission-critical applications with confidence.',
        bullets: [
          'SOC 2 Type II Certified',
          '99.99% Uptime SLA',
          'ISO 27001 Compliant',
        ],
      },
      features: {
        headline: 'Comprehensive Enterprise Features',
        subheadline: 'Built for scale, security, and compliance',
        items: [
          'Advanced Security Controls',
          'Regulatory Compliance Suite',
          'Enterprise Support 24/7',
        ],
      },
      cta: {
        headline: 'Schedule Your Enterprise Demo',
        description: 'Connect with our solutions architects to discuss your requirements.',
        disclaimer: 'Trusted by 80% of the Fortune 500',
        primaryAction: { label: 'Schedule Demo', href: '/enterprise' },
        secondaryAction: { label: 'Download Whitepaper', href: '/resources' },
      },
    },
    
    elegant: {
      hero: {
        headline: 'Refined Excellence in Every Detail',
        subheadline: 'Where sophistication meets innovation, crafted for those who appreciate the finer things.',
        bullets: [
          'Artisanal craftsmanship',
          'Timeless design philosophy',
          'Curated experiences',
        ],
      },
      features: {
        headline: 'Distinguished Capabilities',
        subheadline: 'Meticulously engineered for the discerning professional',
        items: [
          'Bespoke customization',
          'Premium materials',
          'White-glove service',
        ],
      },
      cta: {
        headline: 'Experience Distinction',
        description: 'Elevate your standards with our exclusive offering.',
        primaryAction: { label: 'Request Access', href: '/exclusive' },
      },
    },
    
    warm: {
      hero: {
        headline: 'Welcome Home to Better Building',
        subheadline: 'We\'re here to support your journey, every step of the way. Like a warm hug for your workflow.',
        bullets: [
          'Friendly community support',
          'Gentle learning curve',
          'Always here to help',
        ],
      },
      features: {
        headline: 'Features That Feel Like Home',
        subheadline: 'Comfortable, intuitive tools that just make sense',
        items: [
          'Cozy collaborative spaces',
          'Helpful guidance everywhere',
          'Your success is our joy',
        ],
      },
      cta: {
        headline: 'Come On In, Friend!',
        description: 'We\'ve been waiting for you. Let\'s build something wonderful together.',
        primaryAction: { label: 'Join Our Community', href: '/welcome' },
        secondaryAction: { label: 'Browse Around', href: '/explore' },
      },
    },
    
    nature: {
      hero: {
        headline: 'Sustainable Technology, Naturally',
        subheadline: 'Eco-conscious solutions that grow with you, powered by renewable energy and green practices.',
        bullets: [
          '🌱 Carbon neutral hosting',
          '🌿 Sustainable by design',
          '🌍 Planet-first approach',
        ],
      },
      features: {
        headline: 'Organic Growth Tools',
        subheadline: 'Cultivate success with earth-friendly technology',
        items: [
          'Green infrastructure',
          'Renewable resources',
          'Ecosystem harmony',
        ],
      },
      cta: {
        headline: 'Grow Naturally With Us',
        description: 'Plant the seeds of sustainable success today.',
        primaryAction: { label: '🌱 Plant Seeds', href: '/grow' },
        secondaryAction: { label: '🌿 Learn More', href: '/sustainability' },
      },
    },
    
    luxury: {
      hero: {
        headline: 'The Pinnacle of Digital Craftsmanship',
        subheadline: 'Exclusively designed for those who demand nothing but perfection. Limited availability.',
        bullets: [
          '24-karat gold-standard service',
          'Concierge-level support',
          'Invitation-only access',
        ],
      },
      features: {
        headline: 'Luxurious Capabilities',
        subheadline: 'Rare features for the most distinguished clientele',
        items: [
          'Private cloud instances',
          'Dedicated account team',
          'Bespoke implementations',
        ],
      },
      cta: {
        headline: 'Apply for Exclusive Access',
        description: 'Join an elite circle of industry leaders.',
        disclaimer: 'By invitation only',
        primaryAction: { label: 'Apply Now', href: '/apply' },
      },
    },
    
    modern: {
      hero: {
        headline: '> NEXT GEN PLATFORM',
        subheadline: 'Bleeding-edge tech stack. Async everything. Built for developers who live in the future.',
        bullets: [
          'GraphQL + WebSockets',
          'Edge computing ready',
          'AI-native architecture',
        ],
      },
      features: {
        headline: '// FEATURE_FLAGS.enabled',
        subheadline: 'Tech so fresh, the docs are still warm',
        items: [
          'Serverless first',
          'GitOps workflow',
          'Observable systems',
        ],
      },
      cta: {
        headline: 'git clone future',
        description: 'Deploy to the edge. Scale to infinity.',
        primaryAction: { label: 'npm install', href: '/quickstart' },
        secondaryAction: { label: 'View Docs', href: '/docs' },
      },
    },
    
    retro: {
      hero: {
        headline: '🕹️ RADICAL TECH FOR RAD PEOPLE',
        subheadline: 'Tubular solutions straight from the future! It\'s like 1985 met 2025 and had a baby.',
        bullets: [
          '⚡ TURBO-CHARGED SPEED',
          '💾 MEGA STORAGE POWER',
          '🎸 ROCK SOLID RELIABILITY',
        ],
      },
      features: {
        headline: 'TOTALLY AWESOME FEATURES',
        subheadline: 'Features so cool, they\'ll blow your mind!',
        items: [
          'BLAST PROCESSING',
          'HYPER THREADING',
          'MEGA PIXELS',
        ],
      },
      cta: {
        headline: 'BE EXCELLENT TO EACH OTHER',
        description: 'Don\'t be a square - join the revolution!',
        disclaimer: 'No bogus fees!',
        primaryAction: { label: 'POWER UP! ⚡', href: '/join' },
        secondaryAction: { label: 'CHECK IT OUT', href: '/tour' },
      },
    },
    
    creative: {
      hero: {
        headline: 'Where Imagination Becomes Reality',
        subheadline: 'Break every rule. Question everything. Create the impossible. This is your canvas.',
        bullets: [
          '∞ Infinite possibilities',
          '🎨 Paint outside the lines',
          '💭 Dream in technicolor',
        ],
      },
      features: {
        headline: 'Tools for Mad Scientists & Artists',
        subheadline: 'Experiment. Fail. Iterate. Breakthrough.',
        items: [
          'Chaos engineering mode',
          'Reality distortion field',
          'Quantum creativity engine',
        ],
      },
      cta: {
        headline: 'Unleash Your Inner Genius',
        description: 'Warning: May cause spontaneous innovation.',
        primaryAction: { label: 'Break Free 🎨', href: '/create' },
        secondaryAction: { label: 'See Examples', href: '/gallery' },
      },
    },
    
    monochrome: {
      hero: {
        headline: 'BLACK. WHITE. NOTHING ELSE.',
        subheadline: 'BRUTALIST EFFICIENCY. ZERO COMPROMISE. MAXIMUM CONTRAST.',
        bullets: [
          'STARK SIMPLICITY',
          'BRUTAL HONESTY',
          'PURE FUNCTION',
        ],
      },
      features: {
        headline: 'FEATURES',
        subheadline: 'STRIPPED. RAW. ESSENTIAL.',
        items: [
          'BINARY DECISIONS',
          'MONOLITHIC ARCHITECTURE',
          'ABSOLUTE CONTROL',
        ],
      },
      cta: {
        headline: 'YES OR NO',
        description: 'NO MIDDLE GROUND.',
        primaryAction: { label: 'YES', href: '/yes' },
        secondaryAction: { label: 'NO', href: '/' },
      },
    },

    techno: {
      hero: {
        headline: '◢ CYBERPUNK_PROTOCOL.INIT() ◣',
        subheadline: 'Enter the neon grid. Where digital dreams become holographic reality. The future is now, encrypted.',
        bullets: [
          '⟨◉⟩ NEURAL INTERFACE ACTIVE',
          '⟨⬢⟩ QUANTUM ENCRYPTION ENABLED',
          '⟨◈⟩ MATRIX SYNCHRONIZATION ONLINE',
        ],
      },
      features: {
        headline: '◢◤ CYBERNETIC CAPABILITIES ◥◣',
        subheadline: 'Advanced tech from the digital underground',
        items: [
          'HOLOGRAPHIC DATA STREAMS',
          'NEURAL NETWORK INTERFACE',
          'QUANTUM PROCESSING CORE',
        ],
      },
      cta: {
        headline: '◢ JACK INTO THE MATRIX ◣',
        description: 'Download consciousness. Upload possibilities.',
        disclaimer: 'WARNING: Highly addictive digital experience',
        primaryAction: { label: '⟨◉⟩ CONNECT', href: '/matrix' },
        secondaryAction: { label: '⟨⬢⟩ SCAN CODE', href: '/scan' },
      },
    },

    zen: {
      hero: {
        headline: 'Find Balance in Digital Harmony',
        subheadline: 'Where technology meets tranquility. Mindful tools for a peaceful digital life.',
        bullets: [
          '🧘 Mindful workflows',
          '⚖️ Perfect balance',
          '🌸 Serene simplicity',
        ],
      },
      features: {
        headline: 'Peaceful Productivity',
        subheadline: 'Tools that breathe with your natural rhythm',
        items: [
          'Meditation-inspired interface',
          'Distraction-free workspace',
          'Gentle notification system',
        ],
      },
      cta: {
        headline: 'Begin Your Journey to Digital Peace',
        description: 'Step into serenity. Find your flow.',
        primaryAction: { label: '🧘 Start Mindfully', href: '/peace' },
        secondaryAction: { label: '🌸 Learn More', href: '/philosophy' },
      },
    },
  };
  
  return contentByTone[tone];
}