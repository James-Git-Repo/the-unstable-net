import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/src/lib/supabaseClient";

async function getProjects() {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .in("status", ["published", "coming_soon"])
    .order("created_at", { ascending: true });
  return data || [];
}

export default async function Home() {
  const projects = await getProjects();
  return (
    <div>
      <Header />
      <main className="container-page py-10">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold">The (un)Stable Net</h1>
          <p className="mt-3 text-lg text-slate-600">A blog about Business, Tech, AI & Content</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm">Business</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm">Tech</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm">AI</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm">Content</span>
          </div>
          <div className="mt-6 rounded-2xl bg-white shadow-soft p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">European Market Movers</div>
              <div className="text-slate-600 text-sm">A weekly, PM-style wrap of European markets: what moved, why it mattered, and what's next.</div>
            </div>
            <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" required placeholder="info@example.com" className="rounded-md border px-3 py-2 w-64" />
              <button className="rounded-md bg-brand text-white px-4 py-2">Subscribe</button>
            </form>
          </div>
        </div>

        <section id="projects" className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {projects.map(p => (
              <ProjectCard key={p.id} title={p.title} slug={p.slug} coverImgUrl={p.cover_img_url} coverBg={p.cover_bg} status={p.status} />
            ))}
            {/* Always render a 'coming soon' card */}
            <ProjectCard title="New projects coming soon..." slug="new" status="coming_soon" />
          </div>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
}
