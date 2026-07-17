import { siteConfig } from "@/config/site";
import type { BookingInput } from "@/lib/validation";

/** Human-friendly booking reference, e.g. "AZ-8F3K9Q". */
export function generateReference(): string {
  const prefix = siteConfig.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "TR";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${code}`;
}

/**
 * Indicative price estimate. The final fare is always confirmed by email
 * before payment — this is a friendly ballpark shown in the booking summary.
 */
export function estimatePrice(input: {
  serviceType: BookingInput["serviceType"];
  hours?: number;
  passengers: number;
  roundTrip: boolean;
}): number {
  const vanSurcharge = input.passengers > 4 ? 20 : 0;

  let base: number;
  switch (input.serviceType) {
    case "hourly":
      base = (input.hours ?? 4) * 30 + vanSurcharge;
      break;
    case "tour":
      base = 120 + vanSurcharge;
      break;
    default:
      base = 35 + vanSurcharge;
  }

  if (input.roundTrip) {
    base = Math.round(base * 2 * 0.9);
  }
  return base;
}
