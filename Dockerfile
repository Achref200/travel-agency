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
ARG NEXT_PUBLIC_SITE_URL="https://www.marwentravel.com"
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""
ARG DATABASE_URL

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME \
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=$NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET \
    DATABASE_URL=$DATABASE_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# We only generate Prisma client and run build. The user must provide a valid
# DATABASE_URL build argument if Next.js statically generates pages that need it.
RUN npx prisma generate \
 && npm run build

############################################################
#  Runner — migrate + seed + `next start`
############################################################
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Bring the fully built app. node_modules is kept intact so the Prisma CLI and
# tsx are available to run migrations + seeding on boot (see entrypoint).
COPY --from=builder /app ./

# Writable dirs for the unprivileged `node` user:
#  - /app/public/uploads local image uploads (mounted volume)
#  - /app/.next          Next.js ISR / fetch cache written at runtime
RUN mkdir -p /app/public/uploads \
 && chown -R node:node /app/public/uploads /app/.next

COPY --chmod=0755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
