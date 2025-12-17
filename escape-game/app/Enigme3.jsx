/* Enigme3.jsx */
import { useState, useEffect } from "react";
import Item from "./components/Item";
import { useInventory } from "./context/InventoryContext";
import ModalNenuphar from "./components/ModalNenuphar";

const NENUPHARS_CONFIG = [
  { id: 'nenu1', img: "/assets/e3nn1.png", pos: { top: 'top-[20%]', left: 'left-[15%]' } },
  { id: 'nenu2', img: "/assets/e3nn2.png", pos: { top: 'top-[25%]', left: 'left-[45%]' } },
  { id: 'nenu3', img: "/assets/e3nn3.png", pos: { top: 'top-[60%]', left: 'left-[30%]' } },
  { id: 'nenu4', img: "/assets/e3nn4.png", pos: { top: 'top-[55%]', left: 'left-[65%]' } },
];

export default function Enigme3() {
  const { addItem, hasItem } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  // Chargement de la progression
  useEffect(() => {
    const saved = localStorage.getItem("enigme3_resolved");
    if (saved === "true") setIsResolved(true);
  }, []);

  const handleResolve = () => {
    const keyItem = {
      id: 'golden_key',
      name: 'Clé Dorée',
      img: '/assets/images/key.png',
      icon: '🔑'
    };
    addItem(keyItem);
    setIsResolved(true);
    setIsModalOpen(false);
  };

  return (
    <div className="relative h-full w-full">
      {/* Affichage des nénuphars sur la scène */}
      {NENUPHARS_CONFIG.map((nenu) => (
        <div key={nenu.id} onClick={() => !isResolved && setIsModalOpen(true)}>
          <Item 
            item={{ id: nenu.id, name: "Nénuphar", img: nenu.img }} 
            {...nenu.pos} 
          />
        </div>
      ))}

      {/* Message si déjà résolu */}
      {isResolved && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-amber-900/80 p-2 rounded border border-amber-600 text-amber-100">
          Les nénuphars brillent d'une lueur dorée...
        </div>
      )}

      {isModalOpen && (
        <ModalNenuphar 
          onClose={() => setIsModalOpen(false)} 
          onResolve={handleResolve} 
        />
      )}
    </div>
  );
}