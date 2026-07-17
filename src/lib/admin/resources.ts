/**
 * Config-driven admin. Each content type declares its Prisma model, fields and
 * list columns; the generic list/create/edit pages + server actions render and
 * persist them. Keep this file free of server-only imports (used by client UI).
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "localized"
  | "localizedList";

export type AdminField = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
};

export type AdminResource = {
  key: string; // URL segment + nav key
  model: string; // Prisma client model accessor (camelCase)
  label: string; // plural display
  singular: string;
  tag: string; // cache tag to revalidate on change
  columns: { name: string; label: string }[];
  fields: AdminField[];
};

const published: AdminField = {
  name: "published",
  label: "Published",
  type: "boolean",
};
const order: AdminField = {
  name: "order",
  label: "Sort order",
  type: "number",
  help: "Lower numbers appear first.",
};

export const resources: AdminResource[] = [
  {
    key: "tours",
    model: "tour",
    label: "Tours",
    singular: "Tour",
    tag: "content:tours",
    columns: [
      { name: "slug", label: "Slug" },
      { name: "price", label: "Price" },
      { name: "published", label: "Published" },
    ],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, help: "URL id, e.g. bosphorus-dinner-cruise" },
      { name: "title", label: "Title", type: "localized", required: true },
      { name: "summary", label: "Summary", type: "localized" },
      { name: "description", label: "Description", type: "localized" },
      { name: "category", label: "Category label", type: "localized" },
      { name: "highlights", label: "Highlights (one per line)", type: "localizedList" },
      { name: "price", label: "Price", type: "number", required: true },
      { name: "priceType", label: "Price type", type: "select", options: ["person", "group"] },
      { name: "durationHours", label: "Duration (hours)", type: "number" },
      { name: "image", label: "Image URL", type: "image" },
      { name: "bestSeller", label: "Best seller", type: "boolean" },
      published,
      order,
    ],
  },
  {
    key: "routes",
    model: "route",
    label: "Routes & fares",
    singular: "Route",
    tag: "content:routes",
    columns: [
      { name: "fromLabel", label: "From" },
      { name: "toLabel", label: "To" },
      { name: "price", label: "Price" },
      { name: "category", label: "Category" },
    ],
    fields: [
      { name: "fromLabel", label: "From", type: "text", required: true },
      { name: "toLabel", label: "To", type: "text", required: true },
      { name: "price", label: "Price", type: "number", required: true },
      { name: "category", label: "Category", type: "select", options: ["airport", "hotel", "hospital", "district", "mall"] },
      published,
      order,
    ],
  },
  {
    key: "vehicles",
    model: "vehicle",
    label: "Fleet",
    singular: "Vehicle",
    tag: "content:vehicles",
    columns: [
      { name: "name", label: "Name" },
      { name: "passengers", label: "Pax" },
      { name: "published", label: "Published" },
    ],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "name", label: "Model name", type: "text", required: true },
      { name: "className", label: "Class label", type: "localized" },
      { name: "passengers", label: "Passengers", type: "number" },
      { name: "luggage", label: "Luggage", type: "number" },
      { name: "image", label: "Image URL", type: "image" },
      { name: "features", label: "Features (one per line)", type: "localizedList" },
      published,
      order,
    ],
  },
  {
    key: "faq",
    model: "faqItem",
    label: "FAQ",
    singular: "FAQ item",
    tag: "content:faq",
    columns: [
      { name: "question", label: "Question" },
      { name: "published", label: "Published" },
    ],
    fields: [
      { name: "question", label: "Question", type: "localized", required: true },
      { name: "answer", label: "Answer", type: "localized", required: true },
      published,
      order,
    ],
  },
  {
    key: "gallery",
    model: "galleryImage",
    label: "Gallery",
    singular: "Image",
    tag: "content:gallery",
    columns: [
      { name: "src", label: "Source" },
      { name: "published", label: "Published" },
    ],
    fields: [
      { name: "src", label: "Image URL", type: "image", required: true },
      { name: "alt", label: "Alt text", type: "localized" },
      { name: "wide", label: "Wide (2 cols)", type: "boolean" },
      { name: "tall", label: "Tall (2 rows)", type: "boolean" },
      published,
      order,
    ],
  },
  {
    key: "team",
    model: "teamMember",
    label: "Team",
    singular: "Team member",
    tag: "content:team",
    columns: [
      { name: "name", label: "Name" },
      { name: "published", label: "Published" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "localized" },
      { name: "image", label: "Photo URL", type: "image" },
      published,
      order,
    ],
  },
  {
    key: "milestones",
    model: "milestone",
    label: "Milestones",
    singular: "Milestone",
    tag: "content:milestones",
    columns: [
      { name: "year", label: "Year" },
      { name: "order", label: "Order" },
    ],
    fields: [
      { name: "year", label: "Year", type: "text", required: true },
      { name: "title", label: "Title", type: "localized" },
      { name: "text", label: "Text", type: "localized" },
      order,
    ],
  },
];

export function getResource(key: string): AdminResource | undefined {
  return resources.find((r) => r.key === key);
}

export const LOCALES = ["en", "tr", "ar"] as const;

/** Sensible default field values for the "new record" form. */
export function defaultsFor(resource: AdminResource): Record<string, unknown> {
  const rec: Record<string, unknown> = {};
  for (const f of resource.fields) {
    switch (f.type) {
      case "boolean":
        rec[f.name] = f.name === "published";
        break;
      case "number":
        rec[f.name] = 0;
        break;
      case "select":
        rec[f.name] = f.options?.[0] ?? "";
        break;
      case "localized":
        rec[f.name] = { en: "", tr: "", ar: "" };
        break;
      case "localizedList":
        rec[f.name] = [];
        break;
      default:
        rec[f.name] = "";
    }
  }
  return rec;
}
