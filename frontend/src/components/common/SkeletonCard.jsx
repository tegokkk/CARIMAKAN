// Skeleton card untuk loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
      <div className="skeleton h-48 w-full rounded-2xl mb-4" />
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-2/3 mb-5" />
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}

export default SkeletonCard;
