"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const scroller = mainRef.current;
    if (!scroller) return;

    // 🔥 Attendre que le layout soit complètement rendu
    requestAnimationFrame(() => {
      scroller.scrollTo({
        top: scroller.scrollHeight,
        behavior: "auto",
      });
    });

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


  return (
    <main ref={mainRef} className="h-screen overflow-y-scroll scroll-smooth">
      <section className="h-screen flex flex-col items-center justify-center snap-start bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Section de la liberté</h1>
      </section>

      <section className="h-screen flex flex-col items-center justify-center snap-start bg-slate-800 text-white">
        <h2 className="text-3xl font-semibold mb-4">Section dirt</h2>
      </section>

      <section id="lushcave-section" className="h-screen snap-none overflow-hidden bg-slate-700">
        <div className="maison flex w-[200vw] h-full">
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Maison</h2>
          </div>
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Lushcave</h2>
          </div>
        </div>
      </section>

      <section id="mineshaft" className="h-screen snap-none overflow-hidden bg-slate-600">
        <div className="caverne flex w-[200vw] h-full">
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Caverne</h2>
          </div>
          <div className="w-screen grid place-items-center">
            <h2 className="text-3xl font-bold text-black">Mineshaft</h2>
          </div>
        </div>
      </section>

      <section className="h-screen flex flex-col items-center justify-center snap-start bg-slate-500 text-white">
        <h2 className="text-3xl font-semibold mb-4">Section Mine Deeplase</h2>
      </section>
    </main>
  );
}
