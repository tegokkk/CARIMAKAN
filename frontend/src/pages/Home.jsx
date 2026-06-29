import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaExclamationTriangle,
  FaMugHot,
  FaReceipt,
  FaSearch,
  FaStar,
  FaUtensils,
} from "react-icons/fa";
import toast from "react-hot-toast";
import menuService from "../services/menu.service";
import { AuthContext } from "../context/AuthContextValue";
import { CartContext } from "../context/CartContextValue";
import PageWrapper from "../components/common/PageWrapper";
import MotionSection from "../components/common/MotionSection";
import RetroButton from "../components/common/RetroButton";
import RetroInput from "../components/common/RetroInput";
import RetroWindow from "../components/common/RetroWindow";
import CategoryPills from "../components/food/CategoryPills";
import FoodGrid from "../components/food/FoodGrid";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import { formatCurrency } from "../utils/formatCurrency";
import { getImageUrl } from "../utils/getImageUrl";
import { gsap, useGSAP } from "../animations/gsapConfig";

const fallbackRestaurants = [
  {
    name: "Dapur Senja",
    category: "Menu rumahan",
    count: 12,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Ayam.JPG",
  },
  {
    name: "Kopi & Nasi",
    category: "Kopi dan rice bowl",
    count: 9,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Es%20Kopi%20Susu%20Gula%20Aren.jpg",
  },
  {
    name: "Lokal Hangat",
    category: "Menu harian",
    count: 15,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20geprek.png",
  },
];

