#!/bin/sh
# Runs on every container start. All steps are idempotent and safe to repeat:
#  - `prisma db push` only applies schema changes (no data loss for SQLite)
#  - the seed inserts baseline content ONLY when a table is empty, and upserts
#    the admin account from ADMIN_EMAIL / ADMIN_PASSWORD.
# Existing bookings, messages and admin content edits are therefore preserved.
set -e

cd /app

echo "→ Applying database schema (prisma db push)…"
node_modules/.bin/prisma db push --skip-generate

echo "→ Seeding baseline content + admin account (idempotent)…"
node_modules/.bin/tsx prisma/seed.ts

echo "→ Starting Next.js server…"
exec "$@"
