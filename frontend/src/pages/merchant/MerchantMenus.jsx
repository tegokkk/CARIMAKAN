import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/getImageUrl";

const emptyForm = {
  name: "", description: "", price: "", restaurantId: "", categoryId: "",
  image_url: "", stock: "0", isRecommended: "0", isActive: "1",
};

function MerchantMenus() {
  const [menus, setMenus] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchAll = async () => {
    try {
      const [menuRes, restRes, catRes] = await Promise.all([
        api.get("/merchant/menus"),
        api.get("/merchant/restaurants"),
        api.get("/categories"),
      ]);
      setMenus(menuRes.data.data || []);
      setRestaurants(restRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchAll, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      restaurantId: Number(form.restaurantId),
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      image: form.image_url,
      stock: Number(form.stock),
      isRecommended: Boolean(Number(form.isRecommended)),
      isActive: Boolean(Number(form.isActive))
    };

    try {
      if (editingId) {
        await api.put(`/merchant/menus/${editingId}`, payload);
        toast.success("Menu diperbarui");
      } else {
        await api.post("/merchant/menus", payload);
        toast.success("Menu ditambahkan");
      }
      resetForm();
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan menu");
    }
  };

  const handleEdit = (menu) => {
    setForm({
      name: menu.name,
      description: menu.description || "",
      price: menu.price,
      restaurantId: menu.restaurantId,
      categoryId: menu.categoryId || "",
      image_url: /^https?:\/\//i.test(menu.image || "") ? menu.image : "",
      stock: menu.stock || "0",
      isRecommended: menu.isRecommended ? "1" : "0",
      isActive: menu.isActive ? "1" : "0",
    });
    setEditingId(menu.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus menu ini?")) return;
    try {
      await api.delete(`/merchant/menus/${id}`);
      toast.success("Menu dihapus");
      fetchAll();
    } catch {
      toast.error("Gagal menghapus menu");
    }
  };

  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return menus.filter((menu) => {
      const matchesSearch =
        !keyword ||
        menu.name?.toLowerCase().includes(keyword) ||
        menu.restaurant?.name?.toLowerCase().includes(keyword) ||
        menu.category?.name?.toLowerCase().includes(keyword);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "1" ? menu.isActive : !menu.isActive);
      const matchesCategory =
        categoryFilter === "all" ||
        String(menu.categoryId) === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [menus, search, statusFilter, categoryFilter]);

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat menu...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="retro-system-copy text-[#2e7d32]">Merchant / Menu</p>
          <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Menu</h1>
          <p className="mt-2 text-[#5c4037]">Tambah, edit, dan kelola katalog makanan.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); resetForm(); }} className="retro-button retro-button-primary retro-press px-5 py-3" style={{ backgroundColor: '#2e7d32' }}>
          <FaPlus /> Tambah Menu
        </button>
      </div>

      {showForm && (
        <section className="admin-window mb-6 border-[#2e7d32]">
          <div className="admin-titlebar flex items-center px-3 retro-system-copy" style={{ backgroundColor: '#2e7d32' }}>
            {editingId ? "Edit.menu" : "Tambah.menu"}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <label className="admin-label">Nama Menu</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Harga</label>
              <input type="number" name="price" required value={form.price} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Restoran</label>
              <select name="restaurantId" required value={form.restaurantId} onChange={handleChange} className="admin-input">
                <option value="">Pilih Restoran</option>
                {restaurants.map((restaurant) => <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Kategori</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="admin-input">
                <option value="">Pilih Kategori</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Stok</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Aktif</label>
              <select name="isActive" value={form.isActive} onChange={handleChange} className="admin-input">
                <option value="1">Aktif</option>
                <option value="0">Non-aktif</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">URL Gambar Menu</label>
              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://example.com/menu.jpg"
                className="admin-input"
              />
              <p className="mt-2 text-xs font-bold text-[#5c4037]">Gunakan URL gambar agar tampil permanen di Netlify.</p>
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Deskripsi</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="admin-input" />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button type="submit" className="retro-button retro-button-primary retro-press px-6 py-3" style={{ backgroundColor: '#2e7d32' }}>{editingId ? "Simpan" : "Tambahkan"}</button>
              <button type="button" onClick={() => { setShowForm(false); }} className="retro-button retro-press px-6 py-3">Batal</button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-panel mb-6 grid gap-3 p-4 md:grid-cols-[1fr_12rem_14rem]">
        <div>
          <label className="admin-label">Cari Menu</label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="admin-input"
            placeholder="Nama, restoran, kategori..."
          />
        </div>
        <div>
          <label className="admin-label">Status</label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="admin-input">
            <option value="all">Semua</option>
            <option value="1">Aktif</option>
            <option value="0">Non-aktif</option>
          </select>
        </div>
        <div>
          <label className="admin-label">Kategori</label>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="admin-input">
            <option value="all">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Menu</th>
              <th>Restoran</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Unggulan</th>
              <th>Aktif</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenus.map((menu) => (
              <tr key={menu.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 border-2 border-[#281712] bg-[#e0e0e0] p-1 shadow-[2px_2px_0_#281712]">
                      {menu.image ? <img src={getImageUrl(menu.image)} alt={menu.name} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-[10px] font-bold">No Img</div>}
                    </div>
                    <span className="font-bold text-[#281712]">{menu.name}</span>
                  </div>
                </td>
                <td className="text-[#5c4037]">{menu.restaurant?.name || "-"}</td>
                <td className="text-[#5c4037]">{menu.category?.name || "-"}</td>
                <td className="font-black text-[#2e7d32]">{formatCurrency(menu.price)}</td>
                <td>
                  {menu.isRecommended ? (
                    <span className="admin-badge admin-badge-active">⭐ Unggulan</span>
                  ) : (
                    <span className="admin-badge">-</span>
                  )}
                </td>
                <td>
                  <span className={`admin-badge ${menu.isActive ? "admin-badge-active" : "admin-badge-danger"}`}>
                    {menu.isActive ? "Aktif" : "Non-aktif"}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(menu)} className="admin-icon-button text-[#005daa]"><FaEdit /></button>
                    <button onClick={() => handleDelete(menu.id)} className="admin-icon-button text-[#ba1a1a]"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMenus.length === 0 && <div className="p-10 text-center retro-system-copy text-[#5c4037]">Menu tidak ditemukan</div>}
      </div>
    </div>
  );
}

export default MerchantMenus;
