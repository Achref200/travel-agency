# Deployment (Contabo VPS)

Production runs as two containers via Docker Compose:

- **app** — the Next.js server (`next start`) with a persistent SQLite database
- **caddy** — reverse proxy that terminates TLS with automatic Let's Encrypt certs

Data (SQLite DB + uploaded images) lives in Docker named volumes, so it survives
restarts and redeploys.

---

## 1. Prerequisites (once per server)

```bash
# On the Contabo VPS (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER      # log out / back in afterwards
```

Point your domain's DNS **A record** at the server IP for both the apex
(`marwentravel.com`) and `www` (the canonical host):

| Type | Name  | Value            |
| ---- | ----- | ---------------- |
| A    | `@`   | `<server IP>`    |
| A    | `www` | `<server IP>`    |

Caddy redirects the apex to `https://www.marwentravel.com` automatically.

## 2. Configure

```bash
git clone <your-repo> marwen-travel && cd marwen-travel
cp .env.production.example .env
nano .env
```

Set at minimum:

| Variable                | Example                        | Notes                                   |
| ----------------------- | ------------------------------ | --------------------------------------- |
| `DOMAIN`                | `marwentravel.com`             | Apex, no protocol. Caddy TLS + redirect.|
| `NEXT_PUBLIC_SITE_URL`  | `https://www.marwentravel.com` | Canonical www. **Inlined at build.**    |
| `ADMIN_EMAIL`           | `info@marwentravel.com`        | Admin login.                            |
| `ADMIN_PASSWORD`        | `MarwenTravel@2026`            | Admin login.                            |
| `ADMIN_SESSION_SECRET`  | `openssl rand -base64 48`      | **Generate a fresh value.**             |

> `NEXT_PUBLIC_*` values are compiled into the browser bundle, so if you change
> `NEXT_PUBLIC_SITE_URL` you must rebuild (`docker compose up -d --build`).

## 3. Launch

```bash
docker compose up -d --build
docker compose logs -f app        # watch startup (schema + seed + server)
```

Caddy fetches a certificate automatically on first request. Then visit:

- Site: `https://www.marwentravel.com`
- Admin: `https://www.marwentravel.com/admin`  (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## 4. Updating

```bash
git pull
docker compose up -d --build
```

The database and uploads volumes are untouched by rebuilds.

## 5. Backups

```bash
# SQLite database
docker compose cp app:/data/prod.db ./backup-$(date +%F).db
# Uploaded images
docker run --rm -v marwen-travel_uploads:/u -v "$PWD":/b alpine \
  tar czf /b/uploads-$(date +%F).tgz -C /u .
```

---

## Environment & verification checklist

- [ ] DNS A records (`@` and `www`) resolve to the server (`dig +short www.marwentravel.com`).
- [ ] `.env` filled in; `ADMIN_SESSION_SECRET` is a fresh 48-byte random string.
- [ ] `docker compose ps` shows both services `healthy`/`running`.
- [ ] `https://www.marwentravel.com` loads with a valid padlock (TLS OK).
- [ ] `http://marwentravel.com` redirects (301) to `https://www.marwentravel.com`.
- [ ] `https://www.marwentravel.com/sitemap.xml` and `/robots.txt` show the correct domain.
- [ ] `/admin` login works with the configured credentials.
- [ ] (Optional) Cloudinary vars set if you want CDN image optimisation.

## Notes

- **SQLite** is single-writer; perfect for this workload (content + leads). To
  scale writes later, switch `datasource db { provider }` in
  `prisma/schema.prisma` to `postgresql` and add a Postgres service.
- Rate limiting on `/api/admin/login` and the security headers are in-app; Caddy
  adds TLS + HTTP/2 on top.
