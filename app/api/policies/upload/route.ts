import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const isEditor = req.cookies.get('tsn_editor')?.value === '1';
  if (!isEditor) return NextResponse.json({ ok:false }, { status: 403 });
  const form = await req.formData();
  const type = String(form.get('type') || '');
  const file = form.get('file') as File | null;
  if (!file || !type) return NextResponse.json({ ok:false, error: "Missing data" }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const path = `policies/${type}-${Date.now()}-${file.name}`;
  const { error: upErr } = await supabaseAdmin.storage.from('policies').upload(path, bytes, { upsert: true, contentType: file.type });
  if (upErr) return NextResponse.json({ ok:false, error: upErr.message }, { status: 500 });
  const { data } = supabaseAdmin.storage.from('policies').getPublicUrl(path);
  const file_url = data.publicUrl;
  const { error } = await supabaseAdmin.from('policies').insert({ type, file_url });
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, file_url });
}
