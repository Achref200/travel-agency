import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

/**
 * A booking voucher — the shared shape used to render the on-screen receipt
 * card and to build the WhatsApp text message. Kept framework-agnostic so it
 * works from both client forms and server (admin) code.
 */
export type VoucherData = {
  reference: string;
  serviceType: string; // transfer | hourly | tour | hotel
  fullName: string;
  phone?: string | null;
  email?: string | null;
  fromLocation?: string | null;
  toLocation?: string | null;
  pickupAt?: string | Date | null;
  returnAt?: string | Date | null;
  passengers?: number | null;
  luggage?: number | null;
  flightNumber?: string | null;
  roundTrip?: boolean | null;
  notes?: string | null;
  estimatedPrice?: number | null;
  locale?: string;
  // Hotel bookings
  hotelName?: string | null;
  roomType?: string | null;
  checkIn?: string | Date | null;
  checkOut?: string | Date | null;
  nights?: number | null;
  rooms?: number | null;
};

/**
 * Voucher copy per locale. Kept here rather than in next-intl messages because
 * this text is built server-side for WhatsApp and email, outside any request
 * with a translation context.
 */
type VoucherCopy = {
  voucher: string;
  reference: string;
  greeting: (name: string) => string;
  intro: (brand: string) => string;
  rooms: Record<string, string>;
  services: Record<string, string>;
  labels: Record<string, string>;
  total: string;
  totalNote: string;
  footer: (hours: string) => string;
  regards: string;
  team: (brand: string) => string;
};

const COPY: Record<string, VoucherCopy> = {
  en: {
    voucher: "BOOKING VOUCHER", reference: "Reference",
    greeting: (n) => `Dear ${n},`,
    intro: (b) => `Thank you for choosing ${b}. Here is your reservation summary:`,
    rooms: { single: "Single", couple: "Couple", triple: "Triple", quadruple: "Quadruple" },
    services: { transfer: "Private Transfer", hourly: "Chauffeur by the Hour", tour: "Guided Tour", hotel: "Hotel Reservation" },
    labels: { hotel: "Hotel", room: "Room", checkIn: "Check-in", checkOut: "Check-out", nights: "Nights", guests: "Guests", experience: "Experience", date: "Date", from: "From", to: "To", pickup: "Pick-up", return: "Return", luggage: "Luggage", flight: "Flight", notes: "Notes" },
    total: "Estimated total", totalNote: "Final price is confirmed before any payment.",
    footer: (h) => `Need to change anything? Just reply to this message — our concierge is here for you ${h}.`,
    regards: "Warm regards,", team: (b) => `The ${b} Team`,
  },
  fr: {
    voucher: "BON DE RÉSERVATION", reference: "Référence",
    greeting: (n) => `Bonjour ${n},`,
    intro: (b) => `Merci d'avoir choisi ${b}. Voici le récapitulatif de votre réservation :`,
    rooms: { single: "Simple", couple: "Double", triple: "Triple", quadruple: "Quadruple" },
    services: { transfer: "Transfert privé", hourly: "Chauffeur à l'heure", tour: "Excursion guidée", hotel: "Réservation d'hôtel" },
    labels: { hotel: "Hôtel", room: "Chambre", checkIn: "Arrivée", checkOut: "Départ", nights: "Nuits", guests: "Voyageurs", experience: "Excursion", date: "Date", from: "De", to: "À", pickup: "Prise en charge", return: "Retour", luggage: "Bagages", flight: "Vol", notes: "Remarques" },
    total: "Total estimé", totalNote: "Le prix final est confirmé avant tout paiement.",
    footer: (h) => `Besoin d'un changement ? Répondez simplement à ce message — notre conciergerie est à votre écoute ${h}.`,
    regards: "Cordialement,", team: (b) => `L'équipe ${b}`,
  },
  tr: {
    voucher: "REZERVASYON BELGESİ", reference: "Referans",
    greeting: (n) => `Sayın ${n},`,
    intro: (b) => `${b} tercih ettiğiniz için teşekkürler. Rezervasyon özetiniz:`,
    rooms: { single: "Tek kişilik", couple: "Çift kişilik", triple: "Üç kişilik", quadruple: "Dört kişilik" },
    services: { transfer: "Özel Transfer", hourly: "Saatlik Şoför", tour: "Rehberli Tur", hotel: "Otel Rezervasyonu" },
    labels: { hotel: "Otel", room: "Oda", checkIn: "Giriş", checkOut: "Çıkış", nights: "Gece", guests: "Misafir", experience: "Tur", date: "Tarih", from: "Nereden", to: "Nereye", pickup: "Alış", return: "Dönüş", luggage: "Bagaj", flight: "Uçuş", notes: "Notlar" },
    total: "Tahmini toplam", totalNote: "Nihai fiyat, ödeme öncesinde onaylanır.",
    footer: (h) => `Değişiklik mi gerekiyor? Bu mesajı yanıtlamanız yeterli — concierge ekibimiz ${h} yanınızda.`,
    regards: "Saygılarımızla,", team: (b) => `${b} Ekibi`,
  },
  ar: {
    voucher: "قسيمة الحجز", reference: "الرقم المرجعي",
    greeting: (n) => `عزيزنا ${n},`,
    intro: (b) => `شكرًا لاختيارك ${b}. إليك ملخّص حجزك:`,
    rooms: { single: "غرفة فردية", couple: "غرفة مزدوجة", triple: "غرفة ثلاثية", quadruple: "غرفة رباعية" },
    services: { transfer: "توصيلة خاصة", hourly: "سائق بالساعة", tour: "جولة مع مرشد", hotel: "حجز فندقي" },
    labels: { hotel: "الفندق", room: "الغرفة", checkIn: "تاريخ الوصول", checkOut: "تاريخ المغادرة", nights: "عدد الليالي", guests: "عدد الضيوف", experience: "الجولة", date: "التاريخ", from: "من", to: "إلى", pickup: "الاستلام", return: "العودة", luggage: "الأمتعة", flight: "رقم الرحلة", notes: "ملاحظات" },
    total: "الإجمالي التقديري", totalNote: "يُؤكَّد السعر النهائي قبل أي دفع.",
    footer: (h) => `هل تودّ تعديل شيء؟ ردَّ على هذه الرسالة — خدمة الكونسيرج في خدمتك ${h}.`,
    regards: "مع أطيب التحيات,", team: (b) => `فريق ${b}`,
  },
};

