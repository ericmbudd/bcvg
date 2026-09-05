# bcvg

Small Node.js utility for exporting Ghost members to CSV.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Ghost site URL and Admin API key.

## Environment variables

- `GHOST_URL`: Your Ghost site URL, for example `https://yoursite.com`
- `GHOST_ADMIN_API_KEY`: Your full Ghost admin key in the form `id:secret`
- `GHOST_ADMIN_API_KEY_ID`: Optional, use with `GHOST_ADMIN_API_KEY_SECRET` instead of `GHOST_ADMIN_API_KEY`
- `GHOST_ADMIN_API_KEY_SECRET`: Optional, use with `GHOST_ADMIN_API_KEY_ID` instead of `GHOST_ADMIN_API_KEY`
- `OUTPUT_FILE`: Optional CSV output path, defaults to `members_location_export.csv`

If you are pasting a single key, make sure it includes the colon separator between the 24-character key id and the 64-character secret. Whitespace and wrapping quotes are trimmed automatically.

## Run

```bash
npm run export
```

## Copy the election guide

Creates a new Ghost post or page from an existing one using the Admin API. The source is looked up by slug in pages first, then posts, and the copy is created as the same type. The content's `lexical` (or `mobiledoc`) field is copied verbatim, so the new entry opens in the Ghost editor fully editable with all cards intact - no HTML conversion involved.

```bash
npm run copy-guide
```

Options (all optional, defaults shown):

- `--from`: Source page slug, defaults to `election-guide`
- `--to`: Target page slug, defaults to `election-guide-2026`
- `--title`: New page title, defaults to the source title with `2025` replaced by `2026`
- `--status`: `draft` (default) or `published`

Example:

```bash
npm run copy-guide -- --from election-guide --to election-guide-2026 --title "2026 Boulder County Voter Guide" --status published
```

The script refuses to overwrite an existing target. By default the copy is created as a draft - open it in Ghost Admin to review and publish.

## Update guide content

Applies text replacements to an existing post or page directly in its Lexical content, so everything stays fully editable in the Ghost editor. Replacements only touch visible prose (Lexical `extended-text` nodes) plus text metadata fields (`title`, `excerpt`, `meta_description`, `og_title`, etc.) - link URLs, image sources, and card settings are never modified.

```bash
npm run update-guide
```

Options:

- `--slug`: Target slug, defaults to `election-guide-2026`
- `--replace OLD:NEW`: Replacement to apply, repeatable (e.g. `--replace 2025:2026 --replace "Boulder Valley:St. Vrain"`)
- `--publish`: Also publish the post/page if it is a draft
- `--dry-run`: Show what would change without saving anything
- `--include-html-cards`: Also apply replacements inside raw HTML cards (off by default, since it can touch URLs in that HTML)

Examples:

```bash
# Preview the year rollover before saving anything
npm run update-guide -- --replace 2025:2026 --dry-run

# Apply it and publish
npm run update-guide -- --replace 2025:2026 --publish
```

Review the `--dry-run` output before applying: literal dates that should stay in the past (like "December 2025" deadlines) are replaced too, so adjust those in the editor afterward if needed.

## Push the markdown outline card

Replaces the content of a post/page's markdown card from a local markdown file. The 2026 guide's outline lives in `outline-2026.md` in the repo root - edit it, then push it:

```bash
npm run update-markdown
```

Options:

- `--slug`: Target slug, defaults to `election-guide-2026`
- `--file`: Markdown file, defaults to `outline-2026.md`
- `--dry-run`: Preview without saving

The markdown card is only replaced - all other content in the post is untouched, and the card stays fully editable in the Ghost editor.

The script writes a CSV file with these columns:

- id
- email
- name
- note
- subscribed_to_emails
- complimentary_plan
- stripe_customer_id
- created_at
- deleted_at
- labels
- tiers
- gift_id
- location_*
- additional_fields_json

`labels` and `tiers` are pipe-delimited lists. `additional_fields_json` contains any other member properties returned by Ghost that are not part of the base columns.
All geolocation keys are exported as individual `location_*` columns (for example `location_country`, `location_city`, `location_latitude`, `location_longitude`).