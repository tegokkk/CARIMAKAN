import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaReceipt } from "react-icons/fa";
import orderService from "../services/order.service";
import PageWrapper from "../components/common/PageWrapper";
import RetroButton from "../components/common/RetroButton";
import RetroWindow from "../components/common/RetroWindow";
import AnimatedEmptyState from "../components/common/AnimatedEmptyState";
import { formatCurrency } from "../utils/formatCurrency";
import { gsap, useGSAP } from "../animations/gsapConfig";

const statusLabels = {
  pending: "Menunggu pembayaran",
  paid: "Dibayar",
  process: "Diproses",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageRef = useRef(null);
  const isSuccess = searchParams.get("success") === "1";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);
        setOrder(response.data || null);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Pesanan tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useGSAP(
    () => {
      if (loading || !order) return;
      gsap.fromTo(
        ".order-detail-panel",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.08, ease: "steps(8)" }
      );
    },
    { scope: pageRef, dependencies: [loading, order?.id] }
  );

  const items = useMemo(() => order?.OrderItems || order?.items || [], [order]);

  if (loading) {
    return (
      <PageWrapper className="grid min-h-screen place-items-center px-4 pt-28">
        <RetroWindow title="Memuat.order" className="w-full max-w-lg">
          <div className="p-8 text-center">
            <p className="retro-system-copy text-[#aa3000]">Loading</p>
            <h1 className="retro-headline mt-3 text-3xl text-[#281712]">Mengambil detail pesanan...</h1>
          </div>
        </RetroWindow>
      </PageWrapper>
    );
  }

  if (error || !order) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center px-4 pb-20 pt-28">
        <AnimatedEmptyState
          type="orders"
          title="Pesanan tidak ditemukan"
          description={error || "Detail pesanan tidak tersedia."}
          className="max-w-lg"
        >
          <RetroButton to="/orders" className="mt-8 w-full px-5 py-3">
            Kembali ke Pesanan
          </RetroButton>
        </AnimatedEmptyState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen pb-20 pt-28 md:pt-32">
      <div ref={pageRef} className="section-shell max-w-5xl">
        {isSuccess && (
          <RetroWindow title="Checkout.sukses" className="order-detail-panel mb-8">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center border-2 border-[#281712] bg-[#dcfce7] shadow-[3px_3px_0_#281712]">
                  <FaCheckCircle className="text-2xl text-[#15803d]" />
                </span>
                <div>
                  <p className="retro-system-copy text-[#aa3000]">Pesanan dibuat</p>
                  <h1 className="retro-headline mt-1 text-3xl text-[#281712]">Checkout berhasil.</h1>
                </div>
              </div>
              <RetroButton to="/search" variant="primary" className="px-5 py-3">
                Pesan Lagi
              </RetroButton>
            </div>
          </RetroWindow>
        )}

        <RetroWindow title={`Order.${order.order_code}`} className="order-detail-panel">
          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_20rem]">
            <div>
              <Link to="/orders" className="retro-system-copy inline-flex items-center gap-2 text-[#aa3000]">
                <FaArrowLeft /> Kembali
              </Link>
              <h1 className="retro-headline mt-4 text-4xl text-[#281712] md:text-5xl">
                Detail pesanan
              </h1>
              <div className="mt-6 grid gap-3 retro-system-copy text-[#281712] sm:grid-cols-2">
                <div className="border-2 border-[#281712] bg-[#fff1ed] p-4">
                  <p className="text-[#5c4037]">Kode</p>
                  <p className="mt-1 text-base">{order.order_code}</p>
                </div>
                <div className="border-2 border-[#281712] bg-white p-4">
                  <p className="text-[#5c4037]">Status</p>
                  <p className="mt-1 text-base text-[#aa3000]">{statusLabels[order.status] || order.status}</p>
                </div>
                <div className="border-2 border-[#281712] bg-white p-4">
                  <p className="text-[#5c4037]">Pembayaran</p>
                  <p className="mt-1 text-base">{order.payment_method || "COD"}</p>
                </div>
                <div className="border-2 border-[#281712] bg-white p-4">
                  <p className="text-[#5c4037]">Penerima</p>
                  <p className="mt-1 text-base">{order.customer_name}</p>
                </div>
              </div>

              <div className="mt-6 border-2 border-[#281712] bg-white p-4">
                <p className="retro-system-copy text-[#5c4037]">Alamat</p>
                <p className="mt-2 leading-7 text-[#281712]">{order.delivery_address}</p>
                {order.notes && <p className="mt-3 text-sm leading-6 text-[#5c4037]">Catatan: {order.notes}</p>}
              </div>
            </div>

            <aside className="border-2 border-[#281712] bg-[#fff1ed] p-5 shadow-[4px_4px_0_#281712]">
              <div className="mb-5 flex items-center gap-3">
                <FaReceipt className="text-2xl text-[#aa3000]" />
                <h2 className="retro-headline text-2xl text-[#281712]">Ringkasan</h2>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border-2 border-[#281712] bg-white p-3">
                    <p className="font-bold text-[#281712]">{item.Menu?.name || item.menu_name}</p>
                    <p className="mt-1 retro-system-copy text-[#5c4037]">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t-2 border-[#281712] pt-5">
                <p className="retro-system-copy text-[#5c4037]">Total</p>
                <p className="retro-headline mt-1 text-3xl text-[#aa3000]">{formatCurrency(order.total_price)}</p>
              </div>
            </aside>
          </div>
        </RetroWindow>
      </div>
    </PageWrapper>
  );
}

export default OrderDetail;
