import { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";

function ManageMerchants() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async () => {
    try {
      const [merchantRes, restRes] = await Promise.all([
        adminService.getMerchants(),
        adminService.getRestaurants(),
      ]);
      const merchantList = merchantRes.data || [];
      const allRestaurants = restRes.data || [];

      const enriched = merchantList.map(m => ({
        ...m,
        restaurants: allRestaurants.filter(r => r.ownerId === m.id),
      }));
      setMerchants(enriched);
    } catch {
      toast.error("Gagal memuat data merchant");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchMerchants, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRevoke = async (userId) => {
    if (!window.confirm("Ubah role user ini menjadi pelanggan biasa (user)?")) return;
    try {
      await adminService.updateUserRole(userId, "user");
      toast.success("Role diubah ke User");
      fetchMerchants();
    } catch {
      toast.error("Gagal mengubah role");
    }
  };

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat merchant...</div>;

  return (
    <div>
      <div className="mb-8">
        <p className="retro-system-copy text-[#aa3000]">Admin / Merchant</p>
        <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Merchant</h1>
        <p className="mt-2 text-[#5c4037]">Pantau semua pemilik toko dan restoran yang mereka kelola.</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Email / HP</th>
              <th>Jumlah Toko</th>
              <th>Daftar Restoran</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((merchant) => (
              <tr key={merchant.id}>
                <td>
                  <span className="font-bold text-[#281712]">{merchant.name}</span>
                </td>
                <td className="text-[#5c4037]">
                  <p>{merchant.email}</p>
                  <p className="text-xs">{merchant.phone || "-"}</p>
                </td>
                <td>
                  <span className="admin-badge admin-badge-active">{merchant.restaurants?.length ?? 0} Toko</span>
                </td>
                <td className="text-[#5c4037]">
                  <div className="space-y-1">
                    {merchant.restaurants?.length === 0 && <span className="text-xs">Belum ada toko</span>}
                    {merchant.restaurants?.map(r => (
                      <div key={r.id} className="flex items-center gap-2 text-xs">
                        <span className={`admin-badge ${r.status === 'approved' ? 'admin-badge-active' : r.status === 'pending' ? 'admin-badge-warn' : 'admin-badge-danger'}`}>{r.status}</span>
                        <span className="font-bold text-[#281712]">{r.name}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex justify-end">
                    <button onClick={() => handleRevoke(merchant.id)} className="retro-button retro-press px-3 py-1 text-xs" style={{ backgroundColor: '#ba1a1a', color: 'white' }}>
                      Cabut Akses
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {merchants.length === 0 && <div className="p-10 text-center retro-system-copy text-[#5c4037]">Belum ada merchant terdaftar</div>}
      </div>
    </div>
  );
}

export default ManageMerchants;
