import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get('name') || '');
  const email = String(form.get('email') || '');
  const question = String(form.get('question') || '');
  if (!name || !email || !question) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  const { error } = await supabaseAdmin.from('questions').insert({ name, email, question });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
