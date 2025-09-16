import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";
import { sanitize } from "@/src/lib/sanitize";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const isEditor = req.cookies.get('tsn_editor')?.value === '1';
  if (!isEditor) return NextResponse.json({ ok:false }, { status: 403 });
  const form = await req.formData();
  const body = String(form.get('body') || '');
  const html = sanitize(body);
  const { error } = await supabaseAdmin.from('about').insert({ body_html: html });
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true });
}
