# Grid 2.0 Editor - Feature Documentation

## Overview
The Editor page (`/editor`) is the main interface for real-time website editing using Grid 2.0's deterministic AI system. It combines algorithmic transformations with AI-powered design generation.

## URL
http://localhost:3000/editor

## Main Components

### 1. Transform Tab (Default)
**Purpose**: Apply real-time transformations to website sections using natural language commands.

**How it works**:
1. A session is initialized when the page loads (`/api/preview` with `action: 'init'`)
2. As you type, preview updates are debounced (300ms delay)
3. Click "Apply" to commit the transformation
4. Uses deterministic algorithms, NOT AI, for predictable results

**Commands you can use**:
- `make the hero more dramatic` - Enhances hero section
- `add social proof` - Adds testimonials section
- `increase contrast` - Adjusts color scheme
- `add testimonials` - Inserts testimonial components
- `make it bold` - Increases visual weight

**Buttons**:
- **Apply**: Commits the current transformation (requires session)
- **Undo**: Reverts last applied change
- **Redo**: Re-applies previously undone change

**API Flow**:
```
Page Load → POST /api/preview {action: 'init'} → Get sessionId
Type Command → POST /api/preview {action: 'preview', sessionId, command} → Preview
Click Apply → POST /api/preview {action: 'command', sessionId, command} → Commit
```

### 2. Generate Tab
**Purpose**: Generate complete website designs using Claude AI Director.

**How it works**:
1. Describe your website in natural language
2. Calls Claude Director to generate design philosophy and sections
3. Creates full page with AI-chosen components

**Example prompts**:
- "Create a modern fintech startup landing page with trust indicators"
- "Design a portfolio site for a photographer"
- "Build a SaaS product page with pricing"

**API**: `POST /api/claude-director`

**Note**: This feature requires Claude authentication and may take 30-60 seconds.

### 3. Live Theme Preview
**Purpose**: Apply pre-generated design themes to see different visual styles.

**How it works**:
1. Loads all cached design specs from `.claude-cache/` directory
2. **Single Click**: Preview theme details and color swatches
3. **Double Click**: Apply theme's colors and fonts to entire page

**Features**:
- Shows theme philosophy (e.g., "Versailles palace meets contemporary luxury")
- Displays color swatches for primary, secondary, accent colors
- Applies CSS custom properties for instant theme switching
- Reset button to return to default theme

**API Flow**:
```
Page Load → GET /api/claude-cache-list → List all themes
Click Theme → POST /api/feeling-lucky {specId} → Load theme details
Double-click → JavaScript applies CSS variables → Instant theme change
```

### 4. Preview Pane
**Purpose**: Real-time visual preview of the website with all transformations and themes applied.

**Shows**:
- Current section arrangement
- Applied transformations
- Active theme styling
- Responsive layout

**Header States**:
- `Preview (uncommitted)` - Shows temporary preview before Apply
- `Preview (committed)` - Shows saved state after Apply
- `Claude Generated Design` - Shows AI-generated result

## Current Issues & Behaviors

### Working ✅
- Theme Preview loads and displays all cached themes
- Theme selection and preview works
- Generate tab UI displays correctly
- Transform textarea and buttons render

### Issues ⚠️
- Transform Apply button requires session initialization (working but slow)
- Theme double-click to apply may not always trigger
- React key warning in console for theme color swatches
- Preview API needs session management

## File Structure
```
/app/editor/page.tsx          - Editor page component
/components/RealtimeEditor.tsx - Main editor UI component
/components/ThemePreviewer.tsx - Theme switching component
/lib/hooks/useRealtimePreview.ts - Transform session management
/lib/hooks/useClaudeDirector.ts - Claude AI integration
/api/preview/route.ts         - Transform API endpoint
/api/claude-director/route.ts - AI generation endpoint
/api/claude-cache-list/route.ts - Theme listing endpoint
/api/feeling-lucky/route.ts   - Theme loading endpoint
```

## Usage Tips

1. **For Quick Styling Changes**: Use the Theme Preview - it's instant and doesn't require API calls
2. **For Content Changes**: Use Transform tab with commands like "add testimonials"
3. **For Complete Redesign**: Use Generate tab with Claude AI
4. **Theme Persistence**: Applied themes use CSS variables and persist until page reload

## Testing
Run comprehensive tests:
```bash
npx playwright test e2e/editor-comprehensive.spec.ts
```

Quick manual test:
```bash
node test-editor-features.js
```