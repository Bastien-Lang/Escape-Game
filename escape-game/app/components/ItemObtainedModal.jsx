"use client";
import { useInventory } from "../context/InventoryContext";

export default function ItemObtainedModal() {
  const { obtainedItem, setObtainedItem } = useInventory();

  if (!obtainedItem) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div
        onClick={() => setObtainedItem(null)}
        className="
          bg-amber-900 text-amber-100          
          border-4 border-amber-950 
          shadow-[4px_4px_0_rgba(0,0,0,0.5)]
          rounded-md         
          px-10 py-8 
          text-center
          animate-[pop_0.25s_ease-out]
          cursor-pointer        
          font-serif
        "
        style={{ 
            // Ajout d'une texture simulée (optionnel, nécessite une classe custom ou un style)
            // Par exemple, on pourrait utiliser 'backgroundImage: url(/path/to/texture.jpg)'
            minWidth: '300px'
        }}
      >
        <p className="
          text-sm 
          uppercase 
          text-yellow-400
          mb-3 
          tracking-wider 
          font-semibold
        ">
          Objet obtenu !
        </p>

        <div className="
          text-6xl
          mb-4 
          text-yellow-200
        ">
          {obtainedItem.icon}
        </div>

        <p className="
          text-2xl 
          font-extrabold 
          text-white
          mb-4
        ">
          {obtainedItem.name}
        </p>

        <p className="text-xs italic opacity-80 mt-4 border-t border-amber-800 pt-2">
            (Cliquez pour continuer l'aventure)
        </p>
      </div>
    </div>
  );
}