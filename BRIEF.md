# BRIEF, Bike MOT Check UK (veh-bike-mot-check)

## What it is
Free MOT history checker for any UK registration, from the DVSA MOT History API, with an automatic buyer report and plain English guides. Nobody pays today. A paid full history report (£3.99) is planned and waits on demand.

## Where it is live
- https://bikemotcheckuk.cloud, 200 on 31 Oct 2026. `www` 301 to the bare name.
- `/healthz` 200, returns `{"ok":true,"cached":0}`, no commit in it.
- Guides at https://bikemotcheckuk.cloud/guides/ (200), served by a separate static container `motguides`.

## How it deploys
Two parts.
- Main checker (`server.js`, plain Node, zero dependencies): still builds on the box, needs the pipeline. It runs from the Hostinger hPanel compose in `/docker/bikemotcheck`. Open PR 15 adds the image pipeline for it (`image-web.yml`, `docker-compose.web.yml`), not merged.
- Guides: GitHub `image.yml` on push to `main` (only when guide files change) to `ghcr.io/jagat-it-uk-ltd/veh-bike-mot-check-guides`, image only `docker-compose.vps.yml`, `mem_limit: 64m`.

## Money
Off. The MOT check is free. The paid history report needs a data supplier key, a Stripe key and the ICO number before the buy button turns on (`PAY_ENABLED` in `server.js`). The live `/history-check` page shows a demand button, not a buy button.

## RAM on the box
Guides image about 4 MB (project passport, 29 Oct). Main checker: not measured.

## Session
The Claude session that owns this repo is named "Bike MOT Check (veh-bike-mot-check)" in the app.

## Next steps (from docs/PLAN.md in open PR 15)
1. M1 and M2: merge PR 15 (six docs and the main checker image pipeline, `/healthz` with commit).
2. Remove the server address from this public repo (`project/project.yaml` has it).
3. M3: deploy the main checker by image to `/root/bikemotcheck`, then stop using the hPanel Deploy button.
4. M4: prove the payment flow with a test key and a local fixture, no real supplier call.
5. M5: paid history on, only with R's yes.

## Owner clicks
- History data supplier account and key (paid, money step).
- Stripe live key for this site.
- Yes for M5 paid history.

## Rules
Read `CLAUDE.md`, `AI.md` and `README.md` first. Rules source is JAGAT-IT-UK-LTD/ai-memory `CHARTER.md`.

Last updated: 31 Oct 2026.
