// useCart Hook
import { useState, useCallback } from 'react';
import CartService from '../services/cartService.js';

export const useCart = () => {
  const [cart, setCart] = useState(() => CartService.getCart());
  const [cartTotal, setCartTotal] = useState(() => CartService.getCartTotal());
  const [itemCount, setItemCount] = useState(() => {
    const initial = CartService.getCart();
    return initial.reduce((acc, item) => acc + item.quantity, 0);
  });

  // Initialize cart from storage
  const updateCartMetrics = (cartItems) => {
    const total = CartService.getCartTotal();
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartTotal(total);
    setItemCount(count);
  };

  // initial metrics are derived from storage during state initialization

  const addToCart = useCallback((product) => {
    const updatedCart = CartService.addItem(product);
    setCart(updatedCart);
    updateCartMetrics(updatedCart);
  }, []);

  const removeFromCart = useCallback((productId) => {
    const updatedCart = CartService.removeItem(productId);
    setCart(updatedCart);
    updateCartMetrics(updatedCart);
  }, []);

  const updateItemQuantity = useCallback((productId, quantity) => {
    const updatedCart = CartService.updateQuantity(productId, quantity);
    setCart(updatedCart);
    updateCartMetrics(updatedCart);
  }, []);

  const clearCart = useCallback(() => {
    CartService.clearCart();
    setCart([]);
    setCartTotal(0);
    setItemCount(0);
  }, []);

  const getCartSummary = useCallback(() => {
    return CartService.getCartSummary();
  }, []);

  return {
    cart,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    getCartSummary,
  };
};

export default useCart;
