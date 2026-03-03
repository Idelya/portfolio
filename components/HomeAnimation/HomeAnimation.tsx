"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeAnimation() {
  const sceneRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sceneRef.current) return;

    const ctx = gsap.context(() => {

      gsap.fromTo(
        ".layer-far",
        { y: "30vh" },
        {
          y: "0",
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-track",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        ".layer-front",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-track",
            start: "35% top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        ".layer-mid",
        { y: "35vh" },
        {
          y: "0",
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-track",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        ".layer-near",
        { y: "38vh" },
        {
          y: "0",
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-track",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        ".layer-side",
        { y: "30vh" },
        {
          y: "-30vh",
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-track",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={sceneRef} className="parallax-page">
      <div className="viewport">
        <div className="layer layer-base" />
        <div className="layer layer-far" />
        <div className="layer layer-mid" />
        <div className="layer layer-near" />
        <div className="layer layer-front" />
        <div className="layer layer-side" />
      </div>
      <div className="scroll-track" />
    </main>
  );
}
