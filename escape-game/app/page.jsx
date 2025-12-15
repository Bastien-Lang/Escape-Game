"use client";
import { useEffect, useRef } from "react";

export default function Home() {
  const lastSectionRef = useRef(null);

  useEffect(() => {
    lastSectionRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  return (
    <main className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
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
      </section>

    </main >
  );
}
