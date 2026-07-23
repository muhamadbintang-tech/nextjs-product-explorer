export default function LoadingSkeleton() {
  return (
    <div className="w-full min-h-[50vh] bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center shadow-sm my-2 transition-all">
      {/* Container Ikon Berputar di Tengah */}
      <div className="relative flex items-center justify-center mb-5">
        {/* Ring Outer Pulse (Efek Gelombang Ringan) */}
        <div className="w-14 h-14 rounded-full border-2 border-indigo-100 animate-ping absolute opacity-50"></div>
        
        {/* Icon Lingkaran Berputar (Spinner Clean) */}
        <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-slate-900 animate-spin"></div>
      </div>

      {/* Teks Loading Minimalis */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-slate-600 tracking-widest uppercase animate-pulse">
          Memuat Produk
        </span>
        <span className="text-xs font-bold text-slate-400 animate-bounce">...</span>
      </div>
    </div>
  );
}