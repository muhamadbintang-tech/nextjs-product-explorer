export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-900">ABINSHOP Inc.</p>
          <p className="mt-1">Katalog Produk Resmi DummyJSON © 2026. Hak Cipta Dilindungi.</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-800 cursor-pointer">Syarat & Ketentuan</span>
          <span className="hover:text-slate-800 cursor-pointer">Privasi</span>
          <span className="hover:text-slate-800 cursor-pointer">Bantuan</span>
        </div>
      </div>
    </footer>
  );
}