import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MYMEMORY = "https://api.mymemory.translated.net/get";
// MyMemory rejects anonymous requests longer than 500 bytes; keep a safe margin.
const MAX_CHUNK = 450;

/** Split long text into <=MAX_CHUNK pieces at sentence/word boundaries. */
function chunk(text: string): string[] {
  if (text.length <= MAX_CHUNK) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length > MAX_CHUNK) {
    let cut = rest.lastIndexOf(". ", MAX_CHUNK);
    if (cut < 0) cut = rest.lastIndexOf(" ", MAX_CHUNK);
    if (cut < 0) cut = MAX_CHUNK;
    parts.push(rest.slice(0, cut + 1));
    rest = rest.slice(cut + 1);
  }
  if (rest) parts.push(rest);
  return parts;
}

async function translateChunk(text: string, from: string, to: string): Promise<string> {
  const url = `${MYMEMORY}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(
    `${from}|${to}`,
  )}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "travel-platform-admin" },
    // Never cache — content changes constantly.
    cache: "no-store",
  });
  if (!res.ok) throw new Error("upstream");
  const data = (await res.json()) as {
    responseStatus?: number | string;
    responseData?: { translatedText?: string };
  };
  const out = data?.responseData?.translatedText;
  if (typeof out !== "string" || !out) throw new Error("empty");
  return out;
}

/** Translate a full string, preserving line breaks (used by list fields). */
async function translateText(text: string, from: string, to: string): Promise<string> {
  const lines = text.split("\n");
  const translatedLines = await Promise.all(
    lines.map(async (line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      const pieces = chunk(trimmed);
      const done = [];
      for (const p of pieces) done.push(await translateChunk(p, from, to));
      return done.join(" ");
    }),
  );
  return translatedLines.join("\n");
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { text?: string; from?: string; to?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const text = (body.text ?? "").toString();
  const from = (body.from ?? "en").toString().slice(0, 5);
  const targets = Array.isArray(body.to) ? body.to.map((t) => String(t).slice(0, 5)) : [];

  if (!text.trim() || targets.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_input" }, { status: 400 });
  }

  try {
    const entries = await Promise.all(
      targets
        .filter((to) => to && to !== from)
        .map(async (to) => [to, await translateText(text, from, to)] as const),
    );
    return NextResponse.json({ ok: true, translations: Object.fromEntries(entries) });
  } catch (error) {
    console.error("translate_failed", error);
    return NextResponse.json({ ok: false, error: "translate_failed" }, { status: 502 });
  }
}