const copyFor = (locale: string): VoucherCopy => COPY[locale] ?? COPY.en;

const SERVICE_EMOJI: Record<string, string> = {
  transfer: "🚗",
  hourly: "🕐",
  tour: "🗺️",
  hotel: "🏨",
};

/** A slim divider that renders consistently across WhatsApp clients. */
const DIVIDER = "━━━━━━━━━━━━━━━";

function toDate(v?: string | Date | null): Date | null {
  if (!v) return null;
  const d = typeof v === "string" ? new Date(v) : v;
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmtDateTime(v: string | Date | null | undefined, locale: string): string {
  const d = toDate(v);
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function fmtDate(v: string | Date | null | undefined, locale: string): string {
  const d = toDate(v);
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
}

/**
 * Build a polished, professional WhatsApp voucher message. Uses WhatsApp
 * formatting (*bold*, _italic_) with clean labelled rows and restrained emoji
 * for a premium, easy-to-scan receipt.
 */
export function buildVoucherText(data: VoucherData): string {
  const locale = data.locale ?? "en";
  const brand = siteConfig.name;
  const price =
    data.estimatedPrice != null
      ? formatPrice(data.estimatedPrice, locale, siteConfig.currency)
      : null;

  const c = copyFor(locale);
  const L = c.labels;
  const svc = c.services[data.serviceType] ?? c.voucher;
  const emoji = SERVICE_EMOJI[data.serviceType] ?? "✦";

  /** Labelled detail row; returns null when the value is empty (skipped). */
  const row = (label: string, value?: string | number | null): string | null =>
    value !== undefined && value !== null && value !== ""
      ? `• *${label}:*  ${value}`
      : null;

  const lines: (string | null)[] = [];

  // Header
  lines.push(`✦  *${brand.toUpperCase()}*  ✦`);
  lines.push(DIVIDER);
  lines.push(`*${c.voucher}*`);
  lines.push(`${c.reference}:  *${data.reference}*`);
  lines.push("");

  // Greeting
  lines.push(c.greeting(data.fullName));
  lines.push(c.intro(brand));
  lines.push("");

  // Details
  lines.push(`${emoji}  *${svc}*`);
  if (data.serviceType === "hotel") {
    lines.push(row(L.hotel, data.hotelName));
    if (data.roomType) {
      const room = c.rooms[data.roomType] ?? data.roomType;
      lines.push(
        row(L.room, `${room}${data.rooms && data.rooms > 1 ? ` × ${data.rooms}` : ""}`),
      );
    }
    lines.push(row(L.checkIn, fmtDate(data.checkIn, locale) || null));
    lines.push(row(L.checkOut, fmtDate(data.checkOut, locale) || null));
    lines.push(row(L.nights, data.nights ?? null));
    lines.push(row(L.guests, data.passengers ?? null));
  } else if (data.serviceType === "tour") {
    lines.push(row(L.experience, data.fromLocation));
    lines.push(row(L.date, fmtDateTime(data.pickupAt, locale) || null));
    lines.push(row(L.guests, data.passengers ?? null));
  } else {
    lines.push(row(L.from, data.fromLocation));
    lines.push(row(L.to, data.toLocation));
    lines.push(row(L.pickup, fmtDateTime(data.pickupAt, locale) || null));
    if (data.roundTrip && data.returnAt) {
      lines.push(row(L.return, fmtDateTime(data.returnAt, locale) || null));
    }
    lines.push(row(L.guests, data.passengers ?? null));
    if (data.luggage != null) lines.push(row(L.luggage, data.luggage));
    lines.push(row(L.flight, data.flightNumber));
  }

  if (data.notes) {
    lines.push("");
    lines.push(`*${L.notes}:*  ${data.notes}`);
  }

  // Total
  if (price) {
    lines.push("");
    lines.push(`💰  *${c.total}:  ${price}*`);
    lines.push(`_${c.totalNote}_`);
  }

  // Footer
  lines.push(DIVIDER);
  lines.push(c.footer(siteConfig.hours));
  lines.push("");
  lines.push(`📞  ${siteConfig.contact.phone}`);
  lines.push(c.regards);
  lines.push(`*${c.team(brand)}*`);

  return lines.filter((l): l is string => l !== null).join("\n");
}
