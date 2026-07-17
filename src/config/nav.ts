/** Primary navigation. `key` maps to the `Nav` message namespace. */
export const mainNav = [
  { key: "tours", href: "/tours" },
  { key: "about", href: "/about" },
  { key: "vehicles", href: "/vehicles" },
  { key: "meetingPoints", href: "/meeting-points" },
  { key: "business", href: "/business" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof mainNav)[number]["key"];
