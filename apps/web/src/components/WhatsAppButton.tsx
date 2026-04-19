"use client";

import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  variant?: "floating" | "inline";
  className?: string;
}

export default function WhatsAppButton({
  message,
  label = "Contatar o Suporte",
  variant = "inline",
  className = "",
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(message);

  const handleClick = () => {
    // Detect mobile: prefer native app, fallback to WhatsApp Web
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // Try native app first
      window.location.href = url.replace("https://wa.me/", "whatsapp://send?phone=").replace("?text=", "&text=");
      // Fallback to web after short delay if app not installed
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
      }, 1500);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (variant === "floating") {
    return (
      <button
        onClick={handleClick}
        aria-label="Abrir WhatsApp para suporte"
        title="Falar com o suporte via WhatsApp"
        className={`
          fixed bottom-20 right-5 z-50 md:bottom-6 md:right-6
          flex items-center gap-2
          bg-[#25D366] text-white
          rounded-full shadow-lg
          px-4 py-3
          text-sm font-semibold
          transition-all duration-200
          hover:bg-[#1ebe5d] hover:shadow-xl hover:scale-105
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2
          ${className}
        `}
      >
        <FaWhatsapp className="text-xl flex-shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Abrir WhatsApp para suporte"
      title="Falar com o suporte via WhatsApp"
      className={`
        inline-flex items-center gap-2
        bg-[#25D366] text-white
        rounded-lg
        px-4 py-2.5
        text-sm font-semibold
        transition-all duration-200
        hover:bg-[#1ebe5d] hover:shadow-md hover:scale-[1.02]
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2
        ${className}
      `}
    >
      <FaWhatsapp className="text-lg flex-shrink-0" aria-hidden="true" />
      {label}
    </button>
  );
}
