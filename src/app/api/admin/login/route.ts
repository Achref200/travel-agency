import { NextResponse } from "next/server";
import { z } from "zod";
import {
  authenticate,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  // Throttle brute-force attempts: max 10 tries per IP per 5 minutes.
  const limited = rateLimit(`login:${clientIp(req)}`, 10, 5 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const session = await authenticate(parsed.data.email, parsed.data.password);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "invalid_credentials" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  const isHttps =
    new URL(req.url).protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https";
  res.cookies.set(SESSION_COOKIE, createSessionToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
