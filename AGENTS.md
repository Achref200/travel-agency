# Marwen Travel — working rules

## Next.js version

This project runs **Next.js 16.2** with React 19 and the App Router. Some APIs
differ from older App Router material: `params` is a Promise and must be
awaited, `next/og` provides `ImageResponse`, and middleware lives in
`src/proxy.ts`.

> An earlier version of this file told agents to read
> `node_modules/next/dist/docs/`. **That directory does not exist** — npm does
> not ship Next's docs. Check the actual source in `node_modules/next` or the
> official docs online instead; do not trust that instruction if it reappears.

## Production reality

The site is live at `marwentravel.com` on **Hostinger**, deployed by pushing to
`main`. There is no staging environment — a bad push breaks the live site.
`Dockerfile` / `docker-compose.yml` / `Caddyfile` are leftovers from an
abandoned VPS plan and are **not** what runs. See `DEPLOY.md`.

## Rules

1. **Images live in Cloudinary.** Every content image must be a
   `res.cloudinary.com` URL or a same-origin `/public` asset. Never point the
   database at a third party's site — those break without warning and are not
   ours to serve. Hostinger has no persistent disk, so local uploads are lost on
   the next deploy.
2. **One Prisma client.** Server code imports `prisma` from `@/lib/prisma`.
   Never call `new PrismaClient()` in a route, page, or server action — the
   MySQL connection cap is low and extra pools cause 504s. Standalone CLI
   scripts under `scripts/` and `prisma/` are the only exception.
3. **Keep DB work off the render path.** Content reads go through the cached
   helpers in `@/lib/content`. If you add one, wrap it in `cached()` and make
   sure writes call `revalidateTag(CONTENT_TAG)`.
4. **No unauthenticated endpoint may mutate the database.** `/api/seed` is
   gated behind an admin session or `SEED_SECRET`; keep it that way.
5. **Secrets stay server-side.** Only genuinely public values get the
   `NEXT_PUBLIC_` prefix. `CLOUDINARY_API_SECRET`, `ADMIN_SESSION_SECRET` and
   database credentials must never be prefixed.
6. **Verify images rather than assuming.** After touching image data, run
   `npm run images:verify` — a passing check, not a glance at the page.
7. **Contact details come from `@/config/site`.** The business WhatsApp number
   and inbox are defined once in `siteConfig.contact`; never hardcode them.
