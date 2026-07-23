'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              Temukan pilihan produk terbaik, penawaran menarik, dan katalog terlengkap hanya di Abinshop.
            </p>
          </div>
        </section>

        {/* Main Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          {/* 1. SEBELUM PRODUK MUNCUL: Tampilkan hanya Loading Page di tengah */}
          {isLoading && <LoadingSkeleton />}

          {/* 2. JIKA TERJADI ERROR */}
          {!isLoading && isError && <ErrorState onRetry={loadData} />}

          {/* 3. SETELAH LOADING SELESAI: Tampilkan Bar Kontrol & Produk */}
          {!isLoading && !isError && (
            <>
              {/* Bar Kontrol Pencarian & Kategori */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-sm animate-in fade-in duration-300">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk, merek, atau kata kunci..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
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

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Menampilkan <span className="font-bold text-slate-900">{filteredProducts.length}</span> produk
                  </div>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all active:scale-95"
                    >
                      <span>
                        Kategori: <strong className="font-bold text-slate-900 capitalize">{selectedCategory === 'All' ? 'Semua' : selectedCategory}</strong>
                      </span>
                      <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {isCategoryOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-30 p-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsCategoryOpen(false);
                            }}
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
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Produk */}
              {filteredProducts.length === 0 ? (
                <EmptyState
                  onReset={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 w-full animate-in fade-in duration-300">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}