import { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    try {
      const res = await adminService.getCategories();
      setCategories(res.data || []);
    } catch {
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetch, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const reset = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await adminService.updateCategory(editingId, form);
        toast.success("Kategori diperbarui");
      } else {
        await adminService.createCategory(form);
        toast.success("Kategori ditambahkan");
      }
      reset();
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan kategori");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus kategori ini?")) return;
    try {
      await adminService.deleteCategory(id);
      toast.success("Kategori dihapus");
      fetch();
    } catch {
      toast.error("Gagal menghapus kategori");
    }
  };

  if (loading) {
    return <div className="admin-window p-8 text-center retro-system-copy">Memuat kategori...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="retro-system-copy text-[#aa3000]">Admin / Kategori</p>
          <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Kategori</h1>
          <p className="mt-2 text-[#5c4037]">Tambah dan kelola kelompok menu.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); reset(); }} className="retro-button retro-button-primary retro-press px-5 py-3">
          <FaPlus /> Tambah Kategori
        </button>
      </div>

      {showForm && (
        <section className="admin-window mb-6">
          <div className="admin-titlebar flex items-center px-3 retro-system-copy">
            {editingId ? "Edit.kategori" : "Tambah.kategori"}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <label className="admin-label">Nama Kategori</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" placeholder="Misal: Nasi, Ayam, Kopi" />
            </div>
            <div>
              <label className="admin-label">Deskripsi</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input" placeholder="Deskripsi singkat" />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className="retro-button retro-button-primary retro-press px-6 py-3">{editingId ? "Simpan" : "Tambahkan"}</button>
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="retro-button retro-press px-6 py-3">Batal</button>
            </div>
          </form>
        </section>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Slug</th>
              <th>Deskripsi</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="font-bold text-[#281712]">{cat.name}</td>
                <td className="retro-system-copy text-[#5c4037]">{cat.slug}</td>
                <td className="text-[#5c4037]">{cat.description || "-"}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(cat)} className="admin-icon-button text-[#005daa]"><FaEdit /></button>
                    <button onClick={() => handleDelete(cat.id)} className="admin-icon-button text-[#ba1a1a]"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <div className="p-10 text-center retro-system-copy text-[#5c4037]">Belum ada kategori</div>}
      </div>
    </div>
  );
}

export default ManageCategories;
