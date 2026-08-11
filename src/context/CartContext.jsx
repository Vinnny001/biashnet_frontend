// src/context/CartContext.jsx
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cartService } from "../services/cart.service";
import { useAuth } from "../hooks/useAuth"; // adjust import if your auth hook lives elsewhere

export const CartContext = createContext(null);

function normalizeServerItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    title: item.title,
    image: item.image,
    price: item.price,
    category: item.category,
    quantity: item.quantity,
    sellerId: item.sellerId
  };
}

export function CartProvider({ children }) {
  const { user } = useAuth(); // expects { user } with user === null when logged out
  const [localItems, setLocalItems] = useLocalStorage(STORAGE_KEYS.CART, []);
  const [serverItems, setServerItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasMergedRef = useRef(false);

  const isLoggedIn = Boolean(user);

  const refreshServerCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cartService.list();
      const list = res?.data ?? res ?? [];
      setServerItems(Array.isArray(list) ? list.map(normalizeServerItem) : []);
    } catch {
      // leave serverItems as-is on failure; don't wipe the UI
    } finally {
      setLoading(false);
    }
  }, []);

  // on login: merge any local guest cart into the server cart once, then load server cart
  useEffect(() => {
    if (!isLoggedIn) {
      hasMergedRef.current = false;
      return;
    }
    if (hasMergedRef.current) return;
    hasMergedRef.current = true;

    (async () => {
      try {
        if (localItems.length > 0) {
          await cartService.merge(localItems);
          setLocalItems([]); // clear guest cart after merging
        }
      } catch {
        // merge failure shouldn't block loading the existing server cart
      }
      await refreshServerCart();
    })();
  }, [isLoggedIn, localItems, refreshServerCart, setLocalItems]);

  const addItem = useCallback(
    async (product, quantity = 1) => {
      const productId = product.id || product._id || product.productId;

      if (!isLoggedIn) {
        setLocalItems((current) => {
          const existing = current.find((item) => item.id === productId);
          if (existing) {
            return current.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
            );
          }
          return [...current, { ...product, id: productId, quantity }];
        });
        return;
      }

      try {
        await cartService.addItem(productId, quantity);
        await refreshServerCart();
      } catch {
        // optionally surface a notification here via your NotificationContext
      }
    },
    [isLoggedIn, refreshServerCart, setLocalItems]
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (!isLoggedIn) {
        setLocalItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.id !== id)
            : current.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        return;
      }

      try {
        await cartService.updateQuantity(id, quantity);
        await refreshServerCart();
      } catch {
        // optionally notify
      }
    },
    [isLoggedIn, refreshServerCart, setLocalItems]
  );

  const removeItem = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        setLocalItems((current) => current.filter((item) => item.id !== id));
        return;
      }

      try {
        await cartService.removeItem(id);
        await refreshServerCart();
      } catch {
        // optionally notify
      }
    },
    [isLoggedIn, refreshServerCart, setLocalItems]
  );

  const clearCart = useCallback(async () => {
    if (!isLoggedIn) {
      setLocalItems([]);
      return;
    }
    try {
      await cartService.clear();
      setServerItems([]);
    } catch {
      // optionally notify
    }
  }, [isLoggedIn, setLocalItems]);

  const items = isLoggedIn ? serverItems : localItems;

  const value = useMemo(
    () => ({
      items,
      loading,
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
    [addItem, clearCart, items, loading, removeItem, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}