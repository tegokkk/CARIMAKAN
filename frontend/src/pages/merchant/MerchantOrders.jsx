import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";
import { FaPrint } from "react-icons/fa";

const statusOptions = ["pending", "accepted", "processing", "ready", "done", "cancelled"];
const statusLabel = {
  pending: "Menunggu",
  accepted: "Diterima",
  processing: "Diproses",
  ready: "Siap",
  done: "Selesai",
  cancelled: "Batal",
};

const statusClass = {
  pending: "admin-badge-warn",
  accepted: "",
  processing: "",
  ready: "",
  done: "admin-badge-active",
  cancelled: "admin-badge-danger",
};

function MerchantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openStatusId, setOpenStatusId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/merchant/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      toast.error("Gagal memuat pesanan");
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
      await api.put(`/merchant/orders/${orderId}/status`, { status: newStatus });
      toast.success("Status pesanan diupdate");
      fetchOrders();
    } catch (err) {
      toast.error("Gagal mengupdate status");
    }
  };

  const handlePrint = (order) => {
    const receiptWindow = window.open('', '_blank', 'width=400,height=600');
    if (!receiptWindow) return;

    const itemsHtml = (order.items || order.OrderItems || []).map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <div style="flex: 1;">${item.quantity}x ${item.menu?.name || item.menu_name}</div>
        <div>${formatCurrency(item.price * item.quantity)}</div>
      </div>
    `).join('');

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Cetak Struk #${order.orderCode || order.order_code}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 14px; padding: 20px; color: #000; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .footer { text-align: center; margin-top: 20px; border-top: 2px dashed #000; padding-top: 10px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${order.restaurant?.name || 'Toko CariMakan'}</h2>
            <div>Struk Pesanan</div>
            <div>Order ID: #${order.orderCode || order.order_code}</div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <div class="row"><span>Pelanggan:</span> <span>${order.customerName || order.customer_name}</span></div>
            <div class="row"><span>No HP:</span> <span>${order.customerPhone || order.customer_phone}</span></div>
            <div class="row"><span>Tipe Bayar:</span> <span>${order.paymentMethod || order.payment_method}</span></div>
            <div class="row"><span>Waktu:</span> <span>${new Date(order.createdAt || order.created_at).toLocaleString('id-ID')}</span></div>
          </div>
          
          <div style="border-bottom: 2px dashed #000; margin-bottom: 10px; padding-bottom: 10px;">
            <div class="row bold"><span>Item</span><span>Subtotal</span></div>
            ${itemsHtml}
          </div>
          
          <div class="row bold" style="font-size: 16px;">
            <span>TOTAL:</span>
            <span>${formatCurrency(order.totalPrice || order.total_price)}</span>
          </div>
          
          <div class="footer">
            <div>Terima kasih atas pesanan Anda!</div>
            <div>CariMakan OS</div>
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return orders.filter((order) => {
      const orderCode = order.orderCode || order.order_code || "";
      const customerName = order.customerName || order.customer_name || "";
      const customerPhone = order.customerPhone || order.customer_phone || "";
      const matchesSearch =
        !keyword ||
        orderCode.toLowerCase().includes(keyword) ||
        customerName.toLowerCase().includes(keyword) ||
        customerPhone.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat pesanan...</div>;

  return (
    <div>
      <div className="mb-8">
        <p className="retro-system-copy text-[#2e7d32]">Merchant / Pesanan</p>
        <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Pesanan</h1>
        <p className="mt-2 text-[#5c4037]">Lihat, proses, dan cetak struk pesanan yang masuk ke toko Anda.</p>
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
              <th>Bayar</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="retro-system-copy text-[#5c4037]">#{order.orderCode || order.order_code}</td>
                <td>
                  <p className="font-bold text-[#281712]">{order.customerName || order.customer_name}</p>
                  <p className="text-xs font-bold text-[#5c4037]">{order.customerPhone || order.customer_phone}</p>
                </td>
                <td className="text-[#5c4037]">
                  <div className="space-y-1">
                    {(order.items || order.OrderItems || []).map((item) => (
                      <div key={item.id} className="text-xs">
                        <span className="font-black text-[#281712]">{item.quantity}x</span> {item.menu?.name || item.menu_name}
                      </div>
                    ))}
                    {(order.items || order.OrderItems || []).length === 0 && <span className="text-xs font-bold">Tidak ada item</span>}
                  </div>
                </td>
                <td>
                  <span className="admin-badge">{order.paymentMethod || order.payment_method || "COD"}</span>
                  <div className="mt-1 text-[10px] font-bold text-[#2e7d32]">
                    {(order.paymentStatus || order.payment_status) === "paid" ? "Sudah Dibayar" : "Belum Dibayar"}
                  </div>
                </td>
                <td className="font-black text-[#2e7d32]">{formatCurrency(order.totalPrice || order.total_price)}</td>
                <td className="relative">
                  <div className="relative w-36">
                    <button
                      type="button"
                      onClick={() => setOpenStatusId((currentId) => (currentId === order.id ? null : order.id))}
                      className={`admin-status-trigger ${statusClass[order.status] || ""}`}
                      aria-expanded={openStatusId === order.id}
                    >
                      <span>{statusLabel[order.status] || order.status}</span>
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
                <td>
                  <button onClick={() => handlePrint(order)} className="retro-button px-3 py-2 text-sm" style={{ borderColor: '#2e7d32', color: '#2e7d32' }} title="Cetak Struk">
                    <FaPrint /> Cetak
                  </button>
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

export default MerchantOrders;
