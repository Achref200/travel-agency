# Deployment (Hostinger)

Production runs on **Hostinger web hosting** with the Node.js/Next.js preset.
Pushing to `main` on GitHub deploys straight to `marwentravel.com` — there is no
staging step, so a broken push is a broken live site.

> An earlier VPS plan (Docker + Caddy) was removed — it was never what ran in
> production and repeatedly misled people. Recover it from git history if you
> ever move off Hostinger.

---

## Hostinger constraints that shape this app

| Constraint | Consequence |
| --- | --- |
| **No persistent disk** — every deploy is a fresh checkout | Anything written to `public/uploads` is lost on the next deploy. All images must live in Cloudinary. |
| **No `DATABASE_URL` during build** | Pages cannot be statically generated from the DB. They render dynamically and cache their reads instead (see below). |
| **Low MySQL connection cap** | `src/lib/prisma.ts` pins `connection_limit=5`. Do not create extra `PrismaClient` instances in server code — import the shared one from `@/lib/prisma`. |
| **Proxy request timeout** | Slow DB work surfaces to visitors as a 504. Content reads are cached; keep new DB work off the render path. |

## Environment variables

Set these in **hPanel → your site → Advanced → Environment variables**, then
redeploy. `NEXT_PUBLIC_*` values are inlined at build time, so changing one
requires a rebuild, not just a restart.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | `mysql://user:pass@host:3306/db`. Connection limits are applied in code. |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://marwentravel.com` — canonical URLs, sitemap, OG tags. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | yes | Admin login. The seed endpoint refuses to run without them. |
| `ADMIN_SESSION_SECRET` | yes | Signs session cookies. `openssl rand -base64 48`. Changing it logs everyone out. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | yes | Cloud name (`lwakcrdc`). Needed in the browser bundle for the image loader. |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | yes | Signed uploads. Server-side only — never prefix these with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | no | Only for accounts using an unsigned preset instead of signed keys. |
| `SEED_SECRET` | no | Bearer token for `/api/seed`. Without it the endpoint is closed to anonymous callers. |
| `WHATSAPP_PHONE_NUMBER_ID` / `WHATSAPP_ACCESS_TOKEN` | no | Booking + contact alerts to `+905013476409`. **Unset = leads are saved but nobody is notified.** |
| `RESEND_API_KEY` / `NOTIFICATION_EMAIL_FROM` | no | Email alerts to `contact@marwentravel.com`. Same caveat. |

## First-time database setup

Tables are created by `POST /api/seed`, which is authenticated. With
`SEED_SECRET` set in hPanel:

```bash
curl -X POST https://marwentravel.com/api/seed \
  -H "Authorization: Bearer $SEED_SECRET"
```

It is idempotent: tables use `CREATE TABLE IF NOT EXISTS`, baseline content is
only inserted into empty tables, and an existing admin password is never reset.

## Images

Every content image must be a Cloudinary URL. To pull in anything still hosted
elsewhere:

```bash
npm run images:migrate -- --dry-run   # list what would move
npm run images:migrate                # fetch into Cloudinary, repoint the DB
npm run images:verify                 # confirm every reference resolves
```

Run these locally against the production `DATABASE_URL` — Hostinger's shell
does not reliably expose the app's environment.

## Verification checklist after a deploy

- [ ] `https://marwentravel.com` returns 200 and the tab shows the Marwen logo.
- [ ] `/admin` login works.
- [ ] Admin → upload an image: it returns a `res.cloudinary.com` URL.
- [ ] `npm run images:verify` reports 0 missing / unreachable.
- [ ] Submit a test booking; confirm it appears in Admin → Bookings **and** that
      WhatsApp/email alerts arrive (if those credentials are set).
- [ ] `/sitemap.xml` and `/robots.txt` show the correct domain.
