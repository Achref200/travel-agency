import type { Localized } from "@/lib/utils";

/** A guest review shown in the "Loved by travellers worldwide" section. */
export type Testimonial = {
  quote: Localized;
  author: string;
  origin: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "Our driver was waiting the second we landed, the car was spotless and the price was exactly as quoted. Flawless from start to finish.",
      fr: "Notre chauffeur nous attendait à la seconde où nous avons atterri, la voiture était impeccable et le prix exactement celui annoncé. Parfait du début à la fin.",
      tr: "İner inmez şoförümüz bizi bekliyordu, araç tertemizdi ve fiyat tam da belirtildiği gibiydi. Baştan sona kusursuz.",
      ar: "كان سائقنا بانتظارنا لحظة هبوطنا، والسيارة نظيفة تمامًا، والسعر مطابق تمامًا لما ذُكر. مثاليةٌ من البداية إلى النهاية.",
    },
    author: "Sofia M.",
    origin: "London, UK",
    rating: 5,
  },
  {
    quote: {
      en: "Booked a full-day Bosphorus tour — our guide was warm, knowledgeable and completely tailored the day to us. Unforgettable.",
      fr: "Nous avons réservé une excursion d'une journée sur le Bosphore — notre guide était chaleureux, cultivé et a entièrement adapté la journée à nos envies. Inoubliable.",
      tr: "Tam günlük bir Boğaz turu aldık — rehberimiz sıcak, bilgili ve günü tamamen bize göre şekillendirdi. Unutulmaz.",
      ar: "حجزنا جولة يوم كامل في البوسفور — كان مرشدنا ودودًا ومطّلعًا وصمّم اليوم بالكامل ليناسبنا. لا تُنسى.",
    },
    author: "Ahmed R.",
    origin: "Dubai, UAE",
    rating: 5,
  },
  {
    quote: {
      en: "24/7 WhatsApp support answered in minutes when our flight changed. This is how airport transfers should feel.",
      fr: "L'assistance WhatsApp 24/7 a répondu en quelques minutes lorsque notre vol a changé. C'est ainsi que les transferts aéroport devraient être.",
      tr: "Uçuşumuz değiştiğinde 7/24 WhatsApp desteği dakikalar içinde yanıt verdi. Havalimanı transferi böyle hissettirmeli.",
      ar: "أجاب دعم واتساب على مدار الساعة خلال دقائق عندما تغيّرت رحلتنا. هكذا ينبغي أن تكون توصيلات المطار.",
    },
    author: "Elif & Deniz",
    origin: "Berlin, DE",
    rating: 5,
  },
];
