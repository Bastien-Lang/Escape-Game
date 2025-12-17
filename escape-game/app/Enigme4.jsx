/* Enigme4.jsx */
import { useState, useEffect } from "react";
import Item from "./components/Item";
import { useInventory } from "./context/InventoryContext";
import ModalClock from "./components/ModalClock";
import ModalCode from "./components/ModalCode";
import ModalNote from "./components/ModalNote"; // 👈 On importe la nouvelle modale

export default function Enigme4() {
    const { addItem } = useInventory();
    
    const [solved, setSolved] = useState({
        clock: false,
        chest: false
    });

    // État mis à jour pour inclure 'note'
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const savedClock = localStorage.getItem("e4_clock_solved") === "true";
        const savedChest = localStorage.getItem("e4_chest_solved") === "true";
        setSolved({ clock: savedClock, chest: savedChest });
    }, []);

    const handleClockSuccess = () => {
        const rung1 = {
            id: 'ladder_rung_1',
            name: 'Bâton d’échelle (A)',
            img: '/assets/images/rung.png',
            icon: '🪵'
        };
        addItem(rung1);
        setSolved(prev => ({ ...prev, clock: true }));
        setActiveModal(null);
    };

    const handleChestCode = (code) => {
        if (code === "8246") {
            const rung2 = {
                id: 'ladder_rung_2',
                name: 'Bâton d’échelle (B)',
                img: '/assets/images/rung.png',
                icon: '🪵'
            };
            addItem(rung2);
            setSolved(prev => ({ ...prev, chest: true }));
            setActiveModal(null);
            return true;
        } else {
            alert("Le verrou refuse de tourner...");
            return false;
        }
    };

    return (
        <div className="relative h-full w-full">
            {/* L'Horloge */}
            <div onClick={() => !solved.clock && setActiveModal('clock')}>
                <Item 
                    item={{
                        id: 'clock',
                        name: solved.clock ? "Horloge réparée" : "Horloge ancienne",
                        img:"/assets/clock.png"
                    }} 
                    top={"top-[20%]"} 
                    left={"left-[30%]"} 
                />
            </div>

            {/* Le Papier (Note) - Nouveau ! */}
            <div onClick={() => setActiveModal('note')}>
                <Item 
                    item={{
                        id: 'note',
                        name: "Une note griffonnée",
                        img: "/assets/papier.png"
                    }} 
                    top={"top-[70%]"} 
                    left={"left-[20%]"} 
                />
            </div>

            {/* Le Coffre */}
            <div onClick={() => !solved.chest && setActiveModal('chest')}>
                <Item 
                    item={{
                        id: 'chest',
                        name: solved.chest ? "Coffre vide" : "Coffre scellé",
                        img: solved.chest ? "/assets/coffre_open.png" : "/assets/coffre.png"
                    }} 
                    top={"top-[50%]"} 
                    left={"left-[60%]"} 
                />
            </div>

            {/* Rendu conditionnel des modales */}
            {activeModal === 'clock' && (
                <ModalClock 
                    onClose={() => setActiveModal(null)} 
                    onSuccess={handleClockSuccess} 
                />
            )}

            {activeModal === 'chest' && (
                <ModalCode 
                    onClose={() => setActiveModal(null)} 
                    onCodeSubmit={handleChestCode} 
                />
            )}

            {/* Nouvelle Modale Note */}
            {activeModal === 'note' && (
                <ModalNote 
                    onClose={() => setActiveModal(null)} 
                    code="8246" 
                />
            )}
        </div>
    );
}