#!/usr/bin/env node

/**
 * Generate unique AI images for all 32 styles using Pollinations.ai
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// All 32 styles with their unique characteristics and image prompts
const ALL_STYLES = [
  // Original 12 styles
  { 
    id: 'minimal-swiss', 
    name: 'Minimal Swiss', 
    tone: 'minimal',
    prompts: {
      hero: 'Clean minimalist office space with white walls, geometric furniture, natural light, Swiss design principles, ultra-clean, professional',
      feature1: 'Minimalist product design, clean lines, white background, geometric shapes, Swiss typography influence',
      feature2: 'Simple workspace with laptop, clean desk, minimal decor, natural lighting, focus on functionality',
      feature3: 'Modern minimalist interior, white and grey color scheme, geometric patterns, natural light',
      cta: 'Clean call-to-action design with geometric elements, minimal color palette, professional feel'
    }
  },
  { 
    id: 'bold-brutalist', 
    name: 'Bold Brutalist', 
    tone: 'bold',
    prompts: {
      hero: 'Brutalist concrete architecture, bold geometric shapes, dramatic shadows, industrial design, powerful composition',
      feature1: 'Strong typography design, bold contrasts, industrial materials, concrete textures',
      feature2: 'Dramatic architectural photography, brutalist building, harsh lighting, monumental scale',
      feature3: 'Bold graphic design elements, high contrast, geometric shapes, industrial aesthetic',
      cta: 'Powerful call-to-action with bold typography, strong colors, dramatic composition'
    }
  },
  { 
    id: 'playful-memphis', 
    name: 'Playful Memphis', 
    tone: 'playful',
    prompts: {
      hero: 'Memphis design style with bright colors, geometric patterns, postmodern aesthetic, fun and energetic',
      feature1: 'Colorful geometric shapes, Memphis group inspired design, bright pastels, playful composition',
      feature2: 'Retro 80s design elements, neon colors, abstract patterns, fun and vibrant',
      feature3: 'Memphis style furniture and objects, colorful geometric patterns, postmodern design',
      cta: 'Fun and colorful call-to-action with Memphis design elements, bright colors, playful typography'
    }
  },
  { 
    id: 'corporate-professional', 
    name: 'Corporate Professional', 
    tone: 'corporate',
    prompts: {
      hero: 'Professional business environment, modern office, corporate aesthetic, clean and trustworthy',
      feature1: 'Business team collaboration, professional setting, corporate culture, modern workplace',
      feature2: 'Corporate headquarters building, glass facade, professional architecture, business district',
      feature3: 'Professional meeting room, business presentation, corporate environment, executive style',
      cta: 'Professional call-to-action design, corporate colors, trustworthy and reliable aesthetic'
    }
  },
  { 
    id: 'elegant-editorial', 
    name: 'Elegant Editorial', 
    tone: 'elegant',
    prompts: {
      hero: 'Elegant magazine layout, sophisticated typography, editorial design, refined aesthetic',
      feature1: 'High-end fashion photography, elegant composition, sophisticated lighting, editorial style',
      feature2: 'Luxury product photography, elegant styling, sophisticated presentation, premium feel',
      feature3: 'Editorial lifestyle photography, elegant interior, sophisticated design, refined taste',
      cta: 'Elegant call-to-action with sophisticated typography, refined color palette, editorial style'
    }
  },
  { 
    id: 'modern-tech', 
    name: 'Modern Tech', 
    tone: 'modern',
    prompts: {
      hero: 'Futuristic technology interface, holographic displays, sci-fi aesthetic, cutting-edge design',
      feature1: 'Advanced technology lab, futuristic equipment, modern innovation, tech startup environment',
      feature2: 'Digital interface design, futuristic UI elements, modern technology, sleek aesthetics',
      feature3: 'Smart city technology, IoT devices, modern infrastructure, digital transformation',
      cta: 'Modern tech-inspired call-to-action, futuristic design elements, digital aesthetic'
    }
  },
  { 
    id: 'warm-organic', 
    name: 'Warm Organic', 
    tone: 'warm',
    prompts: {
      hero: 'Cozy organic cafe interior, warm lighting, natural materials, wood and earth tones',
      feature1: 'Organic food preparation, natural ingredients, warm kitchen environment, artisanal cooking',
      feature2: 'Natural spa environment, organic wellness, warm and inviting, earth-friendly design',
      feature3: 'Organic garden, natural growing, sustainable farming, warm sunlight, earth connection',
      cta: 'Warm and inviting call-to-action with organic elements, earth tones, natural feel'
    }
  },
  { 
    id: 'luxury-premium', 
    name: 'Luxury Premium', 
    tone: 'luxury',
    prompts: {
      hero: 'Luxury hotel lobby, premium materials, gold accents, exclusive atmosphere, high-end design',
      feature1: 'Premium luxury car interior, high-end materials, sophisticated craftsmanship, exclusive design',
      feature2: 'Luxury fashion boutique, premium retail environment, elegant displays, exclusive shopping',
      feature3: 'High-end jewelry photography, luxury accessories, premium presentation, exclusive appeal',
      cta: 'Luxury call-to-action with premium design elements, gold accents, exclusive feel'
    }
  },
  { 
    id: 'creative-artistic', 
    name: 'Creative Artistic', 
    tone: 'creative',
    prompts: {
      hero: 'Artist studio with creative chaos, colorful paintings, artistic tools, creative energy',
      feature1: 'Abstract art creation process, artistic expression, creative experimentation, bold colors',
      feature2: 'Creative design studio, artistic workspace, inspiration wall, creative process',
      feature3: 'Art gallery exhibition, creative installations, artistic expression, cultural space',
      cta: 'Creative and artistic call-to-action with bold colors, artistic elements, expressive design'
    }
  },
  { 
    id: 'nature-eco', 
    name: 'Nature Eco', 
    tone: 'nature',
    prompts: {
      hero: 'Lush green forest, sustainable living, eco-friendly environment, natural harmony',
      feature1: 'Solar panels and wind turbines, renewable energy, sustainable technology, green future',
      feature2: 'Organic farming, sustainable agriculture, green growing, environmental stewardship',
      feature3: 'Eco-friendly home design, sustainable architecture, green building, natural materials',
      cta: 'Nature-inspired call-to-action with green elements, sustainable design, eco-friendly feel'
    }
  },
  { 
    id: 'retro-vintage', 
    name: 'Retro Vintage', 
    tone: 'retro',
    prompts: {
      hero: 'Vintage 1950s diner, retro aesthetic, nostalgic atmosphere, classic Americana',
      feature1: 'Classic vintage car, retro automobile design, nostalgic transportation, 50s style',
      feature2: 'Retro kitchen appliances, vintage design, mid-century modern, nostalgic home',
      feature3: 'Vintage record player, retro music setup, nostalgic entertainment, classic design',
      cta: 'Retro-style call-to-action with vintage design elements, nostalgic color palette'
    }
  },
  { 
    id: 'zen-tranquil', 
    name: 'Zen Tranquil', 
    tone: 'zen',
    prompts: {
      hero: 'Peaceful zen garden, meditation space, tranquil water features, balanced harmony',
      feature1: 'Minimalist meditation room, zen interior, peaceful atmosphere, calm and serene',
      feature2: 'Japanese zen temple, traditional architecture, peaceful surroundings, spiritual calm',
      feature3: 'Zen stone balance, peaceful nature, meditation stones, tranquil environment',
      cta: 'Peaceful zen-inspired call-to-action with calm colors, balanced design, serene feel'
    }
  },
  
  // Original 8 AI styles
  { 
    id: 'quantum-nebula', 
    name: 'Quantum Nebula', 
    tone: 'playful',
    prompts: {
      hero: 'Cosmic nebula with quantum particles dancing, purple and cyan colors, space-time distortion, cosmic dance',
      feature1: 'Quantum computing visualization, particle physics, cosmic energy, nebula formations',
      feature2: 'Interstellar portal, quantum tunneling effect, cosmic gateway, purple and cyan lights',
      feature3: 'Cosmic laboratory, quantum experiments, particle accelerator, nebula background',
      cta: 'Quantum-inspired interface with particle effects, cosmic background, futuristic design'
    }
  },
  { 
    id: 'deepseek-enigma', 
    name: 'DeepSeek Enigma', 
    tone: 'bold',
    prompts: {
      hero: 'Deep space exploration, mysterious cosmic phenomena, blue and purple enigma, profound discovery',
      feature1: 'AI neural network visualization, deep learning, mysterious algorithms, blue circuits',
      feature2: 'Deep ocean research station, mysterious depths, underwater exploration, enigmatic discovery',
      feature3: 'Quantum AI laboratory, deep computation, mysterious processing, blue and purple lighting',
      cta: 'Enigmatic interface design with deep blue colors, mysterious elements, bold typography'
    }
  },
  { 
    id: 'thunder-goat', 
    name: 'Thunder Goat', 
    tone: 'creative',
    prompts: {
      hero: 'Mythical thunder goat with lightning, chaotic energy, electric storms, creative chaos',
      feature1: 'Lightning storm over mountains, electric energy, chaotic weather, powerful nature',
      feature2: 'Electric guitar with lightning effects, music energy, creative chaos, thunder sounds',
      feature3: 'Storm chasing, lightning photography, chaotic beauty, electric atmosphere',
      cta: 'Electric-themed call-to-action with lightning effects, chaotic energy, bold design'
    }
  },
  { 
    id: 'voidwhisper', 
    name: 'VOIDWHISPER', 
    tone: 'playful',
    prompts: {
      hero: 'Digital void with whisper effects, glitch aesthetics, digital unicorns, chaos and clarity',
      feature1: 'Digital glitch art, void aesthetics, whisper visualizations, chaotic beauty',
      feature2: 'Unicorn in digital space, magical technology, rainbow holograms, playful mystery',
      feature3: 'Void portal with whisper sounds, digital mysticism, ethereal technology',
      cta: 'Void-inspired interface with whisper effects, glitch aesthetics, playful mystery'
    }
  },
  { 
    id: 'psychedelic-cafe', 
    name: 'Psychedelic Café', 
    tone: 'retro',
    prompts: {
      hero: 'Psychedelic coffee shop, swirling colors, time-space distortion, interdimensional cafe',
      feature1: 'Psychedelic latte art, swirling colors, cosmic coffee, interdimensional flavors',
      feature2: 'Time-traveling menu, psychedelic food, cosmic cuisine, dimensional ingredients',
      feature3: 'Galactic smoothie bar, cosmic blending, psychedelic nutrition, space-time flavors',
      cta: 'Psychedelic cafe interface with swirling colors, cosmic design, retro futurism'
    }
  },
  { 
    id: 'glitchgizzard', 
    name: 'GlitchGizzard', 
    tone: 'playful',
    prompts: {
      hero: 'Digital glitch effects with quantum jellyfish, reality buffering, future memories loading',
      feature1: 'Quantum jellyfish swimming through digital space, glitch effects, future technology',
      feature2: 'Reality loading screen, buffering effects, digital déjà vu, glitch aesthetics',
      feature3: 'Jellyfish navigation system, quantum interfaces, glitch-based UI, future memories',
      cta: 'Glitch-inspired interface with jellyfish elements, buffering effects, playful technology'
    }
  },
  { 
    id: 'glm-air-flow', 
    name: 'GLM Air Flow', 
    tone: 'modern',
    prompts: {
      hero: 'Digital atmosphere, flowing air currents, breathing interfaces, wind-powered technology',
      feature1: 'Air flow visualization, wind patterns, atmospheric data, breathing technology',
      feature2: 'Digital wind turbines, air-powered interfaces, atmospheric computing, flow dynamics',
      feature3: 'Breathing architecture, air-responsive design, atmospheric interaction, wind effects',
      cta: 'Air flow interface with breathing animations, wind effects, atmospheric design'
    }
  },
  { 
    id: 'quantum-quokka', 
    name: 'Quantum Quokka', 
    tone: 'creative',
    prompts: {
      hero: 'Quantum quokka in melting reality, imagination bakery, reality-bending creatures',
      feature1: 'Quokka guides in quantum space, reality melting, imagination baking, creative physics',
      feature2: 'Reality melting laboratory, imagination ovens, quantum baking, creative experiments',
      feature3: 'Quokka quality control, imagination testing, reality inspection, creative assurance',
      cta: 'Quokka-themed interface with melting effects, imagination elements, creative design'
    }
  },
  
  // New 12 AI styles
  { 
    id: 'neon-ghost', 
    name: 'Neon Ghost Protocol', 
    tone: 'modern',
    prompts: {
      hero: 'Cyberpunk ghost in neon matrix, digital rain, neural interfaces, dystopian elegance',
      feature1: 'Neon-lit cyberpunk city, ghost protocols, digital rain effects, matrix aesthetics',
      feature2: 'Neural interface hacking, ghost in machine, neon circuits, cyberpunk technology',
      feature3: 'Quantum encryption visualization, ghost data, neon security, digital soul protection',
      cta: 'Cyberpunk interface with neon effects, ghost protocols, matrix-inspired design'
    }
  },
  { 
    id: 'zen-ethereal', 
    name: 'Ethereal Zen Garden', 
    tone: 'zen',
    prompts: {
      hero: 'Ethereal digital zen garden, floating cherry blossoms, mindful technology, serene interfaces',
      feature1: 'Digital meditation space, ethereal lighting, zen technology, mindful computing',
      feature2: 'Floating cherry blossoms in digital space, zen aesthetics, peaceful technology',
      feature3: 'Mindful interaction design, zen interface elements, peaceful user experience',
      cta: 'Zen-inspired interface with ethereal elements, cherry blossom effects, peaceful design'
    }
  },
  { 
    id: 'retro-arcade', 
    name: 'Pixel Paradise Arcade', 
    tone: 'retro',
    prompts: {
      hero: 'Retro arcade cabinet, pixel art, CRT monitor glow, 8-bit nostalgia, gaming paradise',
      feature1: 'Pixel art game development, retro gaming, 8-bit aesthetics, arcade culture',
      feature2: 'CRT monitor with scanlines, retro gaming setup, arcade atmosphere, pixel perfect',
      feature3: 'Arcade high score screen, pixel achievements, retro gaming culture, nostalgic competition',
      cta: 'Retro arcade interface with pixel art, CRT effects, gaming-inspired design'
    }
  },
  { 
    id: 'dark-academia', 
    name: 'Nocturne Arcana Library', 
    tone: 'elegant',
    prompts: {
      hero: 'Gothic library with ancient scrolls, candlelight, mysterious knowledge, academic mysticism',
      feature1: 'Ancient manuscript illumination, scholarly mysticism, candlelit research, arcane knowledge',
      feature2: 'Gothic architecture library, mysterious shadows, ancient books, scholarly atmosphere',
      feature3: 'Alchemical laboratory, ancient experiments, scholarly mysticism, arcane studies',
      cta: 'Dark academia interface with parchment textures, candlelight effects, scholarly design'
    }
  },
  { 
    id: 'solar-punk', 
    name: 'Sunrise Symphony', 
    tone: 'nature',
    prompts: {
      hero: 'Solar-powered eco city, living architecture, plants and technology harmony, sustainable future',
      feature1: 'Solar panel gardens, green technology integration, sustainable innovation, eco harmony',
      feature2: 'Living building architecture, plant-tech symbiosis, green infrastructure, solar symphony',
      feature3: 'Sustainable community, renewable energy, eco-conscious living, green future vision',
      cta: 'Solar-punk interface with plant elements, solar effects, sustainable design'
    }
  },
  { 
    id: 'vaporwave-dreams', 
    name: 'Digital Sunset Mall', 
    tone: 'creative',
    prompts: {
      hero: 'Vaporwave aesthetic mall, neon sunset, palm trees, 80s nostalgia, digital decay poetry',
      feature1: 'Vaporwave sunset landscape, neon palm trees, retro futurism, aesthetic overload',
      feature2: 'Abandoned mall with neon lighting, vaporwave aesthetics, nostalgic decay, 80s atmosphere',
      feature3: 'VHS glitch effects, vaporwave art, digital nostalgia, retro-futuristic design',
      cta: 'Vaporwave interface with sunset gradients, palm tree silhouettes, aesthetic design'
    }
  },
  { 
    id: 'brutalist-concrete', 
    name: 'Concrete Monolith', 
    tone: 'bold',
    prompts: {
      hero: 'Massive concrete monolith, brutalist architecture, raw power, uncompromising design',
      feature1: 'Concrete fortress architecture, brutalist design, raw materials, structural honesty',
      feature2: 'Monolithic concrete structures, brutalist principles, geometric forms, massive scale',
      feature3: 'Concrete texture details, raw materials, brutalist aesthetics, architectural power',
      cta: 'Brutalist interface with concrete textures, monolithic design, bold typography'
    }
  },
  { 
    id: 'memphis-party', 
    name: 'Geometric Playground', 
    tone: 'playful',
    prompts: {
      hero: 'Memphis design party, geometric shapes celebration, bright colors, design chaos fun',
      feature1: 'Dancing geometric shapes, Memphis group aesthetics, colorful celebration, design party',
      feature2: 'Geometric confetti explosion, shape celebration, colorful chaos, playful design',
      feature3: 'Memphis pattern generators, geometric randomness, colorful combinations, design playground',
      cta: 'Memphis-style interface with dancing shapes, confetti effects, colorful design'
    }
  },
  { 
    id: 'cosmic-void', 
    name: 'Void Whisper Station', 
    tone: 'bold',
    prompts: {
      hero: 'Cosmic void station, eldritch geometry, whispers from dimensions, beautiful terror',
      feature1: 'Non-Euclidean architecture, impossible geometry, cosmic horror, dimensional whispers',
      feature2: 'Void portal technology, eldritch interfaces, cosmic horror aesthetics, dimensional gates',
      feature3: 'Tentacle-like cables, cosmic horror tech, void whispers, eldritch engineering',
      cta: 'Void-themed interface with tentacle elements, cosmic horror aesthetics, bold design'
    }
  },
  { 
    id: 'cottage-comfort', 
    name: 'Digital Cottage Haven', 
    tone: 'warm',
    prompts: {
      hero: 'Cozy digital cottage, warm pixels, grandmother\'s hug feeling, handcrafted interfaces',
      feature1: 'Knitted interface patterns, cozy digital textures, warm design, cottage aesthetics',
      feature2: 'Digital fireplace, cozy atmosphere, warm lighting, cottage comfort technology',
      feature3: 'Handcrafted UI elements, artisanal design, cottage industry, warm craftsmanship',
      cta: 'Cottage-style interface with knitted patterns, fireplace warmth, cozy design'
    }
  },
  { 
    id: 'maximalist-chaos', 
    name: 'Everything Everywhere', 
    tone: 'creative',
    prompts: {
      hero: 'Maximalist design explosion, everything at once, sensory overload, chaos celebration',
      feature1: 'Maximum color explosion, every pattern, all textures, sensory maximalism',
      feature2: 'Infinite scroll chaos, every direction, maximum everything, overwhelming beauty',
      feature3: 'Baroque complexity generators, maximum detail, ornate overload, decorative excess',
      cta: 'Maximalist interface with everything, sensory overload, chaotic beauty, explosive design'
    }
  },
  { 
    id: 'glitch-reality', 
    name: 'Reality.exe Error', 
    tone: 'modern',
    prompts: {
      hero: 'Reality system error, digital corruption, beautiful glitch art, system failure aesthetics',
      feature1: 'Corrupted data streams, digital decay, glitch aesthetics, system errors as art',
      feature2: 'Buffer overflow visualization, memory leaks, system crash beauty, error aesthetics',
      feature3: 'Pixel sorting algorithms, compression artifacts, digital corruption, glitch galleries',
      cta: 'Glitch-themed interface with corruption effects, system errors, digital decay aesthetics'
    }
  }
];

// Generate image URL using Pollinations.ai
function generateImageUrl(prompt, width = 1200, height = 800, seed = null) {
  const encodedPrompt = encodeURIComponent(prompt);
  let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true`;
  
  if (seed) {
    url += `&seed=${seed}`;
  }
  
  return url;
}

// Download image from URL
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Generate a unique seed based on style and image type
function generateSeed(styleId, imageType) {
  const combined = `${styleId}-${imageType}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Main generation function
async function generateAllImages() {
  console.log('🎨 Generating unique AI images for all 32 styles...\n');
  
  const outputDir = path.join(process.cwd(), 'public', 'images', 'ai-generated');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalGenerated = 0;
  const totalImages = ALL_STYLES.length * 5; // 5 images per style
  
  for (let i = 0; i < ALL_STYLES.length; i++) {
    const style = ALL_STYLES[i];
    
    console.log(`\n📸 [${i + 1}/${ALL_STYLES.length}] Generating images for ${style.name}...`);
    
    const styleDir = path.join(outputDir, style.id);
    if (!fs.existsSync(styleDir)) {
      fs.mkdirSync(styleDir, { recursive: true });
    }

    // Generate each image type
    const imageTypes = ['hero', 'feature1', 'feature2', 'feature3', 'cta'];
    
    for (const imageType of imageTypes) {
      const prompt = style.prompts[imageType];
      const seed = generateSeed(style.id, imageType);
      
      // Determine dimensions based on image type
      let width = 1200, height = 800;
      if (imageType === 'hero') {
        width = 1920;
        height = 1080;
      } else if (imageType === 'cta') {
        width = 1200;
        height = 600;
      }
      
      const imageUrl = generateImageUrl(prompt, width, height, seed);
      const filename = `${style.id}-${imageType}.jpg`;
      const filePath = path.join(styleDir, filename);
      
      try {
        console.log(`  ⏳ Generating ${imageType}...`);
        await downloadImage(imageUrl, filePath);
        console.log(`  ✅ Saved ${filename}`);
        totalGenerated++;
        
        // Add small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`  ❌ Failed to generate ${imageType}: ${error.message}`);
      }
    }
    
    // Progress update
    const progress = Math.round(((i + 1) / ALL_STYLES.length) * 100);
    console.log(`  📊 Progress: ${progress}% (${totalGenerated}/${totalImages} images)`);
  }
  
  console.log(`\n🎉 Generation complete!`);
  console.log(`✅ Successfully generated ${totalGenerated}/${totalImages} unique images`);
  console.log(`📁 Images saved to: ${outputDir}`);
  
  // Create manifest file
  const manifest = {
    generated: new Date().toISOString(),
    totalStyles: ALL_STYLES.length,
    totalImages: totalGenerated,
    provider: 'Pollinations.ai',
    styles: ALL_STYLES.map(style => ({
      id: style.id,
      name: style.name,
      tone: style.tone,
      images: {
        hero: `/images/ai-generated/${style.id}/${style.id}-hero.jpg`,
        feature1: `/images/ai-generated/${style.id}/${style.id}-feature1.jpg`,
        feature2: `/images/ai-generated/${style.id}/${style.id}-feature2.jpg`,
        feature3: `/images/ai-generated/${style.id}/${style.id}-feature3.jpg`,
        cta: `/images/ai-generated/${style.id}/${style.id}-cta.jpg`
      }
    }))
  };
  
  const manifestPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📄 Manifest saved to: ${manifestPath}`);
  
  console.log('\n🚀 All styles now have unique AI-generated images!');
  console.log('   You can now update the image provider to use these new images.');
}

// Run the generator
generateAllImages().catch(console.error);