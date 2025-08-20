# Grid 2.0 Roadmap to Beta

Here's a crisp, shippable roadmap plus ready-to-paste GitHub checklists.

## Roadmap (8 weeks to public beta)

### Phase 0 — Hardening (Week 1)
- ✅ Lock MVP (beam search, transforms, realtime preview, testimonials)
- Add smoke tests for generatePage, interpretChat, HistoryManager
- CI: typecheck + build + minimal unit tests on PR
- Error boundaries in /editor and nicer API errors

### Phase 1 — Export & Ownership (Weeks 2–3)
- Static export: renderToString(PageRenderer) + Tailwind JIT render pass
- "Download ZIP" route (streams files, includes assets)
- Next.js project export: include all used section files + registry subset
- Basic SEO audit CLI (pnpm audit:seo)

### Phase 2 — Persistence & Preview Scale (Weeks 3–4)
- Move session store to KV/Redis (env-switchable; in-memory fallback)
- Add /api/preview/ws with WebSocket for live typing + presence
- Session GC job + heartbeat pings
- Rate-limit preview (per IP/session)

### Phase 3 — Content Ingest (Weeks 4–5)
- Heuristic content extractor → API (POST /api/extract)
- Optional LLM extractor with guardrails + tests (behind LLM_ENABLED)
- Image pipeline: smart crop (Cloudinary/UploadThing adapter)

### Phase 4 — Components & Quality (Weeks 5–6)
- Add: Footer (Mega), CTA Inline Form, Features Bento, Hero Minimal, Testimonials Carousel
- A11y pass on all sections (focus rings, landmarks, aria)
- Visual regression baseline (Percy/Chromatic or Playwright screenshots)

### Phase 5 — Collaboration & Multi-page (Weeks 6–7)
- Page model: routes + nav + per-page sections
- Transform scope: "apply to page X" + history per page
- Presence cursors + locking (optimistic, WS)

### Phase 6 — Beta polish (Week 8)
- Starter templates (SaaS, Agency, Founder) selectable on onboarding
- One-click Vercel deploy flow (with env wiring)
- Docs site (Docusaurus or MDX in app/docs)
- Telemetry (anonymous): command latency, preview errors

---

## Backlog (ready-to-paste GitHub checklist)

