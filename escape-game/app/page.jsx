"use client";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import LottieAnimation from "../app/components/LottieAnimation";
import test from "../public/lottie/test.json";
import InventoryModal from "../app/components/InventoryModal";
import { useInventory } from "../app/context/InventoryContext";
import ItemObtainedModal from "../app/components/ItemObtainedModal";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);
  const lastSectionRef = useRef(null);
  const [openInventory, setOpenInventory] = useState(false);
  // Destructuration de l'inventaire pour la logique
  const { hasItem, addItem } = useInventory();

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

  // 3. LOGIQUE DE SCROLL VERROUILLÉ (Empêcher de remonter sans la clé) - Vient de la branche modals
  useEffect(() => {
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


  return (
    // Combinaison des props ref et className
    <main
      ref={mainRef}
      className="h-screen  overflow-y-scroll scroll-smooth"
    >
      {/* ----------------- SECTIONS VERTICALES (Haut) ----------------- */}
      <section className="h-screen  flex flex-col items-center justify-center  bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Section de la liberté</h1>
      </section>

      <section className="h-screen flex flex-col items-center justify-center  bg-slate-800 text-white">
        <h2 className="text-3xl font-semibold mb-4">Section dirt</h2>
      </section>

      {/* ----------------- SECTION LUSHCAVE (GSAP Horizontal) ----------------- */}
      <section id="lushcave-section" className="h-screen  overflow-hidden bg-slate-700">
        <div className="maison flex w-[200vw] h-full">
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Maison</h2>
          </div>
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Lushcave</h2>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION MINESHAFT (GSAP Horizontal) ----------------- */}
      <section id="mineshaft" className="h-screen overflow-hidden">
        {/* Application de la classe 'image' ici, sur l'élément qui fait 200vw */}
        <div className="caverne flex w-[200vw] h-full image">

          {/* Écran 1: Caverne */}
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-white">Caverne</h2>
          </div>

          {/* Écran 2: Mineshaft */}
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-white">Mineshaft</h2>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION MINE DEEPSLASE (Départ Forcé + Lottie) ----------------- */}
      <section
        ref={lastSectionRef}
        className="h-screen flex flex-col items-center justify-center bg-slate-500 text-white"
      >
        <h2 className="text-3xl font-semibold mb-4">
          Section Mine Deeplase: début de la partie
        </h2>

        <LottieAnimation animationData={test} className="w-64 h-64" />

        <button
          onClick={() =>
            addItem({ id: "key", name: "Clé ancienne", icon: "🗝️" })
          }
          className="mt-6 px-4 py-2 bg-emerald-600 rounded"
        >
          Ramasser la clé
        </button>
      </section>

      {/* ----------------- MODALS & INVENTAIRE (modals) ----------------- */}

      <button
        onClick={() => setOpenInventory(true)}
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