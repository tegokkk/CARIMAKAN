import MotionSection from "../common/MotionSection";
import SkeletonCard from "../common/SkeletonCard";
import FoodCard from "./FoodCard";

function FoodGrid({ menus, loading, onAddToCart, emptyTitle = "Menu belum tersedia" }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!menus.length) {
    return (
      <div className="overflow-hidden rounded-[1.15rem] border border-orange-100 bg-white p-10 text-center shadow-sm">
        <p className="text-xl font-black text-slate-900">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-slate-500">
          Menu akan tampil di sini setelah data tersedia. Kamu tetap bisa memakai pencarian untuk mengecek katalog.
        </p>
      </div>
    );
  }

  return (
    <MotionSection className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerSelector=".food-grid-card">
      {menus.map((menu) => (
        <FoodCard key={menu.id} menu={menu} onAddToCart={onAddToCart} className="food-grid-card" />
      ))}
    </MotionSection>
  );
}

export default FoodGrid;
