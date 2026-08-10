# Soma Studios blog posts

Add one Markdown file per post in this folder.

## Quick start

1. Copy `_template.md` to a new file, e.g. `what-is-dream-analysis.md`
2. The filename becomes the URL: `/blog/what-is-dream-analysis`
3. Fill in the frontmatter and write the body in Markdown
4. Save — the post appears on `/blog` after refresh or redeploy

Old `/dream-journal/...` URLs permanently redirect to `/blog/...`.

## Frontmatter

| Field | Required | Notes |
|-------|----------|--------|
| `title` | Yes | Post headline |
| `date` | Yes | Use `YYYY-MM-DD` for correct sorting |
| `excerpt` | Recommended | Shown on the index and in meta/RSS |
| `category` | Optional | Label on the card (defaults to `Article`) |
| `image` | Optional | Card thumbnail path, e.g. `/assets/...` |
| `imageAlt` | Optional | Alt text for the thumbnail |

Files starting with `_` (like `_template.md`) are ignored.
