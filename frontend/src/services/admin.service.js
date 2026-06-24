import api from "./api";

const adminService = {
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },
  getAllUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get("/orders", { params });
      return response.data;
    } catch (error) {
      if (error.response?.status !== 404) throw error;
      const response = await api.get("/admin/orders", { params });
      return response.data;
    }
  },
  updateOrderStatus: async (orderId, status) => {
    const payload = { status };
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, payload);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) throw error;
      const response = await api.put(`/orders/${orderId}/status`, payload);
      return response.data;
    }
  },
  // Categories
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
  // Restaurants
  getRestaurants: async (params = {}) => {
    const response = await api.get("/restaurants", { params });
    return response.data;
  },
  createRestaurant: async (data) => {
    const response = await api.post("/restaurants", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
  updateRestaurant: async (id, data) => {
    const response = await api.put(`/restaurants/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
  deleteRestaurant: async (id) => {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },
  // Menus
  getMenus: async (params = {}) => {
    const response = await api.get("/menus", { params: { includeInactive: 1, ...params } });
    return response.data;
  },
  createMenu: async (formData) => {
    const response = await api.post("/menus", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  updateMenu: async (id, formData) => {
    const response = await api.put(`/menus/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  deleteMenu: async (id) => {
    const response = await api.delete(`/menus/${id}`);
    return response.data;
  },
};

export default adminService;
