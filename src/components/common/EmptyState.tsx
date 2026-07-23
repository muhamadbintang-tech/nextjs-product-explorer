interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center max-w-md mx-auto my-6 shadow-sm">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
        🔍
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">
        Produk Tidak Ditemukan
      </h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        Tidak ada produk yang sesuai dengan nama, kata kunci, atau filter kategori yang kamu pilih.
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
      >
        Reset Filter & Pencarian
      </button>
    </div>
  );
}