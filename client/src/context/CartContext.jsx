import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('lpukart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lpukart_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product.inStock) {
      toast.error('Item is currently out of stock!');
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        toast.success(`Updated ${product.name} quantity in cart`);
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success(`Added ${product.name} to cart!`);
        return [...prev, { product, quantity, selected: true }];
      }
    });

    // If authenticated, sync with server cart
    if (user) {
      axios.post('/api/cart/add', { productId: product._id, quantity }).catch(() => {});
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
    if (user) {
      axios.put('/api/cart/update', { productId, quantity }).catch(() => {});
    }
  };

  const toggleSelect = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
    toast.success('Removed item from cart');
    if (user) {
      axios.delete('/api/cart/remove', { data: { productId } }).catch(() => {});
    }
  };

  const removeSelected = () => {
    const selectedIds = items.filter((i) => i.selected).map((i) => i.product._id);
    if (selectedIds.length === 0) {
      toast('No items selected for removal', { icon: 'ℹ️' });
      return;
    }
    setItems((prev) => prev.filter((item) => !item.selected));
    toast.success('Removed selected items');
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      axios.delete('/api/cart/clear').catch(() => {});
    }
  };

  const selectedItems = items.filter((item) => item.selected);

  const cartTotal = selectedItems.reduce((acc, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedItems,
        addToCart,
        updateQuantity,
        toggleSelect,
        removeFromCart,
        removeSelected,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
