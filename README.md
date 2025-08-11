# The Grid 2.0 — MVP (Deterministic AI Website Builder)

**AI for understanding, algorithms for execution.**  
LLMs parse user intent; beam search + pure transforms build the page. Millisecond previews, no hallucinations in the hot path.

## Highlights
- Deterministic beam search section assembler
- Tone-aware, accessible components (Tailwind)
- Pure transform system + chat interpreter
- Real-time preview API, hook, and editor UI
- Exports: static HTML or Next.js app

## Quickstart

```bash
pnpm i
pnpm dev
# open http://localhost:3000/demo  (static generated page)
# open http://localhost:3000/editor (realtime editor)
```

### CLI demos

```bash
pnpm run demo:node        # beam search + generatePage
pnpm run demo:transforms  # interpret chat, apply transforms, show diff/impact
```

## Docs
- [MANIFESTO](./docs/MANIFESTO.md)
- [ARCHITECTURE](./docs/ARCHITECTURE.md)
- [Realtime Preview API](./docs/API.md)
- [🚀 8-Week Roadmap to Beta](./ROADMAP.md)

## Deploy (Vercel)
1. Push this folder to a new GitHub repo.
2. Click the Deploy button below and replace the `REPOSITORY_URL` with your repo URL.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=REPOSITORY_URL)

Or import the repo at https://vercel.com/import directly.

## Where to add LLMs
- `lib/content-extractor.ts` — map messy text → `ContentGraph` (swap heuristics for LLM where available)
- Chat command parsing — current regex works great; you can layer an LLM classifier on top to produce transform plans.

## Next Steps
See our detailed [8-week roadmap to beta](./ROADMAP.md) with ready-to-import GitHub issues and milestones.

## License
MIT © 2025 Grid 2.0

- [5 Minutes to Deploy](./docs/QUICKSTART-5MIN.md)
