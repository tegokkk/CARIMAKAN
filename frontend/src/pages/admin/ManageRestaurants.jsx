import { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const res = await adminService.getRestaurants();
      setRestaurants(res.data || []);
    } catch {
      toast.error("Gagal memuat restoran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchRestaurants, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateRestaurantStatus(id, newStatus);
      toast.success(`Status restoran diubah menjadi ${newStatus}`);
      fetchRestaurants();
    } catch {
      toast.error("Gagal mengubah status restoran");
    }
  };

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat restoran...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="retro-system-copy text-[#aa3000]">Admin / Restoran</p>
          <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Verifikasi Restoran</h1>
          <p className="mt-2 text-[#5c4037]">Tinjau dan atur status restoran yang didaftarkan oleh Merchant.</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Restoran</th>
              <th>Pemilik</th>
              <th>Kota / Alamat</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>
                  <span className="font-bold text-[#281712]">{restaurant.name}</span>
                </td>
                <td className="text-[#5c4037]">
                  <p className="font-bold">{restaurant.owner?.name}</p>
                  <p className="text-xs">{restaurant.owner?.email}</p>
                </td>
                <td className="max-w-xs text-[#5c4037]">
                  <p className="font-bold">{restaurant.city || "-"}</p>
                  <p className="truncate text-xs">{restaurant.address || "-"}</p>
                </td>
                <td>
                  <span className={`admin-badge ${restaurant.status === "approved" ? "admin-badge-active" : restaurant.status === "pending" ? "admin-badge-warn" : "admin-badge-danger"}`}>
                    {restaurant.status}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    {restaurant.status !== "approved" && (
                      <button onClick={() => handleStatusChange(restaurant.id, "approved")} className="retro-button retro-press px-3 py-1 text-xs" style={{ backgroundColor: '#2e7d32', color: 'white' }}>
                        Setuju
                      </button>
                    )}
                    {restaurant.status !== "rejected" && (
                      <button onClick={() => handleStatusChange(restaurant.id, "rejected")} className="retro-button retro-press px-3 py-1 text-xs" style={{ backgroundColor: '#ba1a1a', color: 'white' }}>
                        Tolak
                      </button>
                    )}
                    {restaurant.status !== "suspended" && (
                      <button onClick={() => handleStatusChange(restaurant.id, "suspended")} className="retro-button retro-press px-3 py-1 text-xs bg-gray-600 text-white">
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {restaurants.length === 0 && <div className="p-10 text-center retro-system-copy text-[#5c4037]">Belum ada restoran</div>}
      </div>
    </div>
  );
}

export default ManageRestaurants;
