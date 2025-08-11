# GitHub Issues Import

## Ready-to-paste Issue Templates

### 🔥 Critical Path (Beta Blockers)

```markdown
### Issue: Add smoke tests for core pipeline
**Labels:** `critical`, `testing`, `phase-0`
**Estimate:** 1 day
**Milestone:** Week 1 - Hardening

Add smoke tests for:
- [ ] generatePage() with all tone variants
- [ ] interpretChat() with 20+ command variations  
- [ ] HistoryManager undo/redo edge cases
- [ ] Transform determinism (hash comparison)

**Acceptance:**
- CI runs tests on every PR
- Tests complete in <30s
- Coverage >80% for critical paths
```

```markdown
### Issue: Static HTML/CSS exporter
**Labels:** `critical`, `export`, `phase-1`
**Estimate:** 2 days
**Milestone:** Week 3 - Export

Implement static export:
- [ ] ReactDOMServer.renderToString(PageRenderer)
- [ ] Extract used Tailwind classes
- [ ] Inline critical CSS
- [ ] Include brand tokens as CSS vars
- [ ] Bundle assets (images)

**Acceptance:**
- Exported HTML works offline
- Lighthouse score >90
- File size <100KB ungzipped
```

```markdown
### Issue: KV/Redis session adapter
**Labels:** `critical`, `infra`, `phase-2`
**Estimate:** 1 day
**Milestone:** Week 4 - Scale

Replace in-memory sessions:
- [ ] Redis adapter with TTL
- [ ] Upstash KV adapter (alternative)
- [ ] Environment switching
- [ ] Graceful fallback to memory
- [ ] Session migration tool

**Acceptance:**
- Zero downtime migration
- P95 latency <150ms
- Handles 1000 concurrent sessions
```

```markdown
### Issue: WebSocket preview endpoint
**Labels:** `critical`, `editor`, `phase-2`
**Estimate:** 2 days
**Milestone:** Week 4 - Scale

Real-time preview via WebSocket:
- [ ] /api/preview/ws endpoint
- [ ] Client hook with reconnection
- [ ] Debounced command streaming
- [ ] Presence indicators
- [ ] Optimistic UI updates

**Acceptance:**
- <50ms perceived latency
- Handles disconnections gracefully
- Multiple clients stay in sync
```

### 📦 Component Library Expansion

```markdown
### Issue: Footer Mega component
**Labels:** `components`, `good-first-issue`
**Estimate:** 4 hours
**Milestone:** Week 5 - Components

Create FooterMega variant:
- [ ] 4-column layout desktop
- [ ] Accordion mobile
- [ ] All 4 tone variants
- [ ] Newsletter signup option
- [ ] Social links grid

**Template:** Use existing component structure
**Reference:** components/sections/CTAGradientSlab.tsx
```

```markdown
### Issue: Features Bento Grid
**Labels:** `components`, `enhancement`
**Estimate:** 1 day
**Milestone:** Week 5 - Components

Asymmetric feature grid:
- [ ] 2x2 with one large cell
- [ ] Auto-flow for 3-7 features
- [ ] Icon support
- [ ] Hover animations (playful tone)
- [ ] Mobile stack gracefully

**Acceptance:**
- Looks good with 3-7 features
- No layout shift on hover
```

### 🧠 AI Integration

```markdown
### Issue: Content extraction API
**Labels:** `ai`, `enhancement`, `phase-3`
**Estimate:** 2 days
**Milestone:** Week 5 - Content

Smart content extractor:
- [ ] POST /api/extract endpoint
- [ ] Heuristic extraction (no LLM)
- [ ] Optional LLM enhancement
- [ ] Rate limiting
- [ ] Schema validation

**Input:** Messy text/markdown/URLs
**Output:** ContentGraph

**Acceptance:**
- Handles 10KB documents
- Falls back gracefully without LLM
- <500ms with heuristics only
```

### 🧪 Quality & Testing

```markdown
### Issue: Visual regression baseline
**Labels:** `qa`, `testing`
**Estimate:** 1 day
**Milestone:** Week 6 - Quality

Screenshot testing setup:
- [ ] Playwright screenshot tests
- [ ] All components × all tones
- [ ] CI integration
- [ ] Diff threshold tuning
- [ ] Update workflow

**Acceptance:**
- Catches unintended style changes
- <5% false positive rate
- Runs in <2min on CI
```

```markdown
### Issue: A11y audit pass
**Labels:** `a11y`, `quality`
**Estimate:** 1 day
**Milestone:** Week 6 - Quality

Accessibility improvements:
- [ ] Axe-core integration
- [ ] Fix all "error" violations
- [ ] Add skip links
- [ ] Focus management in editor
- [ ] Screen reader testing

**Acceptance:**
- Zero WCAG AA errors
- Keyboard navigable
- NVDA/JAWS tested
```

