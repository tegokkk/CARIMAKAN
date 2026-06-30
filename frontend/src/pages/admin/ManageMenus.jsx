import { useEffect, useMemo, useState } from "react";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/getImageUrl";

function ManageMenus() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchAll = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        adminService.getMenus({ limit: 100 }),
        adminService.getCategories(),
      ]);
      setMenus(menuRes.data || []);
      setCategories(catRes.data || []);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus menu ini secara permanen?")) return;
    try {
      await adminService.deleteMenu(id);
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
        menu.restaurant_name?.toLowerCase().includes(keyword) ||
        menu.category_name?.toLowerCase().includes(keyword);
      const matchesStatus =
        statusFilter === "all" ||
        String(menu.is_active) === statusFilter;
      const matchesCategory =
        categoryFilter === "all" ||
        String(menu.category_id) === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [menus, search, statusFilter, categoryFilter]);

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat menu...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="retro-system-copy text-[#aa3000]">Admin / Menu</p>
          <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Pantau Menu</h1>
          <p className="mt-2 text-[#5c4037]">Lihat semua katalog makanan dan hapus jika melanggar ketentuan.</p>
        </div>
      </div>

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
              <th>Status Aktif</th>
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
                <td className="text-[#5c4037]">{menu.restaurant_name || "-"}</td>
                <td className="text-[#5c4037]">{menu.category_name || "-"}</td>
                <td className="font-black text-[#aa3000]">{formatCurrency(menu.price)}</td>
                <td>
                  <span className={`admin-badge ${menu.is_active ? "admin-badge-active" : "admin-badge-danger"}`}>
                    {menu.is_active ? "Aktif" : "Non-aktif (Oleh Toko)"}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleDelete(menu.id)} className="admin-icon-button text-[#ba1a1a]" title="Hapus Menu Permanen"><FaTrash /></button>
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

export default ManageMenus;
