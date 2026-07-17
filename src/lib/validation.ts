import { z } from "zod";

export const bookingSchema = z.object({
  serviceType: z.enum(["transfer", "hourly", "tour"]).default("transfer"),
  fromLocation: z.string().trim().min(2).max(160),
  toLocation: z.string().trim().max(160).optional().or(z.literal("")),
  pickupAt: z.string().min(1).max(40),
  returnAt: z.string().max(40).optional().or(z.literal("")),
  hours: z.coerce.number().int().min(1).max(24).optional(),
  passengers: z.coerce.number().int().min(1).max(20).default(1),
  luggage: z.coerce.number().int().min(0).max(40).default(0),
  flightNumber: z.string().trim().max(20).optional().or(z.literal("")),
  roundTrip: z.boolean().default(false),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(5).max(40),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  locale: z.string().max(5).optional(),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
  locale: z.string().max(5).optional(),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
