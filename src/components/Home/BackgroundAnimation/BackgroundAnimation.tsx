"use client";
import { ParallaxProvider } from "react-scroll-parallax";
import React, { useRef } from "react";
import { ParallaxAnimation } from "./ParallaxAnimation";

export const BackgroundAnimation = () => {
  return (
    <div className="overflow-hidden">
      <ParallaxProvider>
        <ParallaxAnimation />
      </ParallaxProvider>
    </div>
  );
};
