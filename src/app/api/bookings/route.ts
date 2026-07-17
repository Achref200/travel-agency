import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { estimatePrice, generateReference } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot triggered → silently accept without persisting.
  if (data.company) {
    return NextResponse.json({ ok: true, reference: generateReference() });
  }

  const reference = generateReference();
  const estimatedPrice = estimatePrice({
    serviceType: data.serviceType,
    hours: data.hours,
    passengers: data.passengers,
    roundTrip: data.roundTrip,
  });

  try {
    await prisma.booking.create({
      data: {
        reference,
        serviceType: data.serviceType,
        fromLocation: data.fromLocation,
        toLocation: data.toLocation || null,
        pickupAt: new Date(data.pickupAt),
        returnAt: data.returnAt ? new Date(data.returnAt) : null,
        hours: data.hours ?? null,
        passengers: data.passengers,
        luggage: data.luggage,
        flightNumber: data.flightNumber || null,
        roundTrip: data.roundTrip,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        notes: data.notes || null,
        locale: data.locale ?? "en",
        estimatedPrice,
      },
    });
  } catch (error) {
    console.error("booking_create_failed", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  // Integration point: trigger a confirmation email / CRM webhook here.
  return NextResponse.json(
    { ok: true, reference, estimatedPrice },
    { status: 201 },
  );
}
