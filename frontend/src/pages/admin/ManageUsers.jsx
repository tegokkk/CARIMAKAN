import { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Gagal memuat pengguna";
      console.error("Gagal memuat pengguna:", err.response?.status, err.response?.data || err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchUsers, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role);
      toast.success("Role pengguna diperbarui");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengubah role");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Hapus pengguna ini?")) return;
    try {
      await adminService.deleteUser(userId);
      toast.success("Pengguna dihapus");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus pengguna");
    }
  };

  if (loading) return <div className="admin-window p-8 text-center retro-system-copy">Memuat pengguna...</div>;

  return (
    <div>
      <div className="mb-8">
        <p className="retro-system-copy text-[#aa3000]">Admin / Pengguna</p>
        <h1 className="retro-headline mt-2 text-4xl text-[#281712]">Kelola Pengguna</h1>
        <p className="mt-2 text-[#5c4037]">Atur role dan hapus akun pengguna.</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Role</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-bold text-[#281712]">{user.name}</td>
                <td className="text-[#5c4037]">{user.email}</td>
                <td className="text-[#5c4037]">{user.phone || "-"}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`admin-input w-32 py-2 text-xs font-black ${user.role === "admin" ? "bg-[#281712] text-[#fff8f6]" : "bg-[#d4e3ff] text-[#001c3a]"}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete(user.id)} className="admin-icon-button text-[#ba1a1a]"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-10 text-center retro-system-copy text-[#5c4037]">Belum ada pengguna</div>}
      </div>
    </div>
  );
}

export default ManageUsers;
