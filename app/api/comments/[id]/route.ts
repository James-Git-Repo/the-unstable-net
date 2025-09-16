import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const isEditor = req.cookies.get('tsn_editor')?.value === '1';
  if (!isEditor) return NextResponse.json({ ok: false }, { status: 403 });
  const form = await req.formData();
  const action = String(form.get('action') || '');
  if (action === 'approve') {
    const { error } = await supabaseAdmin.from('comments').update({ is_approved: true }).eq('id', params.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } else if (action === 'reject') {
    const { error } = await supabaseAdmin.from('comments').delete().eq('id', params.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 });
}
