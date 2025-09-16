import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";
import { sanitize } from "@/src/lib/sanitize";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 120);
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("tsn_editor")?.value === "1";
  if (!cookie) return NextResponse.json({ ok:false, error: "Forbidden" }, { status: 403 });
  const form = await req.formData();
  const title = String(form.get("title") || "");
  const summary = String(form.get("summary") || "");
  const content_html_raw = String(form.get("content_html") || "");
  const publish = String(form.get("publish") || "0") === "1";
  const cover = form.get("cover") as File | null;

  if (!title) return NextResponse.json({ ok:false, error: "Missing title" }, { status: 400 });

  let cover_url: string | null = null;
  if (cover && cover.size) {
    const arrayBuffer = await cover.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const fileName = `covers/${Date.now()}-${cover.name}`;
    const { data: upload, error: upErr } = await supabaseAdmin.storage.from("covers").upload(fileName, bytes, { contentType: cover.type, upsert: true });
    if (upErr) return NextResponse.json({ ok:false, error: upErr.message }, { status: 500 });
    const { data: pub } = supabaseAdmin.storage.from("covers").getPublicUrl(fileName);
    cover_url = pub.publicUrl;
  }

  const content_html = sanitize(content_html_raw);
  const slug = slugify(title);
  const now = new Date().toISOString();

  const { error } = await supabaseAdmin.from("articles").insert({
    title, slug, summary, content_html, cover_img_url: cover_url, published_at: publish ? now : null
  });

  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true });
}
