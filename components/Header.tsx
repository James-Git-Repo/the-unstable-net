'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useEditor } from "@/src/lib/editorMode";
import { useState } from "react";

export default function Header() {
  const path = usePathname();
  const { isEditor, openGate } = useEditor();
  const [showAsk, setShowAsk] = useState(false);
  const [showContrib, setShowContrib] = useState(false);

  const onNewsletter = path?.startsWith("/newsletter");
  const onAbout = path?.startsWith("/about");
  const onBillboard = path?.startsWith("/billboard");

  return (
    <header className={`sticky top-0 z-40 bg-white/80 backdrop-blur border-b`}>
      <div className="container-page flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <Logo />
          <Link href="/" className="font-semibold">The (un)Stable Net</Link>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {!onBillboard && (
            <>
              {(!onNewsletter && !onAbout) && (
                <>
                  <Link href="/#projects" className="hover:underline">Projects</Link>
                  <Link href="/newsletter" className="hover:underline">Newsletter</Link>
                  <Link href="/about" className="hover:underline">About</Link>
                </>
              )}
              {onNewsletter && (
                <>
                  <Link href="/" className="hover:underline">Home</Link>
                  <button onClick={() => setShowContrib(true)} className="hover:underline">Contribute</button>
                </>
              )}
              {onAbout && (
                <>
                  <Link href="/" className="hover:underline">Home</Link>
                  <button onClick={() => setShowAsk(true)} className="hover:underline">Ask me a question</button>
                </>
              )}
            </>
          )}
          {onBillboard && (
            <Link href="/" className="hover:underline">Home</Link>
          )}
          <button onClick={openGate} className="ml-2 rounded-md border px-2 py-1 text-xs" title="Enter Editor (Ctrl+Shift+E)">Editor</button>
        </nav>
      </div>
      {showContrib && <ContributeModal onClose={() => setShowContrib(false)} />}
      {showAsk && <AskModal onClose={() => setShowAsk(false)} />}
    </header>
  );
}

function ContributeModal({ onClose }: { onClose: () => void; }) {
  async function submit(form: FormData) {
    const res = await fetch("/api/contributions", { method: "POST", body: form });
    if (res.ok) alert("Thanks! Submitted.");
    else alert("Something went wrong.");
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form action={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4">Contribute to the newsletter</h3>
        <div className="grid gap-3">
          <label className="text-sm font-medium">Name<input name="name" required className="w-full rounded-md border px-3 py-2"/></label>
          <label className="text-sm font-medium">Email<input type="email" name="email" required className="w-full rounded-md border px-3 py-2"/></label>
          <label className="text-sm font-medium">Message<textarea name="message" required className="w-full rounded-md border px-3 py-2 min-h-[120px]"/></label>
          <label className="text-sm font-medium">Optional file<input type="file" name="file"/></label>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="px-3 py-2 rounded-md bg-brand text-white">Submit</button>
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-md border">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function AskModal({ onClose }: { onClose: () => void; }) {
  async function submit(form: FormData) {
    const res = await fetch("/api/questions", { method: "POST", body: form });
    if (res.ok) alert("Thanks! Received your question.");
    else alert("Something went wrong.");
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form action={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4">Ask me a question</h3>
        <div className="grid gap-3">
          <label className="text-sm font-medium">Name<input name="name" required className="w-full rounded-md border px-3 py-2"/></label>
          <label className="text-sm font-medium">Email<input type="email" name="email" required className="w-full rounded-md border px-3 py-2"/></label>
          <label className="text-sm font-medium">Question<textarea name="question" required className="w-full rounded-md border px-3 py-2 min-h-[120px]"/></label>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="px-3 py-2 rounded-md bg-brand text-white">Send</button>
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-md border">Cancel</button>
        </div>
      </form>
    </div>
  );
}
