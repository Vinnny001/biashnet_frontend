import { createContext, useCallback, useMemo } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.CART, []);

  const addItem = useCallback(
    (product, quantity = 1) => {
      setItems((current) => {
        const id = product.id || product._id;
        const existing = current.find((item) => item.id === id);

        if (existing) {
          return current.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }

        return [...current, { ...product, id, quantity }];
      });
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      setItems((current) =>
        quantity <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [setItems]
  );

  const removeItem = useCallback(
    (id) => setItems((current) => current.filter((item) => item.id !== id)),
    [setItems]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + Number(item.quantity || 0), 0),
      total: items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
      addItem,
      updateQuantity,
      removeItem,
      clearCart
    }),
    [addItem, clearCart, items, removeItem, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
