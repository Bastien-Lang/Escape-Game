import { useState } from "react"; 
import Item from "./components/Item";
import { useInventory } from "./context/InventoryContext";
import ModalCode from "./components/ModalCode";

// --- Configuration des Énigmes ---
const PUZZLE_CONFIGS = [
    {
        id: 'box1',
        name: 'Boîte verrouillée',
        type: 'code', // Type 1: Nécessite un code
        code: '4', 
        initialImg: "/assets/e1Box.png",
        openImg: "/assets/e1BoxOpen.png",
        position: { top: 'bottom-15', left: 'left-20' },
        prerequisiteItemId: null,
        reward: { id: 'axe', name: 'Hache d’aventurier', img: '/assets/images/axe.png', icon: '🪓' }
    },
    {
        id: 'box2',
        name: 'Boîte en bois fragile',
        type: 'prerequisite-only', // Type 2: Nécessite un prérequis, pas de code ni de modale
        code: null, // Pas de code
        initialImg: "/assets/e1BoxRight.png",
        openImg: "/assets/e1BoxRightOpen.png",
        position: { top: 'bottom-15', right: 'right-20' },
        prerequisiteItemId: 'axe', // REQUIERT la hache
        reward: { id: 'dynamite', name: 'Dynamite', img: '/assets/images/dynamite.png', icon: '💣' }
    },
    {
        id: 'pierres',
        name: 'Pierres',
        type: 'prerequisite-only', // Type 2: Nécessite un prérequis, pas de code ni de modale
        code: null, // Pas de code
        initialImg: "/assets/e1Pierres.png",
        openImg: null,
        position: { top: 'bottom-15', right: 'right-20' },
        prerequisiteItemId: 'dynamite',
        reward: { id: 'key', name: '', img: '#', icon: '' }
    }
];


export default function Enigme1() {
    const { addItem, hasItem } = useInventory();
    
    const [openStatuses, setOpenStatuses] = useState(
        PUZZLE_CONFIGS.reduce((acc, puzzle) => ({ ...acc, [puzzle.id]: false }), {})
    );
    
    const [modalState, setModalState] = useState({
        isOpen: false,
        activePuzzle: null,
    });
    
    // Fonction qui donne la récompense et ouvre la boîte
    const solvePuzzle = (puzzle) => {
        addItem(puzzle.reward);
        setOpenStatuses(prev => ({
            ...prev,
            [puzzle.id]: true,
        }));
    };

    // Gestion du clic sur n'importe quel Item
    function handleClickBox(puzzle) {
        const isOpened = openStatuses[puzzle.id];
        
        if (isOpened) {
            console.log(`La boîte ${puzzle.id} est déjà vide.`);
            return;
        }

        // 1. Vérifie les prérequis (applicable aux deux types)
        const isReady = !puzzle.prerequisiteItemId || hasItem(puzzle.prerequisiteItemId);
        if (!isReady) {
            return;
        }
        
        // 2. Logique spécifique au type
        if (puzzle.type === 'code') {
            // Ouvre la modale pour le code
            setModalState({
                isOpen: true,
                activePuzzle: puzzle,
            });
        } else if (puzzle.type === 'prerequisite-only') {
            // Si le prérequis est rempli et qu'il n'y a pas de code, résout immédiatement l'énigme
            solvePuzzle(puzzle);
        }
    }

    // Gère la soumission du code (uniquement utilisé par le type 'code')
    function checkCode(code) {
        const activePuzzle = modalState.activePuzzle;
        
        if (code === activePuzzle.code) {
            solvePuzzle(activePuzzle); // Utilise la fonction de résolution centralisée
            handleCloseModal();
            return true;

        } else {
            alert("Code incorrect !");
            return false;
        }
    }
    
    function handleCloseModal() {
        setModalState({ ...modalState, isOpen: false });
    }
    
    return (
        <div className="relative h-full w-full">
            {PUZZLE_CONFIGS.map(puzzle => {
                const isOpened = openStatuses[puzzle.id];
                const isReady = !puzzle.prerequisiteItemId || hasItem(puzzle.prerequisiteItemId);
                
                const itemDefinition = {
                    id: puzzle.id,
                    name: isOpened ? `${puzzle.name} (vide)` : puzzle.name,
                    icon: isOpened ? puzzle.reward.icon : (isReady ? '❓' : '🔒'),
                    img: isOpened ? puzzle.openImg : puzzle.initialImg,
                };
                return (
                    <div 
                        id={puzzle.id}
                        key={puzzle.id} 
                        onClick={() => handleClickBox(puzzle)}

                    >
                        <Item 
                            item={itemDefinition} 
                            {...puzzle.position}
                        />
                    </div>
                );
            })}

            {/* La modale s'affiche uniquement si l'énigme active est de type 'code' */}
            {modalState.isOpen && modalState.activePuzzle.type === 'code' && (
                <ModalCode 
                    onClose={handleCloseModal} 
                    onCodeSubmit={checkCode} 
                />
            )}
        </div>
    );
}