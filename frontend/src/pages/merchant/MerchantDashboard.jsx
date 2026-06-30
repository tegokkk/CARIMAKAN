import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FaArrowRight, FaClipboardList, FaMoneyBillWave, FaUtensils, FaStore } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";

function MerchantPageTitle({ title, description }) {
  return (
    <div className="mb-8">
      <p className="retro-system-copy text-[#2e7d32]">CariMakan OS / Merchant</p>
      <h1 className="retro-headline mt-2 text-4xl text-[#281712] md:text-5xl">{title}</h1>
      <p className="mt-2 max-w-2xl leading-7 text-[#5c4037]">{description}</p>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="admin-panel p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="retro-system-copy text-[#5c4037]">{label}</p>
          <p className="retro-headline mt-2 text-5xl text-[#281712]">{value}</p>
        </div>
        <div className="grid h-14 w-14 place-items-center border-2 border-[#281712] bg-[#2e7d32] text-2xl text-white shadow-[3px_3px_0_#281712]">
          {icon}
        </div>
      </div>
    </div>
  );
}

const links = [
  { to: "/merchant/restaurants", label: "Restoran", icon: <FaStore />, active: true },
  { to: "/merchant/menus", label: "Menu" },
  { to: "/merchant/orders", label: "Pesanan", dark: true },
];

function MerchantDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/merchant/dashboard");
        setStats(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-window p-8 text-center">
        <div className="mx-auto h-12 w-12 border-2 border-[#281712] bg-[#2e7d32] shadow-[4px_4px_0_#281712]" />
        <p className="mt-5 retro-system-copy">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <MerchantPageTitle title="Dashboard Toko" description="Ringkasan aktivitas dan performa restoran Anda." />

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`retro-press flex items-center justify-between border-2 border-[#281712] px-5 py-4 retro-system-copy shadow-[4px_4px_0_#281712] ${
              item.active ? "bg-[#2e7d32] text-white" : item.dark ? "bg-[#281712] text-[#fff8f6]" : "bg-white text-[#281712]"
            }`}
          >
            <span className="flex items-center gap-2">{item.icon}{item.label}</span>
            <FaArrowRight />
          </Link>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Restoran" value={stats?.totalRestaurants ?? 0} icon={<FaStore />} />
        <StatCard label="Total Menu" value={stats?.totalMenus ?? 0} icon={<FaUtensils />} />
        <StatCard label="Total Pesanan" value={stats?.totalOrders ?? 0} icon={<FaClipboardList />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="admin-window p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center border-2 border-[#281712] bg-[#dcfce7] text-2xl text-[#15803d] shadow-[3px_3px_0_#281712]">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="retro-system-copy text-[#5c4037]">Total Pendapatan</p>
              <p className="retro-headline text-3xl text-[#281712]">{formatCurrency(stats?.totalRevenue ?? 0)}</p>
            </div>
          </div>
        </section>

        <section className="admin-window lg:col-span-2">
          <div className="admin-titlebar flex items-center px-3" style={{ backgroundColor: '#2e7d32' }}>
            <span className="retro-system-copy">Pesanan.terbaru</span>
          </div>
          <div className="p-6">
            {(stats?.recentOrders || []).length === 0 ? (
              <p className="retro-system-copy text-[#5c4037]">Belum ada pesanan.</p>
            ) : (
              <div className="divide-y divide-[#e6beb2]">
                {(stats?.recentOrders || []).map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-bold text-[#281712]">{order.customerName}</p>
                      <p className="retro-system-copy text-[#5c4037]">#{order.orderCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#aa3000]">{formatCurrency(order.totalPrice)}</p>
                      <span className={`admin-badge mt-1 ${order.status === "done" ? "admin-badge-active" : order.status === "pending" ? "admin-badge-warn" : ""}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MerchantDashboard;
