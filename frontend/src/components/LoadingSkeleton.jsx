const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-2/3 rounded-full bg-slate-700/80" />
            <div className="h-3 w-1/3 rounded-full bg-slate-800/90" />
            <div className="h-3 w-1/2 rounded-full bg-slate-800/80" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
