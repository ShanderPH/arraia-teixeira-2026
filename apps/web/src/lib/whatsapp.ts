const WHATSAPP_NUMBER = "5521993528752";
const DEFAULT_MESSAGE =
  "Olá, estava no portal do cliente e estou com algumas dificuldades, poderia me ajudar?";

/**
 * Builds a wa.me URL with the support number and pre-filled message.
 * Works on desktop (WhatsApp Web) and mobile (native app).
 */
export function buildWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export { DEFAULT_MESSAGE, WHATSAPP_NUMBER };
