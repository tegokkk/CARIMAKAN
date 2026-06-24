import api from "./api";

const reviewService = {
  getReviewsByMenu: async (menuId) => {
    const response = await api.get(`/menus/${menuId}/reviews`);
    return response.data;
  },
  createReview: async (menuId, data) => {
    const response = await api.post(`/menus/${menuId}/reviews`, data);
    return response.data;
  },
};

export default reviewService;
