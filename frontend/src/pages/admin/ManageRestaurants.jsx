import { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { getImageUrl } from "../../utils/getImageUrl";

const emptyForm = {
  name: "",
  description: "",
  address: "",
  city: "",
  phone: "",
  is_active: "1",
};

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (imageFile) payload.append("image", imageFile);

    try {
      if (editingId) {
        await adminService.updateRestaurant(editingId, payload);
        toast.success("Restoran diperbarui");
      } else {
        await adminService.createRestaurant(payload);
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
      is_active: String(restaurant.is_active ?? 1),
    });
    setImageFile(null);
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus restoran ini? Menu di restoran ini juga bisa terdampak.")) return;
    try {
      await adminService.deleteRestaurant(id);
      toast.success("Restoran dihapus");
      fetchRestaurants();
    } catch {
      toast.error("Gagal menghapus restoran");
    }
  };

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat restoran...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="retro-system-copy text-[#aa3000]">Admin / Restoran</p>
          <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Restoran</h1>
          <p className="mt-2 text-[#5c4037]">Tambah, edit, nonaktifkan, dan kelola gambar restoran.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); resetForm(); }} className="retro-button retro-button-primary retro-press px-5 py-3">
          <FaPlus /> Tambah Restoran
        </button>
      </div>

      {showForm && (
        <section className="admin-window mb-6">
          <div className="admin-titlebar flex items-center px-3 retro-system-copy">
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
            <div>
              <label className="admin-label">Status</label>
              <select value={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.value })} className="admin-input">
                <option value="1">Aktif</option>
                <option value="0">Non-aktif</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Gambar Restoran</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="admin-input bg-white file:mr-4 file:border-2 file:border-[#281712] file:bg-[#ffe9e3] file:px-4 file:py-2 file:font-bold" />
              <p className="mt-2 text-xs font-bold text-[#5c4037]">{imageFile ? imageFile.name : editingId ? "Kosongkan jika tidak ingin mengganti gambar." : "Opsional."}</p>
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="admin-input" />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className="retro-button retro-button-primary retro-press px-6 py-3">{editingId ? "Simpan" : "Tambahkan"}</button>
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
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 border-2 border-[#281712] bg-[#e0e0e0] p-1 shadow-[2px_2px_0_#281712]">
                      {restaurant.image ? <img src={getImageUrl(restaurant.image)} alt={restaurant.name} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-[10px] font-bold">No Img</div>}
                    </div>
                    <span className="font-bold text-[#281712]">{restaurant.name}</span>
                  </div>
                </td>
                <td className="text-[#5c4037]">{restaurant.city || "-"}</td>
                <td className="max-w-xs truncate text-[#5c4037]">{restaurant.address || "-"}</td>
                <td className="font-black text-[#aa3000]">{restaurant.rating || "-"}</td>
                <td>
                  <span className={`admin-badge ${restaurant.is_active ? "admin-badge-active" : "admin-badge-danger"}`}>
                    {restaurant.is_active ? "Aktif" : "Non-aktif"}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(restaurant)} className="admin-icon-button text-[#005daa]"><FaEdit /></button>
                    <button onClick={() => handleDelete(restaurant.id)} className="admin-icon-button text-[#ba1a1a]"><FaTrash /></button>
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
