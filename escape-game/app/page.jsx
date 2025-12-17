"use client";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import LottieAnimation from "../app/components/LottieAnimation";
import test from "../public/lottie/test.json";
import InventoryModal from "../app/components/InventoryModal";
import { useInventory } from "../app/context/InventoryContext";
import ItemObtainedModal from "../app/components/ItemObtainedModal";
import Enigme1 from "./Enigme1";

gsap.registerPlugin(ScrollTrigger);
const MINECART_CLICKS_REQUIRED = 8;

// 🚨 NOUVELLE CONSTANTE : Définition des objets de l'Enigme 2
const REPAIR_PART = {
  id: 'repair_part',
  name: 'Pièce de réparation',
  img: '/assets/piere_reparation.png', // Utilisez le chemin public relatif
  icon: '⚙️'
};
const LEVER_ITEM = {
  id: 'lever',
  name: 'Levier',
  img: '/assets/levier.png', // Utilisez le chemin public relatif
  icon: '🕹️'
};
const REPAIR_LOCATION = {
  id: 'repair_location',
  name: 'Jonction des Rails',
  img: '/assets/endroit_a_reparer.png', // Chemin public relatif
  icon: '🔨'
};
export default function Home() {
  const mainRef = useRef(null);
  const lastSectionRef = useRef(null);
  const [openInventory, setOpenInventory] = useState(false);
  // Destructuration de l'inventaire pour la logique
  const { hasItem, addItem } = useInventory();
  const showImageWithoutFog = hasItem("key");

  const hasClickedMinecart = false;
  const hasClickedLever = false;
  // Définition de la variable pour la clé Mineshaft
  const hasMineshaftKey = hasItem("key_mineshaft");
  const showImageTwo = hasMineshaftKey

  const [minecartClickCount, setMinecartClickCount] = useState(0);
  const [mineState, setMineState] = useState('initial'); // 'initial', 'video_aller', 'mineshaft', 'video_retour'
  const [isMinecartVideoPlaying, setIsMinecartVideoPlaying] = useState(false);



  // LOGIQUE CURSEUR 
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--x", e.clientX + "px");
      document.documentElement.style.setProperty("--y", e.clientY + "px");
    };

    document.addEventListener("mousemove", handleMouseMove);

    // cleanup obligatoire
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMinecartClick = () => {
    // Si l'utilisateur a déjà la clé de mineshaft (a terminé l'énigme), on ignore les clics
    if (hasMineshaftKey || isMinecartVideoPlaying) {
      return;
    }

    setMinecartClickCount(prevCount => {
      const newCount = prevCount + 1;

      if (newCount >= MINECART_CLICKS_REQUIRED) {
        console.log("Minecart: Clicks max atteints, déclenchement de la vidéo 'Aller'.");
        setMineState('video_aller');
        setIsMinecartVideoPlaying(true);
        // Réinitialise le compteur après le déclenchement
        return 0;
      }

      console.log(`Minecart: Click ${newCount}/${MINECART_CLICKS_REQUIRED}`);
      return newCount;
    });
  };

  // 🚨 NOUVELLE FONCTION : Gère le clic sur le levier (à l'état 'mineshaft')
  const handleLeverClick = () => {
    // Doit être dans l'état 'mineshaft' (après la vidéo aller) pour pouvoir cliquer
    if (mineState === 'mineshaft' && !isMinecartVideoPlaying) {

      // ✅ VÉRIFICATION DU PRÉREQUIS : la pièce de réparation
      if (!hasItem(REPAIR_PART.id)) {
        console.log("Le levier est cassé, il manque la pièce de réparation !");
        alert("Le levier est cassé ! Il faut trouver la pièce de réparation (⚙️) pour le réparer.");
        return; // Bloque l'action
      }

      console.log("Lever: Clé obtenue et déclenchement de la vidéo 'Retour'.");



      setMineState('video_retour');
      setIsMinecartVideoPlaying(true);
    }
  };

  const handleRepairPartPickup = () => {
    // CORRECTION : Ne peut être ramassé qu'une fois et seulement si nous sommes sur l'Écran 1 (state 'mineshaft')
    if (mineState === 'mineshaft' && !hasItem(REPAIR_PART.id) && !isMinecartVideoPlaying) {
      addItem(REPAIR_PART);
      console.log("Pièce de réparation ramassée !");
      // Optionnel : vous pourriez changer un état pour masquer le hotspot si addItem ne le gère pas
    }
  }
  const handleRepairLocationClick = () => {
    // Peut être réparé uniquement si :
    // 1. Nous sommes à l'état initial (retour du Minecart).
    // 2. L'utilisateur a la pièce de réparation.
    // 3. La clé n'a pas encore été obtenue.
    const hasPart = hasItem(REPAIR_PART.id);

    if (mineState === 'initial' && hasPart && !hasMineshaftKey) {
      console.log("Jonction réparée. Clé Mineshaft obtenue.");

      // La réparation donne la clé Mineshaft
      addItem({ id: 'key_mineshaft', name: 'Droit de passage (Réparé)', icon: '🗝️' });
      // Optionnel: Ajoutez ici une logique pour supprimer la REPAIR_PART de l'inventaire
      // (Si vous n'avez pas removeItem dans useInventory, vous pouvez l'ignorer pour l'instant)

      // Optionnel: Mettez un état pour marquer l'endroit comme définitivement réparé/fini si besoin

    } else if (mineState === 'initial' && !hasPart) {
      alert("Cet endroit nécessite la pièce de réparation (⚙️) pour fonctionner.");
    } else if (hasMineshaftKey) {
      console.log("Déjà réparé et terminé.");
    }
  };
  // 1. LOGIQUE GSAP (Défilement Horizontal) - Vient de la branche HEAD
  useLayoutEffect(() => {
    const scroller = mainRef.current;
    if (!scroller) return;

    // Fonction de configuration du défilement horizontal GSAP
    const setupHorizontalScroll = (sectionId, contentClass) => {
      const section = document.querySelector(sectionId);
      if (!section) return;

      const content = section.querySelector(contentClass);
      if (!content) return;

      gsap.to(content, {
        x: -window.innerWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
    };

    setupHorizontalScroll("#lushcave-section", ".maison");
    setupHorizontalScroll("#mineshaft", ".caverne");

    ScrollTrigger.refresh();
  }, []);

  // 2. LOGIQUE DE SCROLL INITIAL (Positionnement sur la dernière section) - Vient de la branche modals
  useEffect(() => {
    const el = mainRef.current;
    const section = lastSectionRef.current;

    if (el && section) {
      // Positionne le scroll au début de la dernière section ('Mine Deeplase')
      el.scrollTop = section.offsetTop;
    }
  }, []);


  useEffect(() => {
    if (mineState === 'video_aller') {
      const videoElement = document.getElementById('minecart-video');
      if (videoElement) {
        const onVideoEnd = () => {
          console.log("Vidéo 'Aller' terminée. Passage à l'état 'mineshaft'.");
          setIsMinecartVideoPlaying(false);
          setMineState('mineshaft'); // L'utilisateur est maintenant dans la section Mineshaft
          // Ici, vous pouvez ajouter la clé si l'énigme est complète

          videoElement.removeEventListener('ended', onVideoEnd);
        };
        videoElement.addEventListener('ended', onVideoEnd);
        videoElement.play();
        return () => videoElement.removeEventListener('ended', onVideoEnd);
      }
    } else if (mineState === 'video_retour') {
      const videoElement = document.getElementById('minecart-video-retour');
      if (videoElement) {
        const onVideoEnd = () => {
          console.log("Vidéo 'Retour' terminée. Tentative de retour à l'état 'initial' avec délai.");

          // 🚨 CORRECTION IMPLÉMENTÉE : Utilisation de setTimeout pour garantir l'ordre de désactivation/changement d'état
          setIsMinecartVideoPlaying(false);

          setTimeout(() => {
            setMineState('initial'); // Retour à l'état initial
          }, 100); // 100 ms de délai

          videoElement.removeEventListener('ended', onVideoEnd);
        };
        videoElement.addEventListener('ended', onVideoEnd);
        videoElement.play();
        return () => videoElement.removeEventListener('ended', onVideoEnd);
      }
    }
  }, [mineState]);

  // 4. LOGIQUE DE SCROLL POST-ÉNIGME MINESHAFT (NOUVEAU - Utilisation de Hash pour la cohérence)
  useEffect(() => {
    if (hasMineshaftKey) {
      console.log("Clé Mineshaft obtenue. Redirection vers la section 'Lushcave'.");

      // Utilise la même méthode que dans Enigme1.jsx pour déclencher le scroll
      // Nous utilisons un petit délai pour permettre à l'inventaire de s'afficher avant de scroller.
      setTimeout(() => {
        // Cible la section précédente dans le flux vertical
        window.location.hash = '#lushcave-section';
      }, 500);
    }
  }, [hasMineshaftKey]); // Déclenché lorsque la clé est ajoutée à l'inventaire
  // 3. LOGIQUE DE SCROLL VERROUILLÉ (Empêcher de remonter sans la clé) - Vient de la branche modals
  /* useEffect(() => {
      const el = mainRef.current;
      if (!el) return;
	
      const onScroll = () => {
        // Si l'utilisateur n'a pas la clé
        if (!hasItem("key")) {
          const lastSectionTop = lastSectionRef.current?.offsetTop || 0;
	
          // Si la position de scroll est plus haute que la section de départ forcée
          if (el.scrollTop < lastSectionTop) {
            // Ramène le scroll à la section de départ
            el.scrollTop = lastSectionTop;
          }
        }
      };
	
      el.addEventListener("scroll", onScroll);
      return () => el.removeEventListener("scroll", onScroll);
   }, [hasItem]);
   */
  const mineshaftBgClass = (() => {
    if (!showImageWithoutFog) return 'fog';

    switch (mineState) {
      case 'initial':
      case 'video_retour':
        return 'mineshaft_img_1'; // Fond de départ (avec le minecart statique)
      case 'mineshaft':
        return 'mineshaft_img_2'; // Fond après la vidéo 'Aller'
      case 'video_aller':
      default:
        return 'mineshaft_img_1'; // Pendant la vidéo 'Aller', on garde l'arrière-plan de la caverne
    }
  })();
  return (
    // Combinaison des props ref et className
    <main
      ref={mainRef}
      className="h-screen 	overflow-y-scroll scroll-smooth"
    >
      {/* ----------------- SECTIONS VERTICALES (Haut) ----------------- */}
      <section id="liberte-section" className="h-screen 	flex flex-col items-center justify-center 	bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Section de la liberté</h1>
      </section>


      {/* ----------------- SECTION LUSHCAVE (GSAP Horizontal) ----------------- */}
      <section id="lushcave-section" className="h-screen 	overflow-hidden ">
        <div className={`maison flex w-[200vw] h-full ${showImageWithoutFog ? 'fond_lushcave' : 'fog'}`}>
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Maison</h2>
          </div>
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Lushcave</h2>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION MINESHAFT (GSAP Horizontal) ----------------- */}
      {/* ----------------- SECTION MINESHAFT (GSAP Horizontal) ----------------- */}
      <section id="mineshaft" className="h-screen overflow-hidden">
        {/* Utilisation de la classe d'arrière-plan dynamique */}
        <div className={`caverne flex w-[200vw] h-full relative ${mineshaftBgClass}`}>

          {/* ------------------- ÉCRAN 1 : Destination (Pièce de Réparation et Levier) ------------------- */}
          <div className="w-screen grid place-items-center">

            {/* Pièce de réparation cliquable (à ramasser, visible seulement à l'état 'mineshaft') */}
            {!hasItem(REPAIR_PART.id) && mineState === 'mineshaft' && !isMinecartVideoPlaying && (
              <button
                onClick={handleRepairPartPickup}
                className="absolute w-20 h-20 bg-transparent z-20 cursor-pointer"
                // Position sur l'Écran 1 (ex: 40vw)
                style={{ top: '30%', left: '20%' }}
              >
                <img src={REPAIR_PART.img} alt={REPAIR_PART.name} className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 text-white/50 text-xs">
                  {REPAIR_PART.icon} Ramasser
                </span>
              </button>
            )}

            {/* Levier cliquable (Hotspot Levier) */}
            {mineState === 'mineshaft' && !isMinecartVideoPlaying && (
              <button
                onClick={handleLeverClick}
                className="absolute w-20 h-20 bg-transparent z-20 cursor-pointer"
                // Position sur l'Écran 1 (ex: 80vw)
                style={{ top: '40%', left: '40%' }}
              >
                {/* Affichage de l'image du levier */}
                <img
                  src={LEVER_ITEM.img}
                  alt={LEVER_ITEM.name}
                  className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${hasItem(REPAIR_PART.id) ? 'opacity-100' : 'opacity-30 grayscale'}`}
                />

                {/* Texte d'aide/debug */}
                <span className="absolute inset-0 text-white/50 text-xs flex items-center justify-center translate-y-12">
                  {hasItem(REPAIR_PART.id) ? 'Actionner' : 'Cassé'}
                </span>
              </button>
            )}

          </div>


          {/* ------------------- ÉCRAN 2 :  (Minecart et Endroit à Réparer) ------------------- */}
          <div className="w-screen grid place-items-center">

            {/* Chariot cliquable (Hotspot Minecart) */}
            {mineState === 'initial' && !isMinecartVideoPlaying && (
              <button
                onClick={handleMinecartClick}
                className="absolute w-60 h-40 bg-transparent z-20 cursor-pointer"
                // Position sur l'Écran 2 (ex: 160vw)
                style={{ top: '75%', left: '80%' }}
              >
                <span className="absolute inset-0 text-white/50 text-sm flex items-center justify-center">
                  Minecart ({minecartClickCount}/{MINECART_CLICKS_REQUIRED})
                </span>
              </button>
            )}

            {/* Endroit à Réparer cliquable (donne la clé si on a la pièce) */}
            {
              // CONDITION SIMPLIFIÉE : Pas de clé obtenue ET pas de vidéo en lecture (pour ne pas être masqué par la vidéo)
              !hasMineshaftKey && !isMinecartVideoPlaying && (
                <button
                  onClick={handleRepairLocationClick}
                  className="absolute w-40 h-40 bg-transparent z-20 cursor-pointer"
                  // Position sur l'Écran 2 (ex: 140vw)
                  style={{ top: '65%', left: '70%' }}
                >
                  <img
                    src={REPAIR_LOCATION.img}
                    alt={REPAIR_LOCATION.name}
                    // Grisé si la pièce manque, normal si la pièce est là
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${hasItem(REPAIR_PART.id) ? 'opacity-100' : 'opacity-50 grayscale'}`}
                  />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 text-white/50 text-xs">
                    {REPAIR_LOCATION.icon} Réparer
                  </span>
                </button>
              )}
            {/* Titre de l'Écran 2 (Optionnel) */}
            <h2 className="text-3xl font-bold text-white z-10">Caverne (Départ)</h2>
          </div>

          {/* --- VIDÉOS (Positionnées en ABSOLU par rapport au 200vw - Couvre toute la section) --- */}

          {/* Condition pour afficher la vidéo 'Aller' */}
          {mineState === 'video_aller' && (
            <video
              id='minecart-video'
              src='/assets/Minecart_Aller.mp4'
              muted
              playsInline
              // w-full = 200vw. left-0 = couvre toute la section.
              className="absolute left-0 top-0 w-full h-full object-cover z-30"
            />
          )}

          {/* Condition pour afficher la vidéo 'Retour' */}
          {mineState === 'video_retour' && (
            <video
              id='minecart-video-retour'
              src='/assets/Minecart_Retour.mp4'
              muted
              playsInline
              // w-full = 200vw. left-0 = couvre toute la section.
              className="absolute left-0 top-0 w-full h-full object-cover z-30"
            />
          )}

        </div>
      </section >

      {/* ----------------- SECTION MINE DEEPLASE ----  ------------- */}
      <section ref={lastSectionRef} className=" image-mine_deepslate h-screen flex flex-col items-center justify-center "
      >
        <Enigme1 />
      </section >

      {/* ----------------- MODALS & INVENTAIRE (modals) ----------------- */}
      <button
        onClick={() => setOpenInventory(true)
        }
        className="fixed top-4 right-4 z-40 bg-slate-700 text-white px-4 py-2 rounded"
      >
        Inventaire
      </button>

      <InventoryModal
        open={openInventory}
        onClose={() => setOpenInventory(false)}
      />
      <ItemObtainedModal />
    </main >
  );
}