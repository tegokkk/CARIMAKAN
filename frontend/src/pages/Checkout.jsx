import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaMotorcycle,
  FaReceipt,
  FaWallet,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import orderService from "../services/order.service";
import PageWrapper from "../components/common/PageWrapper";
import RetroButton from "../components/common/RetroButton";
import RetroWindow from "../components/common/RetroWindow";
import { formatCurrency } from "../utils/formatCurrency";
import { gsap, useGSAP } from "../animations/gsapConfig";

const DELIVERY_FEE = 10000;
const SERVICE_FEE = 2000;

function Checkout() {
  const { cart, getCartTotal, refreshCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("FAKEPAY");
  const [loading, setLoading] = useState(false);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (cart.length === 0) navigate("/cart");
  }, [cart.length, navigate]);

  useGSAP(
    () => {
      if (!cart.length) return;

      gsap.fromTo(
        ".checkout-panel",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.62, stagger: 0.08, ease: "power3.out" }
      );
    },
    { scope: checkoutRef, dependencies: [cart.length] }
  );

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (!address.trim()) {
      toast.error("Alamat pengiriman harus diisi.");
      return;
    }

    setLoading(true);
    try {
      const checkoutResult = await orderService.checkout({
        customer_name: user?.name || "Pelanggan CariMakan",
        customer_phone: user?.phone || "080000000000",
        delivery_address: address,
        payment_method: paymentMethod,
        notes: notes.trim() || (paymentMethod === "FAKEPAY" ? "Pembayaran simulasi FakePay berhasil." : "Bayar saat pesanan tiba."),
      });
      toast.success(paymentMethod === "FAKEPAY" ? "Pembayaran berhasil, pesanan dibuat." : "Pesanan COD berhasil dibuat.");
      await refreshCart();
      const orderId = checkoutResult.data?.id;
      navigate(orderId ? `/orders/${orderId}?success=1` : "/orders");
    } catch (checkoutError) {
      toast.error(checkoutError.response?.data?.message || "Gagal membuat pesanan");
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const total = subtotal + SERVICE_FEE + DELIVERY_FEE;

  return (
    <PageWrapper className="min-h-screen pb-20 pt-28 md:pt-32">
      <div ref={checkoutRef} className="section-shell">
        <RetroWindow title="Checkout.exe" className="checkout-panel mb-10">
          <div className="p-6 text-center md:p-8">
            <p className="retro-system-copy text-[#aa3000]">Checkout</p>
            <h1 className="retro-headline mx-auto mt-3 max-w-4xl text-4xl leading-tight text-[#281712] md:text-6xl">
              Selesaikan pesanan dengan tenang.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5c4037] md:text-lg">
              Isi alamat, pilih pembayaran, dan pastikan ringkasan pesanan sudah sesuai.
            </p>
          </div>
        </RetroWindow>

        <form onSubmit={handleCheckout} className="grid gap-8 lg:grid-cols-[1fr_26rem] lg:items-start">
          <div className="space-y-5">
            <section className="checkout-panel retro-window p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center border-2 border-[#281712] bg-[#fff1ed] text-[#aa3000] shadow-[3px_3px_0_#281712]">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <h2 className="retro-headline text-2xl text-[#281712]">Alamat pengiriman</h2>
                  <p className="text-sm font-semibold text-[#5c4037]">Pastikan alamat mudah ditemukan kurir.</p>
                </div>
              </div>

              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Contoh: Jl. Sudirman No. 123, Gedung A lantai 5"
                rows={4}
                required
                className="retro-input w-full resize-none px-5 py-4 font-semibold"
              />

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Catatan opsional untuk restoran atau kurir"
                rows={3}
                className="retro-input mt-4 w-full resize-none px-5 py-4 font-semibold"
              />
            </section>

            <section className="checkout-panel retro-window p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center border-2 border-[#281712] bg-[#dcfce7] text-[#15803d] shadow-[3px_3px_0_#281712]">
                  <FaMotorcycle />
                </span>
                <div>
                  <h2 className="retro-headline text-2xl text-[#281712]">Pengiriman</h2>
                  <p className="text-sm font-semibold text-[#5c4037]">Estimasi tiba dalam 30 sampai 45 menit.</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-2 border-[#281712] bg-[#fff1ed] p-5 shadow-[3px_3px_0_#281712]">
                <div>
                  <p className="retro-headline text-lg text-[#281712]">Pengiriman instan</p>
                  <p className="mt-1 retro-system-copy text-[#aa3000]">{formatCurrency(DELIVERY_FEE)}</p>
                </div>
                <FaCheckCircle className="text-2xl text-[#aa3000]" />
              </div>
            </section>

            <section className="checkout-panel retro-window p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center border-2 border-[#281712] bg-white text-[#281712] shadow-[3px_3px_0_#281712]">
                  <FaWallet />
                </span>
                <div>
                  <h2 className="retro-headline text-2xl text-[#281712]">Metode pembayaran</h2>
                  <p className="text-sm font-semibold text-[#5c4037]">Pilih simulasi pembayaran yang ingin dipakai.</p>
                </div>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("FAKEPAY")}
                  className={`flex items-center justify-between border-2 border-[#281712] p-5 text-left shadow-[3px_3px_0_#281712] transition ${
                    paymentMethod === "FAKEPAY"
                      ? "bg-[#fff1ed]"
                      : "bg-white hover:bg-[#fff8f6]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center border-2 border-[#281712] bg-white text-[#aa3000]">
                      <FaWallet />
                    </span>
                    <span>
                      <span className="block font-black text-[#281712]">FakePay Wallet</span>
                      <span className="text-sm font-semibold text-[#5c4037]">Pembayaran simulasi otomatis berhasil</span>
                    </span>
                  </span>
                  {paymentMethod === "FAKEPAY" && <FaCheckCircle className="text-xl text-[#aa3000]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center justify-between border-2 border-[#281712] p-5 text-left shadow-[3px_3px_0_#281712] transition ${
                    paymentMethod === "COD"
                      ? "bg-[#fff1ed]"
                      : "bg-white hover:bg-[#fff8f6]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center border-2 border-[#281712] bg-white text-[#15803d]">
                      <FaMoneyBillWave />
                    </span>
                    <span>
                      <span className="block font-black text-[#281712]">Bayar di Tempat</span>
                      <span className="text-sm font-semibold text-[#5c4037]">Bayar tunai ke kurir saat pesanan tiba</span>
                    </span>
                  </span>
                  {paymentMethod === "COD" && <FaCheckCircle className="text-xl text-[#aa3000]" />}
                </button>
              </div>
            </section>
          </div>

          <aside className="checkout-panel retro-window sticky top-28 p-6">
            <div className="mb-7 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center border-2 border-[#281712] bg-[#aa3000] text-white shadow-[3px_3px_0_#281712]">
                <FaReceipt />
              </span>
              <div>
                <h2 className="retro-headline text-2xl text-[#281712]">Ringkasan</h2>
                <p className="retro-system-copy text-[#5c4037]">{cart.length} item dalam pesanan</p>
              </div>
            </div>

            <div className="max-h-64 space-y-3 overflow-y-auto pr-1" data-lenis-prevent>
              {cart.map((item) => (
                <div key={item.id} className="border-2 border-[#281712] bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-[#281712]">{item.Menu?.name}</p>
                      <p className="mt-1 retro-system-copy text-[#5c4037]">{item.quantity} x {formatCurrency(item.Menu?.price)}</p>
                    </div>
                    <p className="shrink-0 font-black text-[#aa3000]">
                      {formatCurrency(Number(item.Menu?.price || 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-4 border-t-2 border-[#281712] pt-7 retro-system-copy text-[#281712]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos kirim</span>
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya layanan</span>
                <span>{formatCurrency(SERVICE_FEE)}</span>
              </div>
            </div>

            <div className="my-7 border-2 border-[#281712] bg-[#fff1ed] p-5">
              <div className="flex items-end justify-between gap-4">
                <span className="retro-system-copy text-[#281712]">Total</span>
                <span className="retro-headline text-3xl text-[#aa3000]">{formatCurrency(total)}</span>
              </div>
            </div>

            <RetroButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="flex w-full px-4 py-4 text-base disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Konfirmasi Pesanan"}
            </RetroButton>
          </aside>
        </form>
      </div>
    </PageWrapper>
  );
}

export default Checkout;
