# The main checker (server.js) as an image. Built on GitHub's runner by .github/workflows/image-web.yml, never on uk-vps
# (the 19 Oct 2026 OOM outage came from docker builds on the production box). No dependencies, no npm install: the image
# is node plus three files. Secrets come from the box .env at run time, never from this repo (it is public).
#   docker build -t ghcr.io/jagat-it-uk-ltd/veh-bike-mot-check:<sha7> --build-arg BUILD_COMMIT=<sha> .
FROM node:20-alpine
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
