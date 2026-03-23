// Cart Service - Client-side cart management
import { Storage, MathUtils } from '../utils/index.js';

export const CartService = {
  getCart: () => {
    return Storage.getCart();
  },

  addItem: (product) => {
    const cart = Storage.getCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      cart.push({
        id: product.id,
        farmerId: product.farmerId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1,
        availableQuantity: product.availableQuantity,
      });
    }

    Storage.setCart(cart);
    return cart;
  },

  removeItem: (productId) => {
    const cart = Storage.getCart();
    const filteredCart = cart.filter((item) => item.id !== productId);
    Storage.setCart(filteredCart);
    return filteredCart;
  },

  updateQuantity: (productId, quantity) => {
    const cart = Storage.getCart();
    const item = cart.find((item) => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        return CartService.removeItem(productId);
      }
      if (quantity > item.availableQuantity) {
        item.quantity = item.availableQuantity;
      } else {
        item.quantity = quantity;
      }
    }

    Storage.setCart(cart);
    return cart;
  },

  clearCart: () => {
    Storage.removeCart();
  },

  getCartTotal: () => {
    const cart = Storage.getCart();
    return cart.reduce((total, item) => {
      return total + MathUtils.calculateTotalPrice(item.price, item.quantity);
    }, 0);
  },

  getCartItemsCount: () => {
    const cart = Storage.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  getCartSummary: () => {
    const cart = Storage.getCart();
    const subtotal = CartService.getCartTotal();
    const itemCount = CartService.getCartItemsCount();

    // Group items by farmer
    const itemsByFarmer = {};
    cart.forEach((item) => {
      if (!itemsByFarmer[item.farmerId]) {
        itemsByFarmer[item.farmerId] = [];
      }
      itemsByFarmer[item.farmerId].push(item);
    });

    return {
      items: cart,
      itemsByFarmer,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount,
      totalItems: cart.length,
    };
  },

  // Validate cart items (check availability and update prices)
  validateCart: async (productsData) => {
    const cart = Storage.getCart();
    const updatedCart = cart.filter((cartItem) => {
      const product = productsData.find((p) => p.id === cartItem.id);
      if (!product) return false; // Product removed

      // Update price in case it changed
      cartItem.price = product.price;
      cartItem.availableQuantity = product.availableQuantity;

      // Remove if not available
      return product.isAvailable && product.availableQuantity > 0;
    });

    Storage.setCart(updatedCart);
    return updatedCart;
  },
};

export default CartService;
