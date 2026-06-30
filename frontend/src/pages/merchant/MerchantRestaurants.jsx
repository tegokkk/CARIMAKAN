import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEdit, FaPlus } from "react-icons/fa";

const emptyForm = {
  name: "",
  description: "",
  address: "",
  city: "",
  phone: "",
};

function MerchantRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/merchant/restaurants");
      setRestaurants(res.data.data || []);
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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/merchant/restaurants/${editingId}`, form);
        toast.success("Restoran diperbarui");
      } else {
        await api.post("/merchant/restaurants", form);
        toast.success("Restoran ditambahkan");
      }
      resetForm();
      setShowForm(false);
      fetchRestaurants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan restoran");
    }
  };

  const handleEdit = (restaurant) => {
    setForm({
      name: restaurant.name,
      description: restaurant.description || "",
      address: restaurant.address || "",
      city: restaurant.city || "",
      phone: restaurant.phone || "",
    });
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat restoran...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="retro-system-copy text-[#2e7d32]">Merchant / Restoran</p>
          <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Restoran</h1>
          <p className="mt-2 text-[#5c4037]">Tambah atau edit detail restoran Anda.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); resetForm(); }} className="retro-button retro-button-primary retro-press px-5 py-3" style={{ backgroundColor: '#2e7d32' }}>
          <FaPlus /> Tambah Restoran
        </button>
      </div>

      {showForm && (
        <section className="admin-window mb-6 border-[#2e7d32]">
          <div className="admin-titlebar flex items-center px-3 retro-system-copy" style={{ backgroundColor: '#2e7d32' }}>
            {editingId ? "Edit.restoran" : "Tambah.restoran"}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <label className="admin-label">Nama Restoran</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Kota</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Alamat</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">No HP</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="admin-input" />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className="retro-button retro-button-primary retro-press px-6 py-3" style={{ backgroundColor: '#2e7d32' }}>{editingId ? "Simpan" : "Tambahkan"}</button>
              <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="retro-button retro-press px-6 py-3">Batal</button>
            </div>
          </form>
        </section>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Restoran</th>
              <th>Kota</th>
              <th>Alamat</th>
              <th>Rating</th>
              <th>Status Verifikasi</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>
                  <span className="font-bold text-[#281712]">{restaurant.name}</span>
                </td>
                <td className="text-[#5c4037]">{restaurant.city || "-"}</td>
                <td className="max-w-xs truncate text-[#5c4037]">{restaurant.address || "-"}</td>
                <td className="font-black text-[#2e7d32]">{restaurant.rating || "-"}</td>
                <td>
                  <span className={`admin-badge ${restaurant.status === "approved" ? "admin-badge-active" : restaurant.status === "pending" ? "admin-badge-warn" : "admin-badge-danger"}`}>
                    {restaurant.status === "approved" ? "Aktif" : restaurant.status === "pending" ? "Menunggu Verifikasi" : restaurant.status}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(restaurant)} className="admin-icon-button text-[#005daa]"><FaEdit /></button>
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

export default MerchantRestaurants;
