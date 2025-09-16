import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Billboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-slate-900 text-white py-20">
          <div className="container-page">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs mb-6">
              ● Million Billboard Project
            </div>
            <h1 className="text-5xl font-extrabold leading-tight">A Living, Permanent<br/>AI Video Mosaic</h1>
            <p className="mt-4 max-w-2xl text-slate-300">One board, 1,000,000 micro-slots. Anyone can claim space—for a year or forever—and publish AI-generated video stories, art, and messages.</p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="px-4 py-2 rounded-md bg-white text-slate-900 font-medium">Read the Brief</a>
              <a href="#" className="px-4 py-2 rounded-md bg-white/10 border border-white/20">Reserve a Slot</a>
            </div>
            <p className="mt-4 text-xs text-slate-400">Display options: 1-Year or Permanent</p>
          </div>
        </section>
        <section className="container-page py-10">
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-2">Project Brief</h2>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>What it is:</strong> Scalable grid; AI videos adapt to claimed area.</li>
              <li><strong>How it works:</strong> Pick coordinates, choose duration, upload video, go live.</li>
              <li><strong>Why it matters:</strong> Gallery × ad space × digital landmark.</li>
              <li><strong>Ethos:</strong> Open expression with brand-safe moderation.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer variant="dark" />
    </div>
  );
}
