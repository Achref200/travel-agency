import type { Localized } from "@/lib/utils";
import { stockImage } from "@/lib/images";

export type PriceType = "group" | "person";

export type Tour = {
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  price: number;
  priceType: PriceType;
  durationHours: number;
  image: string;
  category: Localized;
  highlights: Localized[];
  bestSeller?: boolean;
};

export const tours: Tour[] = [
  {
    slug: "istanbul-8-hour-tour-with-driver",
    title: {
      en: "8-Hour Istanbul Tour with Private Driver",
      tr: "Şoförlü 8 Saatlik İstanbul Turu",
      ar: "جولة إسطنبول 8 ساعات مع سائق خاص",
    },
    summary: {
      en: "A relaxed day across the city's icons with your own car and driver.",
      tr: "Kendi aracınız ve şoförünüzle şehrin simgeleri arasında rahat bir gün.",
      ar: "يومٌ هادئ بين معالم المدينة بسيارتك وسائقك الخاص.",
    },
    description: {
      en: "Glide between the Blue Mosque, Hagia Sophia, the Grand Bazaar and the Bosphorus at your own pace, with a private, air-conditioned vehicle and an English-speaking driver on hand all day.",
      tr: "Sultanahmet Camii, Ayasofya, Kapalıçarşı ve Boğaz arasında kendi temponuzda, özel klimalı bir araç ve gün boyu yanınızda İngilizce konuşan bir şoförle gezin.",
      ar: "تنقّل بين المسجد الأزرق وآيا صوفيا والبازار الكبير والبوسفور على راحتك، بسيارةٍ خاصة مكيّفة وسائقٍ يتحدّث الإنجليزية طوال اليوم.",
    },
    price: 150,
    priceType: "group",
    durationHours: 8,
    image: stockImage("istanbul-old-city-tour"),
    category: { en: "City tour", tr: "Şehir turu", ar: "جولة مدينة" },
    highlights: [
      { en: "Private car for 1–7 guests", tr: "1–7 misafir için özel araç", ar: "سيارة خاصة لـ 1–7 ضيوف" },
      { en: "Flexible, made-for-you route", tr: "Esnek, size özel rota", ar: "مسارٌ مرن ومصمّم لك" },
      { en: "Hotel pick-up & drop-off", tr: "Otelden alış ve bırakış", ar: "استلام وتوصيل من الفندق" },
    ],
    bestSeller: true,
  },
  {
    slug: "bosphorus-dinner-cruise",
    title: {
      en: "Bosphorus Dinner Cruise",
      tr: "Boğaz'da Akşam Yemeği Turu",
      ar: "رحلة عشاء في البوسفور",
    },
    summary: {
      en: "Dinner, live music and the illuminated skyline gliding past.",
      tr: "Akşam yemeği, canlı müzik ve süzülen ışıklı silüet.",
      ar: "عشاءٌ وموسيقى حية وأفقٌ مضيء ينساب أمامك.",
    },
    description: {
      en: "Sail between two continents after dark with a full dinner, live entertainment and unlimited views of Istanbul's palaces and bridges. Beverages included.",
      tr: "Karanlık çökünce iki kıta arasında yol alın; tam bir akşam yemeği, canlı eğlence ve İstanbul'un saraylarına ve köprülerine sınırsız manzara. İçecekler dahildir.",
      ar: "أبحر بين قارتين بعد الغروب مع عشاءٍ كامل وترفيهٍ حي وإطلالاتٍ لا محدودة على قصور إسطنبول وجسورها. المشروبات مشمولة.",
    },
    price: 50,
    priceType: "person",
    durationHours: 3,
    image: stockImage("bosphorus-night-cruise"),
    category: { en: "Cruise", tr: "Tekne turu", ar: "رحلة بحرية" },
    highlights: [
      { en: "Set dinner menu", tr: "Sabit akşam yemeği menüsü", ar: "قائمة عشاء محدّدة" },
      { en: "Live music & show", tr: "Canlı müzik ve gösteri", ar: "موسيقى حية وعرض" },
      { en: "Beverages included", tr: "İçecekler dahil", ar: "المشروبات مشمولة" },
    ],
  },
  {
    slug: "istanbul-12-hour-tour-with-driver",
    title: {
      en: "12-Hour Istanbul Tour with Private Driver",
      tr: "Şoförlü 12 Saatlik İstanbul Turu",
      ar: "جولة إسطنبول 12 ساعة مع سائق خاص",
    },
    summary: {
      en: "See both sides of the city in one unhurried, private day.",
      tr: "Şehrin iki yakasını da acelesiz, özel bir günde görün.",
      ar: "استكشف ضفّتَي المدينة في يومٍ خاصٍ دون عجلة.",
    },
    description: {
      en: "A full day to cover the historic peninsula, the modern shore and the Asian side — with a private vehicle, driver and time to linger wherever you love most.",
      tr: "Tarihi yarımadayı, modern kıyıyı ve Anadolu yakasını kapsayacak tam bir gün — özel araç, şoför ve en sevdiğiniz yerlerde oyalanma zamanı.",
      ar: "يومٌ كامل يشمل شبه الجزيرة التاريخية والساحل الحديث والجانب الآسيوي — بسيارةٍ خاصة وسائقٍ ووقتٍ للتمهّل حيثما تحب.",
    },
    price: 225,
    priceType: "group",
    durationHours: 12,
    image: stockImage("istanbul-skyline-day"),
    category: { en: "City tour", tr: "Şehir turu", ar: "جولة مدينة" },
    highlights: [
      { en: "Both continents in a day", tr: "Bir günde iki kıta", ar: "قارتان في يوم" },
      { en: "Private car for 1–7 guests", tr: "1–7 misafir için özel araç", ar: "سيارة خاصة لـ 1–7 ضيوف" },
      { en: "Fully customisable", tr: "Tamamen kişiselleştirilebilir", ar: "قابلة للتخصيص بالكامل" },
    ],
  },
  {
    slug: "private-historic-peninsula-tour",
    title: {
      en: "Private Historic Peninsula Tour with Licensed Guide",
      tr: "Lisanslı Rehberle Özel Tarihi Yarımada Turu",
      ar: "جولة شبه الجزيرة التاريخية الخاصة مع مرشد مرخّص",
    },
    summary: {
      en: "The great monuments of old Istanbul, brought to life by an expert.",
      tr: "Eski İstanbul'un büyük anıtları, bir uzmanın anlatımıyla canlanıyor.",
      ar: "روائع إسطنبول القديمة تنبض بالحياة على لسان خبير.",
    },
    description: {
      en: "Walk Sultanahmet with a licensed guide who unlocks the stories behind Hagia Sophia, the Blue Mosque, Topkapı Palace and the Hippodrome — skip-the-queue where possible.",
      tr: "Ayasofya, Sultanahmet Camii, Topkapı Sarayı ve Hipodrom'un ardındaki hikâyeleri açan lisanslı bir rehberle Sultanahmet'i gezin — mümkün olduğunda sıra beklemeden.",
      ar: "تجوّل في السلطان أحمد مع مرشدٍ مرخّص يكشف حكايات آيا صوفيا والمسجد الأزرق وقصر توبكابي والميدان — دون طوابير حيثما أمكن.",
    },
    price: 180,
    priceType: "group",
    durationHours: 6,
    image: stockImage("hagia-sophia-history"),
    category: { en: "Guided tour", tr: "Rehberli tur", ar: "جولة مع مرشد" },
    highlights: [
      { en: "Licensed expert guide", tr: "Lisanslı uzman rehber", ar: "مرشد خبير مرخّص" },
      { en: "Skip-the-queue where possible", tr: "Mümkün olduğunda sırasız giriş", ar: "دخول دون طابور حيثما أمكن" },
      { en: "Private, not shared", tr: "Özel, paylaşımsız", ar: "خاصة وليست مشتركة" },
    ],
    bestSeller: true,
  },
  {
    slug: "princes-islands-full-day-tour",
    title: {
      en: "Princes' Islands Full-Day Tour",
      tr: "Adalar Tam Gün Turu",
      ar: "جولة جزر الأميرات ليوم كامل",
    },
    summary: {
      en: "Car-free islands, pine forests and Ottoman mansions by the sea.",
      tr: "Arabasız adalar, çam ormanları ve deniz kıyısında Osmanlı köşkleri.",
      ar: "جزرٌ بلا سيارات وغاباتُ صنوبر وقصورٌ عثمانية على البحر.",
    },
    description: {
      en: "Cross to Büyükada and its neighbours for a day of sea air, historic mansions and unhurried lunches — round-trip transfer and lunch included.",
      tr: "Deniz havası, tarihi köşkler ve telaşsız öğle yemekleri dolu bir gün için Büyükada ve komşularına geçin — gidiş-dönüş transfer ve öğle yemeği dahil.",
      ar: "اعبر إلى بيوك أضة وجاراتها ليومٍ من نسيم البحر والقصور التاريخية والغداء المتمهّل — التوصيل ذهابًا وإيابًا والغداء مشمولان.",
    },
    price: 35,
    priceType: "person",
    durationHours: 9,
    image: stockImage("princes-islands-sea"),
    category: { en: "Day trip", tr: "Günübirlik gezi", ar: "رحلة يومية" },
    highlights: [
      { en: "Round-trip transfer", tr: "Gidiş-dönüş transfer", ar: "توصيل ذهابًا وإيابًا" },
      { en: "Lunch included", tr: "Öğle yemeği dahil", ar: "الغداء مشمول" },
      { en: "Free time to explore", tr: "Keşif için serbest zaman", ar: "وقت حر للاستكشاف" },
    ],
  },
  {
    slug: "cappadocia-two-day-tour",
    title: {
      en: "Cappadocia 2-Day Tour from Istanbul",
      tr: "İstanbul'dan 2 Günlük Kapadokya Turu",
      ar: "جولة كابادوكيا يومين من إسطنبول",
    },
    summary: {
      en: "Fairy chimneys, cave hotels and sunrise balloons over Anatolia.",
      tr: "Peri bacaları, mağara otelleri ve Anadolu üzerinde gün doğumu balonları.",
      ar: "المداخن الجنية وفنادق الكهوف ومناطيد الشروق فوق الأناضول.",
    },
    description: {
      en: "Fly to Cappadocia for two days among valleys, underground cities and rock-cut churches, with the option of an unforgettable sunrise balloon flight. Flights, hotel and guide arranged for you.",
      tr: "Vadiler, yeraltı şehirleri ve kayaya oyulmuş kiliseler arasında iki gün için Kapadokya'ya uçun; unutulmaz bir gün doğumu balon uçuşu seçeneğiyle. Uçuşlar, otel ve rehber sizin için ayarlanır.",
      ar: "سافر جوًّا إلى كابادوكيا ليومين بين الوديان والمدن الجوفية والكنائس المنحوتة في الصخر، مع خيار رحلة منطاد لا تُنسى عند الشروق. الرحلات والفندق والمرشد مُرتّبة لك.",
    },
    price: 260,
    priceType: "person",
    durationHours: 48,
    image: stockImage("cappadocia-balloons"),
    category: { en: "Multi-day", tr: "Çok günlü", ar: "متعدد الأيام" },
    highlights: [
      { en: "Return flights arranged", tr: "Gidiş-dönüş uçuşlar ayarlanır", ar: "رحلات ذهاب وإياب مُرتّبة" },
      { en: "Cave-hotel stay", tr: "Mağara otelde konaklama", ar: "إقامة في فندق كهفي" },
      { en: "Optional balloon flight", tr: "İsteğe bağlı balon uçuşu", ar: "رحلة منطاد اختيارية" },
    ],
  },
];

export function getTour(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function tourSlugs(): string[] {
  return tours.map((t) => t.slug);
}
