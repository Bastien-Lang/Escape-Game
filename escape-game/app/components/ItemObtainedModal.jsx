"use client";
import { useInventory } from "../context/InventoryContext";

export default function ItemObtainedModal() {
  const { obtainedItem, setObtainedItem } = useInventory();

  if (!obtainedItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        onClick={() => setObtainedItem(null)}
        className="
          bg-zinc-900 text-white
          px-8 py-6
          rounded-xl
          border-2 border-emerald-500
          text-center
          animate-[pop_0.25s_ease-out]
        "
      >
        <p className="text-sm uppercase opacity-60 mb-2">
          Objet obtenu
        </p>

        <div className="text-4xl mb-3">
          {obtainedItem.icon}
        </div>

        <p className="text-xl font-bold">
          {obtainedItem.name}
        </p>
      </div>
    </div>
  );
}
