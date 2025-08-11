# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start Next.js development server on port 3000
- `pnpm build` - Build the Next.js application
- `pnpm start` - Start production server on port 3000

### Demo Scripts
- `pnpm run demo:node` - Run beam search + generatePage CLI demo
- `pnpm run demo:transforms` - Test chat interpretation and transform system
- `pnpm run demo:export` - Test the ZIP export functionality

### Application URLs
- http://localhost:3000/demo - View static generated page example
- http://localhost:3000/editor - Access the realtime editor interface

## Architecture Overview

This is Grid 2.0, a deterministic AI website builder that uses **AI for understanding, algorithms for execution**. The core principle is that LLMs parse user intent while pure algorithms handle page construction to avoid hallucinations in the hot path.

### Key Modules

**Beam Search Assembler** (`lib/beam-search.ts`)
- Deterministic section selection using beam search algorithm
- Scores sections based on content fit, tone match, aesthetic flow, performance, and accessibility
- Produces primary result + alternates with consistent scoring

**Transform System** (`lib/transforms.ts`)
- Pure functions for editing section arrays
- Chat interpreter maps natural language commands to transform operations
- Includes undo/redo via `HistoryManager`
- Commands like "make hero dramatic", "add social proof", "increase contrast"

**Preview Session** (`lib/preview-session.ts`)
- In-memory session management with history
- Supports preview (temporary) and command (committed) operations

**Page Generation** (`lib/generate-page.ts`)
- Complete pipeline: beam search → audit → render
- Includes accessibility, SEO, and performance auditing
- `PageRenderer` component for React rendering

**Component Registry** (`components/sections/registry.ts`)
- Typed metadata system for all sections
- Each component has `SectionMeta` with constraints, content slots, performance characteristics
- Supports hero, features, testimonials, CTA, footer sections with multiple variants

### Data Flow
```
User Chat → /api/preview → interpretChat → [transforms] → apply → analyze → sections → UI
                        ↑                                              ↓
                     init (sections)                               History (undo/redo)
```

### Type System

The entire system is built around `SectionNode` and `SectionMeta` types:
- **SectionKind**: 'hero' | 'features' | 'about' | 'testimonials' | 'cta' | 'footer'
- **Tone**: 'minimal' | 'bold' | 'playful' | 'corporate'
- **ContentGraph**: Structured content input with typed slots
- **BrandTokens**: Complete design system tokens (colors, fonts, radius, shadows, spacing)

### API Endpoints

**POST /api/preview** - Main realtime API
- `init` - Initialize session with sections
- `preview` - Test transforms without committing
- `command` - Apply transforms and commit to history  
- `undo/redo` - History navigation
- `get` - Retrieve current session state

**POST /api/export** - ZIP export API
- `format: 'static'` - Single HTML file with inlined CSS
- `format: 'nextjs'` - Full Next.js project with components
- `format: 'remix'` - Remix project (stub implementation)
- `includeSource: true` - Include component source code

## Development Patterns

### Adding New Sections
1. Define component in `components/sections/`
2. Add metadata to `registry.ts` with proper `SectionMeta`
3. Component must accept `SectionProps` interface
4. Include content slots, constraints, and performance characteristics

### Adding Transform Commands
1. Add pure transform function to `transforms.ts`
2. Update `interpretChat` with regex pattern matching
3. Transform functions take `SectionNode[]` and return `SectionNode[]`

### Content Extraction
- `lib/content-extractor.ts` maps unstructured input to `ContentGraph`
- Currently uses heuristics; can be enhanced with LLM integration

### Testing Transforms
Use the CLI demo to test transform chains:
```bash
pnpm run demo:transforms
```

## Key Constraints

- **Determinism**: Same inputs must produce same outputs
- **No LLM in hot path**: Beam search and transforms are algorithmic
- **Mobile-first**: All components must work on mobile
- **Accessibility**: WCAG AA compliance built into scoring
- **Performance**: Section size estimation and animation limits

## File Organization

- `/app` - Next.js pages and API routes
- `/lib` - Core algorithms (beam search, transforms, generation)
- `/components` - React components with typed metadata
- `/types` - TypeScript definitions for entire system
- `/docs` - Architecture documentation and manifesto