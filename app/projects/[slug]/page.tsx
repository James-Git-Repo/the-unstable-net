import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/src/lib/supabaseClient";

async function getProject(slug: string) {
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).single();
  return data;
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = await getProject(params.slug);
  if (!p) return <div>Not found</div>;
  return (
    <div>
      <Header />
      <main className="container-page py-10">
        <div className="rounded-2xl bg-white shadow-soft border overflow-hidden">
          <div className="h-48" style={{ backgroundColor: p.cover_bg || '#0b122b', backgroundImage: p.cover_img_url ? `url(${p.cover_img_url})` : undefined, backgroundSize:'cover', backgroundPosition:'center' }} />
          <div className="p-6">
            <h1 className="text-3xl font-bold">{p.title}</h1>
            <p className="text-slate-600">Project: {p.slug}</p>
            {p.slug === "billboard" && (
              <p className="mt-4">This project has a dedicated landing page. <a className="underline" href="/billboard">Open the One Million Billboard</a>.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
