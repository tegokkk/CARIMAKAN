import api from "./api";

const menuService = {
  getAllMenus: async (params = {}) => {
    const response = await api.get("/menus", { params });
    // API response: { success, message, data: [...menus] }
    return response.data?.data || [];
  },
  getMenuById: async (id) => {
    const response = await api.get(`/menus/${id}`);
    return response.data?.data || response.data;
  },
  getStats: async () => {
    const response = await api.get("/menus/stats");
    return response.data?.data || {};
  },
};

export default menuService;
