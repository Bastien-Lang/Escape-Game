import { useState } from "react";
import Item from "./components/Item";
import { useInventory } from "./context/InventoryContext";
import ModalCode from "./components/ModalCode";


const PUZZLE_CONFIGS = [
    {
        id: 'box1',
        name: 'Boîte verrouillée',
        type: 'code', // Type 1: Nécessite un code
        code: '4',
        initialImg: "/assets/e1Box.png",
        openImg: "/assets/e1BoxOpen.png",
        position: { bottom: 'bottom-[2%]', left: 'left-[10%]' },
        prerequisiteItemId: null,
        reward: { id: 'axe', name: 'Hache d’aventurier', img: '/assets/images/axe.png', icon: '🪓' },
        nextLocation: null
    },
    {
        id: 'box2',
        name: 'Boîte en bois fragile',
        type: 'prerequisite-only', // Type 2: Nécessite un prérequis, pas de code ni de modale
        code: null, // Pas de code
        initialImg: "/assets/e1BoxRight.png",
        openImg: "/assets/e1BoxRightOpen.png",
        position: { bottom: 'bottom-[2%]', right: 'right-[2%]' },
        prerequisiteItemId: 'axe', // REQUIERT la hache
        reward: { id: 'dynamite', name: 'Dynamite', img: '/assets/images/dynamite.png', icon: '💣' },
        nextLocation: null
    },
    {
        id: 'pierres',
        name: 'Pierres',
        type: 'prerequisite-only', // Type 2: Nécessite un prérequis, pas de code ni de modale
        code: null, // Pas de code
        initialImg: "/assets/e1Pierres.png",
        openImg: "#",
        position: { top: 'top-[40%]', right: 'right-[10%]', width: 'w-[50%]', height: 'h-[50%]' },
        nextLocation: '#mineshaft',
        prerequisiteItemId: 'dynamite',
        reward: { id: 'key', name: 'Droit de passage', img: '#', icon: '' }
    }
];


export default function Enigme1() {
    // !!! MODIFICATION : Retrait de 'removeItem' du hook useInventory
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

        // 1. !!! LIGNE RETIRÉE : La suppression de l'item prérequis est annulée.
        // if (puzzle.prerequisiteItemId) {
        //     removeItem(puzzle.prerequisiteItemId); 
        // }

        // 2. Ajout de la récompense
        addItem(puzzle.reward);

        // 3. Mise à jour du statut d'ouverture
        setOpenStatuses(prev => ({
            ...prev,
            [puzzle.id]: true,
        }));

        // 4. Redirection si une nouvelle localisation est définie
        if (puzzle.nextLocation) {
            setTimeout(() => {
                window.location.hash = puzzle.nextLocation;
            }, 800);
        }
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
            console.log(`Il manque l'objet ${puzzle.prerequisiteItemId} pour ouvrir cette boîte.`);
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
                
                // NOUVEAU: Vérifie si l'élément doit être masqué (résolu ET openImg est '#')
                if (isOpened && puzzle.openImg === "#") {
                    return null; // Ne rend rien si la condition de disparition est remplie
                }

                // ... le reste du code de définition d'item est le même ...
                const itemDefinition = {
                    id: puzzle.id,
                    name: isOpened ? `${puzzle.name} (vide)` : puzzle.name,
                    icon: isOpened ? (puzzle.openImg ? puzzle.reward.icon : '✅') : (isReady ? '❓' : '🔒'),
                    // L'image reste l'image initiale si openImg est '#'
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