// Creative and hilarious content generator for Grid 2.0
import type { Tone } from '@/types/section-system';

// Hilarious feature descriptions that actually make people smile
const HILARIOUS_FEATURES = {
  minimal: [
    { title: 'Distraction Assassin', desc: 'We murdered every unnecessary pixel so you can focus on what matters' },
    { title: 'Swiss Army Knife', desc: 'But without the 47 tools you\'ll never use. Just the good stuff.' },
    { title: 'Marie Kondo Mode', desc: 'If it doesn\'t spark joy, it\'s not in our code. Period.' },
    { title: 'Loading Time Champion', desc: 'So fast, your coffee won\'t even cool down' },
    { title: 'Zen Master Approved', desc: 'Buddhist monks asked us to tone it down a bit' },
    { title: 'Whitespace Worship', desc: 'We believe empty space deserves respect too' }
  ],
  bold: [
    { title: 'Attention Hijacker', desc: 'Your users\' eyeballs won\'t know what hit them' },
    { title: 'Contrast Overdrive', desc: 'So bold, sunglasses recommended for indoor viewing' },
    { title: 'Typography on Steroids', desc: 'Our fonts bench press other fonts for breakfast' },
    { title: 'Color Explosion', desc: 'Like a unicorn had a party in your browser' },
    { title: 'Scroll Stopper 9000', desc: 'Users will forget why they came but remember you forever' },
    { title: 'Drama Generator', desc: 'Every click feels like a season finale' }
  ],
  playful: [
    { title: 'Joy Injection', desc: 'FDA-approved doses of pure happiness in every interaction' },
    { title: 'Smile Compiler', desc: 'Transforms frowns into upside-down frowns at 60fps' },
    { title: 'Bounce House Mode', desc: 'Everything jiggles just enough to be delightful' },
    { title: 'Easter Egg Factory', desc: 'Hidden surprises that make users go "Did that just...?"' },
    { title: 'Confetti Canon', desc: 'Celebrate everything. Even scrolling deserves applause.' },
    { title: 'Dopamine Dealer', desc: 'Legal in all 50 states and most countries' }
  ],
  corporate: [
    { title: 'Synergy Synthesizer', desc: 'Leverages paradigm shifts to maximize ROI on your KPIs' },
    { title: 'Meeting Minimizer', desc: 'So efficient, you\'ll cancel tomorrow\'s standup' },
    { title: 'Buzzword Bingo', desc: 'Disrupting the space with blockchain AI quantum solutions' },
    { title: 'Excel Sheet Whisperer', desc: 'Makes spreadsheets sexy (yes, really)' },
    { title: 'PowerPoint Killer', desc: 'No more death by slideshow. You\'re welcome.' },
    { title: 'C-Suite Seducer', desc: 'Makes executives nod knowingly while checking their stocks' }
  ],
  elegant: [
    { title: 'Sophistication Engine', desc: 'Like wearing a tuxedo to browse the internet' },
    { title: 'Champagne Typography', desc: 'Our fonts aged in French oak barrels for 18 months' },
    { title: 'Velvet Scrolling', desc: 'Smoother than a jazz saxophone on Sunday morning' },
    { title: 'Golden Ratio Everything', desc: 'Fibonacci would weep tears of mathematical joy' },
    { title: 'Subtle Flex Mode', desc: 'Rich but doesn\'t need to shout about it' },
    { title: 'Museum Quality', desc: 'The Louvre called. They want our CSS.' }
  ],
  modern: [
    { title: 'Future Proof™', desc: 'Works on devices that haven\'t been invented yet' },
    { title: 'AI-Powered Nothing', desc: 'We use AI to tell AI we don\'t need AI' },
    { title: 'Quantum Loading', desc: 'Pages load before you decide to click them' },
    { title: 'Holographic Ready', desc: 'When screens become passé, we\'re already there' },
    { title: 'Carbon Negative', desc: 'Our code actually removes CO2 from the atmosphere*' },
    { title: 'Metaverse Compatible', desc: 'Your virtual avatar will love browsing this' }
  ],
  warm: [
    { title: 'Digital Hug Machine', desc: 'Every interaction feels like grandma\'s cookies' },
    { title: 'Comfort Code', desc: 'Like wearing your favorite hoodie but for your eyes' },
    { title: 'Friendship Algorithm', desc: 'Makes users feel like they\'ve known you since kindergarten' },
    { title: 'Cozy Mode Activated', desc: 'Fireplace crackle sounds not included but implied' },
    { title: 'Empathy Engine', desc: 'Understands your users better than their therapist' },
    { title: 'Fuzzy Feeling Generator', desc: 'Warning: May cause spontaneous smiling' }
  ],
  luxury: [
    { title: 'Yacht Mode', desc: 'For when your other website is at the marina' },
    { title: 'Caviar Compression', desc: 'Only the finest bits and bytes, darling' },
    { title: 'Private Jet Loading', desc: 'First class performance, no TSA required' },
    { title: 'Diamond Standard', desc: 'Cut, clarity, color, and CSS - all flawless' },
    { title: 'Concierge Service', desc: 'Your pixels have their own butler' },
    { title: 'Tax Haven Hosting', desc: 'Legal, ethical, and incredibly smooth' }
  ],
  creative: [
    { title: 'Imagination Amplifier', desc: 'Turns "what if" into "holy cow, look at that!"' },
    { title: 'Inspiration Injector', desc: 'Side effects include uncontrollable urges to create' },
    { title: 'Weird Mode', desc: 'Normal is overrated. Embrace the bizarre.' },
    { title: 'Artistic License', desc: 'We took it. Framed it. Made it interactive.' },
    { title: 'Chaos Coordinator', desc: 'Organized disorder that somehow just works' },
    { title: 'Muse Multiplier', desc: 'Ancient Greeks hate this one simple trick' }
  ],
  nature: [
    { title: 'Tree Hugger Certified', desc: 'Each pixel planted with love and composted data' },
    { title: 'Carbon Neutral Dreams', desc: 'Your conscience can finally take a vacation' },
    { title: 'Organic Algorithm', desc: 'No pesticides, GMOs, or artificial intelligence' },
    { title: 'Solar Powered', desc: 'Works best during daylight (just kidding, always works)' },
    { title: 'Biodegradable Code', desc: 'Returns to the earth as pure energy' },
    { title: 'Vegan JavaScript', desc: 'No animals were harmed in this compilation' }
  ],
  retro: [
    { title: 'Nostalgia Overdose', desc: 'Remember when websites were simple? We member.' },
    { title: 'Dial-Up Approved', desc: 'Still loads faster than your 90s internet' },
    { title: 'Geocities Survivor', desc: 'All the charm, none of the under construction GIFs' },
    { title: 'Vintage Filter', desc: 'Instagram wishes it could be this authentically old' },
    { title: 'Cassette Tape UI', desc: 'Press play and enjoy the sweet rewind animations' },
    { title: 'Y2K Compliant', desc: 'Survived the millennium bug, ready for Y3K' }
  ],
  monochrome: [
    { title: 'Color Blind Friendly', desc: 'Because we discriminate against colors, not people' },
    { title: 'Ink Saver Pro', desc: 'Your printer will thank you (if anyone still prints)' },
    { title: 'Film Noir Mode', desc: 'Every click feels like a detective story' },
    { title: 'Contrast King', desc: 'So crisp you could cut diamonds with these edges' },
    { title: 'Minimalist\'s Dream', desc: 'Even our shadows have shadows' },
    { title: 'Newspaper Chic', desc: 'All the news that\'s fit to click' }
  ],
  techno: [
    { title: 'Matrix Mode', desc: 'You take the blue pill, the story ends here' },
    { title: 'Neon Overdrive', desc: 'Blade Runner called, wants our color palette' },
    { title: 'Glitch Aesthetic', desc: 'Intentional errors that look cooler than perfection' },
    { title: 'Cyber Enhancement', desc: 'Your browser is now 40% more cyberpunk' },
    { title: 'Digital Rain', desc: 'Green text cascading like it\'s 1999' },
    { title: 'Hack The Planet', desc: 'Legal hacking of your users\' expectations' }
  ],
  zen: [
    { title: 'Inner Peace Mode', desc: 'Om my god, it\'s so calming' },
    { title: 'Meditation Assistant', desc: 'Loading bars that actually reduce anxiety' },
    { title: 'Mindful Scrolling', desc: 'Each pixel placed with intention and purpose' },
    { title: 'Chi Optimizer', desc: 'Feng shui for your user interface' },
    { title: 'Karma Counter', desc: 'Good UX creates good karma. It\'s science.' },
    { title: 'Enlightenment Engine', desc: 'Users achieve nirvana by page 3' }
  ]
};

