import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/src/lib/supabaseClient";
import { sanitize } from "@/src/lib/sanitize";
import { cookies } from "next/headers";
import { Suspense } from "react";

async function getArticle(slug: string) {
  const { data } = await supabase.from("articles").select("*").eq("slug", slug).single();
  return data;
}

async function getComments(article_id: number) {
  const { data } = await supabase.from("comments").select("*").eq("article_id", article_id).eq("is_approved", true).order("created_at", { ascending: true });
  return data || [];
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) return <div>Not found</div>;

  const approved = await getComments(article.id);
  const isEditor = cookies().get("tsn_editor")?.value === "1";

  return (
    <div>
      <Header />
      <main className="container-page py-8">
        <article className="prose max-w-none">
          <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
          <p className="text-slate-600">{article.summary}</p>
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-soft">
            <div dangerouslySetInnerHTML={{ __html: sanitize(article.content_html || "") }} />
          </div>
        </article>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <CommentForm articleId={article.id} />
          <div className="mt-6 grid gap-3">
            {approved.map(c => (
              <div key={c.id} className="rounded-2xl bg-white p-4 shadow-soft border">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap">{c.text}</div>
              </div>
            ))}
          </div>
        </section>

        {isEditor && <Suspense><Moderation articleId={article.id} /></Suspense>}
      </main>
      <Footer />
    </div>
  );
}

function CommentForm({ articleId }: { articleId: number }) {
  async function submit(form: FormData) {
    form.set("article_id", String(articleId));
    const res = await fetch("/api/comments", { method: "POST", body: form });
    if (res.ok) alert("Thanks! Your comment awaits approval.");
    else alert("Failed to submit comment.");
  }
  return (
    <form action={submit} className="rounded-2xl bg-white p-6 shadow-soft border mt-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium">Name<input name="name" required className="w-full rounded-md border px-3 py-2"/></label>
        <label className="text-sm font-medium">Email (not shown)<input type="email" name="email" className="w-full rounded-md border px-3 py-2"/></label>
      </div>
      <label className="text-sm font-medium mt-3 block">Comment<textarea name="text" required className="w-full min-h-[120px] rounded-md border px-3 py-2" placeholder="Be respectful. No HTML allowed."/></label>
      <div className="mt-3">
        <button className="rounded-md bg-brand text-white px-4 py-2">Post comment</button>
      </div>
      <p className="text-xs text-slate-500 mt-2">Stored in Supabase if available (falls back locally).</p>
    </form>
  );
}

async function Moderation({ articleId }: { articleId: number }) {
  const { data: pending } = await supabase.from("comments").select("*").eq("article_id", articleId).eq("is_approved", false).order("created_at", { ascending: true });
  if (!pending?.length) return null;
  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold mb-2">Pending comments</h3>
      <div className="grid gap-3">
        {pending.map(p => (
          <form key={p.id} className="rounded-2xl bg-white p-4 shadow-soft border flex items-start gap-3" action={async (fd: FormData) => {
            const res = await fetch(`/api/comments/${p.id}`, { method: "PATCH", body: fd });
            if (res.ok) globalThis?.location?.reload();
          }}>
            <input type="hidden" name="article_id" value={String(articleId)} />
            <div className="flex-1">
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap">{p.text}</div>
            </div>
            <div className="flex items-center gap-2">
              <button name="action" value="approve" className="px-3 py-2 rounded-md bg-emerald-600 text-white">Approve</button>
              <button name="action" value="reject" className="px-3 py-2 rounded-md border">Reject</button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
