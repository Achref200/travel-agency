"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