// Spicy CTAs that actually convert
const SPICY_CTAS = {
  minimal: {
    headline: 'Ready? Let\'s Not Overthink This.',
    description: 'The universe is complicated enough. Your next step doesn\'t have to be.',
    primary: 'Start Something Simple',
    secondary: 'Or Don\'t. We\'re Not Pushy.'
  },
  bold: {
    headline: 'STOP SCROLLING. START DOING.',
    description: 'Fortune favors the bold. Also, we favor the bold. Click the damn button.',
    primary: 'UNLEASH THE BEAST',
    secondary: 'Need More Convincing?'
  },
  playful: {
    headline: '🎉 Party Time! (Business in the Front)',
    description: 'Serious results with a silly smile. Your competition won\'t see it coming.',
    primary: 'Join the Fun Brigade',
    secondary: 'I\'m Too Serious for This'
  },
  corporate: {
    headline: 'Accelerate Your Digital Transformation Journey',
    description: 'Leverage our synergistic solutions to optimize your value chain. (We had to say it.)',
    primary: 'Schedule a Strategic Discussion',
    secondary: 'Download the White Paper'
  },
  elegant: {
    headline: 'Your Moment of Distinction Awaits',
    description: 'For those who appreciate the finer pixels in life.',
    primary: 'Begin Your Journey',
    secondary: 'Explore Quietly'
  },
  modern: {
    headline: 'The Future Called. It Left You a Voicemail.',
    description: 'Stop living in the past (5 minutes ago). The future is now, literally.',
    primary: 'Quantum Leap Forward',
    secondary: 'Time Travel Tutorial'
  },
  warm: {
    headline: 'Come On In, The Code\'s Warm',
    description: 'We saved you a spot by the digital fireplace. Hot cocoa sold separately.',
    primary: 'Get Cozy With Us',
    secondary: 'Just Browsing, Thanks'
  },
  luxury: {
    headline: 'Because Ordinary is for Other People',
    description: 'Your exquisite taste deserves an equally exquisite experience.',
    primary: 'Reserve Your Experience',
    secondary: 'Request Private Viewing'
  },
  creative: {
    headline: 'Break the Rules. Make New Ones. Break Those Too.',
    description: 'Conformity is the enemy of art. Also, boring websites.',
    primary: 'Unleash Your Weird',
    secondary: 'Play It Safe (Boring)'
  },
  nature: {
    headline: 'Plant the Seed. Watch it Grow. Sustainably.',
    description: 'Mother Earth approved this message. And our carbon footprint.',
    primary: 'Grow Something Beautiful',
    secondary: 'Learn Our Eco-Story'
  },
  retro: {
    headline: 'Party Like It\'s 1999 (But With Better Internet)',
    description: 'All the nostalgia, none of the dial-up trauma.',
    primary: 'Press Start to Begin',
    secondary: 'Insert Coin to Continue'
  },
  monochrome: {
    headline: 'Black. White. Right.',
    description: 'Why use many colors when few colors do trick?',
    primary: 'Embrace the Void',
    secondary: 'Fade to Gray'
  },
  techno: {
    headline: 'SYSTEM: READY. USER: REQUIRED.',
    description: 'Initialize the sequence. The machines are waiting.',
    primary: 'JACK IN',
    secondary: 'Run Diagnostic'
  },
  zen: {
    headline: 'When You\'re Ready, You\'ll Know',
    description: 'No rush. The path reveals itself to those who seek it.',
    primary: 'Begin Mindfully',
    secondary: 'Continue Contemplating'
  }
};

