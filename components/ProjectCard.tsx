'use client';

import Link from "next/link";
import { useEditor } from "@/src/lib/editorMode";

type Props = {
  title: string;
  slug?: string;
  coverImgUrl?: string | null;
  coverBg?: string | null;
  status?: string;
};

export default function ProjectCard({ title, slug, coverImgUrl, coverBg, status }: Props) {
  const { isEditor } = useEditor();
  const isComing = status === "coming_soon";
  const clickable = !isComing || isEditor;
  const href = slug ? (isComing ? "/admin/new-project" : `/projects/${slug}`) : "#";

  return (
    <div className="group rounded-2xl bg-white shadow-soft overflow-hidden border focus-within:ring-2 focus-within:ring-brand">
      <div
        className="h-40 w-full"
        style={{ backgroundColor: coverBg || "#0b122b", backgroundImage: coverImgUrl ? `url(${coverImgUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-hidden
      />
      <div className="p-4">
        {clickable ? (
          <Link href={href} className="font-semibold text-lg hover:underline">{title}</Link>
        ) : (
          <span className="font-semibold text-lg text-slate-500">{title}</span>
        )}
        {isComing && <div className="mt-1 text-xs bg-slate-100 inline-block px-2 py-0.5 rounded">Coming up</div>}
      </div>
    </div>
  );
}
