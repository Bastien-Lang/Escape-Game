"use client";
import { createContext, useContext, useState } from "react";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [obtainedItem, setObtainedItem] = useState(null);

  const addItem = (item) => {
    setItems((prev) =>
        prev.find((i) => i.id === item.id) ? prev : [...prev, item]
    );
        setObtainedItem(item);

    // auto close après 2s
    setTimeout(() => {
      setObtainedItem(null);
    }, 2000);
  };

  const hasItem = (id) => items.some((i) => i.id === id);

  return (
    <InventoryContext.Provider value={{ items, addItem, hasItem, obtainedItem, setObtainedItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
