export type RouteCategory = "airport" | "hotel" | "hospital" | "district" | "mall";

export type Route = {
  from: string;
  to: string;
  price: number;
  category: RouteCategory;
};

/**
 * Indicative one-way fares for a standard sedan. Place names are proper nouns
 * kept consistent across locales; the word "Transfer" is localised in the UI.
 */
export const routes: Route[] = [
  // Airport ↔ airport / city
  { from: "Istanbul Airport (IST)", to: "Sabiha Gökçen (SAW)", price: 55, category: "airport" },
  { from: "Istanbul Airport (IST)", to: "Taksim", price: 32, category: "airport" },
  { from: "Sabiha Gökçen (SAW)", to: "Kadıköy", price: 30, category: "airport" },
  { from: "Antalya Airport (AYT)", to: "Alanya", price: 75, category: "airport" },
  { from: "Antalya Airport (AYT)", to: "Side", price: 55, category: "airport" },

  // Hotels
  { from: "Istanbul Airport (IST)", to: "Sultanahmet hotels", price: 32, category: "hotel" },
  { from: "Istanbul Airport (IST)", to: "Beşiktaş hotels", price: 32, category: "hotel" },
  { from: "Sabiha Gökçen (SAW)", to: "Taksim hotels", price: 34, category: "hotel" },
  { from: "Istanbul Airport (IST)", to: "Şişli hotels", price: 30, category: "hotel" },
  { from: "Sabiha Gökçen (SAW)", to: "Kadıköy hotels", price: 30, category: "hotel" },

  // Hospitals
  { from: "Istanbul Airport (IST)", to: "Acıbadem Maslak Hospital", price: 34, category: "hospital" },
  { from: "Istanbul Airport (IST)", to: "Memorial Şişli Hospital", price: 32, category: "hospital" },
  { from: "Sabiha Gökçen (SAW)", to: "Medipol Mega Hospital", price: 30, category: "hospital" },
  { from: "Istanbul Airport (IST)", to: "Florence Nightingale Hospital", price: 33, category: "hospital" },
  { from: "Sabiha Gökçen (SAW)", to: "Acıbadem Kozyatağı Hospital", price: 28, category: "hospital" },

  // Districts
  { from: "Istanbul Airport (IST)", to: "Sultanahmet", price: 32, category: "district" },
  { from: "Istanbul Airport (IST)", to: "Beşiktaş", price: 32, category: "district" },
  { from: "Istanbul Airport (IST)", to: "Kadıköy", price: 38, category: "district" },
  { from: "Sabiha Gökçen (SAW)", to: "Taksim", price: 34, category: "district" },
  { from: "Sabiha Gökçen (SAW)", to: "Beşiktaş", price: 36, category: "district" },

  // Shopping malls
  { from: "Istanbul Airport (IST)", to: "İstinye Park", price: 33, category: "mall" },
  { from: "Istanbul Airport (IST)", to: "Cevahir Mall", price: 30, category: "mall" },
  { from: "Sabiha Gökçen (SAW)", to: "Emaar Square Mall", price: 28, category: "mall" },
  { from: "Istanbul Airport (IST)", to: "Mall of Istanbul", price: 26, category: "mall" },
  { from: "Sabiha Gökçen (SAW)", to: "Akasya Mall", price: 29, category: "mall" },
];

export const routeCategories: RouteCategory[] = [
  "airport",
  "hotel",
  "hospital",
  "district",
  "mall",
];
