'use client';

import { useEffect, useState, use } from 'react';
import { Product } from '@/types/product';
import { getProductById } from '@/lib/api';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      if (isNaN(productId)) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = await getProductById(productId);

      if (!data) {
        setIsNotFound(true);
      } else {
        setProduct(data);
      }
      setIsLoading(false);
    }
    fetchDetail();
  }, [productId]);

  const mainImage = product?.thumbnail || (product?.images && product?.images[0]) || '/placeholder.png';

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          ← Kembali ke Katalog Abinshop
        </Link>

        {isLoading ? (
          /* Loading Spinner Clean di Tengah */
          <LoadingSkeleton />
        ) : isNotFound || !product ? (
          /* Tampilan Jika Produk Tidak Ditemukan */
          <div className="bg-white p-10 rounded-2xl border border-slate-200/80 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Maaf, produk dengan ID tersebut tidak tersedia di katalog Abinshop.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Kembali ke Katalog Utama
            </Link>
          </div>
        ) : (
          /* Render Detail Produk Clean White */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm animate-in fade-in duration-300">
            {/* Display Frame Gambar Produk */}
            <div className="relative w-full h-[420px] bg-slate-50/80 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-6">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Display Detail Informasi */}
            <div className="flex flex-col justify-between h-full py-2">
              <div>
                {/* Badge Kategori & Merek */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      • Merek: <strong className="text-slate-800 font-bold">{product.brand}</strong>
                    </span>
                  )}
                </div>

                {/* Judul Produk */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
                  {product.title}
                </h1>

                {/* Rating & Stok */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <span>★</span>
                    <span className="text-slate-700">{product.rating}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {product.stock > 0 ? `Stok Tersedia (${product.stock} pcs)` : 'Stok Habis'}
                  </span>
                </div>

                {/* Harga */}
                <div className="py-5 border-y border-slate-100 my-6">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider block mb-1">
                    Harga Resmi
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    ${product.price.toLocaleString()}
                  </span>
                </div>

                {/* Deskripsi */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Deskripsi Produk
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Tombol Beli */}
              <button className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95">
                Beli Produk
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}