import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// TEMPORARY DIAGNOSTIC — delete once the deployment is healthy.
// Reports only whether env vars are PRESENT (never their values) plus a
// sanitized database error, so we can tell "variable missing" apart from
// "variable set but connection failing" without reading Vercel's logs.
const KEY = "7812fd379ac74a4a070d44c1";

const NAMES = [
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_URL",
  "POSTGRES_HOST",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DATABASE",
  "AUTH_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "BLOB_READ_WRITE_TOKEN",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

// Strip credentials from anything we echo back.
function sanitize(text: string): string {
  return text
    .replace(/(\w+:\/\/)[^:@\s]+:[^@\s]+@/g, "$1USER:PASS@")
    .slice(0, 600);
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return new NextResponse("Not found", { status: 404 });
  }

  const present: Record<string, boolean> = {};
  for (const n of NAMES) present[n] = Boolean(process.env[n]);

  // Shape of the pooler URL without exposing the credentials in it.
  let urlShape: string | null = null;
  const raw = process.env.POSTGRES_PRISMA_URL;
  if (raw) {
    try {
      const u = new URL(raw);
      urlShape = `${u.protocol}//USER:PASS@${u.hostname}:${u.port}${u.pathname}${u.search}`;
    } catch {
      urlShape = "present but not parseable as a URL";
    }
  }

  let db: Record<string, unknown>;
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.companyContent.count();
    db = { ok: true, companyContentRows: count };
  } catch (err) {
    const e = err as { name?: string; code?: string; message?: string };
    db = {
      ok: false,
      name: e?.name ?? null,
      code: e?.code ?? null,
      message: sanitize(e?.message ?? String(err)),
    };
  }

  return NextResponse.json(
    { runtime: process.version, vercelEnv: process.env.VERCEL_ENV ?? null, present, urlShape, db },
    { headers: { "cache-control": "no-store" } }
  );
}
