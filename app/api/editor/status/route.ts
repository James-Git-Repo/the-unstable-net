import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("tsn_editor")?.value === "1";
  return NextResponse.json({ ok: true, editor: cookie });
}
