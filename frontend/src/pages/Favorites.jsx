import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import favoriteService from "../services/favorite.service";
import { CartContext } from "../context/CartContextValue";
import PageWrapper from "../components/common/PageWrapper";
import SkeletonCard from "../components/common/SkeletonCard";
import FoodCard from "../components/food/FoodCard";
import { gsap, useGSAP } from "../animations/gsapConfig";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const pageRef = useRef(null);

  const getFavoriteItems = async () => {
    const response = await favoriteService.getFavorites();
    return response.data?.data || [];
  };

  useEffect(() => {
    let active = true;

    const loadFavorites = async () => {
      try {
        const items = await getFavoriteItems();
        if (active) setFavorites(items);
      } catch (error) {
        console.error("Error fetching favorites", error);
        if (active) toast.error("Gagal memuat favorit");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  useGSAP(
    () => {
      if (loading) return;
      gsap.fromTo(
        ".favorite-card",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.56, stagger: 0.07, ease: "power3.out" }
      );
    },
    { scope: pageRef, dependencies: [loading, favorites.length] }
  );

  const handleRemove = async (menu) => {
    try {
      await favoriteService.removeFavorite(menu.id);
      toast.success("Dihapus dari favorit");
      const items = await getFavoriteItems();
      setFavorites(items);
    } catch {
      toast.error("Gagal menghapus favorit");
    }
  };

  const handleAddToCart = async (menu, event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await addToCart(menu.id, 1);
      toast.success(`${menu.name} ditambahkan.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menambahkan");
    }
  };

  return (
    <PageWrapper className="ambient-warm min-h-screen pb-20 pt-28 md:pt-32">
      <div ref={pageRef} className="section-shell">
        <section className="mx-auto mb-12 max-w-4xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-500">
            <FaHeart />
          </div>
          <p className="mt-6 text-sm font-black uppercase text-orange-600">Menu favorit</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950 md:text-6xl">
            Simpan pilihan terbaikmu.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Semua menu yang kamu sukai tersimpan di sini agar lebih cepat dipilih lagi nanti.
          </p>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="favorite-card mx-auto max-w-2xl rounded-[1.15rem] border border-orange-100 bg-white p-10 text-center shadow-sm">
            <FaRegHeart className="mx-auto text-6xl text-slate-300" />
            <h2 className="mt-6 text-3xl font-black text-slate-950">Belum ada favorit</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
              Tambahkan menu dari halaman katalog agar daftar favoritmu mulai terbentuk.
            </p>
            <Link to="/search" className="btn-primary mt-8 inline-flex items-center justify-center gap-2 px-7 py-4">
              Cari Menu <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((menu) =>
              menu ? (
                <FoodCard
                  key={menu.favorite_id || menu.id}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                  onFavorite={handleRemove}
                  favoriteActive
                  className="favorite-card"
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default Favorites;
