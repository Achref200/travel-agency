import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/site";

/** Floating WhatsApp contact button, fixed to the bottom-end corner. */
export function WhatsappFab({ label }: { label: string }) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform duration-300 hover:scale-105 print:hidden"
    >
      <span className="relative inline-flex items-center justify-center size-14 rounded-full">
        <span className="absolute inline-flex size-full rounded-full bg-[#25D366] opacity-60 animate-ping [animation-duration:2.5s]" />
        <MessageCircle className="relative size-7" />
      </span>
    </a>
  );
}
