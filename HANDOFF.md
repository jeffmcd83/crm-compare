# HANDOFF — Cardiac Rhythm Management (CRM) guide
Live: https://jeffmcd83.github.io/crm-compare/  ·  Written 2026-10-14

## How it's built
- **Source data:** `/workspace/crm-specs/` (verified CSVs, `sources/` manuals + per-pass logs, `sources/STANDING_DECISIONS.md`, `recalls/`, `refresh/`).
- **Build:** `python3 /workspace/crm-specs/app/build_app.py --out root` (and `--out preview`) writes `index.html`, `data/`, `sw.js`, `manifest.webmanifest` into this repo (`/workspace/crm-compare-site`).
- **Hosting:** GitHub Pages, branch `main`, folder `/`. The site is static files only — it keeps working if the bot's computer is down.
- **Offline:** `sw.js` (network-first, cache fallback; cache name changes each release) + `manifest.webmanifest` (installable to home screen).

## Data rules
Verified sources only, naming the exact model/catalog number; every value links to its source; blanks stay blank; conflicts are logged, never overwritten. See STANDING_DECISIONS.md.

## How it's updated (deploy safety)
- **Data pass deploy:** `/workspace/crm-specs/sources/deploy_pass.sh N TAG "message"` — rebuilds, serves locally, runs `app/test_v11.py`; any failure/crash/server-not-ready => exit 1, nothing committed or pushed.
- **Weekly recall refresh (Mon):** `python3 /workspace/crm-specs/refresh/weekly_refresh.py` — pushes only if `app/gate.sh` (same tests) passes; otherwise reverts `index.html` and reports `ABORTED`.
- **Daily gap fill (2:07 PM ET):** goes through `deploy_pass.sh`.

## How to roll back
See ROLLBACK.md. Tag `stable` = last known-good live state (2026-10-14).

## Backups
Off-box backup of working files (CSVs, scripts, logs, STANDING_DECISIONS, PDF manifest): private repo `jeffmcd83/device-guides-backup`, refreshed by `bash /workspace/backup_guides.sh`.

## If the bot is gone
The site keeps serving as-is from GitHub Pages. To maintain: clone this repo, restore working files from the backup repo into `/workspace/`, run the build + gate commands above (needs Python 3, openpyxl, playwright + Chrome).
