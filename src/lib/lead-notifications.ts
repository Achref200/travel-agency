import "server-only";

import { siteConfig, whatsappDigits } from "@/config/site";
import type { VoucherData } from "@/lib/voucher";

export type ContactLead = {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
};

export type NotificationChannelResult = {
  status: "sent" | "skipped" | "failed";
  error?: string;
};

export type LeadNotificationResult = {
  whatsapp: NotificationChannelResult;
  email: NotificationChannelResult;
  ok: boolean;
};

function textRow(label: string, value?: string | number | null): string | null {
  return value === undefined || value === null || value === ""
    ? null
    : `${label}: ${value}`;
}

function dateTime(value?: string | Date | null): string | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

/** Text for a new booking notification sent to the business WhatsApp line and email. */
export function buildBookingLeadText(data: VoucherData): string {
  const lines = [
    "NEW BOOKING REQUEST",
    textRow("Reference", data.reference),
    textRow("Service", data.serviceType),
    textRow("Customer", data.fullName),
    textRow("Phone", data.phone),
    textRow("Email", data.email),
    textRow("From", data.fromLocation),
    textRow("To", data.toLocation),
    textRow("Pickup", dateTime(data.pickupAt)),
    data.roundTrip ? textRow("Return", dateTime(data.returnAt)) : null,
    textRow("Passengers", data.passengers),
    textRow("Luggage", data.luggage),
    textRow("Flight", data.flightNumber),
    textRow("Hotel", data.hotelName),
    textRow("Room", data.roomType),
    textRow("Check-in", dateTime(data.checkIn)),
    textRow("Check-out", dateTime(data.checkOut)),
    textRow("Nights", data.nights),
    textRow("Rooms", data.rooms),
    textRow(
      "Estimated total",
      data.estimatedPrice != null
        ? `${data.estimatedPrice} ${siteConfig.currency}`
        : null,
    ),
    textRow("Notes", data.notes),
  ];

  return lines.filter((line): line is string => Boolean(line)).join("\n");
}

/** Text for a new contact-form notification sent to the business WhatsApp line and email. */
export function buildContactLeadText(data: ContactLead): string {
  const lines = [
    "NEW CONTACT MESSAGE",
    textRow("Name", data.name),
    textRow("Email", data.email),
    textRow("Phone", data.phone),
    textRow("Subject", data.subject),
    "Message:",
    data.message,
  ];

  return lines.filter((line): line is string => Boolean(line)).join("\n");
}

/** Whether the server has the credentials needed for each delivery channel. */
export function getLeadNotificationSetup() {
  return {
    whatsapp: Boolean(
      process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID,
    ),
    email: Boolean(process.env.RESEND_API_KEY),
  };
}

function skipped(message: string): NotificationChannelResult {
  return { status: "skipped", error: message };
}

function failed(error: unknown): NotificationChannelResult {
  return {
    status: "failed",
    error: error instanceof Error ? error.message : "Unknown delivery error",
  };
}

async function sendWhatsAppText(text: string): Promise<NotificationChannelResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId) {
    return skipped(
      "WhatsApp is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.",
    );
  }

  const version = process.env.WHATSAPP_GRAPH_API_VERSION ?? "v23.0";
  try {
    const response = await fetch(
      `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: whatsappDigits,
          type: "text",
          text: { preview_url: false, body: text },
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API returned HTTP ${response.status}`);
    }
    return { status: "sent" };
  } catch (error) {
    return failed(error);
  }
}

async function sendEmailText(
  subject: string,
  text: string,
): Promise<NotificationChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return skipped("Email is not configured. Set RESEND_API_KEY.");
  }

  const from =
    process.env.NOTIFICATION_EMAIL_FROM ??
    `${siteConfig.name} <${siteConfig.contact.email}>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [siteConfig.contact.email],
        subject,
        text,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`Email API returned HTTP ${response.status}`);
    }
    return { status: "sent" };
  } catch (error) {
    return failed(error);
  }
}

async function deliver(
  text: string,
  subject: string,
): Promise<LeadNotificationResult> {
  const [whatsapp, email] = await Promise.all([
    sendWhatsAppText(text),
    sendEmailText(subject, text),
  ]);

  return {
    whatsapp,
    email,
    ok: whatsapp.status === "sent" && email.status === "sent",
  };
}

/** Deliver a booking lead to both configured business channels. */
export function notifyBookingLead(data: VoucherData) {
  return deliver(
    buildBookingLeadText(data),
    `New booking ${data.reference} — ${data.fullName}`,
  );
}

/** Deliver a contact message to both configured business channels. */
export function notifyContactLead(data: ContactLead) {
  return deliver(
    buildContactLeadText(data),
    `New contact message — ${data.name}`,
  );
}
