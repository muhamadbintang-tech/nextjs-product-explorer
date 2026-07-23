interface ProductFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
}

export default function ProductFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}: ProductFilterProps) {
  return (
    <div id="katalog" className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama produk, brand, atau kata kunci..."
          className="w-full pl-10 pr-8 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dynamic Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap capitalize ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}