import { supabase } from "@/src/lib/supabaseClient";

async function getPolicies() {
  const { data } = await supabase
    .from("policies")
    .select("*")
    .order("updated_at", { ascending: false });
  const latest: Record<string, string> = {};
  data?.forEach(p => { if (!latest[p.type]) latest[p.type] = p.file_url as string; });
  return latest;
}

export default async function Footer({ variant = "default" }: { variant?: "default" | "home" | "dark"; }) {
  const latest = await getPolicies();
  const isDark = variant === "dark";
  return (
    <footer className={`${isDark ? 'bg-slate-900 text-white' : ''} border-t mt-12`}>
      <div className="container-page py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {variant === "home" ? (
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-brand">
              <span aria-hidden>🔗</span>
              <span aria-hidden>✉️</span>
              <span aria-hidden>🐙</span>
              <span aria-hidden>𝕏</span>
            </div>
            <div className="text-sm max-w-md">
              <strong>About</strong>
              <p>I'm a Swiss–Italian analyst & builder focused on fintech & AI. With a curious and delivery-oriented mindset, I'm always down for a new challenge.</p>
            </div>
          </div>
        ) : <div />}
        <div className="text-sm">
          © 2025 The (un)Stable Net
          {" • "}
          <a href={latest["privacy"] || "#"} target="_blank" className="underline">Privacy Policy (PDF)</a>
          {" • "}
          <a href={latest["terms"] || "#"} target="_blank" className="underline">Terms & Conditions (PDF)</a>
        </div>
      </div>
    </footer>
  );
}
