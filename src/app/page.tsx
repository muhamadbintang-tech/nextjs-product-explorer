'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Product } from '@/types/product';
import { getProducts } from '@/lib/api';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/products/ProductCard';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Membaca Nilai Awal dari URL Query Parameter
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'default';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialFavOnly = searchParams.get('favorites') === 'true';

  // State Kontrol Filter
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(initialFavOnly);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const ITEMS_PER_PAGE = 8; // Jumlah produk per halaman

  // 1. Debounce Input Pencarian (300ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch Data Produk dari API
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await getProducts();
        
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);

        const cats = Array.from(new Set(productList.map((p: Product) => p.category)));
        setCategories(cats as string[]);
      } catch (err) {
        console.error('Gagal mengambil data produk:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // 3. Membaca LocalStorage Favorit secara Real-Time
  useEffect(() => {
    const updateFavs = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('abinshop_favorites') || '[]');
        setFavoriteIds(favs);
      } catch (e) {
        console.error('Gagal membaca favorit:', e);
      }
    };

    updateFavs();

    window.addEventListener('storage', updateFavs);
    window.addEventListener('favoritesUpdated', updateFavs);

    return () => {
      window.removeEventListener('storage', updateFavs);
      window.removeEventListener('favoritesUpdated', updateFavs);
    };
  }, []);

  // 4. Sinkronisasi State Filter ke URL Query Parameters
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy && sortBy !== 'default') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (showFavoritesOnly) params.set('favorites', 'true');

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, selectedCategory, sortBy, currentPage, showFavoritesOnly, pathname, router]);

  // Reset ke halaman 1 jika ada perubahan filter/pencarian
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, showFavoritesOnly]);

  // 5. Logika Filter & Sorting
  const processedProducts = useMemo(() => {
    let result = [...products];

    if (showFavoritesOnly) {
      result = result.filter((p) => favoriteIds.includes(p.id));
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (debouncedSearch.trim() !== '') {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, debouncedSearch, sortBy, showFavoritesOnly, favoriteIds]);

  // 6. Logika Pagination
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  // Fungsi Reset Filter
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    setShowFavoritesOnly(false);
  };

  // 🚀 Fungsi Perpindahan Halaman + Auto Scroll Smooth ke Atas
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Banner Judul */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full inline-block mb-3">
          Katalog Abinshop
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Eksplorasi Produk Pilihan
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Temukan berbagai produk berkualitas dari DummyJSON API dengan informasi lengkap dan harga terjangkau.
        </p>
      </div>

      {/* Control Panel (Pencarian, Filter, Sorting, Favorit) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari produk, merek, atau kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer capitalize"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="default">Urutkan: Default</option>
            <option value="price-asc">Harga: Terendah → Tertinggi</option>
            <option value="price-desc">Harga: Tertinggi → Terendah</option>
            <option value="rating-desc">Rating: Tertinggi ★</option>
          </select>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              showFavoritesOnly
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{showFavoritesOnly ? '❤️' : '♡'}</span>
            <span>{showFavoritesOnly ? 'Semua Produk' : 'Favorit Saya'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Menampilkan <strong className="text-slate-900 font-bold">{processedProducts.length}</strong> produk
            {showFavoritesOnly && <span className="text-rose-500 ml-1 font-semibold">(Filter Favorit)</span>}
          </div>
          {(debouncedSearch || selectedCategory !== 'all' || sortBy !== 'default' || showFavoritesOnly) && (
            <button
              onClick={handleResetFilters}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Render Kondisional */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => window.location.reload()} />
      ) : paginatedProducts.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Kontrol Pagination dengan Auto-Scroll ke Atas */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Header />
      <Suspense fallback={<LoadingSkeleton />}>
        <CatalogContent />
      </Suspense>
      <Footer />
    </div>
  );
}