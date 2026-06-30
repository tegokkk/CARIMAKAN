import SkeletonCard from "../common/SkeletonCard";
import FoodCard from "./FoodCard";

const gridClassName = "grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-5";

function FoodGrid({ menus, loading, onAddToCart, emptyTitle = "Menu belum tersedia" }) {
  if (loading) {
    return (
      <div className={gridClassName}>
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
    <section className={gridClassName}>
      {menus.map((menu) => (
        <FoodCard key={menu.id} menu={menu} onAddToCart={onAddToCart} className="food-grid-card" />
      ))}
    </section>
  );
}

export default FoodGrid;
