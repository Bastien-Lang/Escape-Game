"use client";
import { useInventory } from "../context/InventoryContext";

const SLOT_COUNT = 9;

export default function InventoryModal({ open, onClose }) {
  const { items } = useInventory();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* HUD container */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-black/70 p-3 rounded-xl border border-gray-600">
          <div className="grid grid-cols-9 gap-2">
            {Array.from({ length: SLOT_COUNT }).map((_, index) => {
              const item = items[index];

              return (
                <div
                  key={index}
                  className="
                    w-12 h-12
                    bg-gray-700
                    border-2 border-gray-500
                    flex items-center justify-center
                    text-xl
                  "
                >
                  {item ? item.icon : ""}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="block mx-auto mt-3 text-white opacity-60 hover:opacity-100 text-sm"
        >
          fermer inventaire
        </button>
      </div>
    </div>
  );
}
