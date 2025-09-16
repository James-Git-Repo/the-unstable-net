import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
      <div className="h-8 w-8 grid place-items-center rounded-full bg-slate-900 text-white">TSN</div>
      <span className="sr-only">Home</span>
    </Link>
  );
}