### 📦 Export & Ownership
- Static exporter: SSR HTML + Tailwind extraction (#export, est 2d)
- ZIP download route with streamed archive (#export, est 1d)
- Next.js project exporter (tree-shakes unused components) (#export, est 2d)

### ⚡ Realtime Preview
- KV/Redis session adapter + env switch (#infra, est 1d)
- WebSocket preview endpoint + client hook (#editor, est 2d)
- Presence indicators (#editor, est 1d)
- Rate limiting + abuse guard (#infra, est 0.5d)

### 🧠 Content Extractor
- /api/extract (heuristics) (#extractor, est 1d)
- LLM extractor with schema validation (#extractor, #ai, est 2d)
- Unit tests + golden samples (#qa, est 1d)

### 🧩 Component Library
- FooterMega + registry meta (#components, est 0.5d)
- CTAPrimaryInlineForm (#components, est 1d)
- FeaturesBentoGrid (#components, est 1d)
- HeroMinimal (#components, est 0.5d)
- TestimonialsCarousel (#components, est 1d)
- A11y audit (contrast, roles, heading order) (#a11y, est 1d)

### 🧪 Quality & Tests
- Playwright e2e: editor apply/undo/redo (#qa, est 1d)
- Visual regression baseline screenshots (#qa, est 1d)
- Scorer invariants + beam determinism tests (#qa, est 0.5d)

### 🧰 Transforms Enhancements
- "Theme: high-contrast" macro (tone + palette hints) (#editor, est 0.5d)
- "Compress hero copy to ≤120 chars" transform (#editor, est 0.5d)
- "Swap feature layout" smart variant chooser (#editor, est 0.5d)

### 🧵 Multi-page & Nav
- Page graph + nav builder (#pages, est 2d)
- Transform scoping per page (#pages, est 1d)
- Export supports multiple routes (#export, est 1d)

### 🚀 Deploy & Ops
- One-click Vercel deploy (repo URL param) (#ops, est 0.5d)
- Health checks & basic logging (#ops, est 0.5d)
- Anonymous telemetry toggle (#ops, est 0.5d)

### 📚 Docs & Examples
- Tutorial: "From prompt to deployed site in 5 min" (#docs, est 1d)
- API docs for transforms + interpreter (#docs, est 0.5d)
- Example content briefs → outputs (#docs, est 0.5d)

---

## Milestones & Success Criteria

- **M1 (Week 3)**: Export ZIP + Next project; preview stable at p95 < 100ms.
- **M2 (Week 5)**: Extractor API (heuristics), 5 more sections, a11y pass; p95 < 120ms with KV.
- **Beta (Week 8)**: WebSocket preview + presence, templates, deploy button; 10 external testers complete onboarding < 10 min.

### Quality bars
- **Determinism**: same input → same output (hash test in CI).
- **A11y**: WCAG AA nits tracked, zero "error" grade in audits.
- **Perf**: bundle unchanged by preview feature (client code only in editor).

---

## GitHub Issues Import

### 🔥 Critical Path (Beta Blockers)

**Issue: Add smoke tests for core pipeline**
- **Labels:** `critical`, `testing`, `phase-0`
- **Estimate:** 1 day
- **Milestone:** Week 1 - Hardening

Add smoke tests for:
- [ ] generatePage() with all tone variants
- [ ] interpretChat() with 20+ command variations  
- [ ] HistoryManager undo/redo edge cases
- [ ] Transform determinism (hash comparison)

**Acceptance:**
- CI runs tests on every PR
- Tests complete in <30s
- Coverage >80% for critical paths

---

**Issue: Static HTML/CSS exporter**
- **Labels:** `critical`, `export`, `phase-1`
- **Estimate:** 2 days
- **Milestone:** Week 3 - Export

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

---

**Issue: KV/Redis session adapter**
- **Labels:** `critical`, `infra`, `phase-2`
- **Estimate:** 1 day
- **Milestone:** Week 4 - Scale

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

---

**Issue: WebSocket preview endpoint**
- **Labels:** `critical`, `editor`, `phase-2`
- **Estimate:** 2 days
- **Milestone:** Week 4 - Scale

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

---

### 📦 Component Library Expansion

**Issue: Footer Mega component**
- **Labels:** `components`, `good-first-issue`
- **Estimate:** 4 hours
- **Milestone:** Week 5 - Components

Create FooterMega variant:
- [ ] 4-column layout desktop
- [ ] Accordion mobile
- [ ] All 4 tone variants
- [ ] Newsletter signup option
- [ ] Social links grid

**Template:** Use existing component structure
**Reference:** components/sections/CTAGradientSlab.tsx

---

**Issue: Features Bento Grid**
- **Labels:** `components`, `enhancement`
- **Estimate:** 1 day
- **Milestone:** Week 5 - Components

Asymmetric feature grid:
- [ ] 2x2 with one large cell
- [ ] Auto-flow for 3-7 features
- [ ] Icon support
- [ ] Hover animations (playful tone)
- [ ] Mobile stack gracefully

**Acceptance:**
- Looks good with 3-7 features
- No layout shift on hover

---

### 🧠 AI Integration

**Issue: Content extraction API**
- **Labels:** `ai`, `enhancement`, `phase-3`
- **Estimate:** 2 days
- **Milestone:** Week 5 - Content

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

---

### 🧪 Quality & Testing

**Issue: Visual regression baseline**
- **Labels:** `qa`, `testing`
- **Estimate:** 1 day
- **Milestone:** Week 6 - Quality

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

---

**Issue: A11y audit pass**
- **Labels:** `a11y`, `quality`
- **Estimate:** 1 day
- **Milestone:** Week 6 - Quality

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

---

### 🚀 Launch Features

**Issue: One-click Vercel deploy**
- **Labels:** `ops`, `enhancement`
- **Estimate:** 4 hours
- **Milestone:** Week 8 - Beta

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

---

**Issue: Starter templates**
- **Labels:** `enhancement`, `ux`
- **Estimate:** 1 day
- **Milestone:** Week 8 - Beta

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

---

## Project Board Structure

### 📋 GitHub Project Board: Grid 2.0 Beta

**Columns:**
1. **🧊 Icebox** (Future ideas)
2. **📝 Backlog** (Prioritized, ready)
3. **🚧 In Progress** (Actively working)
4. **👀 In Review** (PR open)
5. **✅ Done** (Merged)

**Automation Rules:**
- Issue created → Backlog
- PR opened → In Review
- PR merged → Done
- "blocked" label → Icebox

**Views:**

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

- **Week 1-2:** Everyone on critical path
- **Week 3-4:** Split infra (backend) vs components (frontend)
- **Week 5-6:** Quality sprint (whole team)
- **Week 7-8:** Polish and launch prep

## Success Metrics

- **Beta Ready:** 10 external users complete full flow
- **Performance:** P95 < 150ms for all operations
- **Quality:** Zero critical bugs, <5 minor bugs
- **Documentation:** 100% of public APIs documented