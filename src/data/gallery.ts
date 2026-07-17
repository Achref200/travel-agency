import type { Localized } from "@/lib/utils";
import { stockImage } from "@/lib/images";

export type GalleryImage = {
  src: string;
  alt: Localized;
  /** Grid emphasis for a subtly asymmetric, editorial layout. */
  wide?: boolean;
  tall?: boolean;
};

export const galleryImages: GalleryImage[] = [
  {
    src: stockImage("bosphorus-bridge-dusk", 1400, 1000),
    alt: { en: "Bosphorus bridge at dusk", tr: "Alacakaranlıkta Boğaz Köprüsü", ar: "جسر البوسفور عند الغسق" },
    wide: true,
  },
  {
    src: stockImage("luxury-car-arrival", 900, 1200),
    alt: { en: "Chauffeur opening a luxury car door", tr: "Lüks araç kapısını açan şoför", ar: "سائق يفتح باب سيارة فاخرة" },
    tall: true,
  },
  {
    src: stockImage("istanbul-rooftop-view", 900, 900),
    alt: { en: "Rooftop view over Istanbul", tr: "İstanbul'a tepeden bakış", ar: "إطلالة من سطح فوق إسطنبول" },
  },
  {
    src: stockImage("grand-bazaar-lanterns", 900, 900),
    alt: { en: "Lanterns in the Grand Bazaar", tr: "Kapalıçarşı'da fenerler", ar: "فوانيس في البازار الكبير" },
  },
  {
    src: stockImage("yacht-blue-water", 1400, 1000),
    alt: { en: "Private yacht on blue water", tr: "Mavi suda özel yat", ar: "يخت خاص على مياه زرقاء" },
    wide: true,
  },
  {
    src: stockImage("cappadocia-sunrise-balloon", 900, 1200),
    alt: { en: "Sunrise balloons over Cappadocia", tr: "Kapadokya'da gün doğumu balonları", ar: "مناطيد الشروق فوق كابادوكيا" },
    tall: true,
  },
  {
    src: stockImage("ornate-palace-interior", 900, 900),
    alt: { en: "Ornate Ottoman palace interior", tr: "Süslü Osmanlı sarayı iç mekânı", ar: "مقصورة قصر عثماني مزخرف" },
  },
  {
    src: stockImage("seaside-dinner-table", 900, 900),
    alt: { en: "Seaside dinner table at golden hour", tr: "Altın saatte deniz kenarında yemek masası", ar: "طاولة عشاء على البحر عند الساعة الذهبية" },
  },
];
