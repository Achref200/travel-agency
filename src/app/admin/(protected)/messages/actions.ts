"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
