"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notifyContactLead } from "@/lib/lead-notifications";

export async function setMessageHandled(
  id: string,
  handled: boolean,
  _formData?: FormData,
) {
  if (!(await getSession())) redirect("/admin/login");
  await prisma.contactMessage.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string, _formData?: FormData) {
  if (!(await getSession())) redirect("/admin/login");
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

/** Retry delivery for one contact message from the protected admin board. */
export async function resendMessage(id: string, _formData?: FormData) {
  if (!(await getSession())) redirect("/admin/login");
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return;

  const result = await notifyContactLead(message);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  redirect(
    `/admin/messages?resend=${result.ok ? "success" : "failed"}&sent=${result.ok ? 1 : 0}&failed=${result.ok ? 0 : 1}`,
  );
}

/** Retry delivery for every historical contact message currently in the database. */
export async function resendAllMessages(_formData?: FormData) {
  if (!(await getSession())) redirect("/admin/login");
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "asc" } });
  let sent = 0;
  let failed = 0;

  for (const message of messages) {
    const result = await notifyContactLead(message);
    if (result.ok) sent += 1;
    else failed += 1;
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  redirect(`/admin/messages?resend=bulk&sent=${sent}&failed=${failed}`);
}
