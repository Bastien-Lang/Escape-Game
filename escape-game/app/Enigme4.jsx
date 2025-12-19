/* Enigme4.jsx */
import { useState, useEffect } from "react";
import Item from "./components/Item";
import { useInventory } from "./context/InventoryContext";
import ModalClock from "./components/ModalClock";
import ModalCode from "./components/ModalCode";
import ModalNote from "./components/ModalNote";

// 💡 Récupération des deux props pour les vidéos
export default function Enigme4({ onChestOpen, onClockOpen }) {
    const { addItem, hasItem } = useInventory();

    const [solved, setSolved] = useState({
        clock: false,
        chest: false
    });

    const [activeModal, setActiveModal] = useState(null);

    const canSeeEnigme4 = hasItem("golden_key");

    const handleClockSuccess = () => {
        const rung1 = {
            id: 'ladder_rung_1',
            name: 'Bâton d’échelle (A)',
            img: '/assets/images/rung.png',
            icon: '🪵'
        };

        // 🎬 Déclenchement de la vidéo horloge
        if (onClockOpen) {
            onClockOpen();
        }

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

            // 🎬 Déclenchement de la vidéo coffre
            if (onChestOpen) {
                onChestOpen();
            }

            addItem(rung2);
            setSolved(prev => ({ ...prev, chest: true }));
            setActiveModal(null);

            return true;
        } else {
            alert("Le verrou refuse de tourner...");
            return false;
        }
    };

    if (!canSeeEnigme4) {
        return null;
    }

    return (
        <div className="relative h-full w-full">
            {/* L'Horloge */}
            <div onClick={() => !solved.clock && setActiveModal('clock')}>
                <Item
                    item={{
                        id: 'clock',
                        name: solved.clock ? "Horloge réparée" : "Horloge ancienne",
                        img: solved.clock ? "/assets/open_clock.png" : "/assets/clock.png"
                    }}
                    top={"top-[20%]"}
                    left={"left-[44%]"}
                />
            </div>

            {/* Le Papier (Note) */}
            <div onClick={() => setActiveModal('note')}>
                <Item
                    item={{
                        id: 'note',
                        name: "Une note griffonnée",
                        img: "/assets/papier.png"
                    }}
                    top={"bottom-[5%]"}
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
                    top={"top-[60%]"}
                    left={"left-[40%]"}
                />
            </div>

            {activeModal === 'clock' && (
                <ModalClock onClose={() => setActiveModal(null)} onSuccess={handleClockSuccess} />
            )}

            {activeModal === 'chest' && (
                <ModalCode onClose={() => setActiveModal(null)} onCodeSubmit={handleChestCode} />
            )}

            {activeModal === 'note' && (
                <ModalNote onClose={() => setActiveModal(null)} code="8246" />
            )}
        </div>
    );
}