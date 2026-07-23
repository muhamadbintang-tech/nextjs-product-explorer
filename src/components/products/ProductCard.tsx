'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Cek status favorit dari LocalStorage & dengarkan perubahan Real-Time
  useEffect(() => {
    const checkFavorite = () => {
      try {
        const favorites: number[] = JSON.parse(localStorage.getItem('abinshop_favorites') || '[]');
        setIsFavorite(favorites.includes(product.id));
      } catch (error) {
        console.error('Gagal membaca favorit dari LocalStorage:', error);
      }
    };

    checkFavorite();
    window.addEventListener('favoritesUpdated', checkFavorite);
    window.addEventListener('storage', checkFavorite);

    return () => {
      window.removeEventListener('favoritesUpdated', checkFavorite);
      window.removeEventListener('storage', checkFavorite);
    };
  }, [product.id]);

  // Fungsi Toggle Favorit
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const favorites: number[] = JSON.parse(localStorage.getItem('abinshop_favorites') || '[]');
      let updatedFavorites: number[];

      if (favorites.includes(product.id)) {
        updatedFavorites = favorites.filter((id) => id !== product.id);
      } else {
        updatedFavorites = [...favorites, product.id];
      }

      // 1. Simpan ke LocalStorage
      localStorage.setItem('abinshop_favorites', JSON.stringify(updatedFavorites));

      // 2. Trigger Custom Event agar halaman utama langsung reaktif secara Real-Time!
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error('Gagal memperbarui favorit di LocalStorage:', error);
    }
  };

  const mainImage = product.thumbnail || (product.images && product.images[0]) || '/placeholder.png';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group relative">
      {/* Tombol Favorit */}
      <button
        onClick={toggleFavorite}
        type="button"
        title={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center text-slate-400 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
      >
        <span className={`text-base transition-colors ${isFavorite ? 'text-rose-500 scale-110' : 'text-slate-400'}`}>
          {isFavorite ? '❤️' : '♡'}
        </span>
      </button>

      <Link href={`/product/${product.id}`} className="p-5 flex-1 flex flex-col">
        <div className="w-full h-48 bg-slate-50/80 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-4">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
            <span>★</span>
            <span className="text-slate-700">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Harga</span>
            <span className="text-base font-extrabold text-slate-900">${product.price.toLocaleString()}</span>
          </div>
          <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
            Detail →
          </span>
        </div>
      </Link>
    </div>
  );
}