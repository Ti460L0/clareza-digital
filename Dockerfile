# Revalidar e registrar o digest da imagem antes de publicar uma versão.
ARG NODE_IMAGE=node:24-bookworm-slim
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY apps/api ./apps/api
COPY packages/content ./packages/content
RUN npm run api:build

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8788 DATABASE_PATH=/app/data/usage.sqlite
WORKDIR /app
RUN mkdir -p /app/data && chown node:node /app/data
COPY --from=build --chown=node:node /app/apps/api/dist/server.js ./server.mjs
COPY --chown=node:node scripts/backup-db.mjs ./backup-db.mjs
COPY --chown=node:node LICENSE apps/web/public/third-party-notices.txt ./
USER node
EXPOSE 8788
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:8788/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
