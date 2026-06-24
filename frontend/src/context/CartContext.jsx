import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import cartService from "../services/cart.service";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const normalizeCartItem = (item) => ({
  ...item,
  Menu: item.Menu || {
    id: item.menu_id,
    name: item.name,
    price: Number(item.price) || 0,
    image: item.image,
    stock: item.stock,
    restaurant_name: item.restaurant_name,
  },
});

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return [];
    }

    setLoadingCart(true);
    try {
      const response = await cartService.getCart();
      const items = (response.data || []).map(normalizeCartItem);
      setCart(items);
      return items;
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
      return [];
    } finally {
      setLoadingCart(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (menuId, quantity = 1) => {
    await cartService.addToCart(menuId, quantity);
    return refreshCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await cartService.updateCartItem(cartItemId, quantity);
    return refreshCart();
  };

  const removeFromCart = async (cartItemId) => {
    await cartService.removeFromCart(cartItemId);
    return refreshCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart([]);
  };

  const getCartTotal = useCallback(
    () => cart.reduce((total, item) => total + (Number(item.Menu?.price) || 0) * item.quantity, 0),
    [cart]
  );

  const value = useMemo(() => ({
    cart,
    loadingCart,
    refreshCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  }), [cart, loadingCart, refreshCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
