import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { GRANT_COOKIE, redeemAccessCode } from "@/lib/access";

const BodySchema = z.object({
  code: z.string().min(4).max(64),
});

export async function POST(req: Request) {
  const { code } = BodySchema.parse(await req.json());
  const result = await redeemAccessCode(code);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(GRANT_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({ ok: true, plan: result.plan });
}
