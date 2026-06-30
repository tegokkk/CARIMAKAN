import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContextValue";
import { FaClipboardList, FaHome, FaSignOutAlt, FaStore, FaTerminal, FaUtensils } from "react-icons/fa";
import api from "../../services/api";

const baseNavItems = [
  { label: "Dashboard", to: "/merchant", icon: <FaTerminal /> },
  { label: "Menu", to: "/merchant/menus", icon: <FaUtensils /> },
  { label: "Restoran", to: "/merchant/restaurants", icon: <FaStore /> },
  { label: "Pesanan", to: "/merchant/orders", icon: <FaClipboardList />, badgeKey: "pending" },
];

function MerchantSidebar() {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get("/merchant/orders");
        const orders = res.data?.data || [];
        setPendingCount(orders.filter(o => o.status === 'pending').length);
      } catch { /* ignore */ }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = baseNavItems;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <aside className="admin-window fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-64 flex-col md:flex">
        <div className="admin-titlebar flex items-center gap-2 px-2" style={{ backgroundColor: '#2e7d32' }}>
          <span className="h-4 w-4 border border-[#fff8f6] bg-[#fff8f6]" />
          <span className="flex-1 text-center retro-system-copy">Merchant.console</span>
          <span className="h-4 w-4 border border-[#fff8f6]" />
        </div>

        <div className="border-b-2 border-[#281712] bg-white p-5">
          <Link to="/" className="retro-headline flex items-center gap-3 text-2xl text-[#2e7d32]">
            <FaHome />
            CariMakan
          </Link>
          <p className="mt-2 retro-system-copy text-[#5c4037]">Panel Toko / Merchant</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active = pathname === item.to || (pathname.startsWith(item.to) && item.to !== "/merchant");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`retro-press flex items-center gap-3 border-2 px-4 py-3 retro-system-copy shadow-[3px_3px_0_#281712] ${
                  active
                    ? "border-[#281712] bg-[#2e7d32] text-white"
                    : "border-[#281712] bg-white text-[#281712] hover:bg-[#e8f5e9]"
                }`}
              >
                {item.icon}
                {item.label}
                {item.badgeKey === 'pending' && pendingCount > 0 && (
                  <span className="ml-auto grid min-h-5 min-w-5 place-items-center border border-white bg-[#ba1a1a] px-1 text-[10px] font-black text-white">{pendingCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t-2 border-[#281712] p-4">
          <button
            onClick={handleLogout}
            className="retro-button retro-press w-full justify-start px-4 py-3 text-[#93000a]"
          >
            <FaSignOutAlt />
            Keluar
          </button>
        </div>
      </aside>

      <div className="admin-window fixed inset-x-3 top-3 z-40 md:hidden">
        <div className="admin-titlebar flex items-center justify-between px-2" style={{ backgroundColor: '#2e7d32' }}>
          <span className="retro-system-copy">Merchant.console</span>
          <button onClick={handleLogout} className="retro-system-copy text-[#c8e6c9]">Keluar</button>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-2" data-lenis-prevent>
          {navItems.map((item) => {
            const active = pathname === item.to || (pathname.startsWith(item.to) && item.to !== "/merchant");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 border-2 border-[#281712] px-3 py-2 retro-system-copy ${
                  active ? "bg-[#2e7d32] text-white" : "bg-white text-[#281712]"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  );
}

export default MerchantSidebar;
