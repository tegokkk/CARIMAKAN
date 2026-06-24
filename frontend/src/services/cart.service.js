import api from "./api";

const cartService = {
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },
  addToCart: async (menu_id, quantity = 1) => {
    const response = await api.post("/cart", { menu_id, quantity });
    return response.data;
  },
  updateCartItem: async (cartItemId, quantity) => {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },
  removeFromCart: async (cartItemId) => {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  },
};

export default cartService;
