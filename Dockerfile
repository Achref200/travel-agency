# syntax=docker/dockerfile:1

############################################################
#  Base — Debian slim + OpenSSL (required by Prisma engine)
############################################################
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

############################################################
#  Dependencies (postinstall runs `prisma generate`)
############################################################
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

############################################################
#  Builder — generate client + statically build the site
############################################################
FROM base AS builder
# NEXT_PUBLIC_* values are inlined into the client bundle at BUILD time,
# so they must be passed as build args (see docker-compose.yml).
ARG NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Static pages are generated from a throwaway SQLite DB seeded with the same
# baseline content the runtime container seeds, so SSG output stays consistent.
RUN npx prisma generate \
 && DATABASE_URL="file:/tmp/build.db" npx prisma db push --skip-generate \
 && DATABASE_URL="file:/tmp/build.db" npx tsx prisma/seed.ts \
 && DATABASE_URL="file:/tmp/build.db" npm run build

############################################################
#  Runner — migrate + seed + `next start`
############################################################
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL="file:/data/prod.db"

# Bring the fully built app. node_modules is kept intact so the Prisma CLI and
# tsx are available to run migrations + seeding on boot (see entrypoint).
COPY --from=builder /app ./

# Writable dirs for the unprivileged `node` user:
#  - /data              persistent SQLite database (mounted volume)
#  - /app/public/uploads local image uploads (mounted volume)
#  - /app/.next          Next.js ISR / fetch cache written at runtime
RUN mkdir -p /data /app/public/uploads \
 && chown -R node:node /data /app/public/uploads /app/.next

COPY --chmod=0755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
