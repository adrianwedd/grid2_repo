# Architecture

**Principle:** AI for understanding, algorithms for execution.

## Modules

- **BeamSearchAssembler (`lib/beam-search.ts`)** — deterministic section selection with scoring and constraints.
- **Transforms (`lib/transforms.ts`)** — pure functions that edit the section array; interpreter maps chat → transforms.
- **Preview Session (`lib/preview-session.ts`)** — in-memory sessions, Undo/Redo via `HistoryManager`.
- **Components (`components/sections/*`)** — tone-aware Tailwind sections with typed meta.
- **Generate Page (`lib/generate-page.ts`)** — runs beam search, audits, returns `PageNode` for rendering.
- **Realtime Editor** — `/editor` page using `/api/preview`, `useRealtimePreview` hook, and `PageRenderer`.

## Data Flow

```
User → Chat (command) → /api/preview → interpretChat → [transforms] → apply → analyze → sections → UI
                       ↑                                               ↓
                    init (sections)                                History (undo/redo)
```

## Determinism

- No LLM calls on the hot path.
- Pure transforms; beam search with fixed scorer.
- Same inputs → same outputs.
