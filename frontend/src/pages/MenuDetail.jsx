import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaFire,
  FaHeart,
  FaLock,
  FaMapMarkerAlt,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaShoppingBag,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import menuService from "../services/menu.service";
import reviewService from "../services/review.service";
import favoriteService from "../services/favorite.service";
import { AuthContext } from "../context/AuthContextValue";
import { CartContext } from "../context/CartContextValue";
import PageWrapper from "../components/common/PageWrapper";
import { formatCurrency } from "../utils/formatCurrency";
import { getImageUrl } from "../utils/getImageUrl";
import { gsap, ScrollTrigger, useGSAP } from "../animations/gsapConfig";

function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [menu, setMenu] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isAddingFav, setIsAddingFav] = useState(false);
  const detailRef = useRef(null);
  const heroImageRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuRes, reviewRes] = await Promise.all([
          menuService.getMenuById(id),
          reviewService.getReviewsByMenu(id),
        ]);
        setMenu(menuRes);
        setReviews(reviewRes.data || []);
      } catch (detailError) {
        console.error("Error fetching menu detail:", detailError);
        toast.error("Menu tidak ditemukan");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useGSAP(
    () => {
      if (loading || !menu) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".detail-image", { opacity: 0, scale: 0.9, duration: 0.74 })
        .from(".detail-copy > *", { opacity: 0, y: 22, duration: 0.54, stagger: 0.07 }, "-=0.38")
        .from(".review-card", { opacity: 0, y: 18, duration: 0.48, stagger: 0.06 }, "-=0.18");

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && heroImageRef.current) {
        gsap.fromTo(
          heroImageRef.current,
          { yPercent: -3, scale: 1.04 },
          {
            yPercent: 7,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: ".detail-image",
              start: "top 30%",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }

      return () => ScrollTrigger.refresh();
    },
    { scope: detailRef, dependencies: [loading, menu?.id, reviews.length] }
  );

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(menu.id, quantity);
      toast.success(`${menu.name} ditambahkan ke keranjang.`);
    } catch (cartError) {
      toast.error(cartError.response?.data?.message || "Gagal menambah ke keranjang");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddFavorite = async () => {
    if (!user) {
      toast.error("Silakan login untuk menyimpan favorit.");
      navigate("/login");
      return;
    }

    setIsAddingFav(true);
    try {
      await favoriteService.addFavorite(menu.id);
      toast.success(`${menu.name} ditambahkan ke favorit.`);
    } catch (favoriteError) {
      toast.error(favoriteError.response?.data?.message || "Gagal menambahkan ke favorit");
    } finally {
      setIsAddingFav(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error("Silakan login untuk memberikan ulasan.");
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview(menu.id, reviewForm);
      toast.success("Ulasan berhasil dikirim.");
      const reviewRes = await reviewService.getReviewsByMenu(id);
      setReviews(reviewRes.data || []);
      setReviewForm({ rating: 5, comment: "" });
    } catch (reviewError) {
      toast.error(reviewError.response?.data?.message || "Gagal mengirim ulasan");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper className="ambient-warm flex min-h-screen items-center justify-center pt-24">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
          <p className="mt-5 font-black text-slate-500">Memuat detail menu...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!menu) return null;

  return (
    <PageWrapper className="ambient-warm min-h-screen pb-20 pt-28 md:pt-32">
      <div ref={detailRef} className="section-shell">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-white/90 px-5 py-3 font-black text-slate-700 shadow-sm transition hover:bg-orange-50 hover:text-orange-600"
        >
          <FaArrowLeft />
          Kembali
        </button>

        <section className="overflow-hidden rounded-[1.15rem] border border-orange-100 bg-white shadow-2xl shadow-orange-950/10">
          <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
            <div className="detail-image relative min-h-[24rem] overflow-hidden bg-slate-100 lg:min-h-[42rem]">
              {menu.image ? (
                <img
                  ref={heroImageRef}
                  src={getImageUrl(menu.image, 1200)}
                  alt={menu.name}
                  className="detail-parallax-media h-full w-full object-cover will-change-transform"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#fff7ed,#ecfdf5)] text-2xl font-black text-orange-600">
                  CariMakan
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/5 to-transparent" />
              {menu.is_recommended === 1 && (
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                  <FaFire />
                  Spesial
                </div>
              )}
            </div>

            <div className="detail-copy flex flex-col justify-center p-7 md:p-10 lg:p-12">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-black uppercase text-orange-700">
                  {menu.category_name || "Kategori"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700">
                  <FaStar className="text-amber-400" />
                  {Number(menu.rating) > 0 ? menu.rating : "Baru"}
                </span>
                <button
                  onClick={handleAddFavorite}
                  disabled={isAddingFav}
                  className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-500 hover:text-white disabled:opacity-60"
                  title="Tambah ke favorit"
                >
                  <FaHeart />
                </button>
              </div>

              <h1 className="mt-7 text-4xl font-black leading-tight text-slate-950 md:text-6xl">
                {menu.name}
              </h1>

              <div className="mt-5 flex items-center gap-2 text-slate-500">
                <FaMapMarkerAlt className="text-orange-500" />
                <p className="font-semibold">
                  dari <span className="font-black text-slate-800">{menu.restaurant_name || "Restoran"}</span>
                </p>
              </div>

              <p className="mt-7 text-lg leading-8 text-slate-600">
                {menu.description || "Menu pilihan CariMakan dengan rasa yang siap jadi favorit baru."}
              </p>

              <div className="mt-10 rounded-[1rem] border border-orange-100 bg-orange-50/70 p-5">
                <p className="text-sm font-black uppercase text-orange-700">Harga menu</p>
                <p className="mt-1 text-4xl font-black text-orange-600">{formatCurrency(menu.price)}</p>
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <div className="quantity-stepper sm:w-44">
                  <button
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="qty-button h-12 w-12"
                    type="button"
                  >
                    <FaMinus />
                  </button>
                  <span className="min-w-9 text-center font-black text-slate-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity((current) => current + 1)}
                    className="qty-button h-12 w-12"
                    type="button"
                  >
                    <FaPlus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="btn-primary flex min-h-14 flex-1 items-center justify-center gap-3 text-lg disabled:opacity-70"
                >
                  <FaShoppingBag />
                  {addingToCart ? "Memproses..." : "Tambah ke Keranjang"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="review-card rounded-[1.15rem] border border-orange-100 bg-white p-7 shadow-sm md:p-8">
            {user ? (
              <>
                <h2 className="text-2xl font-black text-slate-950">Beri ulasan</h2>
                <p className="mt-2 leading-7 text-slate-500">Bagikan pengalamanmu agar pengguna lain bisa memilih lebih cepat.</p>

                <form onSubmit={handleReviewSubmit} className="mt-6">
                  <div className="mb-5 rounded-xl bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-black text-slate-700">Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="text-2xl text-amber-400 transition hover:scale-110"
                        >
                          {reviewForm.rating >= star ? <FaStar /> : <FaRegStar />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={reviewForm.comment}
                    onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
                    placeholder="Tulis ulasan singkat..."
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-orange-100 bg-white px-5 py-4 text-slate-700"
                  />

                  <button type="submit" disabled={submittingReview} className="btn-primary mt-5 w-full py-4 disabled:opacity-70">
                    {submittingReview ? "Mengirim..." : "Kirim Ulasan"}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-500">
                  <FaLock />
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-950">Masuk untuk memberi ulasan</h2>
                <p className="mt-3 max-w-sm leading-7 text-slate-500">Ulasan hanya bisa dikirim oleh pengguna yang sudah login.</p>
                <button onClick={() => navigate("/login")} className="btn-primary mt-7 px-7 py-3">
                  Masuk Sekarang
                </button>
              </div>
            )}
          </div>

          <div className="review-card rounded-[1.15rem] border border-orange-100 bg-white p-7 shadow-sm md:p-8">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Ulasan pelanggan</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{reviews.length} ulasan terkumpul</p>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                {Number(menu.rating || 0).toFixed(1)}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="grid min-h-72 place-items-center rounded-xl bg-slate-50 p-8 text-center">
                <div>
                  <FaRegStar className="mx-auto text-5xl text-slate-300" />
                  <h3 className="mt-5 text-xl font-black text-slate-800">Belum ada ulasan</h3>
                  <p className="mt-2 text-slate-500">Jadilah yang pertama membagikan pengalaman.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={review.id || index} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-orange-100 font-black text-orange-700">
                        {(review.user_name || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-950">{review.user_name || "Pengguna"}</p>
                        <div className="mt-1 flex gap-1 text-sm text-amber-400">
                          {Array.from({ length: 5 }).map((_, starIndex) =>
                            starIndex < review.rating ? <FaStar key={starIndex} /> : <FaRegStar key={starIndex} className="text-slate-300" />
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="leading-7 text-slate-600">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default MenuDetail;
