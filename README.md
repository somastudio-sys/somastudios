This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Dream analysis (OpenAI)

The diary’s **Analyse (Freud)** button calls `POST /api/analyze`, which uses the OpenAI API on the server only (your key is never sent to the browser).

1. Create an API key at [OpenAI API keys](https://platform.openai.com/api-keys).
2. **Local:** copy `.env.example` to `.env.local`, set `OPENAI_API_KEY=sk-...`, restart `npm run dev`.
3. **Vercel:** Project → Settings → Environment Variables → add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`, default `gpt-4o-mini`). Redeploy.

Optional: set `OPENAI_MODEL` to another chat model if your account supports it. In the OpenAI dashboard you can set usage limits and budgets.

**Story journey:** After you run **Analyse (Freud)** on a dream, use **Story journey** to pick a genre and build a choose-your-path short story from the dream and analysis (same `OPENAI_API_KEY`, `POST /api/story`).

**Public journal (`/dream-journal`):** Markdown posts in `content/blog/` — copy `_template.md`, add a new `.md` file, deploy. RSS at `/dream-journal/rss.xml`. Old `/blog` URLs redirect here.

**SEO pages:** `/ai-dream-analysis` (product), `/dream-analysis-podcast` (podcast).

**Private repurposed stories (`/diary/stories`, login required):** After a story journey, **Save to my stories** stores fiction in your cloud archive (Postgres), same as dreams.

## Cloud archive (permanent storage)

Dreams and saved stories are stored in **Vercel Postgres** (Neon), scoped to each user account—not in the browser. Clearing cache will not delete them once `POSTGRES_URL` is configured.

**Local setup**

1. Create a Postgres database in [Vercel Storage](https://vercel.com/docs/storage) (or use an existing Neon project).
2. Copy `.env.example` → `.env.local` and set:
   - `POSTGRES_URL` — from Vercel/Neon (required)
   - `DIARY_SESSION_SECRET` — 32+ random characters for the login cookie
   - `OPENAI_API_KEY` — for Analyse / Story journey
3. Restart `npm run dev`, then **Sign up** at `/signup` to create your account.

**Vercel deploy**

In Project → Settings → Environment Variables, add `POSTGRES_URL` (from Storage), `DIARY_SESSION_SECRET`, and `OPENAI_API_KEY`. Redeploy.

On first load after login, any dreams still in this browser’s old `localStorage` are imported into the cloud archive automatically.

**Settings (`/diary/settings`):** Export your full archive as PDF, or delete all dreams / all repurposed stories from your account.

**Forgot password:** `/forgot-password` sends a one-hour reset link. Set `RESEND_API_KEY` and `EMAIL_FROM` in production; in local dev the link is logged to the terminal if Resend is not configured.

**Legacy data:** If you had dreams stored before per-user accounts, they are assigned to a legacy account (`DIARY_LEGACY_EMAIL`, password `DIARY_PASSWORD`) on first deploy after the upgrade. Log in to your account and use **Import legacy archive** in `/diary/settings` to move them into your email account.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
