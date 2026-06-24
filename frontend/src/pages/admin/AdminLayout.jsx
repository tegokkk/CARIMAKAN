import AdminSidebar from "../../components/admin/AdminSidebar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

function AdminLayout() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "admin") {
        toast.error("Akses ditolak. Halaman ini hanya untuk admin.");
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="admin-shell flex h-screen items-center justify-center">
        <div className="admin-window p-8 text-center">
          <div className="mx-auto h-12 w-12 border-2 border-[#281712] bg-[#aa3000] shadow-[4px_4px_0_#281712]" />
          <p className="mt-5 retro-system-copy">Memuat admin console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell flex min-h-screen">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 pt-24 md:ml-72 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
