function CategoryPills({ categories = [], activeCategory = "Semua", onSelect }) {
  const visibleCategories = ["Semua", ...categories.filter(Boolean).slice(0, 8)];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2" data-lenis-prevent>
      {visibleCategories.map((category) => {
        const active = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect?.(category)}
            className={`retro-press shrink-0 border-2 px-5 py-3 retro-system-copy ${
              active
                ? "border-[#281712] bg-[#281712] text-[#fff8f6]"
                : "border-[#281712] bg-white text-[#281712] shadow-[3px_3px_0_#281712] hover:bg-[#ffe9e3]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryPills;
