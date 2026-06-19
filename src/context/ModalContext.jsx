import { createContext, useCallback, useMemo, useState } from "react";

export const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const openModal = useCallback((content, options = {}) => {
    setModal({ content, options });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const value = useMemo(
    () => ({ modal, openModal, closeModal }),
    [closeModal, modal, openModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
