import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";

export default function PoliciesAdmin() {
  const isEditor = cookies().get("tsn_editor")?.value === "1";
  if (!isEditor) return (
    <div>
      <Header />
      <main className="container-page py-10">
        <div className="rounded-2xl bg-white p-6 shadow-soft">Editor access required.</div>
      </main>
      <Footer />
    </div>
  );

  async function upload(form: FormData) {
    const res = await fetch('/api/policies/upload', { method: 'POST', body: form });
    if (res.ok) alert('Uploaded!');
  }

  return (
    <div>
      <Header />
      <main className="container-page py-10">
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-semibold mb-2">Policies (PDF)</h1>
          <form action={upload} className="grid gap-3">
            <label className="text-sm font-medium">Type
              <select name="type" className="w-full rounded-md border px-3 py-2">
                <option value="privacy">privacy</option>
                <option value="terms">terms</option>
              </select>
            </label>
            <label className="text-sm font-medium">PDF file<input type="file" name="file" accept="application/pdf" className="w-full rounded-md border px-3 py-2" /></label>
            <button className="rounded-md bg-brand text-white px-4 py-2">Upload</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
