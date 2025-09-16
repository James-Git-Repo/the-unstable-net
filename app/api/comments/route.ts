import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get('name') || '').slice(0, 120);
  const email = form.get('email') ? String(form.get('email')) : null;
  const text = String(form.get('text') || '').slice(0, 4000);
  const article_id = Number(form.get('article_id') || 0);

  if (!name || !text || !article_id) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from('comments').insert({ name, email, text, article_id, is_approved: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
