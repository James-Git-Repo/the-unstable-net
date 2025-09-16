import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("tsn_editor", "", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // match login route
  sameSite: "lax",
  path: "/",
  maxAge: 0,
});
  return res;
}
