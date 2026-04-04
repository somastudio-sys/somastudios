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

**Story journey:** After you run **Analyse (Freud)** on a dream, use **Story journey** to pick a literary genre and build a choose-your-path short story from the dream and analysis (same `OPENAI_API_KEY`, `POST /api/story`).

**Public journal (`/blog`):** Marketing posts for the product (edit `app/blog/MarketingBlogClient.tsx`).

**Private repurposed stories (`/diary/stories`, login required):** After a story journey, **Save to my stories** stores fiction in `localStorage` under `soma-repurposed-stories` (browser-only, not synced).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
