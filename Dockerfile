# The main checker (server.js) as an image. Built on GitHub's runner by .github/workflows/image-web.yml, never on uk-vps
# (the 19 Oct 2026 OOM outage came from docker builds on the production box). No dependencies, no npm install: the image
# is node plus three files. Secrets come from the box .env at run time, never from this repo (it is public).
#   docker build -t ghcr.io/jagat-it-uk-ltd/veh-bike-mot-check:<sha7> --build-arg BUILD_COMMIT=<sha> .
#
# Pinned to the node:22-alpine release (Node 22.23.4, Alpine 3.24.3) whose layers other containers on uk-vps already
# run on, 31 Oct 2026, so the node binary sits in a shared lower layer and its page cache is not charged again to this
# container (SLIM-RECIPE R9). server.js uses only Node built ins, so 22 runs it as 20 did. Bump only with the other sites.
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914
WORKDIR /app
COPY server.js client.js assets.b64 ./
ARG BUILD_COMMIT=unknown
# /healthz prints this, so a deploy can be checked against the git sha from outside.
ENV BUILD_COMMIT=$BUILD_COMMIT
ENV NODE_ENV=production
ENV PORT=8080
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
CMD ["node", "server.js"]
