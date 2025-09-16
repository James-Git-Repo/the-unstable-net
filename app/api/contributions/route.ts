import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get('name') || '');
  const email = String(form.get('email') || '');
  const message = String(form.get('message') || '');
  const file = form.get('file') as File | null;

  if (!name || !email || !message) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  let file_url: string | null = null;
  if (file && file.size) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const path = `contrib/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabaseAdmin.storage.from('uploads').upload(path, bytes, { upsert: true, contentType: file.type });
    if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });
    const { data } = supabaseAdmin.storage.from('uploads').getPublicUrl(path);
    file_url = data.publicUrl;
  }
  const { error } = await supabaseAdmin.from('contributions').insert({ name, email, message, file_url });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