// Generate hilarious hero content
export function generateHeroContent(tone: Tone) {
  const heroes = {
    minimal: {
      headline: 'Less Drama. More Karma.',
      subheadline: 'We removed everything that doesn\'t matter. You\'re welcome.',
      bullets: [
        'Decluttered like Marie Kondo on espresso',
        'Loading so fast it\'s basically time travel',
        'White space that pays rent'
      ]
    },
    bold: {
      headline: 'SUBTLE IS DEAD. LONG LIVE BOLD.',
      subheadline: 'Your grandma will need sunglasses to view this site.',
      bullets: [
        'Contrast that slaps harder than reality',
        'Typography that yells politely',
        'Colors that refuse to be ignored'
      ]
    },
    playful: {
      headline: 'Serious Business. Silly Execution. 🎈',
      subheadline: 'Who said professional can\'t party?',
      bullets: [
        'Animations that spark joy',
        'Surprise and delight on tap',
        'Fun that converts to funds'
      ]
    },
    corporate: {
      headline: 'Synergize Your Paradigm Shift',
      subheadline: 'Disrupting disruption with innovative innovation.',
      bullets: [
        'KPIs that actually matter',
        'ROI so high it\'s technically illegal',
        'Buzzword compliance certified'
      ]
    },
    elegant: {
      headline: 'Understated. Overdelivered.',
      subheadline: 'Like a whisper that echoes forever.',
      bullets: [
        'Sophistication without snobbery',
        'Beauty in the details',
        'Timeless, not trendy'
      ]
    },
    modern: {
      headline: 'Tomorrow\'s Design. Yesterday\'s Price.',
      subheadline: 'The future is here, and it loads instantly.',
      bullets: [
        'AI-ready (whatever that means)',
        'Quantum-encrypted vibes',
        'Updates before you need them'
      ]
    },
    warm: {
      headline: 'Welcome Home, Friend',
      subheadline: 'We\'ve been waiting for you. The kettle\'s on.',
      bullets: [
        'Comfort food for your eyes',
        'Hugs delivered digitally',
        'That fuzzy feeling, guaranteed'
      ]
    },
    luxury: {
      headline: 'Exclusively Inclusive',
      subheadline: 'First class experience, no membership required.',
      bullets: [
        'Artisanal pixels, hand-crafted',
        'White glove service, digitally',
        'The Rolls Royce of websites'
      ]
    },
    creative: {
      headline: 'Normal? Never Heard of Her.',
      subheadline: 'Where weird meets wonderful and has beautiful babies.',
      bullets: [
        'Unconventional by design',
        'Creativity on steroids',
        'Different, in the best way'
      ]
    },
    nature: {
      headline: 'Organic, Free-Range Websites',
      subheadline: 'No artificial ingredients. 100% sustainable pixels.',
      bullets: [
        'Carbon negative since day one',
        'Powered by good intentions',
        'Mother Earth\'s favorite website'
      ]
    },
    retro: {
      headline: 'The Future of Yesterday, Today',
      subheadline: 'Nostalgia hits different when it loads this fast.',
      bullets: [
        'Vintage vibes, modern performance',
        'Y2K survived and thrived',
        'Old school cool, new school rules'
      ]
    },
    monochrome: {
      headline: 'Colorblind? Perfect. Not? Also Perfect.',
      subheadline: 'We don\'t see color. Literally.',
      bullets: [
        'Black, white, and read all over',
        'Minimalism\'s final form',
        'Contrast is our only friend'
      ]
    },
    techno: {
      headline: 'WELCOME TO THE MACHINE',
      subheadline: 'Resistance is futile. UX is eternal.',
      bullets: [
        'Cyberpunk without the dystopia',
        'Neon dreams, LED schemes',
        'The Matrix has you now'
      ]
    },
    zen: {
      headline: 'Be Present. Click Mindfully.',
      subheadline: 'Inner peace through outer pixels.',
      bullets: [
        'Meditation-grade calmness',
        'Breathe in, scroll out',
        'Digital enlightenment awaits'
      ]
    }
  };

  return heroes[tone] || heroes.minimal;
}