### 🚀 Launch Features

```markdown
### Issue: One-click Vercel deploy
**Labels:** `ops`, `enhancement`
**Estimate:** 4 hours
**Milestone:** Week 8 - Beta

Deploy button flow:
- [ ] Deploy button component
- [ ] Environment variable template
- [ ] Auto-fork GitHub repo
- [ ] Post-deploy onboarding
- [ ] Custom domain instructions

**Acceptance:**
- Working site in <60s
- Clear next steps
- Error recovery flow
```

```markdown
### Issue: Starter templates
**Labels:** `enhancement`, `ux`
**Estimate:** 1 day
**Milestone:** Week 8 - Beta

Pre-built templates:
- [ ] SaaS Landing (feature-heavy)
- [ ] Agency Portfolio (visual)
- [ ] Personal/Founder (minimal)
- [ ] E-commerce Coming Soon
- [ ] Template selector UI

**Acceptance:**
- Each template <5 clicks to preview
- Customizable after selection
- Mobile-optimized
```

---

## Project Board Structure

### 📋 GitHub Project Board: Grid 2.0 Beta

#### **Columns:**

1. **🧊 Icebox** (Future ideas)
2. **📝 Backlog** (Prioritized, ready)
3. **🚧 In Progress** (Actively working)
4. **👀 In Review** (PR open)
5. **✅ Done** (Merged)

#### **Automation Rules:**

- Issue created → Backlog
- PR opened → In Review
- PR merged → Done
- "blocked" label → Icebox

#### **Views:**

**1. Sprint View (Current Week)**
- Filter: `milestone:current-week`
- Group by: Assignee
- Sort: Priority

**2. Component View**
- Filter: `label:components`
- Group by: Status
- Sort: Estimate

**3. Critical Path**
- Filter: `label:critical`
- Group by: Milestone
- Sort: Due date

**4. Good First Issues**
- Filter: `label:good-first-issue`
- Group by: Type
- Sort: Estimate (ascending)

---

## Milestones

### Week 1: Hardening ✅
**Due:** [Date]
- Smoke tests
- CI pipeline  
- Error boundaries
- Session cleanup

### Week 3: Export & Ownership
**Due:** [Date + 2 weeks]
- Static export
- ZIP download
- Next.js export
- SEO audit

### Week 4: Scale Infrastructure  
**Due:** [Date + 3 weeks]
- Redis sessions
- WebSocket preview
- Rate limiting
- Monitoring

### Week 5: Content & Components
**Due:** [Date + 4 weeks]
- Content extractor
- 5 new components
- Image pipeline
- A11y pass

### Week 8: Beta Launch 🚀
**Due:** [Date + 7 weeks]
- Templates
- Deploy button
- Documentation
- Telemetry

---

## CSV Import Format

```csv
title,body,labels,milestone,estimate
"Add smoke tests for core pipeline","Add tests for generatePage, interpretChat, HistoryManager","critical,testing,phase-0","Week 1 - Hardening","1d"
"Static HTML/CSS exporter","Implement ReactDOMServer rendering with Tailwind extraction","critical,export,phase-1","Week 3 - Export","2d"
"KV/Redis session adapter","Replace in-memory sessions with persistent store","critical,infra,phase-2","Week 4 - Scale","1d"
"WebSocket preview endpoint","Real-time preview via WebSocket connection","critical,editor,phase-2","Week 4 - Scale","2d"
"Footer Mega component","4-column footer with newsletter signup","components,good-first-issue","Week 5 - Components","4h"
"Features Bento Grid","Asymmetric feature grid layout","components,enhancement","Week 5 - Components","1d"
"Content extraction API","Smart content extractor with optional LLM","ai,enhancement,phase-3","Week 5 - Content","2d"
"Visual regression baseline","Playwright screenshot testing setup","qa,testing","Week 6 - Quality","1d"
"A11y audit pass","Fix all WCAG AA violations","a11y,quality","Week 6 - Quality","1d"
"One-click Vercel deploy","Deploy button with auto-configuration","ops,enhancement","Week 8 - Beta","4h"
"Starter templates","Pre-built SaaS, Agency, Personal templates","enhancement,ux","Week 8 - Beta","1d"
```

---

## Team Assignments

**Week 1-2:** Everyone on critical path
**Week 3-4:** Split infra (backend) vs components (frontend)
**Week 5-6:** Quality sprint (whole team)
**Week 7-8:** Polish and launch prep

## Success Metrics

- **Beta Ready:** 10 external users complete full flow
- **Performance:** P95 < 150ms for all operations
- **Quality:** Zero critical bugs, <5 minor bugs
- **Documentation:** 100% of public APIs documented

---

*Copy this into a `ROADMAP.md` and link from your README. The CSV can be imported directly into GitHub Issues.*