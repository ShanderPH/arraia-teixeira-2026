"use client";

import { Button } from "@heroui/react";
import { MdOutlineCheckCircle, MdPeopleAlt } from "react-icons/md";
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
      className="relative overflow-hidden min-h-[100svh] flex flex-col star-sky"
      aria-label="Apresentação da Arraia Teixeira"
    >
      <NightSky />
      <Fireworks />

      {/* Glow blobs - posicionados de forma responsiva */}
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(700px,80vw)] h-[min(700px,80vw)] rounded-full blur-[120px] opacity-30" style={{ background: "#009739" }} />
      <div aria-hidden="true" className="absolute bottom-[20%] left-[5%] w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-[90px] opacity-25" style={{ background: "#D45D12" }} />

      {/* Bandeirinhas string at top (pluckable) */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <PluckableBandeirinhas count={20} />
      </div>

      {/* Balões floating at edges - apenas em telas maiores */}
      <div className="hidden xl:block absolute top-28 left-8 z-20">
        <Balao3D color="#D45D12" accent="#FEDD00" size={72} delay={0} label="Balão terracota — clique para confetes" />
      </div>
      <div className="hidden xl:block absolute top-40 right-10 z-20">
        <Balao3D color="#009739" accent="#FEDD00" size={64} delay={1.3} label="Balão verde — clique para confetes" />
      </div>
      <div className="hidden 2xl:block absolute top-72 left-[18%] z-20">
        <Balao3D color="#FEDD00" accent="#D45D12" size={56} delay={2.1} label="Balão amarelo — clique para confetes" />
      </div>

      {/* Main content - SEM z-index para não criar stacking context */}
      <div className="relative flex-1 flex flex-col items-center max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* TOP SECTION - Textos + Contador centralizados juntos */}
        <div className="w-full flex-1 flex flex-col justify-center items-center">
          
          {/* HEADER - Títulos e subtítulo (logo acima do contador) */}
          <div className="w-full flex flex-col items-center gap-1 sm:gap-2">
            <div className="w-full flex justify-start pl-[2%] sm:pl-[5%]">
              <h1
                className="font-display text-[clamp(3rem,10vw,120px)] leading-[0.85] tracking-tight uppercase text-corn"
                style={{
                  textShadow: "1px 1px 0 #003D1A, 3px 3px 0 #002D12, 5px 5px 0 #001A09, 7px 7px 0 #000D04",
                }}
              >
                Arraia
              </h1>
            </div>
            <div className="w-full flex justify-center -mt-1 sm:-mt-2">
              <h1
                className="font-display text-[clamp(4.5rem,14vw,180px)] leading-[0.82] tracking-tight uppercase text-white"
                style={{
                  textShadow: "1px 1px 0 #8B0000, 3px 3px 0 #6B0000, 5px 5px 0 #4A0000, 7px 7px 0 #280000, 10px 10px 0 #0E0000",
                }}
              >
                Teixeira
              </h1>
            </div>
            <div className="w-full flex justify-end pr-[2%] sm:pr-[5%] -mt-1">
              <h2
                className="font-display text-[clamp(1.8rem,6vw,80px)] leading-[0.9] tracking-tight uppercase"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px #D45D12",
                  textShadow: "4px 4px 0 rgba(212,93,18,0.25)",
                }}
              >
                Versão 2026
              </h2>
            </div>
            <p className="font-hand text-lg sm:text-xl lg:text-2xl text-corn mt-2 text-center px-4">
              Uma noite de forró, comida boa e muito fogo na fogueira!
            </p>
            
            {/* Contador logo abaixo do texto com distância razoável */}
            <div className="pt-6 sm:pt-8 lg:pt-10">
              <Countdown target={EVENT_DATE} />
            </div>
          </div>
        </div>

        {/* BOTTOM - Botões na FRENTE da fogueira (z-50 absoluto) */}
        <div className="relative z-50 w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 pb-[8vh] sm:pb-[10vh] lg:pb-[12vh]">
          <Button
            type="button"
            size="lg"
            onPress={onRsvp}
            className="bg-accent text-accent-foreground font-black uppercase tracking-widest text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-2xl animate-hero-pulse-glow hover:scale-105 active:scale-95 transition-transform duration-200 border-2 border-white/20 shadow-[0_8px_30px_rgba(0,151,57,0.5)] min-w-[200px] sm:min-w-[240px]"
            aria-label="Confirmar presença no evento"
          >
            <MdOutlineCheckCircle className="text-xl sm:text-2xl mr-2 flex-shrink-0" aria-hidden="true" />
            Confirmar Presença
          </Button>
          <Button
            type="button"
            size="lg"
            onPress={() => document.getElementById("confirmados")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#FEDD00] text-[#1a0a00] font-black uppercase tracking-wide text-xs sm:text-sm lg:text-base px-6 sm:px-8 py-3 sm:py-4 lg:py-5 rounded-2xl hover:bg-[#ffe84d] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#FEDD00]/20 shadow-[0_8px_30px_rgba(254,221,0,0.4)] min-w-[200px] sm:min-w-[240px]"
            aria-label="Ver quem já confirmou presença"
          >
            <MdPeopleAlt className="text-lg sm:text-xl mr-2 flex-shrink-0" aria-hidden="true" />
            Quem já Confirmou?
          </Button>
        </div>
      </div>

      {/* FOGUEIRA - Posicionada na base, ATRÁS de tudo (z-0) */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 sm:gap-6 lg:gap-10 pointer-events-none px-2 z-0">
        <div className="hidden md:block pb-8">
          <DancingCouple delay={0} />
        </div>
        <div className="relative scale-75 sm:scale-90 lg:scale-100 origin-bottom">
          <BigFogueira emberCount={18} />
        </div>
        <div className="hidden md:block pb-8">
          <DancingCouple flip delay={0.5} />
        </div>
      </div>

      {/* Wave transition to light background */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-8 sm:h-12 md:h-16 lg:h-20"
          aria-hidden="true"
        >
          <path
            d="M0,90 C240,20 480,0 720,30 C960,60 1200,20 1440,0 L1440,90 L0,90 Z"
            fill="#003D1A"
          />
        </svg>
      </div>
    </section>
  );
}
