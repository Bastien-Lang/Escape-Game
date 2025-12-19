"use client";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import InventoryModal from "../app/components/InventoryModal";
import { useInventory } from "../app/context/InventoryContext";
import ItemObtainedModal from "../app/components/ItemObtainedModal";
import Enigme1 from "./Enigme1";
import StartScreen from "../app/components/StartScreen";
import Enigme3 from "./Enigme3";
import Enigme4 from "./Enigme4";

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
  const audioRef = useRef(null); // 🎵 Réf pour la musique

  const [openInventory, setOpenInventory] = useState(false);
  const { hasItem, addItem } = useInventory();

  const [minecartClickCount, setMinecartClickCount] = useState(0);
  const [mineState, setMineState] = useState('initial');
  const [isMinecartVideoPlaying, setIsMinecartVideoPlaying] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [isLiannePlaying, setIsLiannePlaying] = useState(false);
  const [isChestVideoPlaying, setIsChestVideoPlaying] = useState(false);
  const [isClockVideoPlaying, setIsClockVideoPlaying] = useState(false);
  const [isEndingVideoPlaying, setIsEndingVideoPlaying] = useState(false);

  const showImageWithoutFog = hasItem("key");
  const showLushCaveWithoutFog = hasItem("key_mineshaft");
  const hasMineshaftKey = hasItem("key_mineshaft");

  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);

  // 🎵 Lancement du jeu et de la musique
  const handleStart = () => {
    setIsGameStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(e => console.error("Erreur audio:", e));
    }
  };


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  // 1. LOGIQUE GSAP
  useLayoutEffect(() => {
    if (!isGameStarted || !mainRef.current) return;
    const ctx = gsap.context(() => {
      const setupHorizontalScroll = (sectionId, contentClass) => {
        const section = document.querySelector(sectionId);
        const content = section?.querySelector(contentClass);
        if (!section || !content) return;
        gsap.to(content, {
          x: "-50%",
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
    return () => ctx.revert();
  }, [isGameStarted]);

  // 2. CURSEUR
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--x", e.clientX + "px");
      document.documentElement.style.setProperty("--y", e.clientY + "px");
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🎬 SURVEILLANCE DE LA FIN (2 bâtons)
  useEffect(() => {
    if (hasItem("ladder_rung_1") && hasItem("ladder_rung_2") && !isEndingVideoPlaying) {
      const timer = setTimeout(() => {
        setIsEndingVideoPlaying(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasItem, isEndingVideoPlaying]);

  // 3. LOGIQUE MINECART / REPARATION
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
    if ((mineState === 'initial' || mineState === 'returned') && hasItem(REPAIR_PART.id) && !hasMineshaftKey) {
      addItem({ id: 'key_mineshaft', name: 'Droit de passage', icon: '🗝️' });
    }
  };

  // 4. GESTION DES VIDEOS MINECART
  useEffect(() => {
    const videoId = mineState === 'video_aller' ? 'minecart-video' :
      mineState === 'video_retour' ? 'minecart-video-retour' : null;
    if (!videoId) return;
    const videoElement = document.getElementById(videoId);
    if (videoElement) {
      const onVideoEnd = () => {
        setIsMinecartVideoPlaying(false);
        if (mineState === 'video_aller') setMineState('mineshaft');
        if (mineState === 'video_retour') setMineState('returned');
      };
      videoElement.addEventListener('ended', onVideoEnd);
      videoElement.play().catch(e => console.error(e));
      return () => videoElement.removeEventListener('ended', onVideoEnd);
    }
  }, [mineState]);

  // SCROLL AUTO
  useEffect(() => {
    if (hasMineshaftKey) {
      setTimeout(() => { window.location.hash = '#lushcave-section'; }, 500);
    }
  }, [hasMineshaftKey]);

  useEffect(() => {
    if (isGameStarted && lastSectionRef.current && mainRef.current) {
      mainRef.current.scrollTop = lastSectionRef.current.offsetTop;
    }
  }, [isGameStarted]);

  // CLASSES DYNAMIQUES
  const mineshaftBgClass = (() => {
    if (!showImageWithoutFog) return 'fog';
    switch (mineState) {
      case 'initial': case 'video_aller': return 'mineshaft_img_1';
      case 'mineshaft': case 'video_retour': return 'mineshaft_img_2';
      case 'returned': return 'mineshaft_final';
      default: return 'mineshaft_img_1';
    }
  })();

  const lushCaveBgClass = (() => {
    if (!showLushCaveWithoutFog) return 'fog-lushcave';
    if (hasItem("golden_key")) return 'lushcave_final';
    if (mineState === 'liane_done') return 'lushcave_liane_ouverte';
    return 'lushcave_liane_fermee';
  })();

  return (
    <main ref={mainRef} className="h-screen overflow-y-auto">
      {/* 🎵 Element Audio */}
      <audio ref={audioRef} src="/assets/bande son.mp3" loop />
      {/* 🔊 CONTRÔLEUR DE VOLUME PERMANENT */}
      {isGameStarted && (
        <div className="fixed bottom-4 left-4 z-[60] flex items-center gap-3 bg-slate-800/80 p-3 rounded-full border border-slate-600 backdrop-blur-sm transition-all hover:bg-slate-800">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-xl hover:scale-110 transition-transform"
          >
            {isMuted || volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      )}

      {isGameStarted ? (
        <>
          <section id="liberte-section" className="h-screen flex flex-col items-center justify-center liberte text-white"></section>

          <section id="lushcave-section" className="h-screen overflow-hidden">
            <div className={`maison flex w-[200vw] h-full relative ${lushCaveBgClass}`}>
              <div className="w-screen grid place-items-center relative">
                {showLushCaveWithoutFog && (
                  <Enigme4
                    onChestOpen={() => setIsChestVideoPlaying(true)}
                    onClockOpen={() => setIsClockVideoPlaying(true)}
                  />
                )}
              </div>
              <div className="w-screen grid place-items-center relative">
                {showLushCaveWithoutFog && (
                  <>
                    <Enigme3 />
                    {!isLiannePlaying && (
                      <button onClick={() => setIsLiannePlaying(true)} className="absolute w-70 h-50 z-50 bg-transparent cursor-pointer" style={{ top: '0%', left: '15%' }}></button>
                    )}
                  </>
                )}
              </div>

              {/* Vidéos de transition */}
              {isLiannePlaying && <video autoPlay onEnded={() => { setIsLiannePlaying(false); setMineState('liane_done'); }} className="absolute left-0 top-0 w-full h-full object-cover z-30" src="/assets/lushcave-lianne.mp4" />}
              {isChestVideoPlaying && <video autoPlay onEnded={() => setIsChestVideoPlaying(false)} className="absolute left-0 top-0 w-full h-full object-cover z-30" src="/assets/ouverture_coffre.mp4" />}
              {isClockVideoPlaying && <video autoPlay onEnded={() => setIsClockVideoPlaying(false)} className="absolute left-0 top-0 w-full h-full object-cover z-30" src="/assets/ouverture_horloge.mp4" />}
            </div>
          </section>

          <section id="mineshaft" className="h-screen overflow-hidden">
            <div className={`caverne flex w-[200vw] h-full relative ${mineshaftBgClass}`}>
              <div className="w-screen relative">
                {showImageWithoutFog && !hasItem(REPAIR_PART.id) && mineState === 'mineshaft' && !isMinecartVideoPlaying && (
                  <button onClick={handleRepairPartPickup} className="absolute w-20 h-20 z-20" style={{ top: '30%', left: '20%' }}><img src={REPAIR_PART.img} className="w-full opacity-80" /></button>
                )}
                {showImageWithoutFog && mineState === 'mineshaft' && !isMinecartVideoPlaying && (
                  <button onClick={handleLeverClick} className="absolute w-40 h-20 z-40" style={{ top: '70%', left: '10%' }}><img src={LEVER_ITEM.img} /></button>
                )}
              </div>
              <div className="w-screen relative grid place-items-center">
                {showImageWithoutFog && mineState === 'initial' && !isMinecartVideoPlaying && <button onClick={handleMinecartClick} className="absolute w-140 h-50 z-50 " style={{ top: '68%', left: '28%' }}></button>}
                {showImageWithoutFog && !hasMineshaftKey && !isMinecartVideoPlaying && (mineState === 'initial' || mineState === 'returned') && (
                  <button onClick={handleRepairLocationClick} className="absolute w-40 h-40 z-20" style={{ top: '68%', left: '62%' }}><img src={REPAIR_LOCATION.img} /></button>
                )}
              </div>
              {mineState === 'video_aller' && <video id='minecart-video' src='/assets/Minecart_Aller.mp4' muted playsInline className="absolute left-0 top-0 w-full h-full object-cover z-30" />}
              {mineState === 'video_retour' && <video id='minecart-video-retour' src='/assets/Minecart_Retour.mp4' muted playsInline className="absolute left-0 top-0 w-full h-full object-cover z-30" />}
            </div>
          </section>

          <section ref={lastSectionRef} className="image-mine_deepslate h-screen">
            <Enigme1 />
          </section>

          <button onClick={() => setOpenInventory(true)} className="fixed top-4 right-4 z-40 bg-slate-700 text-white px-4 py-2 rounded">Inventaire</button>
          <InventoryModal open={openInventory} onClose={() => setOpenInventory(false)} />
          <ItemObtainedModal />

          {/* 🎬 GÉNÉRIQUE DE FIN */}
          {isEndingVideoPlaying && (
            <video
              autoPlay
              className="fixed inset-0 w-screen h-screen object-cover z-[100] bg-black"
              src="/assets/generiquevf.mp4"
              onPlay={() => { if (audioRef.current) audioRef.current.pause(); }} // Coupe la musique pendant le film
              onEnded={() => { window.location.reload(); }}
            />
          )}
        </>
      ) : (
        <StartScreen onStart={handleStart} />
      )}
    </main>
  );
}