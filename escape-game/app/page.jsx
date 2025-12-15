"use client";
import { useEffect, useRef } from "react";
import LottieAnimation from "../app/components/LottieAnimation";
import test from "../public/lottie/test.json";
import InventoryModal from "../app/components/InventoryModal";
import { useInventory } from "../app/context/InventoryContext";
import ItemObtainedModal from "../app/components/ItemObtainedModal";
import { useState } from "react";

export default function Home() {
  const lastSectionRef = useRef(null);
  const [openInventory, setOpenInventory] = useState(false);
  const { hasItem } = useInventory();
  const { addItem } = useInventory();
  const mainRef = useRef(null);


  useEffect(() => {
    const el = mainRef.current;
    const section = lastSectionRef.current;

    if (el && section) {
      el.scrollTop = section.offsetTop;
    }
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!hasItem("key")) {
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (el.scrollTop < maxScroll) {
          el.scrollTop = maxScroll;
        }
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasItem]);




  return (
    <main
      ref={mainRef}
      className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
    >
      <section className="h-screen flex flex-col items-center justify-center snap-start bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Section de la liberté : grass, trees etc
        </h1>

      </section>

      <section className="h-screen flex flex-col items-center justify-center snap-start bg-slate-800 text-white">
        <h2 className="text-3xl font-semibold mb-4">
          Section dirt ?? : à voir si on garde si assez de temps
        </h2>

      </section>

      <section

        className="h-screen flex flex-col items-center justify-center snap-start bg-slate-700 text-white"
      >
        <h2 className="text-3xl font-semibold mb-4">
          Section Lushcave: maison à droite (donc lien pour aller sur page "droite")
        </h2>

      </section>
      <section className="h-screen flex flex-col items-center justify-center snap-start bg-slate-600 text-white">
        <h2 className="text-3xl font-semibold mb-4">
          Section Mineshaft: minecart qui va vers la gauche (donc lien pour aller sur page "gauche")
        </h2>
      </section>
      <section ref={lastSectionRef} className="h-screen flex flex-col items-center justify-center snap-start bg-slate-500 text-white">
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
