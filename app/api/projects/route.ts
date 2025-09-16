import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const isEditor = req.cookies.get('tsn_editor')?.value === '1';
  if (!isEditor) return NextResponse.json({ ok: false }, { status: 403 });
  const form = await req.formData();
  const title = String(form.get('title') || '');
  const slug = String(form.get('slug') || '');
  const cover_bg = String(form.get('cover_bg') || '#0b122b');
  const status = String(form.get('status') || 'draft');
  const cover_img = form.get('cover_img') as File | null;

  let cover_url: string | null = null;
  if (cover_img && cover_img.size) {
    const arrayBuffer = await cover_img.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const path = `project-covers/${Date.now()}-${cover_img.name}`;
    const { error: upErr } = await supabaseAdmin.storage.from('covers').upload(path, bytes, { upsert: true, contentType: cover_img.type });
    if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });
    const { data } = supabaseAdmin.storage.from('covers').getPublicUrl(path);
    cover_url = data.publicUrl;
  }
  const { error } = await supabaseAdmin.from('projects').insert({ title, slug, cover_bg, cover_img_url: cover_url, status });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
