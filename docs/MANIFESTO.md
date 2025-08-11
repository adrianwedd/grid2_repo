# The Grid 2.0: AI Site Builder That Actually Works

## 🎯 Vision

Remember The Grid? The AI website builder that promised to design itself but burned through $7M delivering vaporware? This is the revenge project - building what they couldn't with 2014 tech, using 2025's tools to actually deliver on the promise.

**The difference:** Instead of black-box AI making unpredictable designs, we use deterministic algorithms with AI only for content understanding. Result: **sites generated in <50ms** with consistent, professional results.

## 🏗️ Architecture

### Core Pipeline
```
User Input → Content Graph → Beam Search → Component Assembly → Export
     ↓            ↓              ↓              ↓                ↓
   Chat UI    Structure      Layout AI      React/Tailwind    Next.js
```

### Key Components

#### 1. **Beam Search Layout Engine** (`lib/beam-search.ts`)
- Deterministic section selection using constraint satisfaction
- Scores 100+ layout combinations in parallel
- Considers: content fit, tone match, aesthetic flow, performance, accessibility
- **No LLMs** - pure algorithmic approach for speed and reliability

#### 2. **Component System** (`components/sections/`)
- Pre-built, battle-tested React components
- 4 tone variations per component (minimal/bold/playful/corporate)
- Pure Tailwind CSS - no runtime styling
- Current library:
  - `HeroSplitImageLeft` - Split hero with image
  - `FeaturesCards3Up` - 3-column feature grid
  - `TestimonialsGrid2x2` - 2×2 testimonial grid
  - `CTAGradientSlab` - Full-width gradient CTA

#### 3. **Transform System** (`lib/transforms.ts`)
- Pure functions for page edits
- Chat interpreter with regex patterns
- No LLM hallucination in edit path
- Transforms:
  - `makeHeroDramatic` - Increase hero impact
  - `increaseContrast` - Boost visual hierarchy
  - `addSocialProof` - Insert testimonials
  - `tightenAboveTheFold` - Optimize first view
  - `optimizeForConversion` - CTA-focused layout
  - `swapVariant` - Change component variants
  - `reorderSections` - Drag-and-drop via code
  - `updateContent` - Edit text/media

#### 4. **Real-time Preview** (`app/api/preview/`)
- Session-based editing with undo/redo
- Debounced preview-as-you-type
- <10ms response time (no LLMs)
- WebSocket-ready architecture

## 🚀 Quick Start

```bash
# Install
git clone [repo]
cd grid-20
pnpm install

# Development
pnpm dev
# → http://localhost:3000

# Try the editor
# → http://localhost:3000/editor

# Run transform demo
pnpm demo:transforms
```

## 💬 Chat Commands

The editor understands natural language:

```
"make the hero more dramatic"
"increase contrast"
"add social proof"
"tighten above the fold"
"optimize for conversion"
"add urgency banner: Limited time!"
"move cta to position 2"
"update hero headline: Ship Faster"
"apply theme bold"
```

## 🎨 Component Authoring

Add new sections to `components/sections/`:

```tsx
// components/sections/YourSection.tsx
export function YourSection({ content, tone = 'minimal' }: SectionProps) {
  const toneStyles = {
    minimal: { /* ... */ },
    bold: { /* ... */ },
    playful: { /* ... */ },
    corporate: { /* ... */ },
  };
  
  return (
    <section className={toneStyles[tone].container}>
      {/* Your component */}
    </section>
  );
}

// Register in registry.ts
export const componentRegistry = {
  'your-section': {
    component: YourSection,
    meta: {
      kind: 'your-kind',
      variant: 'your-variant',
      // ... constraints, slots, etc
    }
  }
};
```

## 📊 Performance

- **Page generation:** <50ms (no AI calls)
- **Transform application:** <5ms
- **Preview update:** <10ms
- **Export to code:** Instant
- **Memory usage:** ~20MB per session

## 🔮 Roadmap

### Phase 1: MVP (Current) ✅
- [x] Beam search layout engine
- [x] Component system with tone variants
- [x] Transform system with chat interpreter
- [x] Real-time preview with undo/redo
- [x] Export to HTML/Next.js

### Phase 2: Production Ready
- [ ] 50+ component variants
- [ ] LLM content extraction from docs/URLs
- [ ] Image generation/optimization pipeline
- [ ] One-click Vercel deployment
- [ ] Custom domain support

### Phase 3: Scale
- [ ] Multi-page support
- [ ] Blog/CMS integration
- [ ] E-commerce components
- [ ] A/B testing variants
- [ ] Analytics dashboard

### Phase 4: Platform
- [ ] Component marketplace
- [ ] Custom brand AI training
- [ ] Team collaboration
- [ ] White-label offering
- [ ] API for developers

## 🏢 Business Model

```
Free Tier:
- 1 site
- Basic components
- Watermark

Pro ($29/mo):
- Unlimited sites
- All components
- Custom domains
- No watermark
- Priority support

Agency ($99/mo):
- White-label
- Client management
- Advanced analytics
- API access
- Custom components
```

## 🔧 Technical Decisions

### Why Beam Search?
- Deterministic results (same input → same output)
- Fast exploration of layout space
- Respects hard constraints (accessibility, SEO)
- No "AI surprises" for users

### Why No LLMs in Layout?
- Speed: 50ms vs 2-3 seconds
- Reliability: No hallucination
- Cost: Zero inference costs
- Control: Predictable outputs

### Where We DO Use AI:
- Content extraction from messy inputs
- Image generation (DALL-E, Midjourney)
- Smart cropping (ClipDrop)
- SEO optimization suggestions

## 🛠️ Development

### Project Structure
```
grid-20/
├── app/                    # Next.js app router
│   ├── api/preview/       # Real-time preview API
│   └── editor/            # Editor UI
├── components/
│   └── sections/          # Component library
├── lib/
│   ├── beam-search.ts     # Layout engine
│   ├── transforms.ts      # Edit system
│   └── generate-page.ts   # Pipeline
└── types/
    └── section-system.ts  # Type definitions
```

### Testing
```bash
# Run tests
pnpm test

# Test transforms
pnpm demo:transforms

# Test generation
pnpm demo:generate
```

## 🤝 Contributing

We need:
- **Component authors** - Build new section variants
- **Transform writers** - Add chat commands
- **Designers** - Create tone systems
- **Testers** - Break things, file issues

## 📈 Why This Wins

1. **Actually works** - No vaporware, proven tech stack
2. **Fast** - Sub-50ms generation, instant preview
3. **Predictable** - Deterministic algorithms, no surprises
4. **Flexible** - Chat edits feel magical but stay reliable
5. **Ownable** - Users get real code, not lock-in

## 🎯 The Grid's Revenge

The original Grid failed because:
- Weak models couldn't handle layout reasoning
- Slow inference made iteration painful  
- Black-box AI created unpredictable results
- No way to refine or control output

We succeeded because:
- **Constraint-based search** > ML hallucination
- **Component composition** > Generative design  
- **Deterministic transforms** > Unpredictable AI
- **Real-time preview** > Slow regeneration

This isn't just better than The Grid - it's what The Grid should have been.

## 📝 License

MIT - Take it, fork it, ship it.

---

*Built with spite and good algorithms.*

**The Grid is dead. Long live Grid 2.0.**