import { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaLock, FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/auth.service";
import PageWrapper from "../components/common/PageWrapper";
import RetroButton from "../components/common/RetroButton";
import RetroWindow from "../components/common/RetroWindow";
import { gsap, useGSAP } from "../animations/gsapConfig";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.34, ease: "steps(6)" });
    },
    { scope: containerRef }
  );

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      login(response.data.token, response.data.user);
      toast.success("Login berhasil");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center px-4 py-16">
      <div ref={containerRef} className="w-full max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <RetroWindow title="Login.exe" className="order-2 lg:order-1">
            <div className="p-6 md:p-8">
              <div className="mb-8 border-b-2 border-[#281712] pb-5">
                <p className="retro-system-copy text-[#aa3000]">Akses pengguna</p>
                <h1 className="retro-headline mt-2 text-4xl leading-tight text-[#281712]">
                  Masuk ke CariMakan OS.
                </h1>
                <p className="mt-3 leading-7 text-[#5c4037]">
                  Gunakan akunmu untuk melanjutkan pesanan, favorit, dan riwayat transaksi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block retro-system-copy text-[#281712]">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`retro-input h-12 w-full px-4 ${errors.email ? "border-[#ba1a1a]" : ""}`}
                    placeholder="contoh@email.com"
                  />
                  {errors.email && <p className="mt-2 border-2 border-[#ba1a1a] bg-[#ffdad6] px-3 py-2 text-xs font-bold text-[#93000a]">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block retro-system-copy text-[#281712]">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={`retro-input h-12 w-full px-4 ${errors.password ? "border-[#ba1a1a]" : ""}`}
                    placeholder="Masukkan password"
                  />
                  {errors.password && <p className="mt-2 border-2 border-[#ba1a1a] bg-[#ffdad6] px-3 py-2 text-xs font-bold text-[#93000a]">{errors.password}</p>}
                </div>

                <div className="flex justify-end">
                  <span className="retro-system-copy text-[#5c4037] opacity-60">Lupa password?</span>
                </div>

                <RetroButton type="submit" variant="primary" disabled={loading} className="h-13 w-full px-6 py-4 disabled:opacity-60">
                  {loading ? "Memproses..." : "Masuk"} <FaArrowRight />
                </RetroButton>
              </form>

              <p className="mt-8 text-center text-sm font-bold text-[#5c4037]">
                Belum punya akun?{" "}
                <Link to="/register" className="text-[#aa3000] underline">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </RetroWindow>

          <RetroWindow title="User.card" className="order-1 lg:order-2">
            <div className="retro-dither p-6 md:p-8">
              <div className="retro-window bg-white p-8 text-center">
                <div className="mx-auto grid h-28 w-28 place-items-center border-2 border-[#281712] bg-[#aa3000] text-5xl text-white retro-shadow">
                  <FaUserCircle />
                </div>
                <h2 className="retro-headline mt-8 text-3xl text-[#281712]">Selamat datang kembali</h2>
                <p className="mx-auto mt-4 max-w-sm leading-7 text-[#5c4037]">
                  Mesin lapar sudah siap. Login untuk membuka keranjang, favorit, dan status pesanan.
                </p>
                <div className="mt-7 inline-flex items-center gap-2 border-2 border-[#281712] bg-white px-4 py-3 retro-system-copy">
                  <FaLock className="text-[#aa3000]" />
                  Sesi aman
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Login;
