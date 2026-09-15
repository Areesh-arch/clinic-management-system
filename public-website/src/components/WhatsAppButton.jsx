
import { FiMessageCircle } from "react-icons/fi";

export default function WhatsAppButton({ whatsapp }) {
  if (!whatsapp) {
    return null;
  }

  // Convert the CMS number to WhatsApp international format.
  // Example:
  // +92 300 1234567 → 923001234567
  const whatsappNumber = String(whatsapp).replace(/\D/g, "");

  if (!whatsappNumber) {
    return null;
  }

  const message =
    "Hello, I would like to book a consultation.";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}` +
    `?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-9998
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-[#173B32]
        text-[#FBF8F0]
        shadow-[0_10px_30px_rgba(23,59,50,0.28)]
        ring-1
        ring-[#A58B52]/40
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-[#234D3C]
        hover:shadow-[0_14px_35px_rgba(23,59,50,0.35)]
        focus:outline-none
        focus:ring-2
        focus:ring-[#A58B52]
        focus:ring-offset-2
        sm:h-[60px]
        sm:w-[60px]
      "
    >
      <FiMessageCircle
        size={27}
        strokeWidth={1.8}
      />

      <span
        className="
          absolute
          -right-1
          -top-1
          h-3
          w-3
          rounded-full
          border-2
          border-[#FBF8F0]
          bg-[#6F8F7D]
        "
      />
    </a>
  );
}
