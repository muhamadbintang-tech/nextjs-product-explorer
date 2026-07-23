'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Product } from '@/types/product';
import { getProducts } from '@/lib/api';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/products/ProductCard';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getProducts();
      setProducts(res.products);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const title = p.title || '';
      const brand = p.brand || '';
      const desc = p.description || '';

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased flex flex-col justify-between w-full overflow-x-hidden">
      <div>
        <Header />

        {/* Hero Section */}
        <section className="py-8 sm:py-14 text-center border-b border-slate-200/60 bg-white px-4">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 mb-2.5">
              Katalog Abinshop
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 sm:mb-3">
              Eksplorasi Produk Pilihan
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Temukan berbagai produk berkualitas dari DummyJSON API dengan informasi lengkap dan harga terjangkau.
            </p>
          </div>
        </section>

        {/* Main Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full overflow-x-hidden">
          {/* Search Bar & Counter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-sm">
            <div className="relative w-full sm:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-xs sm:text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk, merek, kata kunci..."
                className="w-full pl-9 pr-8 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-[11px] sm:text-xs text-slate-500 font-medium self-end sm:self-center">
              Menampilkan <span className="font-bold text-slate-900">{filteredProducts.length}</span> produk
            </div>
          </div>

          {/* Fitur Kategori khusus Mobile (Horizontal Scroll Bar) */}
          <div className="block lg:hidden mb-6">
            <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <span>🏷️</span> Kategori:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'All' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout (Produk + Sidebar Desktop) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
            {/* Kolom Produk */}
            <div className="flex-1 w-full min-w-0">
              {isLoading && <LoadingSkeleton />}

              {isError && <ErrorState onRetry={loadData} />}

              {!isLoading && !isError && filteredProducts.length === 0 && (
                <EmptyState
                  onReset={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                />
              )}

              {!isLoading && !isError && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Kolom Sidebar Kategori (Hanya Desktop lg:) */}
            <aside className="hidden lg:block w-64 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm sticky top-24 shrink-0">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  🏷️ Kategori
                </h2>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-[11px] text-indigo-600 hover:underline font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5 max-h-[65vh] overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat === 'All' ? 'Semua Kategori' : cat}</span>
                    {selectedCategory === cat && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}