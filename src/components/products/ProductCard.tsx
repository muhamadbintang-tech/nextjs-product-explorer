'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const mainImage = product.thumbnail || (product.images && product.images[0]) || '/placeholder.png';

  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 flex flex-col justify-between w-full max-w-full">
      <div>
        {/* Frame Gambar Responsive */}
        <div className="relative w-full h-44 sm:h-52 bg-slate-50/80 rounded-xl overflow-hidden mb-3 sm:mb-4 flex items-center justify-center border border-slate-100">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Heart Wishlist Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-xs sm:text-sm text-slate-400 hover:text-rose-500 transition-colors shadow-sm border border-slate-100"
            title="Suka produk ini"
          >
            {isLiked ? '❤️' : '♡'}
          </button>

          {/* Badge Kategori */}
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded-md shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Brand & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider truncate">
            {product.brand || 'Abinshop'}
          </span>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold shrink-0">
            <span>★</span>
            <span className="text-slate-700">{product.rating}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1 tracking-tight">
          {product.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed font-normal">
          {product.description}
        </p>
      </div>

      {/* Footer Card */}
      <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[8px] sm:text-[9px] uppercase text-slate-400 tracking-wider block font-semibold">Harga</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate block">
            ${product.price.toLocaleString()}
          </span>
        </div>
        <Link
          href={`/product/${product.id}`}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 hover:bg-indigo-600 text-white text-[11px] sm:text-xs font-semibold rounded-xl transition-all active:scale-95 shadow-sm shrink-0"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}