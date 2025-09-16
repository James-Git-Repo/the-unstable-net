import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/src/lib/supabaseClient";
import { EditorOnlyArticleForm } from "./parts";

async function getArticles() {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  return data || [];
}

export default async function Newsletter() {
  const articles = await getArticles();
  return (
    <div>
      <Header />
      <main className="container-page py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr] gap-6">
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <h1 className="text-3xl font-bold mb-2">European Market Movers</h1>
            <p className="text-slate-600">A weekly wrap of European markets: what moved, why it mattered, and what's next.</p>
          </section>
          <EditorOnlyArticleForm />
          <section className="grid gap-4 md:grid-cols-2">
            {articles.map(a => (
              <a key={a.id} href={`/newsletter/${a.slug}`} className="rounded-2xl bg-white shadow-soft border overflow-hidden focus-visible:ring-2 focus-visible:ring-brand">
                {a.cover_img_url ? <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${a.cover_img_url})` }} /> : <div className="h-40 bg-brand" />}
                <div className="p-4">
                  <div className="font-semibold text-lg">{a.title}</div>
                  <div className="text-sm text-slate-600">{a.summary}</div>
                </div>
              </a>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
