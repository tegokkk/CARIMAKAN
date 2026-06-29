import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextValue";
import { CartContext } from "../../context/CartContextValue";

function Footer() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const year = new Date().getFullYear();

  return (
    <footer className="retro-status-bar fixed inset-x-0 bottom-0 z-40 hidden h-8 items-center justify-between px-4 retro-system-copy md:flex">
      <div className="flex items-center gap-4">
        <span>System 7.5.3 © {year} CariMakan</span>
        <span>Memory: 640KB</span>
        <span>Cart: {cart?.length || 0} Item</span>
      </div>
      <nav className="flex items-center gap-5">
        <span>User: {user?.name || "Guest"}</span>
        <Link to="/privacy" className="underline hover:text-[#aa3000]">
          Privasi
        </Link>
        <Link to="/terms" className="underline hover:text-[#aa3000]">
          Ketentuan
        </Link>
        <span className="text-[#aa3000] underline">Network: OK</span>
      </nav>
    </footer>
  );
}

export default Footer;
