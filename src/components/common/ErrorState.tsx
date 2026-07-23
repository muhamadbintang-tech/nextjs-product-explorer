interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="bg-white border border-rose-200/80 rounded-2xl p-10 text-center max-w-md mx-auto my-8 shadow-sm">
      <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
        ⚠️
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">
        Gagal Memuat Data
      </h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        Terjadi kesalahan saat mengambil data produk dari server. Pastikan koneksi internet kamu terhubung dan coba lagi.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2.5 bg-slate-900 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
      >
        Coba Lagi
      </button>
    </div>
  );
}