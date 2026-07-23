export default function LoadingSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-4">
          <div className="w-full h-52 bg-zinc-800/60 rounded-xl"></div>
          <div className="h-4 bg-zinc-800/60 rounded w-3/4"></div>
          <div className="h-3 bg-zinc-800/40 rounded w-1/2"></div>
          <div className="pt-2 flex justify-between items-center border-t border-zinc-800/50">
            <div className="h-5 bg-zinc-800/60 rounded w-1/3"></div>
            <div className="h-8 bg-zinc-800/60 rounded-lg w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}