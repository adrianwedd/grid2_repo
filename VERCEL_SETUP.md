# Vercel Deployment Setup

## Quick Setup Steps

1. **Login to Vercel CLI locally:**
   ```bash
   npx vercel login
   ```

2. **Link your project:**
   ```bash
   npx vercel link
   ```
   - Choose "Link to existing project" if you already created one on vercel.com
   - Or choose "Create new project" to set it up fresh

3. **Deploy manually (first time):**
   ```bash
   npx vercel --prod
   ```

4. **Get your secrets for GitHub Actions:**
   After deploying, run:
   ```bash
   npx vercel env pull .env.vercel
   ```
   
   Then get your IDs:
   - Open `.vercel/project.json` to find `projectId` and `orgId`
   - Get your token from: https://vercel.com/account/tokens

5. **Add secrets to GitHub:**
   Go to your repo Settings → Secrets → Actions and add:
   - `VERCEL_TOKEN` - Your personal access token
   - `VERCEL_ORG_ID` - From `.vercel/project.json`
   - `VERCEL_PROJECT_ID` - From `.vercel/project.json`

## Environment Variables

Your app uses `.env.local`, which Vercel will automatically load. You can also set them in Vercel Dashboard:
- Go to your project → Settings → Environment Variables
- Add your `CHATGPT_SESSION_TOKEN` and `CHATGPT_COOKIES`

## Automatic Deployments

Once set up, every push to `main` will automatically deploy via GitHub Actions.

## Manual Deployment

```bash
npx vercel          # Deploy to preview
npx vercel --prod   # Deploy to production
```

## Project Structure

Your `vercel.json` is already configured to:
- Use `pnpm` for installation
- Build with Next.js
- Handle API routes with serverless functions

## Domains

After deployment, you'll get:
- Preview URL: `your-project-*.vercel.app` (for branches)
- Production URL: `your-project.vercel.app` (for main branch)

You can add custom domains in Vercel Dashboard → Domains.