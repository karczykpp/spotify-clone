const SectionGridSkeleton = () => {
  return (
    <div className="mb-8">
      <div className="h-8 w-48 bg-zinc-800 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-zinc-800/50 p-4 rounded-md animate-pulse"
          >
            <div className="aspect-square bg-zinc-700 mb-4 rounded-md" />
            <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-zinc-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionGridSkeleton;
