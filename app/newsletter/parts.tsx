'use client';

import { useEditor } from "@/src/lib/editorMode";
import { useState } from "react";
import { toHtmlFromPlainText } from "@/src/lib/sanitize";

export function EditorOnlyArticleForm() {
  const { isEditor } = useEditor();
  const [format, setFormat] = useState<'text'|'html'>('text');
  const [status, setStatus] = useState<'draft'|'publish'>('draft');
  if (!isEditor) return null;

  async function submit(form: FormData) {
    const title = String(form.get('title') || '');
    const summary = String(form.get('summary') || '');
    const html = format === 'html' ? String(form.get('content_html') || '') : toHtmlFromPlainText(String(form.get('content_text') || ''));
    const file = form.get('cover') as File | null;
    const publish = status === 'publish';

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content_html', html);
    data.set('publish', publish ? '1' : '0');
    if (file && file.size) data.set('cover', file);

    const res = await fetch('/api/articles', { method: 'POST', body: data });
    if (res.ok) window.location.reload();
    else alert('Failed to save article.');
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upload article</h2>
        <span className="text-xs rounded px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">Editor-only</span>
      </div>
      <form action={submit} className="grid gap-3 mt-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm font-medium">Title<input name="title" required className="w-full rounded-md border px-3 py-2"/></label>
          <label className="text-sm font-medium">Summary<input name="summary" className="w-full rounded-md border px-3 py-2"/></label>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm font-medium">Cover image<input type="file" name="cover" accept="image/*" className="w-full rounded-md border px-3 py-2"/></label>
          <label className="text-sm font-medium">Publish?
            <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
              <option value="draft">Save as draft</option>
              <option value="publish">Publish</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setFormat('text')} className={`px-2 py-1 rounded border ${format==='text'?'bg-slate-100':''}`}>Text</button>
          <button type="button" onClick={() => setFormat('html')} className={`px-2 py-1 rounded border ${format==='html'?'bg-slate-100':''}`}>HTML</button>
        </div>
        {format === 'text' ? (
          <label className="text-sm font-medium">Text content<textarea name="content_text" className="w-full min-h-[200px] rounded-md border px-3 py-2"/></label>
        ) : (
          <label className="text-sm font-medium">HTML content<textarea name="content_html" className="w-full min-h-[200px] rounded-md border px-3 py-2"/></label>
        )}
        <div>
          <button className="rounded-md bg-brand text-white px-4 py-2">Save</button>
        </div>
      </form>
    </section>
  );
}
