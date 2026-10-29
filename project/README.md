# Project passport: veh-bike-mot-check

> Family: **UK Vehicle Checks** · Owner: @ruhulamin0001 · Completeness: **43%** · Generated 2026-10-15
> Auto-filled from repo files only; `TBC` = unknown. **Never put secret values here.** Update after every change.

## Domain & DNS
bikemotcheckuk.cloud (VERIFIED: routed by Traefik on uk-vps (72.62.213.196, Hostinger srv1569293) 2026-10-15; TLS cert expires 2026-11-19; registrar TBC)

## Hosting/VPS & deploy
uk-vps (72.62.213.196, Hostinger srv1569293) (Traefik + Docker). Compose project `bikemotcheck`, path `/docker/bikemotcheck (+ motguides container for /guides)`. Containers: see path. Deploy remote: no git checkout in deploy dir (image built from copied source)

## GitHub
https://github.com/JAGAT-IT-UK-LTD/veh-bike-mot-check (public), default branch main

## Brand
Uses design-system: https://github.com/JAGAT-IT-UK-LTD/design-system (logo/colours TBC)

## Website
https://bikemotcheckuk.cloud (HTTP 200 on 2026-10-15)

## Email
TBC

## Phone/web phone
TBC

## Apps
TBC

## Payment gateway
TBC

## Paperwork/legal
TBC

## ENV (names only)
TBC

## Credentials
TBC

## Code/stack
TBC

## Database
TBC

## Data store/backups
No app-specific backup. Server-wide: nightly /root/ops/backup-databases.sh (every DB, keep 7) + backup-vps.sh (configs, keep 7) into /root/backups on the same disk. Off-site since 15 Oct 2026: nightly 04:30 age-encrypted archive → bd-vps `/srv/offsite/uk-vps` (14 days, sha256 + restore self-test). Cloudflare R2 third copy live since 16 Oct 2026 (encrypted, 7 days).

## Marketing
TBC

## Sales plan
TBC

## AI/agents
Claude Code, GitHub Copilot; last push 2026-10-15

## Progress
Last push 2026-10-15. Description: MOT history checker for bikemotcheckuk.cloud. Node backend, no dependencies. Secrets live in the server environment, never in this repo.
2026-10-29 (Claude Code, Fable 5.1): branch `static-export`, the /guides container (motguides) prepared as a static nginx:alpine image. `GUIDES_STATIC_OUT=<dir> node guides.js` renders the 25 guide pages, sitemap and 404 page to files; `Dockerfile.guides` builds them into nginx; `docker-compose.vps.yml` runs it image only with `mem_limit: 64m` (measured about 4MB against about 17MB for the Node container). Not deployed yet. Trade off: a new guide now needs an image rebuild, the five minute remote poll of guides-data.json is gone in the static build.

## Competitors
TBC

## Google traffic/SEO
sitemap present (Search Console property / GA4 id TBC)

## Owner
@ruhulamin0001

## Risks
TBC
