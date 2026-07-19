import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { estimatePrice, generateReference } from "@/lib/booking";
import { getHotel, getTour } from "@/lib/content";
import { roomPrice, type RoomType } from "@/data/hotels";
import { localize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

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

  // Build the persisted record, branching on hotel vs transport bookings.
  let estimatedPrice: number | null = null;
  let fromLocation = data.fromLocation;
  let toLocation: string | null = data.toLocation || null;
  let pickupAt = new Date(data.pickupAt);
  let returnAt: Date | null = data.returnAt ? new Date(data.returnAt) : null;
  let hotelName: string | null = null;
  let roomType: string | null = null;
  let checkIn: Date | null = null;
  let checkOut: Date | null = null;
  let nights: number | null = null;
  let rooms: number | null = null;

  if (data.serviceType === "hotel") {
    // Pricing is resolved server-side from the catalogue — never trust the client.
    const hotel = data.hotelSlug ? await getHotel(data.hotelSlug) : undefined;
    const room = (data.roomType ?? "couple") as RoomType;
    checkIn = data.checkIn ? new Date(data.checkIn) : new Date(data.pickupAt);
    checkOut = data.checkOut ? new Date(data.checkOut) : null;
    nights = checkOut
      ? Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / DAY))
      : 1;
    rooms = data.rooms ?? 1;
    roomType = room;
    hotelName = hotel
      ? localize(hotel.name, data.locale ?? "en")
      : data.hotelName || null;
    const unit = hotel ? roomPrice(hotel, room) : 0;
    estimatedPrice = unit > 0 ? unit * nights * rooms : null;
    pickupAt = checkIn;
    returnAt = checkOut;
    fromLocation = hotelName ?? data.fromLocation;
    toLocation = null;
  } else if (data.serviceType === "tour") {
    // Tour pricing resolved server-side from the catalogue — never trust the client.
    const tour = data.tourSlug ? await getTour(data.tourSlug) : undefined;
    if (tour) fromLocation = localize(tour.title, data.locale ?? "en");
    toLocation = null;
    estimatedPrice = tour
      ? tour.price
      : estimatePrice({
          serviceType: "tour",
          hours: data.hours,
          passengers: data.passengers,
          roundTrip: data.roundTrip,
        });
  } else {
    estimatedPrice = estimatePrice({
      serviceType: data.serviceType,
      hours: data.hours,
      passengers: data.passengers,
      roundTrip: data.roundTrip,
    });
  }

  try {
    await prisma.booking.create({
      data: {
        reference,
        serviceType: data.serviceType,
        fromLocation,
        toLocation,
        pickupAt,
        returnAt,
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
        hotelName,
        roomType,
        checkIn,
        checkOut,
        nights,
        rooms,
      },
    });
  } catch (error) {
    console.error("booking_create_failed", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  // Integration point: trigger a confirmation email / CRM webhook here.
  return NextResponse.json(
    { ok: true, reference, estimatedPrice, nights },
    { status: 201 },
  );
}
