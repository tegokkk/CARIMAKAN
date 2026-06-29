import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { CartContext } from "../context/CartContextValue";
import PageWrapper from "../components/common/PageWrapper";
import AnimatedEmptyState from "../components/common/AnimatedEmptyState";
import RetroButton from "../components/common/RetroButton";
import RetroWindow from "../components/common/RetroWindow";
import { formatCurrency } from "../utils/formatCurrency";
import { getImageUrl } from "../utils/getImageUrl";
import { gsap, useGSAP } from "../animations/gsapConfig";

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [loadingItems, setLoadingItems] = useState({});
  const cartRef = useRef(null);

  useGSAP(
    () => {
      if (!cart.length) return;
      gsap.fromTo(
        ".cart-item",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.56, stagger: 0.08, ease: "power3.out" }
      );
      gsap.fromTo(
        ".cart-summary",
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.62, delay: 0.12, ease: "power3.out" }
      );
    },
    { scope: cartRef, dependencies: [cart.length] }
  );

  const handleUpdateQty = async (id, currentQty, amount) => {
    const nextQty = currentQty + amount;
    if (nextQty < 1) return;

    setLoadingItems((current) => ({ ...current, [id]: true }));
    try {
      await updateQuantity(id, nextQty);
    } catch {
      toast.error("Gagal update jumlah");
    } finally {
      setLoadingItems((current) => ({ ...current, [id]: false }));
    }
  };

  const handleRemove = async (id) => {
    setLoadingItems((current) => ({ ...current, [id]: true }));
    try {
      await removeFromCart(id);
      toast.success("Item dihapus");
    } catch {
      toast.error("Gagal menghapus item");
      setLoadingItems((current) => ({ ...current, [id]: false }));
    }
  };

  if (!cart.length) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center px-4 pb-20 pt-28">
        <AnimatedEmptyState
          type="cart"
          title="Keranjang kosong"
          description="Kamu belum memilih makanan. Mulai dari katalog menu dan tambahkan pilihan favoritmu."
          className="max-w-lg"
        >
          <Link to="/search" className="btn-primary mt-8 inline-flex w-full items-center justify-center gap-2 py-4">
            Eksplorasi Menu <FaArrowRight />
          </Link>
        </AnimatedEmptyState>
      </PageWrapper>
    );
  }

  const subtotal = getCartTotal();
  const adminFee = 2000;
  const total = subtotal + adminFee;

  return (
    <PageWrapper className="min-h-screen pb-20 pt-28 md:pt-32">
      <div ref={cartRef} className="section-shell">
        <RetroWindow title="Keranjang.exe" className="mb-10">
          <div className="p-6 md:p-8">
            <p className="retro-system-copy text-[#aa3000]">Keranjang pesanan</p>
            <h1 className="retro-headline mt-3 max-w-3xl text-4xl leading-tight text-[#281712] md:text-6xl">
              Cek ulang sebelum checkout.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5c4037] md:text-lg">
              Pastikan jumlah, menu, dan ringkasan pembayaran sudah sesuai.
            </p>
          </div>
        </RetroWindow>

        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div className="space-y-5">
            {cart.map((item) => {
              const disabled = Boolean(loadingItems[item.id]);
              const price = Number(item.Menu?.price || 0);

              return (
                <div
                  key={item.id}
                  className={`cart-item retro-window grid gap-5 p-4 transition md:grid-cols-[9.5rem_1fr] md:p-5 ${
                    disabled ? "pointer-events-none opacity-55" : ""
                  }`}
                >
                  <div className="retro-photo-frame group relative aspect-[4/3] overflow-hidden bg-[#e0e0e0] p-1 md:aspect-square">
                    {item.Menu?.image ? (
                      <img
                        src={getImageUrl(item.Menu.image)}
                        alt={item.Menu.name}
                        className="h-full w-full border-2 border-[#281712] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center border-2 border-[#281712] bg-[#fff1ed] retro-system-copy text-[#aa3000]">
                        CariMakan
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col justify-between gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="retro-system-copy text-[#aa3000]">
                          {item.Menu?.restaurant_name || "Restoran"}
                        </p>
                        <h2 className="retro-headline mt-1 truncate text-2xl text-[#281712]">
                          {item.Menu?.name}
                        </h2>
                        <p className="mt-2 retro-system-copy text-[#281712]">{formatCurrency(price)}</p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={disabled}
                        className="retro-press grid h-11 w-11 shrink-0 place-items-center border-2 border-[#281712] bg-[#ffdad6] text-[#93000a] shadow-[3px_3px_0_#281712] transition hover:bg-[#93000a] hover:text-white"
                        title="Hapus item"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex h-12 w-full items-center justify-between border-2 border-[#281712] bg-white shadow-[3px_3px_0_#281712] sm:w-40">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                          disabled={disabled}
                          className="grid h-full w-12 place-items-center border-r-2 border-[#281712] text-[#281712] transition hover:bg-[#fff1ed]"
                          type="button"
                        >
                          <FaMinus />
                        </button>
                        <span className="min-w-8 text-center retro-system-copy text-base text-[#281712]">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                          disabled={disabled}
                          className="grid h-full w-12 place-items-center border-l-2 border-[#281712] text-[#281712] transition hover:bg-[#fff1ed]"
                          type="button"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="retro-system-copy text-[#8f9bb3]">Subtotal</p>
                        <p className="retro-system-copy text-xl text-[#aa3000]">
                          {formatCurrency(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <RetroWindow title="Ringkasan.sys" className="cart-summary sticky top-28">
            <aside className="p-6">
              <div className="retro-dither border-2 border-[#281712] p-4">
                <h2 className="retro-headline text-2xl text-[#281712]">Ringkasan</h2>
                <p className="mt-2 retro-system-copy text-[#5c4037]">{cart.length} item dalam keranjang</p>
              </div>

              <div className="mt-6 space-y-4 retro-system-copy text-[#281712]">
                <div className="flex justify-between gap-4 border-b border-[#e6beb2] pb-3">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#e6beb2] pb-3">
                  <span>Biaya layanan</span>
                  <span>{formatCurrency(adminFee)}</span>
                </div>
              </div>

              <div className="my-6 border-2 border-[#281712] bg-[#fff1ed] p-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="retro-system-copy text-[#281712]">Total</span>
                  <span className="retro-headline text-3xl text-[#aa3000]">{formatCurrency(total)}</span>
                </div>
              </div>

              <RetroButton
                onClick={() => navigate("/checkout")}
                variant="primary"
                className="flex w-full px-4 py-4 text-base"
              >
                Lanjut Pembayaran <FaArrowRight />
              </RetroButton>
            </aside>
          </RetroWindow>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Cart;
