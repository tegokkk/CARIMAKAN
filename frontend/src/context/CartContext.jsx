import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import cartService from "../services/cart.service";
import { AuthContext } from "./AuthContextValue";
import { CartContext } from "./CartContextValue";

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
    const timeoutId = window.setTimeout(() => {
      refreshCart();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshCart]);

  const addToCart = useCallback(async (menuId, quantity = 1) => {
    await cartService.addToCart(menuId, quantity);
    return refreshCart();
  }, [refreshCart]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    await cartService.updateCartItem(cartItemId, quantity);
    return refreshCart();
  }, [refreshCart]);

  const removeFromCart = useCallback(async (cartItemId) => {
    await cartService.removeFromCart(cartItemId);
    return refreshCart();
  }, [refreshCart]);

  const clearCart = useCallback(async () => {
    await cartService.clearCart();
    setCart([]);
  }, []);

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
  }), [cart, loadingCart, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