// Generate creative feature content
export function generateFeatureContent(tone: Tone) {
  const features = HILARIOUS_FEATURES[tone] || HILARIOUS_FEATURES.minimal;
  
  return {
    headline: getFeatureHeadline(tone),
    subheadline: getFeatureSubheadline(tone),
    items: features.slice(0, 3).map(f => ({
      title: f.title,
      description: f.desc
    }))
  };
}

function getFeatureHeadline(tone: Tone): string {
  const headlines: Record<Tone, string> = {
    minimal: 'Features Without the Fluff',
    bold: 'FEATURES THAT ACTUALLY MATTER',
    playful: 'Super Powers for Your Website 🦸‍♀️',
    corporate: 'Value Propositions That Deliver',
    elegant: 'Refined Capabilities',
    modern: 'Next-Gen Features, Current-Gen Pricing',
    warm: 'Features That Feel Like Home',
    luxury: 'Premium Features, Naturally',
    creative: 'Features That Color Outside the Lines',
    nature: 'Organically Grown Features',
    retro: 'Classic Features, Modern Twist',
    monochrome: 'Features in Black & White',
    techno: 'SYSTEM CAPABILITIES LOADED',
    zen: 'Features in Perfect Balance'
  };
  return headlines[tone] || 'Features';
}

function getFeatureSubheadline(tone: Tone): string {
  const subheadlines: Record<Tone, string> = {
    minimal: 'Everything essential. Nothing extra. Perfect.',
    bold: 'Buckle up. This is going to be intense.',
    playful: 'Seriously powerful. Seriously fun. Seriously.',
    corporate: 'Leveraging synergies to maximize your potential.',
    elegant: 'Sophisticated solutions for discerning users.',
    modern: 'The future called. It left these features.',
    warm: 'Features that give you that fuzzy feeling.',
    luxury: 'Because you deserve the finest.',
    creative: 'Where imagination meets implementation.',
    nature: 'Sustainably sourced, ethically coded.',
    retro: 'Blast from the past, built for the future.',
    monochrome: 'Proof that less color means more impact.',
    techno: 'Enhanced capabilities for the digital age.',
    zen: 'Features that bring harmony to your workflow.'
  };
  return subheadlines[tone] || 'Everything you need';
}

