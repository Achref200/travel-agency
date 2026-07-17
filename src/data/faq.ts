import type { Localized } from "@/lib/utils";

export type FaqItem = {
  question: Localized;
  answer: Localized;
};

/** Also used to generate FAQPage JSON-LD (great for AEO / rich results). */
export const faqItems: FaqItem[] = [
  {
    question: {
      en: "How do I find my driver at the airport?",
      tr: "Havalimanında şoförümü nasıl bulurum?",
      ar: "كيف أجد سائقي في المطار؟",
    },
    answer: {
      en: "After you collect your luggage, your driver will be waiting in the arrivals hall holding a sign with your name. We track your flight, so a delay is never a problem.",
      tr: "Bagajınızı aldıktan sonra şoförünüz, geliş salonunda adınızın yazılı olduğu bir tabelayla sizi bekliyor olacak. Uçuşunuzu takip ettiğimiz için gecikme asla sorun değildir.",
      ar: "بعد استلام أمتعتك، سيكون سائقك في انتظارك في صالة الوصول حاملًا لافتة باسمك. نتابع رحلتك، لذا لا يُشكّل التأخير أي مشكلة.",
    },
  },
  {
    question: {
      en: "Is the price fixed or can it change?",
      tr: "Fiyat sabit mi yoksa değişebilir mi?",
      ar: "هل السعر ثابت أم قد يتغيّر؟",
    },
    answer: {
      en: "The price you confirm at booking is the total price you pay. There are no surge fees, night surcharges or extra charges for flight delays.",
      tr: "Rezervasyon sırasında onayladığınız fiyat, ödeyeceğiniz toplam fiyattır. Zam ücreti, gece farkı veya uçuş gecikmesi için ek ücret yoktur.",
      ar: "السعر الذي تؤكّده عند الحجز هو الإجمالي الذي تدفعه. لا رسوم إضافية للذروة أو الليل أو تأخّر الرحلات.",
    },
  },
  {
    question: {
      en: "Can I cancel my booking?",
      tr: "Rezervasyonumu iptal edebilir miyim?",
      ar: "هل يمكنني إلغاء حجزي؟",
    },
    answer: {
      en: "Yes. You can cancel free of charge up to 6 hours before your scheduled pick-up and receive a full refund.",
      tr: "Evet. Planlanan alış saatinizden 6 saat öncesine kadar ücretsiz iptal edip tam iade alabilirsiniz.",
      ar: "نعم. يمكنك الإلغاء مجانًا حتى 6 ساعات قبل موعد الاستلام مع استرداد كامل المبلغ.",
    },
  },
  {
    question: {
      en: "Do you provide child seats?",
      tr: "Çocuk koltuğu sağlıyor musunuz?",
      ar: "هل توفّرون مقاعد أطفال؟",
    },
    answer: {
      en: "Yes, baby and child seats are available free of charge. Just add a note with your child's age when you book.",
      tr: "Evet, bebek ve çocuk koltukları ücretsiz olarak mevcuttur. Rezervasyon yaparken çocuğunuzun yaşını belirten bir not eklemeniz yeterli.",
      ar: "نعم، مقاعد الرضّع والأطفال متوفّرة مجانًا. أضف فقط ملاحظة بعمر طفلك عند الحجز.",
    },
  },
  {
    question: {
      en: "How many passengers and bags can you carry?",
      tr: "Kaç yolcu ve bagaj taşıyabilirsiniz?",
      ar: "كم عدد الركاب والأمتعة التي يمكنكم نقلها؟",
    },
    answer: {
      en: "Our sedans carry up to 3 guests, VIP vans up to 6, and Sprinters up to 12 — each with matching luggage space. Tell us your group size and we'll assign the right vehicle.",
      tr: "Sedan araçlarımız 3, VIP minivanlarımız 6, Sprinter'larımız ise 12 misafire kadar taşır — her biri uygun bagaj alanıyla. Grup büyüklüğünüzü bildirin, doğru aracı ayarlayalım.",
      ar: "تتّسع سياراتنا السيدان حتى 3 ضيوف، وفانات VIP حتى 6، وسبرينتر حتى 12 — مع مساحة أمتعة مناسبة لكلٍ منها. أخبرنا بحجم مجموعتك وسنخصّص السيارة المناسبة.",
    },
  },
  {
    question: {
      en: "Which airports and cities do you cover?",
      tr: "Hangi havalimanlarına ve şehirlere hizmet veriyorsunuz?",
      ar: "ما المطارات والمدن التي تخدمونها؟",
    },
    answer: {
      en: "We operate at Istanbul (IST), Sabiha Gökçen (SAW), Antalya, Bodrum, Izmir, Dalaman, Trabzon and more, with transfers and tours across Türkiye.",
      tr: "İstanbul (IST), Sabiha Gökçen (SAW), Antalya, Bodrum, İzmir, Dalaman, Trabzon ve daha fazlasında hizmet veriyor; Türkiye genelinde transfer ve turlar sunuyoruz.",
      ar: "نعمل في مطارات إسطنبول (IST) وصبيحة كوكجن (SAW) وأنطاليا وبودروم وإزمير ودالامان وطرابزون وغيرها، مع توصيلات وجولات في أنحاء تركيا.",
    },
  },
  {
    question: {
      en: "How and when do I pay?",
      tr: "Nasıl ve ne zaman ödeme yaparım?",
      ar: "كيف ومتى أدفع؟",
    },
    answer: {
      en: "You can pay securely online by card, or in cash to your driver. We confirm the final price by email before any payment is taken.",
      tr: "Kartla güvenli şekilde çevrimiçi ödeyebilir veya şoförünüze nakit verebilirsiniz. Herhangi bir ödeme alınmadan önce nihai fiyatı e-posta ile onaylıyoruz.",
      ar: "يمكنك الدفع بأمان عبر الإنترنت بالبطاقة، أو نقدًا للسائق. نؤكّد السعر النهائي عبر البريد الإلكتروني قبل أي دفع.",
    },
  },
  {
    question: {
      en: "Can you arrange tours as well as transfers?",
      tr: "Transferlerin yanı sıra tur da düzenliyor musunuz?",
      ar: "هل تنظّمون جولات إلى جانب التوصيلات؟",
    },
    answer: {
      en: "Absolutely. From Bosphorus cruises to full-day private tours with licensed guides, we can design a complete itinerary around your stay.",
      tr: "Kesinlikle. Boğaz turlarından lisanslı rehberlerle tam günlük özel turlara kadar, konaklamanıza göre eksiksiz bir program tasarlayabiliriz.",
      ar: "بالتأكيد. من رحلات البوسفور إلى جولاتٍ خاصة ليومٍ كامل مع مرشدين مرخّصين، يمكننا تصميم برنامجٍ متكامل حول إقامتك.",
    },
  },
];
