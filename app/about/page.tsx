import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/src/lib/supabaseClient";
import { sanitize } from "@/src/lib/sanitize";
import { cookies } from "next/headers";

async function getAbout() {
  const { data } = await supabase.from("about").select("*").order("updated_at", { ascending: false }).limit(1).single();
  return data;
}

export default async function About() {
  const a = await getAbout();
  const isEditor = cookies().get("tsn_editor")?.value === "1";

  return (
    <div>
      <Header />
      <main className="container-page py-10">
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <aside className="rounded-2xl bg-white p-4 shadow-soft">
            <div className="h-48 bg-slate-800 rounded-xl grid place-items-center text-white">Your Photo</div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <div className="font-semibold">Contacts</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Instagram</li>
                <li>LinkedIn</li>
                <li>GitHub</li>
                <li>X</li>
                <li>Others</li>
              </ul>
            </div>
          </aside>
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <h1 className="text-2xl font-semibold mb-2">About The (un)Stable Net&apos;s founder</h1>
            <p className="text-slate-600 mb-4">I turn market noise into crisp briefs and ship small, useful AI products for SMEs and teams.</p>
            {isEditor ? <AboutEditor existingHtml={a?.body_html || ''} /> : <div dangerouslySetInnerHTML={{ __html: sanitize(a?.body_html || '') }} />}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AboutEditor({ existingHtml }: { existingHtml: string }) {
  async function submit(form: FormData) {
    const res = await fetch('/api/about', { method: 'POST', body: form });
    if (res.ok) location.reload();
  }
  return (
    <form action={submit} className="grid gap-3">
      <label className="text-sm font-medium">Content (HTML or plain text)<textarea name="body" defaultValue={existingHtml} className="w-full min-h-[220px] rounded-md border px-3 py-2"/></label>
      <button className="rounded-md bg-brand text-white px-4 py-2">Save</button>
    </form>
  );
}
