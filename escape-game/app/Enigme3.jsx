/* Enigme3.jsx */
import { useState, useEffect } from "react";
import Item from "./components/Item";
import { useInventory } from "./context/InventoryContext";
import ModalNenuphar from "./components/ModalNenuphar";

const NENUPHARS_CONFIG = [
  { id: 'nenu1', img: "/assets/e3nn1.png", pos: { top: 'top-[90%]', left: 'left-[33%]' } },
  { id: 'nenu2', img: "/assets/e3nn2.png", pos: { top: 'top-[89%]', left: 'left-[49%]' } },
  { id: 'nenu3', img: "/assets/e3nn3.png", pos: { top: 'top-[88%]', left: 'left-[40%]' } },
  { id: 'nenu4', img: "/assets/e3nn4.png", pos: { top: 'top-[89%]', left: 'left-[59%]' } },
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

      {isModalOpen && (
        <ModalNenuphar
          onClose={() => setIsModalOpen(false)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}