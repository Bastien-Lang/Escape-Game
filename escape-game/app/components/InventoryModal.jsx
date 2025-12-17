"use client";
import { useInventory } from "../context/InventoryContext";

const SLOT_COUNT = 9;

export default function InventoryModal({ open, onClose }) {
  const { items } = useInventory();

  if (!open) return null;

  return (
    // Le conteneur ne change pas, il s'agit juste de l'ancrage
    <div className="fixed inset-0 z-50 pointer-events-none">
      
      {/* HUD container */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        
        {/* Le cadre de l'inventaire : couleur bois/cuir foncé, bordure épaisse */}
        <div className="
            bg-amber-950/90 // Fond bois très foncé, légèrement transparent
            p-4 // Padding accru pour encadrer les slots
            rounded-lg 
            border-4 border-amber-900 // Bordure extérieure épaisse
            shadow-xl
        ">
          <div className="grid grid-cols-9 gap-2">
            {Array.from({ length: SLOT_COUNT }).map((_, index) => {
              const item = items[index];

              return (
                <div
                  key={index}
                  className={`
                    w-12 h-12
                    
                    // Fond des slots : couleur de toile ou de vieux métal
                    bg-amber-700 
                    
                    // Bordure des slots : aspect de métal vieilli ou de clous
                    border-2 border-amber-900
                    
                    // Ombre intérieure pour simuler la profondeur
                    shadow-inner shadow-black/50

                    flex items-center justify-center
                    text-2xl // Icônes légèrement plus grandes pour l'impact
                    text-white
                    
                    // Ajout d'une surbrillance si le slot contient un objet
                    ${item ? 'border-yellow-400 shadow-yellow-800' : 'border-amber-900'}
                  `}
                >
                  {/* Utilisation de l'image de l'item si elle existe, sinon l'icône */}
                  {item ? item.icon || "" : (
                      // Optionnel : ajouter un petit indicateur visuel de slot vide
                      <span className="text-sm opacity-30 text-amber-500">_</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="
            block mx-auto mt-3 
            text-amber-100 // Texte de couleur claire
            opacity-70 hover:opacity-100 
            text-xs // Texte plus petit
            tracking-wider // Espacement pour l'aspect HUD
          "
        >
          FERMER INVENTAIRE
        </button>
      </div>
    </div>
  );
}