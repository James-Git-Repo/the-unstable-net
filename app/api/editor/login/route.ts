import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json();
  const hash = process.env.EDITOR_PASSCODE_BCRYPT || "";
  const ok = hash ? await bcrypt.compare(passcode || "", hash) : false;
  if (!ok) return NextResponse.json({ ok: false, error: "Invalid passcode." }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("tsn_editor", "1", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  return res;
}
