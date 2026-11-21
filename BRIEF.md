# BRIEF, Bike MOT Check UK (veh-bike-mot-check)

## What it is
Free MOT history checker for any UK registration, from the DVSA MOT History API, with an automatic buyer report and plain English guides. Nobody pays today. A paid full history report (£3.99) is planned and waits on demand.

## Where it is live
- https://bikemotcheckuk.cloud, 200 on 31 Oct 2026. `www` 301 to the bare name.
- Main checker live at `73d2565` since 21 Nov 2026 00:47 UTC (pinned source SHA in `/docker/bikemotcheck/docker-compose.yml`; rollback file `docker-compose.yml.before-navfix-20261121-*` beside it). `/healthz` shows `"commit":"dev"` on this path, the image path below will carry the real commit.
- Rule 8 (owner, 20 Nov 2026): prices shown plain, £3.99 and £11.99, no struck "standard" prices (they were never charged). When payment is switched on, the tick shows only a small "Terms and conditions" link; the 14 day clause is in `/terms#cancel` and `/refunds#cancel`. Phones: the header no longer widens the page (was 459px at 375). Proof: `docs/screenshots/rule8/` at 375 and 1280.
- Guides at https://bikemotcheckuk.cloud/guides/ (200), served by a separate static container `motguides`.

## How it deploys
Two parts.
- Main checker (`server.js`, plain Node, zero dependencies): runs from the hPanel compose in `/docker/bikemotcheck`, which pulls `server.js`, `client.js` and `assets.b64` at a pinned SHA when the container starts (no build). A deploy is a SHA bump in that file plus a recreate under `build-lock`. The image pipeline for it (`image-web.yml`, `Dockerfile`, `docker-compose.web.yml`) is merged (PR 15) and its smoke is green; moving the box onto it is the next step.
- Guides: GitHub `image.yml` on push to `main` (only when guide files change) to `ghcr.io/jagat-it-uk-ltd/veh-bike-mot-check-guides`, image only `docker-compose.vps.yml`, `mem_limit: 64m`.

## Money
Off. The MOT check is free. The paid history report needs a data supplier key, a Stripe key and the ICO number before the buy button turns on (`PAY_ENABLED` in `server.js`). The live `/history-check` page shows a demand button, not a buy button.

## RAM on the box
RAM age 6 MiB (main checker, box docker stats 29 Oct), pore 10 MiB (21 Nov, minutes after the restart; the container installs curl and fetches its files at start). Guides under 1 MiB. Already plain Node, so the slim recipe has nothing left to cut here.

## Session
The Claude session that owns this repo is named "Bike MOT Check (veh-bike-mot-check)" in the app.

## Next steps (from docs/PLAN.md)
1. Done 21 Nov: PR 15 (six docs, image pipeline, `/healthz` commit), server address out of the passport, rule 8, phone header fix.
2. The server address is still in this public repo's git history; clearing it needs a history rewrite, which is R's call.
3. M3: move the main checker onto the image path (`/root/bikemotcheck`, `docker-compose.web.yml`, `image-web` dispatch), then stop using the hPanel Deploy button.
4. M4: prove the payment flow with a test key and a local fixture, no real supplier call.
5. M5: paid history on, only with R's yes.

## Owner clicks
- History data supplier account and key (paid, money step).
- Stripe live key for this site.
- Yes for M5 paid history.

## Rules
Read `CLAUDE.md`, `AI.md` and `README.md` first. Rules source is JAGAT-IT-UK-LTD/ai-memory `CHARTER.md`.

Last updated: 21 Nov 2026.
