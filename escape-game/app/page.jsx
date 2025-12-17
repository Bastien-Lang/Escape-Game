"use client";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import InventoryModal from "../app/components/InventoryModal";
import { useInventory } from "../app/context/InventoryContext";
import ItemObtainedModal from "../app/components/ItemObtainedModal";
import Enigme1 from "./Enigme1";
import StartScreen from "../app/components/StartScreen";

// Configuration GSAP globale
gsap.registerPlugin(ScrollTrigger);

const MINECART_CLICKS_REQUIRED = 8;

const REPAIR_PART = {
  id: 'repair_part',
  name: 'Pièce de réparation',
  img: '/assets/piere_reparation.png',
  icon: '⚙️'
};

const LEVER_ITEM = {
  id: 'lever',
  name: 'Levier',
  img: '/assets/levier.png',
  icon: '🕹️'
};

const REPAIR_LOCATION = {
  id: 'repair_location',
  name: 'Jonction des Rails',
  img: '/assets/endroit_a_reparer.png',
  icon: '🔨'
};

export default function Home() {
  const mainRef = useRef(null);
  const lastSectionRef = useRef(null);
  const [openInventory, setOpenInventory] = useState(false);
  const { hasItem, addItem } = useInventory();

  const [minecartClickCount, setMinecartClickCount] = useState(0);
  const [mineState, setMineState] = useState('initial'); // 'initial', 'video_aller', 'mineshaft', 'video_retour'
  const [isMinecartVideoPlaying, setIsMinecartVideoPlaying] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const showImageWithoutFog = hasItem("key");
  const hasMineshaftKey = hasItem("key_mineshaft");

  const handleStart = () => {
    setIsGameStarted(true);
  };

  // 1. LOGIQUE GSAP (Défilement Horizontal)
  // On utilise isGameStarted en dépendance car les éléments n'existent pas avant.
  useLayoutEffect(() => {
    if (!isGameStarted || !mainRef.current) return;

    // Nettoyage au cas où (pour le Fast Refresh de Next.js)
    const ctx = gsap.context(() => {
      const setupHorizontalScroll = (sectionId, contentClass) => {
        const section = document.querySelector(sectionId);
        const content = section?.querySelector(contentClass);

        if (!section || !content) return;

        gsap.to(content, {
          x: "-50%", // Puisque ton contenu fait 200vw, on déplace de la moitié
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scroller: mainRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      };

      setupHorizontalScroll("#lushcave-section", ".maison");
      setupHorizontalScroll("#mineshaft", ".caverne");
    }, mainRef);

    return () => ctx.revert(); // Nettoyage propre des triggers
  }, [isGameStarted]);

  // 2. CURSEUR LUMINEUX
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--x", e.clientX + "px");
      document.documentElement.style.setProperty("--y", e.clientY + "px");
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3. LOGIQUE DE JEU (Minecart & Réparation)
  const handleMinecartClick = () => {
    if (hasMineshaftKey || isMinecartVideoPlaying) return;

    setMinecartClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= MINECART_CLICKS_REQUIRED) {
        setMineState('video_aller');
        setIsMinecartVideoPlaying(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleLeverClick = () => {
    if (mineState === 'mineshaft' && !isMinecartVideoPlaying) {
      if (!hasItem(REPAIR_PART.id)) {
        alert("Le levier est cassé ! Il faut trouver la pièce de réparation (⚙️).");
        return;
      }
      setMineState('video_retour');
      setIsMinecartVideoPlaying(true);
    }
  };

  const handleRepairPartPickup = () => {
    if (mineState === 'mineshaft' && !hasItem(REPAIR_PART.id) && !isMinecartVideoPlaying) {
      addItem(REPAIR_PART);
    }
  };

  const handleRepairLocationClick = () => {
    if (mineState === 'initial' && hasItem(REPAIR_PART.id) && !hasMineshaftKey) {
      addItem({ id: 'key_mineshaft', name: 'Droit de passage', icon: '🗝️' });
    } else if (mineState === 'initial' && !hasItem(REPAIR_PART.id)) {
      alert("Cet endroit nécessite la pièce de réparation (⚙️).");
    }
  };

  // 4. GESTION DES VIDÉOS
  useEffect(() => {
    const videoId = mineState === 'video_aller' ? 'minecart-video' :
      mineState === 'video_retour' ? 'minecart-video-retour' : null;

    if (!videoId) return;

    const videoElement = document.getElementById(videoId);
    if (videoElement) {
      const onVideoEnd = () => {
        setIsMinecartVideoPlaying(false);
        if (mineState === 'video_aller') setMineState('mineshaft');
        if (mineState === 'video_retour') setMineState('initial');
      };
      videoElement.addEventListener('ended', onVideoEnd);
      videoElement.play().catch(e => console.error("Erreur lecture vidéo:", e));
      return () => videoElement.removeEventListener('ended', onVideoEnd);
    }
  }, [mineState]);

  // 5. SCROLL AUTO APRÈS ÉNIGMES
  useEffect(() => {
    if (hasMineshaftKey) {
      setTimeout(() => {
        window.location.hash = '#lushcave-section';
      }, 500);
    }
  }, [hasMineshaftKey]);

  useEffect(() => {
    if (isGameStarted && lastSectionRef.current && mainRef.current) {
      mainRef.current.scrollTop = lastSectionRef.current.offsetTop;
    }
  }, [isGameStarted]);

  const mineshaftBgClass = !showImageWithoutFog ? 'fog' :
    (mineState === 'mineshaft' ? 'mineshaft_img_2' : 'mineshaft_img_1');

  return (
    <main ref={mainRef} className="h-screen overflow-y-auto">
      {isGameStarted ? (
        <>
          <section id="liberte-section" className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
            <h1 className="text-4xl font-bold mb-4">Section de la liberté</h1>
          </section>

          <section id="lushcave-section" className="h-screen overflow-hidden">
            <div className={`maison flex w-[200vw] h-full ${showImageWithoutFog ? 'fond_lushcave' : 'fog'}`}>
              <div className="w-screen grid place-items-center">
                <h2 className="text-3xl font-bold text-black">Maison</h2>
              </div>
              <div className="w-screen grid place-items-center">
                <h2 className="text-3xl font-bold text-black">Lushcave</h2>
              </div>
            </div>
          </section>

          <section id="mineshaft" className="h-screen overflow-hidden">
            <div className={`caverne flex w-[200vw] h-full relative ${mineshaftBgClass}`}>

              {/* ÉCRAN 1 (Gauche) */}
              <div className="w-screen relative">
                {!hasItem(REPAIR_PART.id) && mineState === 'mineshaft' && !isMinecartVideoPlaying && (
                  <button onClick={handleRepairPartPickup} className="absolute w-20 h-20 z-20" style={{ top: '30%', left: '20%' }}>
                    <img src={REPAIR_PART.img} alt="item" className="w-full opacity-80" />
                  </button>
                )}
                {mineState === 'mineshaft' && !isMinecartVideoPlaying && (
                  <button onClick={handleLeverClick} className="absolute w-20 h-20 z-20" style={{ top: '80%', left: '10%' }}>
                    <img src={LEVER_ITEM.img} alt="levier" className={hasItem(REPAIR_PART.id) ? '' : 'grayscale opacity-50'} />
                  </button>
                )}
              </div>

              {/* ÉCRAN 2 (Droite) */}
              <div className="w-screen relative grid place-items-center">
                {mineState === 'initial' && !isMinecartVideoPlaying && (
                  <button onClick={handleMinecartClick} className="absolute w-60 h-40 z-20 bg-white/10" style={{ top: '68%', left: '15%' }}>
                    <span className="text-white">Minecart ({minecartClickCount}/{MINECART_CLICKS_REQUIRED})</span>
                  </button>
                )}
                {!hasMineshaftKey && !isMinecartVideoPlaying && (
                  <button onClick={handleRepairLocationClick} className="absolute w-40 h-40 z-20" style={{ top: '65%', left: '35%' }}>
                    <img src={REPAIR_LOCATION.img} className={hasItem(REPAIR_PART.id) ? '' : 'grayscale opacity-50'} />
                  </button>
                )}
                <h2 className="text-3xl font-bold text-white">Caverne de Départ</h2>
              </div>

              {/* VIDÉOS */}
              {mineState === 'video_aller' && (
                <video id='minecart-video' src='/assets/Minecart_Aller.mp4' muted playsInline className="absolute left-0 top-0 w-full h-full object-cover z-30" />
              )}
              {mineState === 'video_retour' && (
                <video id='minecart-video-retour' src='/assets/Minecart_Retour.mp4' muted playsInline className="absolute left-0 top-0 w-full h-full object-cover z-30" />
              )}
            </div>
          </section>

          <section ref={lastSectionRef} className="image-mine_deepslate h-screen">
            <Enigme1 />
          </section>

          <button onClick={() => setOpenInventory(true)} className="fixed top-4 right-4 z-40 bg-slate-700 text-white px-4 py-2 rounded">
            Inventaire
          </button>

          <InventoryModal open={openInventory} onClose={() => setOpenInventory(false)} />
          <ItemObtainedModal />
        </>
      ) : (
        <StartScreen onStart={handleStart} />
      )}
    </main>
  );
}