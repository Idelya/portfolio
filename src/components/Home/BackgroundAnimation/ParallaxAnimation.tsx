"use client";
import { useParallax, ParallaxProvider } from "react-scroll-parallax";
import React, { useRef } from "react";
import Image from "next/image";
import Sky from "@/assets/sky.png";
import Mountain1 from "@/assets/mountains1.png";
import Mountain2 from "@/assets/mountains2.png";
import Grass from "@/assets/grass.png";

export const ParallaxAnimation = () => {
  const target = useRef(null);
  const mountain1 = useParallax({
    translateY: ["-35vh", "35vh"],
    shouldAlwaysCompleteAnimation: true,
    targetElement: target.current,
  });

  const mountain2 = useParallax({
    translateY: ["-32vh", "32vh"],
    shouldAlwaysCompleteAnimation: true,
    targetElement: target.current,
  });

  return (
    <div className="h-[200vh] w-screen top-0 relative overflow-hidden">
      <div className="h-screen w-screen fixed top-0">
        <Image src={Sky} fill style={{ objectFit: "cover" }} alt={""} />
      </div>
      <div
        className="h-screen w-screen absolute top-[70vh]"
        ref={mountain1.ref}
      >
        <Image src={Mountain1} fill style={{ objectFit: "cover" }} alt={""} />
      </div>
      <div
        className="h-screen w-screen absolute top-[73vh]"
        ref={mountain2.ref}
      >
        <Image src={Mountain2} fill style={{ objectFit: "cover" }} alt={""} />
      </div>
      <div className="h-[200vh] w-screen absolute top-[0] right-0">
        <Image src={Grass} fill style={{ objectFit: "cover" }} alt={""} />
      </div>
    </div>
  );
};
