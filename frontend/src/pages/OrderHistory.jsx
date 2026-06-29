import { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaReceipt,
} from "react-icons/fa";
import orderService from "../services/order.service";
import PageWrapper from "../components/common/PageWrapper";
import AnimatedEmptyState from "../components/common/AnimatedEmptyState";
import RetroButton from "../components/common/RetroButton";
import RetroWindow from "../components/common/RetroWindow";
import { formatCurrency } from "../utils/formatCurrency";
import { gsap, useGSAP } from "../animations/gsapConfig";

const statusConfig = {
  pending: {
    label: "Menunggu Pembayaran",
    vars: {
      "--status-bg": "linear-gradient(135deg, rgba(254, 243, 199, 0.98), rgba(255, 247, 237, 0.98))",
      "--status-border": "rgba(245, 158, 11, 0.24)",
      "--status-text": "#92400e",
      "--status-dot": "#f59e0b",
      "--status-halo": "rgba(245, 158, 11, 0.16)",
      "--status-glow": "rgba(245, 158, 11, 0.56)",
    },
  },
  paid: {
    label: "Dibayar",
    vars: {
      "--status-bg": "linear-gradient(135deg, rgba(219, 234, 254, 0.98), rgba(239, 246, 255, 0.98))",
      "--status-border": "rgba(59, 130, 246, 0.24)",
      "--status-text": "#1d4ed8",
      "--status-dot": "#3b82f6",
      "--status-halo": "rgba(59, 130, 246, 0.14)",
      "--status-glow": "rgba(59, 130, 246, 0.52)",
    },
  },
  process: {
    label: "Diproses",
    vars: {
      "--status-bg": "linear-gradient(135deg, rgba(243, 232, 255, 0.98), rgba(250, 245, 255, 0.98))",
      "--status-border": "rgba(168, 85, 247, 0.24)",
      "--status-text": "#7e22ce",
      "--status-dot": "#a855f7",
      "--status-halo": "rgba(168, 85, 247, 0.14)",
      "--status-glow": "rgba(168, 85, 247, 0.52)",
    },
  },
  done: {
    label: "Selesai",
    vars: {
      "--status-bg": "linear-gradient(135deg, rgba(220, 252, 231, 0.98), rgba(240, 253, 244, 0.98))",
      "--status-border": "rgba(34, 197, 94, 0.24)",
      "--status-text": "#15803d",
      "--status-dot": "#22c55e",
      "--status-halo": "rgba(34, 197, 94, 0.14)",
      "--status-glow": "rgba(34, 197, 94, 0.54)",
    },
  },
  cancelled: {
    label: "Dibatalkan",
    vars: {
      "--status-bg": "linear-gradient(135deg, rgba(254, 226, 226, 0.98), rgba(255, 241, 242, 0.98))",
      "--status-border": "rgba(239, 68, 68, 0.24)",
      "--status-text": "#b91c1c",
      "--status-dot": "#ef4444",
      "--status-halo": "rgba(239, 68, 68, 0.14)",
      "--status-glow": "rgba(239, 68, 68, 0.52)",
    },
  },
};

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error("Gagal memuat pesanan", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useGSAP(
    () => {
      if (loading || !orders.length) return;
      gsap.fromTo(
        ".order-card",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.56, stagger: 0.08, ease: "power3.out" }
      );
    },
    { scope: pageRef, dependencies: [loading, orders.length] }
  );

  if (loading) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center px-4 pt-24">
        <RetroWindow title="Memuat.orders" className="w-full max-w-lg">
          <div className="p-8 text-center">
            <p className="retro-system-copy text-[#aa3000]">Loading</p>
            <h1 className="retro-headline mt-3 text-3xl text-[#281712]">Memuat riwayat pesanan...</h1>
          </div>
        </RetroWindow>
      </PageWrapper>
    );
  }

  if (!orders.length) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center px-4 pb-20 pt-28">
        <AnimatedEmptyState
          type="orders"
          title="Belum ada pesanan"
          description="Riwayat pesananmu akan muncul setelah checkout pertama berhasil."
          className="max-w-lg"
        >
          <RetroButton to="/search" variant="primary" className="mt-8 w-full px-5 py-3">
            Mulai Pesan <FaArrowRight />
          </RetroButton>
        </AnimatedEmptyState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen pb-20 pt-28 md:pt-32">
      <div ref={pageRef} className="section-shell max-w-5xl">
        <RetroWindow title="Pesanan.log" className="mb-10">
          <div className="p-6 md:p-8">
            <p className="retro-system-copy text-[#aa3000]">Riwayat pesanan</p>
            <h1 className="retro-headline mt-3 text-4xl leading-tight text-[#281712] md:text-6xl">
              Pantau semua pesananmu.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5c4037] md:text-lg">
              Lihat status, detail item, dan total pembayaran dari transaksi yang sudah dibuat.
            </p>
          </div>
        </RetroWindow>

        <div className="space-y-5">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const orderDate = new Date(order.created_at || order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article key={order.id} className="order-card retro-window overflow-hidden">
                <div className="flex flex-col gap-4 border-b-2 border-[#281712] bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center border-2 border-[#281712] bg-[#281712] text-white shadow-[3px_3px_0_#281712]">
                      <FaReceipt />
                    </span>
                    <div>
                      <p className="retro-headline text-xl text-[#281712]">Pesanan #{order.order_code}</p>
                      <p className="mt-1 retro-system-copy text-[#5c4037]">{orderDate}</p>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 border-2 border-[#281712] bg-[#fff1ed] px-4 py-2 retro-system-copy text-[#281712]">
                    <span className="status-dot" />
                    {status.label}
                  </span>
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-[1fr_17rem] md:p-6">
                  <div>
                    <h2 className="retro-headline mb-4 text-2xl text-[#281712]">Detail item</h2>
                    <div className="space-y-3">
                      {order.OrderItems?.length ? (
                        order.OrderItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4 border-2 border-[#281712] bg-white p-4">
                            <div className="min-w-0">
                              <p className="truncate font-black text-[#281712]">{item.Menu?.name}</p>
                              <p className="mt-1 retro-system-copy text-[#5c4037]">{item.quantity} item</p>
                            </div>
                            <span className="shrink-0 font-black text-[#281712]">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-[#281712] bg-[#fff1ed] p-4 text-sm font-semibold text-[#5c4037]">
                          Detail item belum tersedia dari server.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between border-2 border-[#281712] bg-[#fff1ed] p-5 shadow-[3px_3px_0_#281712]">
                    <div>
                      <p className="retro-system-copy text-[#aa3000]">Total pembayaran</p>
                      <p className="retro-headline mt-2 text-3xl text-[#aa3000]">{formatCurrency(order.total_price)}</p>
                    </div>
                    <div className="mt-6 grid gap-3">
                      <RetroButton to={`/orders/${order.id}`} className="px-4 py-3">
                        Detail <FaArrowRight />
                      </RetroButton>
                      {order.status === "done" && (
                        <RetroButton to="/search" variant="primary" className="px-4 py-3">
                          Pesan Lagi <FaArrowRight />
                        </RetroButton>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

export default OrderHistory;