function Home() {
  const [menus, setMenus] = useState([]);
  const [stats, setStats] = useState({
    total_menus: 0,
    total_restaurants: 0,
    total_customers: 0,
    average_rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [menusResult, statsResult] = await Promise.allSettled([
          menuService.getAllMenus({ limit: 12 }),
          menuService.getStats(),
        ]);

        const nextMenus = menusResult.status === "fulfilled" ? menusResult.value : [];
        const nextStats = statsResult.status === "fulfilled" ? statsResult.value : {};

        setMenus(Array.isArray(nextMenus) ? nextMenus : []);
        setStats({
          total_menus: nextStats.total_menus || nextMenus.length || 0,
          total_restaurants: nextStats.total_restaurants || 0,
          total_customers: nextStats.total_customers || 0,
          average_rating: nextStats.average_rating || 0,
        });

        if (menusResult.status === "rejected") console.error("Error fetching menus:", menusResult.reason);
        if (statsResult.status === "rejected") console.error("Error fetching home stats:", statsResult.reason);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap
        .timeline({ defaults: { ease: "steps(8)", duration: 0.38 } })
        .from(".retro-boot-window", { opacity: 0, y: 18, stagger: 0.08 })
        .from(".retro-float-icon", { opacity: 0, scale: 0.8, stagger: 0.08 }, "-=0.18");
    },
    { scope: pageRef }
  );

  const categories = useMemo(() => {
    const values = menus.map((menu) => menu.category_name).filter(Boolean);
    return [...new Set(values)];
  }, [menus]);

  const filteredMenus = useMemo(() => {
    if (activeCategory === "Semua") return menus.slice(0, 8);
    return menus.filter((menu) => menu.category_name === activeCategory).slice(0, 8);
  }, [activeCategory, menus]);

  const featuredMenu = menus[0];
  const heroImage =
    featuredMenu?.image ||
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20geprek.png";

  const restaurantCards = useMemo(() => {
    const map = new Map();
    menus.forEach((menu) => {
      const name = menu.restaurant_name || "CariMakan Kitchen";
      const current = map.get(name) || {
        name,
        category: menu.category_name || "Pilihan harian",
        count: 0,
        image: menu.image || `https://picsum.photos/seed/${encodeURIComponent(name)}-food/640/480`,
      };
      current.count += 1;
      map.set(name, current);
    });

    const values = [...map.values()].slice(0, 3);
    return values.length ? values : fallbackRestaurants;
  }, [menus]);

  const metricItems = [
    { value: stats.total_menus || menus.length || "12+", label: "Menu Aktif" },
    { value: stats.total_restaurants || restaurantCards.length || "3+", label: "Restoran" },
    { value: Number(stats.average_rating || 4.8).toFixed(1), label: "Rating" },
  ];

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
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const keyword = search.trim();
    navigate(keyword ? `/search?q=${encodeURIComponent(keyword)}` : "/search");
  };

  return (
    <PageWrapper className="relative">
      <div ref={pageRef} className="section-shell relative z-10 py-12 md:py-20">
        <FaMugHot className="retro-float-icon pointer-events-none absolute left-3 top-96 hidden text-5xl text-[#281712]/30 md:block" />
        <FaUtensils className="retro-float-icon pointer-events-none absolute right-2 top-52 hidden text-6xl text-[#281712]/20 md:block" />

        <RetroWindow title="Beranda.exe" className="retro-boot-window">
          <div className="grid gap-10 p-6 md:grid-cols-[1fr_0.9fr] md:p-10 lg:p-14">
            <div className="flex flex-col justify-center">
              <p className="mb-5 retro-system-copy text-[#aa3000]">CariMakan OS / Food Discovery</p>
              <h1 className="retro-headline max-w-3xl text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.96] text-[#281712]">
                Cari rasa lokal yang pas hari ini.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#5c4037]">
                Menghubungkan kamu dengan cita rasa otentik dari dapur-dapur terbaik di sekitar. Semua terasa seperti mengoperasikan mesin pencari makanan pribadi.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <RetroButton to="/search" variant="primary" className="px-6 py-3">
                  Jelajahi Menu <FaArrowRight />
                </RetroButton>
                <RetroButton to={user ? "/cart" : "/register"} className="px-6 py-3">
                  {user ? "Lihat Keranjang" : "Daftar Gratis"}
                </RetroButton>
              </div>
            </div>

            <div className="retro-photo-frame bg-[#e0e0e0]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#281712] md:aspect-square">
                <img
                  src={getImageUrl(heroImage, 900)}
                  alt={featuredMenu?.name || "Menu pilihan CariMakan"}
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(40,23,18,0.8),transparent_52%)]" />
                <div className="absolute bottom-4 left-4 right-4 border-2 border-[#281712] bg-white p-4 shadow-[4px_4px_0_#281712]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="retro-system-copy text-[#aa3000]">Rekomendasi</span>
                    <span className="inline-flex items-center gap-1 retro-system-copy text-[#281712]">
                      <FaStar className="text-[#aa3000]" />
                      {featuredMenu?.rating || Number(stats.average_rating || 4.8).toFixed(1)}
                    </span>
                  </div>
                  <h2 className="retro-headline line-clamp-1 text-2xl text-[#281712]">
                    {featuredMenu?.name || "Menu pilihan CariMakan"}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[#5c4037]">
                    {featuredMenu?.restaurant_name || "Partner favorit hari ini"}
                  </p>
                  <p className="mt-3 text-2xl font-black text-[#aa3000]">
                    {featuredMenu ? formatCurrency(featuredMenu.price) : "Mulai dari Rp20.000"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RetroWindow>

        <RetroWindow title="Cari.menu" className="retro-boot-window mx-auto mt-10 max-w-3xl">
          <form onSubmit={handleSearch} className="retro-dither flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <label className="w-24 retro-system-copy">Cari:</label>
            <RetroInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ayam geprek, kopi susu..."
              className="flex-1"
            />
            <RetroButton type="submit" variant="primary" className="h-12 px-5">
              Go <FaSearch />
            </RetroButton>
          </form>
        </RetroWindow>

        <MotionSection className="retro-boot-window mt-12 grid gap-5 md:grid-cols-3" staggerSelector=".metric-card">
          {metricItems.map((item) => (
            <div key={item.label} className="metric-card retro-window p-5 text-center">
              <p className="retro-headline text-4xl text-[#aa3000]">{item.value}</p>
              <p className="mt-2 retro-system-copy text-[#5c4037]">{item.label}</p>
            </div>
          ))}
        </MotionSection>

        <section className="retro-boot-window mt-12 grid gap-6 md:grid-cols-3">
          {restaurantCards.map((restaurant) => (
            <RestaurantCard key={restaurant.name} {...restaurant} />
          ))}
        </section>

        <RetroWindow title="Kategori.sys" className="retro-boot-window mt-14">
          <div className="p-5 md:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="retro-system-copy text-[#aa3000]">Eksplorasi cepat</p>
                <h2 className="retro-headline mt-2 text-3xl text-[#281712] md:text-4xl">
                  Pilih kategori, lihat menu terbaik.
                </h2>
              </div>
              <RetroButton to="/search" className="px-5 py-3">
                Semua Menu <FaArrowRight />
              </RetroButton>
            </div>
            <CategoryPills categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
          </div>
        </RetroWindow>

        <RetroWindow title="Menu.populer" className="retro-boot-window mt-10">
          <div className="p-5 md:p-6">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="retro-system-copy text-[#aa3000]">Rekomendasi</p>
                <h2 className="retro-headline mt-2 text-3xl text-[#281712] md:text-4xl">
                  Menu populer dalam kartu file makanan.
                </h2>
              </div>
            </div>
            <FoodGrid menus={filteredMenus} loading={loading} onAddToCart={handleAddToCart} />
          </div>
        </RetroWindow>

        <section className="retro-boot-window mt-14 flex justify-center pb-10">
          <div className="retro-window max-w-xl p-7 text-center">
            <FaExclamationTriangle className="mx-auto mb-5 text-4xl text-[#aa3000]" />
            <p className="mx-auto max-w-md retro-system-copy text-base leading-7">
              Peringatan: rasa yang sangat adiktif ditemukan di dekat kamu.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <RetroButton to="/search" className="px-6 py-3">
                Batal
              </RetroButton>
              <RetroButton to={user ? "/search" : "/register"} variant="primary" className="px-6 py-3">
                {user ? "Mulai Pesan" : "Daftar"} <FaReceipt />
              </RetroButton>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default Home;
