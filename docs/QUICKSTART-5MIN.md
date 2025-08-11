# 5 Minutes to Deploy

> Build, preview, and deploy a deterministic AI-generated site in minutes.

## 1) Clone and install
```bash
git clone <your-repo-url> grid2
cd grid2
pnpm i   # or npm i / yarn
```

## 2) Run the demos
```bash
pnpm dev           # Next.js on http://localhost:3000
pnpm run demo:node # beam search + audits
pnpm run demo:transforms # chat → transforms → analysis
```

## 3) Try the realtime editor
Open http://localhost:3000/editor and type:
- `make the hero more dramatic`
- `add social proof`
- `increase contrast`

Click **Apply** to commit. Use **Undo/Redo** to step changes.

## 4) Add your content
Paste rough text into `lib/content-extractor.ts` or call your own extractor API to produce a `ContentGraph`, then pass it to `generatePage()`.

## 5) Deploy to Vercel
- Push to GitHub
- Open the README and click **Deploy with Vercel**
- Replace `REPOSITORY_URL` with your repo URL
- Vercel builds automatically; open the URL it gives you

> Tip: For production styling, replace Tailwind CDN in `app/layout.tsx` with the Tailwind build pipeline.
