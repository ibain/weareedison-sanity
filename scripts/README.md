# Data migrations

## Event excerpt → rich text

Converts legacy plain-text `excerpt` fields to portable text blocks and archives the original in `excerptLegacy`.

### Before you run

1. Deploy schema first so Studio knows about `excerptLegacy`:
   ```bash
   npm run deploy
   ```
2. Preview changes (no writes):
   ```bash
   npm run migrate:excerpts:dry
   ```

### Run migration

Requires Sanity login with write access to `production`:

```bash
npm run migrate:excerpts
```

The script will:

- Write a dated JSON backup to `scripts/backups/event-excerpts-YYYY-MM-DD.json`
- Copy each plain-text excerpt to `excerptLegacy`
- Convert `excerpt` to rich text blocks (paragraphs split on blank lines; single line breaks kept)

### Pre-migration snapshot

`scripts/backups/event-excerpts-pre-migration-2026-08-23.json` — snapshot of all 14 excerpts pulled before this work (one duplicate dine-out event was added later in Sanity).

### After migration

- Descriptions appear in the rich text editor in Studio
- **Previous description (archived)** shows on each migrated event (read-only)
- Website keeps working; Squarespace code already supports both formats
