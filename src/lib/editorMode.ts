'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Ctx = {
  isEditor: boolean;
  setIsEditor: (v: boolean) => void;
  openGate: () => void;
};

const EditorCtx = createContext<Ctx>({
  isEditor: false,
  setIsEditor: () => {},
  openGate: () => {},
});

export function useEditor() {
  return useContext(EditorCtx);
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [isEditor, setIsEditor] = useState(false);
  const [showGate, setShowGate] = useState(false);

  // On mount, ask the server if the editor cookie is set
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/editor/status', { cache: 'no-store' });
        const j = await res.json();
        setIsEditor(!!j.ok && !!j.editor);
      } catch {}
    })();
  }, []);

  // Keybindings
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setShowGate(true);
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        fetch('/api/editor/logout', { method: 'POST' }).then(() => {
          setIsEditor(false);
        });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <EditorCtx.Provider value={{ isEditor, setIsEditor, openGate: () => setShowGate(true) }}>
      {children}
      <ModeIndicator isEditor={isEditor} />
      {showGate && <EditorGate onClose={() => setShowGate(false)} onSuccess={() => { setIsEditor(true); setShowGate(false); }} />}
    </EditorCtx.Provider>
  );
}

function ModeIndicator({ isEditor }: { isEditor: boolean }) {
  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50">
      <span className={`px-3 py-1 rounded-full shadow-soft text-sm ${isEditor ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'}`}>
        {isEditor ? 'Editor' : 'Viewer'}
      </span>
    </div>
  );
}

function EditorGate({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void; }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/editor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: pass })
    });
    const j = await res.json();
    setLoading(false);
    if (j.ok) onSuccess();
    else setError(j.error || 'Access denied');
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-2">Enter Editor mode</h3>
        <p className="text-sm text-slate-600 mb-4">Press <kbd className="px-1 py-0.5 border">Ctrl</kbd> + <kbd className="px-1 py-0.5 border">Shift</kbd> + <kbd className="px-1 py-0.5 border">E</kbd> to open this gate anytime.</p>
        <label className="block text-sm font-medium mb-1" htmlFor="pass">Passcode</label>
        <input id="pass" type="password" className="w-full rounded-md border px-3 py-2 mb-3" value={pass} onChange={e => setPass(e.target.value)} />
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <div className="flex items-center gap-2">
          <button onClick={submit} disabled={loading} className="px-3 py-2 rounded-md bg-brand text-white disabled:opacity-70">Enter</button>
          <button onClick={onClose} className="px-3 py-2 rounded-md border">Cancel</button>
        </div>
      </div>
    </div>
  );
}