// Generate CTA content
export function generateCTAContent(tone: Tone) {
  const cta = SPICY_CTAS[tone] || SPICY_CTAS.minimal;
  
  return {
    headline: cta.headline,
    description: cta.description,
    primaryAction: { label: cta.primary, href: '#' },
    secondaryAction: { label: cta.secondary, href: '#' }
  };
}

// Get random hilarious placeholder text
export function getRandomPlaceholder(): string {
  const placeholders = [
    'Lorem ipsum? More like boring ipsum.',
    'This text is temporarily permanent.',
    'Placeholder text so good, you might keep it.',
    'Words go here. Good words. The best words.',
    'If you\'re reading this, the content team is on vacation.',
    'This space intentionally left awesome.',
    'Insert profound statement here. Or cat facts.',
    'Temporary text with permanent impact.',
    'Coming soon: actual content. Maybe.',
    'This is where the magic happens. Abracadabra!',
    'Professional words doing professional things.',
    'Content loading... just kidding, this is it.',
    'Warning: This text may cause inspiration.',
    'Placeholder text with main character energy.',
    'Words arranged in a way that makes sense.',
  ];
  
  return placeholders[Math.floor(Math.random() * placeholders.length)];
}

// Export for use in generation
export const creativeContent = {
  generateHeroContent,
  generateFeatureContent,
  generateCTAContent,
  getRandomPlaceholder
};