# Soma blog posts

Add one Markdown file per post in this folder.

## Quick start

1. Copy `_template.md` to a new file, e.g. `my-first-post.md`
2. The filename becomes the URL: `/blog/my-first-post`
3. Fill in the frontmatter (`title`, `date`, `excerpt`) and write the body in Markdown
4. Save — the post appears on `/blog` after refresh or redeploy

## Frontmatter

| Field | Required | Notes |
|-------|----------|--------|
| `title` | Yes | Post headline |
| `date` | Yes | Use `YYYY-MM-DD` for correct sorting |
| `excerpt` | Recommended | Shown on the index and in meta/RSS |

Files starting with `_` (like `_template.md`) are ignored.
