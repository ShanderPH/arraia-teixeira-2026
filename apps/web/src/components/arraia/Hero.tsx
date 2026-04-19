"use client";

import { Button } from "@heroui/react";
import { MdOutlineCheckCircle, MdOutlineFoodBank } from "react-icons/md";
import NightSky from "./hero/NightSky";
import Fireworks from "./hero/Fireworks";
import BigFogueira from "./hero/BigFogueira";
import DancingCouple from "./hero/DancingCouple";
import PluckableBandeirinhas from "./hero/PluckableBandeirinhas";
import Balao3D from "./hero/Balao3D";
import Countdown from "./hero/Countdown";

const EVENT_DATE = new Date(2026, 5, 20, 18, 0);

interface HeroProps {
  onRsvp?: () => void;
}

export default function Hero({ onRsvp }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden min-h-[92vh] flex flex-col star-sky"
      aria-label="Apresentação da Arraia Teixeira"
    >
      <NightSky />
      <Fireworks />

      {/* Glow blobs */}
      <div aria-hidden="true" className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[120px] opacity-30" style={{ background: "#C92A2A" }} />
      <div aria-hidden="true" className="absolute bottom-[-60px] left-[10%] w-96 h-96 rounded-full blur-[90px] opacity-25" style={{ background: "#F76707" }} />

      {/* Bandeirinhas string at top (pluckable) */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <PluckableBandeirinhas count={20} />
      </div>

      {/* Balões floating at edges */}
      <div className="hidden md:block absolute top-28 left-8 z-20">
        <Balao3D color="#C92A2A" accent="#FFD43B" size={72} delay={0} label="Balão vermelho — clique para confetes" />
      </div>
      <div className="hidden md:block absolute top-40 right-10 z-20">
        <Balao3D color="#364FC7" accent="#FFD43B" size={64} delay={1.3} label="Balão azul — clique para confetes" />
      </div>
      <div className="hidden lg:block absolute top-72 left-[18%] z-20">
        <Balao3D color="#2B8A3E" accent="#FFD43B" size={56} delay={2.1} label="Balão verde — clique para confetes" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-[1400px] mx-auto w-full px-4 sm:px-8 pt-20 sm:pt-24 pb-36">
        <div className="relative w-full flex flex-col items-center gap-2 sm:gap-3">
          <div className="w-full flex justify-start pl-[4%] sm:pl-[10%]">
            <h1
              className="font-display text-[clamp(3rem,11vw,140px)] leading-[0.82] tracking-tight uppercase text-corn"
              style={{
                textShadow:
                  "1px 1px 0 #6B1200, 3px 3px 0 #4A0A00, 5px 5px 0 #2A0400, 7px 7px 0 #0C0100",
              }}
            >
              Arraia
            </h1>
          </div>
          <div className="w-full flex justify-center">
            <h1
              className="font-display text-[clamp(4rem,15vw,200px)] leading-[0.82] tracking-tight uppercase text-white"
              style={{
                textShadow:
                  "1px 1px 0 #8B0000, 3px 3px 0 #6B0000, 5px 5px 0 #4A0000, 7px 7px 0 #280000, 10px 10px 0 #0E0000",
              }}
            >
              Teixeira
            </h1>
          </div>
          <div className="w-full flex justify-end pr-[4%] sm:pr-[10%]">
            <h2
              className="font-display text-[clamp(1.8rem,6.5vw,88px)] leading-[0.85] tracking-tight uppercase"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px #F76707",
                textShadow: "4px 4px 0 rgba(247,103,7,0.25)",
              }}
            >
              São João
            </h2>
          </div>
          <p className="font-hand text-2xl sm:text-3xl text-corn mt-2 text-center">
            Uma noite de forró, comida boa e muito fogo na fogueira!
          </p>
        </div>

        <div className="w-full mt-10 sm:mt-14">
          <Countdown target={EVENT_DATE} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-10">
          <Button
            type="button"
            size="lg"
            onPress={onRsvp}
            className="bg-accent text-accent-foreground font-black uppercase tracking-widest text-base md:text-lg px-8 md:px-12 py-6 md:py-7 rounded-2xl animate-hero-pulse-glow hover:scale-105 active:scale-95 transition-transform duration-200 border-2 border-white/20 shadow-[0_8px_30px_rgba(201,42,42,0.5)]"
            aria-label="Confirmar presença no evento"
          >
            <MdOutlineCheckCircle className="text-2xl mr-2 flex-shrink-0" aria-hidden="true" />
            Confirmar Presença
          </Button>
          <a href="#pratos" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto border-2 border-corn/60 text-corn bg-transparent font-bold uppercase tracking-wide text-sm md:text-base px-8 py-6 md:py-7 rounded-2xl hover:bg-corn/10 hover:border-corn hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Ver lista de pratos"
            >
              <MdOutlineFoodBank className="text-xl mr-2 flex-shrink-0" aria-hidden="true" />
              Ver Pratos
            </Button>
          </a>
        </div>
      </div>

      {/* Bottom scene: fogueira in center with dancing couples flanking */}
      <div className="absolute bottom-16 left-0 right-0 flex items-end justify-center gap-4 sm:gap-10 md:gap-16 pointer-events-none px-4">
        <div className="hidden sm:block">
          <DancingCouple delay={0} />
        </div>
        <div className="relative">
          <BigFogueira emberCount={18} />
        </div>
        <div className="hidden sm:block">
          <DancingCouple flip delay={0.5} />
        </div>
      </div>

      {/* Wave transition to light background */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-16 md:h-20"
          aria-hidden="true"
        >
          <path
            d="M0,90 C240,20 480,0 720,30 C960,60 1200,20 1440,0 L1440,90 L0,90 Z"
            fill="oklch(0.97 0.06 98)"
          />
        </svg>
      </div>
    </section>
  );
}
