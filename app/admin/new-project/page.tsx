import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";

export default function NewProject() {
  const isEditor = cookies().get("tsn_editor")?.value === "1";
  if (!isEditor) {
    return (
      <div>
        <Header />
        <main className="container-page py-10">
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <h1 className="text-2xl font-semibold mb-2">Editor access required</h1>
            <p>Press <kbd className="px-1 py-0.5 border">Ctrl</kbd> + <kbd className="px-1 py-0.5 border">Shift</kbd> + <kbd className="px-1 py-0.5 border">E</kbd> to enter Editor mode.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  async function submit(form: FormData) {
    "use server";
    // handled on client side? For app router server action, but we can't inside a server component easily.
  }
  return (
    <div>
      <Header />
      <main className="container-page py-10">
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-semibold mb-4">New Project Builder</h1>
          <ProjectForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProjectForm() {
  async function submit(form: FormData) {
    const res = await fetch('/api/projects', { method: 'POST', body: form });
    if (res.ok) location.href = '/';
    else alert('Failed to create project');
  }
  return (
    <form action={submit} className="grid gap-3">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm font-medium">Title<input name="title" required className="w-full rounded-md border px-3 py-2"/></label>
        <label className="text-sm font-medium">Slug<input name="slug" required className="w-full rounded-md border px-3 py-2"/></label>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm font-medium">Cover background<input name="cover_bg" defaultValue="#0b122b" className="w-full rounded-md border px-3 py-2"/></label>
        <label className="text-sm font-medium">Cover image<input type="file" name="cover_img" accept="image/*" className="w-full rounded-md border px-3 py-2"/></label>
      </div>
      <label className="text-sm font-medium">Status
        <select name="status" className="w-full rounded-md border px-3 py-2">
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="coming_soon">coming_soon</option>
        </select>
      </label>
      <button className="rounded-md bg-brand text-white px-4 py-2">Publish</button>
    </form>
  );
}
