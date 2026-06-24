import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaClipboardList, FaHome, FaSignOutAlt, FaStore, FaTags, FaTerminal, FaUsers, FaUtensils } from "react-icons/fa";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: <FaTerminal /> },
  { label: "Menu", to: "/admin/menus", icon: <FaUtensils /> },
  { label: "Restoran", to: "/admin/restaurants", icon: <FaStore /> },
  { label: "Kategori", to: "/admin/categories", icon: <FaTags /> },
  { label: "Pesanan", to: "/admin/orders", icon: <FaClipboardList /> },
  { label: "Pengguna", to: "/admin/users", icon: <FaUsers /> },
];

function AdminSidebar() {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <aside className="admin-window fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-64 flex-col md:flex">
        <div className="admin-titlebar flex items-center gap-2 px-2">
          <span className="h-4 w-4 border border-[#fff8f6] bg-[#fff8f6]" />
          <span className="flex-1 text-center retro-system-copy">Admin.console</span>
          <span className="h-4 w-4 border border-[#fff8f6]" />
        </div>

        <div className="border-b-2 border-[#281712] bg-white p-5">
          <Link to="/" className="retro-headline flex items-center gap-3 text-2xl text-[#aa3000]">
            <FaHome />
            CariMakan
          </Link>
          <p className="mt-2 retro-system-copy text-[#5c4037]">Panel administrator</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`retro-press flex items-center gap-3 border-2 px-4 py-3 retro-system-copy shadow-[3px_3px_0_#281712] ${
                  active
                    ? "border-[#281712] bg-[#aa3000] text-white"
                    : "border-[#281712] bg-white text-[#281712] hover:bg-[#ffe9e3]"
                }`}
              >
                {item.icon}
                {item.label}
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
        <div className="admin-titlebar flex items-center justify-between px-2">
          <span className="retro-system-copy">Admin.console</span>
          <button onClick={handleLogout} className="retro-system-copy text-[#ffb59e]">Keluar</button>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-2" data-lenis-prevent>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`shrink-0 border-2 border-[#281712] px-3 py-2 retro-system-copy ${
                pathname === item.to ? "bg-[#aa3000] text-white" : "bg-white text-[#281712]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export default AdminSidebar;
