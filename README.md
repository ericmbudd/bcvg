# bcvg

Small Node.js utility for exporting Ghost members to CSV, including location fields when available.

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

The script writes a CSV file with these columns:

- Name
- Email
- Status
- Country
- City