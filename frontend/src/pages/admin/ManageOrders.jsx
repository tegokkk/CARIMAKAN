import { useEffect, useMemo, useState } from "react";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";

const statusOptions = ["pending", "paid", "process", "done", "cancelled"];
const statusLabel = {
  pending: "Menunggu",
  paid: "Dibayar",
  process: "Diproses",
  done: "Selesai",
  cancelled: "Batal",
};

const statusClass = {
  pending: "admin-badge-warn",
  paid: "",
  process: "",
  done: "admin-badge-active",
  cancelled: "admin-badge-danger",
};

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openStatusId, setOpenStatusId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await adminService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Gagal memuat pesanan";
      console.error("Gagal memuat pesanan:", err.response?.status, err.response?.data || err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchOrders, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setOpenStatusId(null);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success("Status pesanan diupdate");
      fetchOrders();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Gagal mengupdate status";
      console.error("Gagal mengupdate status:", err.response?.status, err.response?.data || err);
      toast.error(message);
    }
  };

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !keyword ||
        order.order_code?.toLowerCase().includes(keyword) ||
        order.customer_name?.toLowerCase().includes(keyword) ||
        order.customer_phone?.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat pesanan...</div>;

  return (
    <div>
      <div className="mb-8">
        <p className="retro-system-copy text-[#aa3000]">Admin / Pesanan</p>
        <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Pesanan</h1>
        <p className="mt-2 text-[#5c4037]">Lihat dan kelola semua pesanan masuk.</p>
      </div>

      <section className="admin-panel mb-6 grid gap-3 p-4 md:grid-cols-[1fr_14rem]">
        <div>
          <label className="admin-label">Cari Pesanan</label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="admin-input"
            placeholder="Kode, nama, nomor..."
          />
        </div>
        <div>
          <label className="admin-label">Status</label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="admin-input">
            <option value="all">Semua Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{statusLabel[status]}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Pemesan</th>
              <th>Item</th>
              <th>Alamat</th>
              <th>Bayar</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="retro-system-copy text-[#5c4037]">#{order.order_code}</td>
                <td>
                  <p className="font-bold text-[#281712]">{order.customer_name}</p>
                  <p className="text-xs font-bold text-[#5c4037]">{order.customer_phone}</p>
                </td>
                <td className="text-[#5c4037]">
                  <div className="space-y-1">
                    {(order.items || []).map((item) => (
                      <div key={item.id} className="text-xs">
                        <span className="font-black text-[#281712]">{item.quantity}x</span> {item.menu_name}
                      </div>
                    ))}
                    {(order.items || []).length === 0 && <span className="text-xs font-bold">Tidak ada item</span>}
                  </div>
                </td>
                <td className="max-w-xs truncate text-[#5c4037]">{order.delivery_address}</td>
                <td><span className="admin-badge">{order.payment_method || "COD"}</span></td>
                <td className="font-black text-[#aa3000]">{formatCurrency(order.total_price)}</td>
                <td className="relative">
                  <div className="relative w-36">
                    <button
                      type="button"
                      onClick={() => setOpenStatusId((currentId) => (currentId === order.id ? null : order.id))}
                      className={`admin-status-trigger ${statusClass[order.status] || ""}`}
                      aria-expanded={openStatusId === order.id}
                    >
                      <span>{statusLabel[order.status]}</span>
                      <span aria-hidden="true">⌄</span>
                    </button>

                    {openStatusId === order.id && (
                      <div className="admin-status-menu" data-lenis-prevent>
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleStatusChange(order.id, status)}
                            className={`admin-status-option ${status === order.status ? "admin-status-option-active" : ""}`}
                          >
                            {statusLabel[status]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <div className="p-10 text-center retro-system-copy text-[#5c4037]">Pesanan tidak ditemukan</div>}
      </div>
    </div>
  );
}

export default ManageOrders;
