import { useContext, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaHeart,
  FaHome,
  FaReceipt,
  FaSearch,
  FaShoppingBag,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContextValue";
import { CartContext } from "../../context/CartContextValue";
import { gsap, useGSAP } from "../../animations/gsapConfig";

const navLinks = [
  { label: "Beranda", to: "/", icon: FaHome },
  { label: "Cari Menu", to: "/search", icon: FaSearch },
];

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = cart?.length || 0;

  useGSAP(
    () => {
      gsap.fromTo(headerRef.current, { y: -36 }, { y: 0, duration: 0.46, ease: "steps(6)" });
    },
    { scope: headerRef }
  );

  useGSAP(
    () => {
      if (!mobileOpen || !mobilePanelRef.current) return;
      gsap.fromTo(
        mobilePanelRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.18, ease: "steps(4)" }
      );
    },
    { dependencies: [mobileOpen], scope: mobilePanelRef }
  );

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const desktopLinkClass = ({ isActive }) =>
    `retro-invert-active inline-flex h-8 items-center gap-2 border-l-2 border-[#281712] px-4 retro-system-copy transition-colors hover:bg-[#e0e0e0] ${
      isActive ? "active" : ""
    }`;

  return (
    <header ref={headerRef} className="retro-top-bar fixed inset-x-0 top-0 z-50 h-10">
      <div className="flex h-full items-center justify-between">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="retro-headline flex h-full items-center border-r-2 border-[#281712] px-4 text-xl font-bold uppercase text-[#aa3000] md:px-5"
        >
          CariMakan
        </Link>

        <nav className="hidden h-full items-center md:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={desktopLinkClass}>
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto hidden h-full items-center border-l-2 border-[#281712] md:flex">
          {user && (
            <Link to="/favorites" className="relative grid h-full w-12 place-items-center border-r-2 border-[#281712] hover:bg-[#ffe9e3]" title="Favorit">
              <FaHeart />
            </Link>
          )}
          <Link to="/cart" className="relative grid h-full w-12 place-items-center border-r-2 border-[#281712] hover:bg-[#ffe9e3]" title="Keranjang">
            <FaShoppingBag />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 grid min-h-5 min-w-5 place-items-center border-2 border-[#281712] bg-[#aa3000] px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="inline-flex h-full items-center gap-2 border-r-2 border-[#281712] px-4 retro-system-copy hover:bg-[#ffe9e3]">
                <FaReceipt />
                Pesanan
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="inline-flex h-full items-center border-r-2 border-[#281712] bg-[#281712] px-4 retro-system-copy text-[#fff8f6]">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="inline-flex h-full items-center gap-2 border-r-2 border-[#281712] px-4 retro-system-copy hover:bg-[#ffe9e3]">
                <FaUserCircle />
                {user.name?.split(" ")[0] || "Profil"}
              </Link>
              <button onClick={handleLogout} className="grid h-full w-12 place-items-center hover:bg-[#ffdad6]" title="Keluar">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex h-full items-center border-r-2 border-[#281712] px-4 retro-system-copy hover:bg-[#ffe9e3]">
                Masuk
              </Link>
              <Link to="/register" className="inline-flex h-full items-center bg-[#aa3000] px-4 retro-system-copy text-white hover:bg-[#d43f00]">
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          className="grid h-full w-12 place-items-center border-l-2 border-[#281712] md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileOpen && (
        <div ref={mobilePanelRef} className="retro-window mx-3 mt-3 md:hidden">
          <div className="retro-titlebar flex items-center gap-2 px-2">
            <span className="h-4 w-4 border-2 border-[#281712] bg-white" />
            <div className="retro-stripes h-4 flex-1" />
            <span className="retro-system-copy">Menu Sistem</span>
          </div>
          <div className="grid p-2">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="border-2 border-transparent px-3 py-3 retro-system-copy hover:border-[#281712] hover:bg-[#e0e0e0]">
                {item.label}
              </Link>
            ))}
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-2 border-transparent px-3 py-3 retro-system-copy hover:border-[#281712] hover:bg-[#e0e0e0]">
              Keranjang
              {cartCount > 0 && <span className="border-2 border-[#281712] bg-[#aa3000] px-2 text-white">{cartCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/favorites" onClick={() => setMobileOpen(false)} className="border-2 border-transparent px-3 py-3 retro-system-copy hover:border-[#281712] hover:bg-[#e0e0e0]">
                  Favorit
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="border-2 border-transparent px-3 py-3 retro-system-copy hover:border-[#281712] hover:bg-[#e0e0e0]">
                  Pesanan
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="border-2 border-transparent px-3 py-3 retro-system-copy hover:border-[#281712] hover:bg-[#e0e0e0]">
                  Profil
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="border-2 border-transparent px-3 py-3 retro-system-copy hover:border-[#281712] hover:bg-[#e0e0e0]">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="px-3 py-3 text-left retro-system-copy text-[#ba1a1a]">
                  Keluar
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="retro-button retro-press py-3">
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="retro-button retro-button-primary retro-press py-3">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
