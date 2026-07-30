"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notifyBookingLead } from "@/lib/lead-notifications";

export async function setBookingStatus(
  id: string,
  status: string,
  _formData?: FormData,
) {
  if (!(await getSession())) redirect("/admin/login");
  await prisma.booking.update({ where: { id }, data: { status } });
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function deleteBooking(id: string, _formData?: FormData) {
  if (!(await getSession())) redirect("/admin/login");
  await prisma.booking.delete({ where: { id } });
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

/** Retry delivery for one booking from the protected admin board. */
export async function resendBooking(id: string, _formData?: FormData) {
  if (!(await getSession())) redirect("/admin/login");
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return;

  const result = await notifyBookingLead(booking);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  redirect(
    `/admin/bookings?resend=${result.ok ? "success" : "failed"}&sent=${result.ok ? 1 : 0}&failed=${result.ok ? 0 : 1}`,
  );
}

/** Retry delivery for every historical booking currently in the database. */
export async function resendAllBookings(_formData?: FormData) {
  if (!(await getSession())) redirect("/admin/login");
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "asc" } });
  let sent = 0;
  let failed = 0;

  for (const booking of bookings) {
    const result = await notifyBookingLead(booking);
    if (result.ok) sent += 1;
    else failed += 1;
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  redirect(`/admin/bookings?resend=bulk&sent=${sent}&failed=${failed}`);
}
