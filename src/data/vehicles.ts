import type { Localized } from "@/lib/utils";
import { stockImage } from "@/lib/images";

export type Vehicle = {
  slug: string;
  name: string;
  className: Localized;
  passengers: number;
  luggage: number;
  image: string;
  features: Localized[];
};

export const vehicles: Vehicle[] = [
  {
    slug: "economy-sedan",
    name: "Economy Sedan",
    className: { en: "Economy", tr: "Ekonomi", ar: "اقتصادية" },
    passengers: 3,
    luggage: 3,
    image: stockImage("economy-sedan-car"),
    features: [
      { en: "Comfortable saloon car", tr: "Konforlu binek araç", ar: "سيارة سيدان مريحة" },
      { en: "Air conditioning", tr: "Klima", ar: "تكييف" },
      { en: "Bottled water", tr: "Şişe su", ar: "مياه معبأة" },
    ],
  },
  {
    slug: "business-sedan",
    name: "Mercedes E-Class",
    className: { en: "Business", tr: "Business", ar: "أعمال" },
    passengers: 3,
    luggage: 3,
    image: stockImage("mercedes-eclass-business"),
    features: [
      { en: "Executive Mercedes sedan", tr: "Üst düzey Mercedes sedan", ar: "سيدان مرسيدس فاخرة" },
      { en: "Leather interior", tr: "Deri döşeme", ar: "مقصورة جلدية" },
      { en: "Complimentary Wi-Fi", tr: "Ücretsiz Wi-Fi", ar: "واي فاي مجاني" },
    ],
  },
  {
    slug: "premium-van",
    name: "Mercedes V-Class",
    className: { en: "VIP van", tr: "VIP minivan", ar: "فان VIP" },
    passengers: 6,
    luggage: 6,
    image: stockImage("mercedes-vclass-van"),
    features: [
      { en: "Spacious VIP minivan", tr: "Geniş VIP minivan", ar: "فان VIP فسيح" },
      { en: "Captain seats", tr: "Kaptan koltukları", ar: "مقاعد قائد" },
      { en: "Extra luggage space", tr: "Ekstra bagaj alanı", ar: "مساحة أمتعة إضافية" },
    ],
  },
  {
    slug: "group-van",
    name: "Mercedes Sprinter",
    className: { en: "Group", tr: "Grup", ar: "مجموعة" },
    passengers: 12,
    luggage: 12,
    image: stockImage("mercedes-sprinter-group"),
    features: [
      { en: "Ideal for groups & teams", tr: "Gruplar ve ekipler için ideal", ar: "مثالية للمجموعات والفرق" },
      { en: "Generous luggage capacity", tr: "Geniş bagaj kapasitesi", ar: "سعة أمتعة كبيرة" },
      { en: "Standing headroom", tr: "Ayakta durma yüksekliği", ar: "ارتفاع يسمح بالوقوف" },
    ],
  },
];

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}
