import type { Localized } from "@/lib/utils";
import { stockImage } from "@/lib/images";

/** The four bookable room types, in display order. */
export type RoomType = "single" | "couple" | "triple" | "quadruple";
export const ROOM_TYPES: RoomType[] = ["single", "couple", "triple", "quadruple"];

/** Structured hotel address. All parts optional — admins fill what they know. */
export type HotelAddress = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  lat?: string;
  lng?: string;
};

/** Human-readable one-line address, skipping the parts left blank. */
export function formatAddress(address?: HotelAddress | null): string {
  if (!address) return "";
  return [address.street, address.city, address.state, address.zip, address.country]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}

/** Google Maps link — precise pin when coordinates exist, else a text search. */
export function mapsUrl(address?: HotelAddress | null, fallback?: string): string | null {
  const lat = address?.lat?.trim();
  const lng = address?.lng?.trim();
  if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const query = formatAddress(address) || fallback?.trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

export type Hotel = {
  slug: string;
  name: Localized;
  location: string;
  description: Localized;
  image: string;
  /** Gallery photos shown on the detail page, in admin-defined order. */
  images: string[];
  address: HotelAddress | null;
  amenities: Localized[];
  priceSingle: number;
  priceCouple: number;
  priceTriple: number;
  priceQuadruple: number;
  stars: number;
};

type RoomPrices = Pick<
  Hotel,
  "priceSingle" | "priceCouple" | "priceTriple" | "priceQuadruple"
>;

/** Nightly price for a given room type. */
export function roomPrice(hotel: RoomPrices, room: RoomType): number {
  switch (room) {
    case "single":
      return hotel.priceSingle;
    case "couple":
      return hotel.priceCouple;
    case "triple":
      return hotel.priceTriple;
    case "quadruple":
      return hotel.priceQuadruple;
  }
}

export const hotels: Hotel[] = [
  {
    slug: "bosphorus-palace-hotel",
    name: {
      en: "Bosphorus Palace Hotel",
      tr: "Boğaz Sarayı Oteli",
      ar: "فندق قصر البوسفور",
    },
    location: "Beşiktaş, Istanbul",
    description: {
      en: "A refined waterfront retreat on the European shore, blending Ottoman elegance with modern comfort and sweeping Bosphorus views.",
      tr: "Avrupa yakasında, Osmanlı zarafetini modern konforla buluşturan ve Boğaz'ın eşsiz manzarasına sahip zarif bir sahil oteli.",
      ar: "ملاذٌ راقٍ على الواجهة البحرية في الضفة الأوروبية، يمزج بين الأناقة العثمانية والراحة العصرية مع إطلالات خلابة على البوسفور.",
    },
    image: stockImage("bosphorus-palace-hotel", 1600, 1067),
    images: [],
    address: null,
    amenities: [
      { en: "Free Wi-Fi", tr: "Ücretsiz Wi-Fi", ar: "واي فاي مجاني" },
      { en: "Rooftop restaurant", tr: "Çatı restoranı", ar: "مطعم على السطح" },
      { en: "Spa & hammam", tr: "Spa & hamam", ar: "سبا وحمّام" },
      { en: "Airport transfer", tr: "Havalimanı transferi", ar: "نقل من المطار" },
    ],
    priceSingle: 90,
    priceCouple: 130,
    priceTriple: 170,
    priceQuadruple: 210,
    stars: 5,
  },
  {
    slug: "old-city-boutique-hotel",
    name: {
      en: "Old City Boutique Hotel",
      tr: "Tarihi Yarımada Butik Otel",
      ar: "فندق المدينة القديمة البوتيكي",
    },
    location: "Sultanahmet, Istanbul",
    description: {
      en: "Steps from Hagia Sophia and the Blue Mosque, a warm boutique stay with characterful rooms and a beloved terrace breakfast.",
      tr: "Ayasofya ve Sultanahmet Camii'ne birkaç adım mesafede, karakterli odaları ve sevilen teras kahvaltısıyla sıcak bir butik konaklama.",
      ar: "على بُعد خطوات من آيا صوفيا والمسجد الأزرق، إقامة بوتيكية دافئة بغرفٍ مميّزة وفطور شهير على الشرفة.",
    },
    image: stockImage("old-city-boutique-hotel", 1600, 1067),
    images: [],
    address: null,
    amenities: [
      { en: "Free Wi-Fi", tr: "Ücretsiz Wi-Fi", ar: "واي فاي مجاني" },
      { en: "Terrace breakfast", tr: "Teras kahvaltısı", ar: "فطور على الشرفة" },
      { en: "24/7 reception", tr: "24/7 resepsiyon", ar: "استقبال على مدار الساعة" },
      { en: "Family rooms", tr: "Aile odaları", ar: "غرف عائلية" },
    ],
    priceSingle: 55,
    priceCouple: 75,
    priceTriple: 100,
    priceQuadruple: 125,
    stars: 4,
  },
  {
    slug: "airport-comfort-suites",
    name: {
      en: "Airport Comfort Suites",
      tr: "Havalimanı Konfor Suitleri",
      ar: "أجنحة الراحة بالمطار",
    },
    location: "Arnavutköy, Istanbul",
    description: {
      en: "Modern suites minutes from Istanbul Airport (IST) — ideal for early departures, layovers and business trips, with a free shuttle.",
      tr: "İstanbul Havalimanı'na (IST) dakikalar mesafede modern suitler — erken uçuşlar, aktarmalar ve iş seyahatleri için ideal, ücretsiz servisle.",
      ar: "أجنحة عصرية على بُعد دقائق من مطار إسطنبول (IST) — مثالية للرحلات المبكرة والتوقفات ورحلات العمل، مع خدمة نقل مجانية.",
    },
    image: stockImage("airport-comfort-suites", 1600, 1067),
    images: [],
    address: null,
    amenities: [
      { en: "Free airport shuttle", tr: "Ücretsiz havalimanı servisi", ar: "نقل مجاني للمطار" },
      { en: "Free Wi-Fi", tr: "Ücretsiz Wi-Fi", ar: "واي فاي مجاني" },
      { en: "Fitness center", tr: "Fitness merkezi", ar: "مركز لياقة" },
      { en: "Business desk", tr: "Çalışma masası", ar: "مكتب أعمال" },
    ],
    priceSingle: 65,
    priceCouple: 85,
    priceTriple: 110,
    priceQuadruple: 140,
    stars: 4,
  },
];
