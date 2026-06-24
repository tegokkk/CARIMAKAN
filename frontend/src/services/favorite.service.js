import api from "./api";

const favoriteService = {
  getFavorites: () => api.get("/favorites"),
  addFavorite: (menuId) => api.post(`/favorites/${menuId}`),
  removeFavorite: (menuId) => api.delete(`/favorites/${menuId}`),
};

export default favoriteService;
