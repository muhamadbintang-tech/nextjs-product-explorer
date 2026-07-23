import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand ABINSHOP */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md group-hover:bg-indigo-600 transition-colors">
            A
          </span>
          <div className="flex flex-col">
            <span className="tracking-wider text-sm sm:text-base font-extrabold text-slate-900 leading-none">ABINSHOP</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 tracking-widest uppercase font-semibold">Product Explorer</span>
          </div>
        </Link>

        {/* Tag Kanan (Hanya muncul di layar Tablet/Desktop sm:) */}
        <div className="hidden sm:inline-flex text-[10px] font-semibold tracking-widest text-slate-500 uppercase border border-slate-200 px-3.5 py-1.5 rounded-full bg-slate-50">
          Official Catalog
        </div>
      </div>
    </header>
  );
}