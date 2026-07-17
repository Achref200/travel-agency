import type { Localized } from "@/lib/utils";
import { stockImage } from "@/lib/images";

/** "Our Story" timeline milestones. Years are plain; copy is localised. */
export type Milestone = {
  year: string;
  title: Localized;
  text: Localized;
};

export const milestones: Milestone[] = [
  {
    year: "2014",
    title: { en: "The first welcome", tr: "İlk karşılama", ar: "أول ترحيب" },
    text: {
      en: "It began with a single airport pick-up and a promise: no traveller waits alone.",
      tr: "Tek bir havalimanı karşılamasıyla ve bir sözle başladı: hiçbir yolcu yalnız beklemez.",
      ar: "بدأ الأمر باستقبالٍ واحد في المطار ووعدٍ واحد: لا مسافر ينتظر وحده.",
    },
  },
  {
    year: "2017",
    title: { en: "A growing fleet", tr: "Büyüyen bir filo", ar: "أسطولٌ ينمو" },
    text: {
      en: "Privately owned Mercedes vehicles joined us, and comfort became our signature.",
      tr: "Özel Mercedes araçlar bize katıldı ve konfor imzamız oldu.",
      ar: "انضمّت إلينا سيارات مرسيدس المملوكة خاصة، وصارت الراحة بصمتنا.",
    },
  },
  {
    year: "2019",
    title: { en: "Beyond transfers", tr: "Transferlerin ötesi", ar: "أبعد من التوصيلات" },
    text: {
      en: "We launched curated tours with licensed local guides across Türkiye.",
      tr: "Türkiye genelinde lisanslı yerel rehberlerle özenli turlar başlattık.",
      ar: "أطلقنا جولاتٍ مُنسّقة مع مرشدين محليين مرخّصين في أنحاء تركيا.",
    },
  },
  {
    year: "2022",
    title: { en: "100,000 journeys", tr: "100.000 yolculuk", ar: "100,000 رحلة" },
    text: {
      en: "A milestone reached one warm welcome at a time, and a five-star reputation earned.",
      tr: "Her seferinde sıcak bir karşılamayla ulaşılan bir dönüm noktası ve kazanılan beş yıldızlı bir itibar.",
      ar: "إنجازٌ تحقّق بترحيبٍ دافئ في كل مرة، وسمعةٌ بخمس نجوم اكتُسبت.",
    },
  },
  {
    year: "2025",
    title: { en: "All of Türkiye", tr: "Tüm Türkiye", ar: "كل تركيا" },
    text: {
      en: "From Istanbul to Antalya, Bodrum and beyond — one team, always on time.",
      tr: "İstanbul'dan Antalya'ya, Bodrum'a ve ötesine — tek ekip, her zaman dakik.",
      ar: "من إسطنبول إلى أنطاليا وبودروم وأبعد — فريقٌ واحد، دائمًا في الموعد.",
    },
  },
];

export type Member = {
  name: string;
  role: Localized;
  image: string;
};

export const team: Member[] = [
  {
    name: "Amelia Wren",
    role: {
      en: "Founder & Chief Explorer",
      tr: "Kurucu ve Baş Kâşif",
      ar: "المؤسِّسة وكبيرة المستكشفين",
    },
    image: stockImage("team-amelia-portrait", 640, 720),
  },
  {
    name: "Noah Ramirez",
    role: {
      en: "Head of Operations",
      tr: "Operasyon Direktörü",
      ar: "رئيس العمليات",
    },
    image: stockImage("team-noah-portrait", 640, 720),
  },
  {
    name: "Elif Demir",
    role: {
      en: "Lead Travel Guide",
      tr: "Baş Seyahat Rehberi",
      ar: "كبيرة مرشدي السفر",
    },
    image: stockImage("team-elif-portrait", 640, 720),
  },
  {
    name: "Omar Haddad",
    role: {
      en: "Guest Experience",
      tr: "Misafir Deneyimi",
      ar: "تجربة الضيوف",
    },
    image: stockImage("team-omar-portrait", 640, 720),
  },
];

/** Placeholder partner wordmarks (rendered as muted text logos). */
export const partners = ["Aerolux", "Bosphora", "Voyageur", "Meridian", "Nomada"];
