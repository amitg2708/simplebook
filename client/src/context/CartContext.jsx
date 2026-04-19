import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (book, qty = 1) => {
    const existing = cart.find((i) => i._id === book._id);
    let updated;
    if (existing) {
      updated = cart.map((i) =>
        i._id === book._id ? { ...i, quantity: i.quantity + qty } : i
      );
      toast.success('Cart updated!');
    } else {
      updated = [...cart, { ...book, quantity: qty }];
      toast.success('Added to cart!');
    }
    saveCart(updated);
  };

  const removeFromCart = (bookId) => {
    saveCart(cart.filter((i) => i._id !== bookId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (bookId, qty) => {
    if (qty < 1) return removeFromCart(bookId);
    saveCart(cart.map((i) => (i._id === bookId ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
