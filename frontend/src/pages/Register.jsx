import { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaClipboardList, FaUserPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import authService from "../services/auth.service";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/common/PageWrapper";
import RetroButton from "../components/common/RetroButton";
import RetroWindow from "../components/common/RetroWindow";
import { gsap, useGSAP } from "../animations/gsapConfig";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
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
    if (!formData.name || formData.name.length < 3) newErrors.name = "Nama minimal 3 karakter";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Format email tidak valid";
    if (!formData.phone || !/^08[0-9]{8,11}$/.test(formData.phone)) newErrors.phone = "Nomor HP harus diawali 08 dan berisi 10-13 digit angka";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password minimal 6 karakter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.register(formData);
      login(response.data.token, response.data.user);
      toast.success("Registrasi berhasil");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Nama Lengkap", name: "name", type: "text", placeholder: "Budi Santoso", minLength: 3 },
    { label: "Email", name: "email", type: "email", placeholder: "contoh@email.com" },
    { label: "Nomor HP", name: "phone", type: "text", placeholder: "08123456789", pattern: "^08[0-9]{8,11}$" },
    { label: "Password", name: "password", type: "password", placeholder: "Minimal 6 karakter", minLength: 6 },
  ];

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center px-4 py-16">
      <div ref={containerRef} className="w-full max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <RetroWindow title="Daftar.info" className="hidden lg:block">
            <div className="retro-dither p-6">
              <div className="retro-window bg-white p-8">
                <div className="grid h-24 w-24 place-items-center border-2 border-[#281712] bg-[#aa3000] text-4xl text-white retro-shadow">
                  <FaUserPlus />
                </div>
                <h2 className="retro-headline mt-8 text-3xl text-[#281712]">Buat akun baru</h2>
                <p className="mt-4 leading-7 text-[#5c4037]">
                  Akun CariMakan menyimpan favorit, keranjang, dan riwayat pesanan dalam satu sistem yang rapi.
                </p>
                <div className="mt-7 border-2 border-[#281712] bg-[#ffe9e3] p-4 retro-system-copy leading-6">
                  Data yang diperlukan: nama, email, nomor HP, dan password.
                </div>
              </div>
            </div>
          </RetroWindow>

          <RetroWindow title="Register.exe">
            <div className="p-6 md:p-8">
              <div className="mb-8 border-b-2 border-[#281712] pb-5">
                <p className="retro-system-copy text-[#aa3000]">Pendaftaran pengguna</p>
                <h1 className="retro-headline mt-2 text-4xl leading-tight text-[#281712]">
                  Daftar ke CariMakan OS.
                </h1>
                <p className="mt-3 leading-7 text-[#5c4037]">
                  Isi data singkat untuk mulai memesan makanan favoritmu.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.name} className={field.name === "password" ? "md:col-span-2" : ""}>
                    <label className="mb-2 block retro-system-copy text-[#281712]">{field.label}</label>
                    <input
                      {...field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      title={field.name === "phone" ? "Nomor HP harus diawali 08 dan berisi 10-13 digit angka" : undefined}
                      className={`retro-input h-12 w-full px-4 ${errors[field.name] ? "border-[#ba1a1a]" : ""}`}
                    />
                    {errors[field.name] && (
                      <p className="mt-2 border-2 border-[#ba1a1a] bg-[#ffdad6] px-3 py-2 text-xs font-bold text-[#93000a]">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="md:col-span-2">
                  <RetroButton type="submit" variant="primary" disabled={loading} className="w-full px-6 py-4 disabled:opacity-60">
                    {loading ? "Memproses..." : "Daftar"} <FaArrowRight />
                  </RetroButton>
                </div>
              </form>

              <p className="mt-8 text-center text-sm font-bold text-[#5c4037]">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-[#aa3000] underline">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </RetroWindow>

          <div className="retro-window p-4 lg:hidden">
            <div className="flex items-center gap-3">
              <FaClipboardList className="text-[#aa3000]" />
              <p className="retro-system-copy">Simpan data akun untuk checkout lebih cepat.</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Register;
