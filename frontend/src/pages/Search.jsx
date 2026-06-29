import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaFilter, FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import menuService from "../services/menu.service";
import { AuthContext } from "../context/AuthContextValue";
import { CartContext } from "../context/CartContextValue";
import PageWrapper from "../components/common/PageWrapper";
import FoodGrid from "../components/food/FoodGrid";
import { gsap, useGSAP } from "../animations/gsapConfig";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("recommended");
  const [filterOpen, setFilterOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchedMenus = await menuService.getAllMenus({
          search: searchParams.get("q") || "",
          limit: 32,
        });
        setMenus(Array.isArray(fetchedMenus) ? fetchedMenus : []);
      } catch (fetchError) {
        console.error("Error fetching menus:", fetchError);
        setError("Menu belum bisa dimuat. Coba ulangi beberapa saat lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [searchParams]);

  useGSAP(
    () => {
      if (loading) return;
      gsap.fromTo(
        ".search-animate",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.58, stagger: 0.08, ease: "power3.out" }
      );
    },
    { scope: pageRef, dependencies: [loading, menus.length, error] }
  );

  const categories = useMemo(() => {
    const values = menus.map((menu) => menu.category_name).filter(Boolean);
    return ["Semua", ...new Set(values)];
  }, [menus]);

  const visibleMenus = useMemo(() => {
    const filtered =
      activeCategory === "Semua"
        ? [...menus]
        : menus.filter((menu) => menu.category_name === activeCategory);

    return filtered.sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
      return Number(b.is_recommended || 0) - Number(a.is_recommended || 0);
    });
  }, [activeCategory, menus, sortBy]);

  const handleSearch = (event) => {
    event.preventDefault();
    const keyword = searchTerm.trim();
    setActiveCategory("Semua");
    if (keyword) setSearchParams({ q: keyword });
    else setSearchParams({});
  };

  const handleAddToCart = async (menu, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      toast.error("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    try {
      await addToCart(menu.id, 1);
      toast.success(`${menu.name} ditambahkan.`);
    } catch (cartError) {
      toast.error(cartError.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("Semua");
    setSortBy("recommended");
    setSearchParams({});
  };

  return (
    <PageWrapper className="ambient-warm min-h-screen pb-40 pt-28 md:pb-20 md:pt-32">
      <div ref={pageRef} className="section-shell">
        <section className="search-animate mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-black uppercase text-orange-600">Eksplorasi menu</p>
          <h1 className="text-5xl font-black leading-tight text-slate-950 md:text-6xl">
            Cari menu yang pas untuk hari ini.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Gunakan pencarian, kategori, dan urutan harga untuk menemukan makanan yang paling cocok tanpa berpindah halaman.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-9 flex max-w-3xl flex-col gap-3 rounded-[1.15rem] border border-orange-100 bg-white/90 p-2 shadow-2xl shadow-orange-950/10 backdrop-blur sm:flex-row"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari nasi goreng, ayam geprek, kopi susu"
                className="h-14 w-full rounded-xl border-0 bg-transparent pl-12 pr-4 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:shadow-none"
              />
            </div>
            <button type="submit" className="btn-primary h-14 px-8">
              Cari Menu
            </button>
          </form>
        </section>

        <section className="search-animate mt-14 grid gap-5 lg:grid-cols-[18rem_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[1.15rem] border border-orange-100 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white">
                  <FaSlidersH />
                </span>
                <div>
                  <h2 className="font-black text-slate-950">Filter</h2>
                  <p className="text-sm font-semibold text-slate-500">{visibleMenus.length} menu tampil</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-black text-slate-700">Kategori</label>
                  <div className="grid gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                          activeCategory === category
                            ? "bg-slate-950 text-white"
                            : "bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-black text-slate-700">Urutkan</label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 font-bold text-slate-700"
                  >
                    <option value="recommended">Rekomendasi</option>
                    <option value="rating">Rating tertinggi</option>
                    <option value="price-low">Harga terendah</option>
                    <option value="price-high">Harga tertinggi</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-3 rounded-[1.15rem] border border-orange-100 bg-white/90 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {searchParams.get("q") ? (
                    <>Hasil untuk "{searchParams.get("q")}"</>
                  ) : (
                    "Semua menu"
                  )}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {visibleMenus.length} dari {menus.length} menu tersedia
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFilterOpen((value) => !value)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-black text-white lg:hidden"
              >
                {filterOpen ? <FaTimes /> : <FaFilter />}
                Filter
              </button>
            </div>

            {filterOpen && (
              <div className="search-animate mb-6 rounded-[1.15rem] border border-orange-100 bg-white p-4 shadow-sm lg:hidden">
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1" data-lenis-prevent>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${
                        activeCategory === category ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 font-bold text-slate-700"
                >
                  <option value="recommended">Rekomendasi</option>
                  <option value="rating">Rating tertinggi</option>
                  <option value="price-low">Harga terendah</option>
                  <option value="price-high">Harga tertinggi</option>
                </select>
              </div>
            )}

            {error ? (
              <div className="search-animate rounded-[1.15rem] border border-red-100 bg-white p-10 text-center shadow-sm">
                <h3 className="text-2xl font-black text-slate-950">Data belum tersedia</h3>
                <p className="mx-auto mt-3 max-w-md text-slate-500">{error}</p>
                <button onClick={resetFilters} className="mt-7 rounded-xl bg-slate-950 px-6 py-3 font-black text-white">
                  Muat ulang katalog
                </button>
              </div>
            ) : (
              <FoodGrid
                menus={visibleMenus}
                loading={loading}
                onAddToCart={handleAddToCart}
                emptyTitle="Menu tidak ditemukan"
              />
            )}
          </div>
        </section>
      </div>

      {!loading && !error && (
        <div className="sticky-mobile-filter rounded-[1.15rem] p-3 lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFilterOpen((value) => !value)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-black text-white active:scale-95"
            >
              {filterOpen ? <FaTimes /> : <FaFilter />}
              Filter
            </button>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-full border border-orange-100 bg-white px-4 text-sm font-black text-slate-700"
            >
              <option value="recommended">Rekomendasi</option>
              <option value="rating">Rating tertinggi</option>
              <option value="price-low">Harga terendah</option>
              <option value="price-high">Harga tertinggi</option>
            </select>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" data-lenis-prevent>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition active:scale-95 ${
                  activeCategory === category
                    ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                    : "bg-white text-slate-700 ring-1 ring-orange-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default Search;
