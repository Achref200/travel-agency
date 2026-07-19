"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { getResource, LOCALES, type AdminResource } from "@/lib/admin/resources";

type FormState = { error?: string } | undefined;

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

function lines(formData: FormData, key: string): string[] {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseForm(resource: AdminResource, formData: FormData) {
  const data: Record<string, unknown> = {};
  for (const f of resource.fields) {
    switch (f.type) {
      case "text":
      case "textarea":
      case "image":
      case "select": {
        const raw = String(formData.get(f.name) ?? "");
        // Slugs must be URL-safe (lowercase, hyphenated) so detail pages resolve.
        data[f.name] = f.name === "slug" ? slugify(raw) : raw;
        break;
      }
      case "number":
        data[f.name] = Number(formData.get(f.name) ?? 0) || 0;
        break;
      case "boolean":
        data[f.name] = formData.get(f.name) === "on";
        break;
      case "localized":
        data[f.name] = Object.fromEntries(
          LOCALES.map((loc) => [loc, String(formData.get(`${f.name}.${loc}`) ?? "")]),
        );
        break;
      case "localizedList": {
        const cols = LOCALES.map((loc) => lines(formData, `${f.name}.${loc}`));
        const n = Math.max(0, ...cols.map((c) => c.length));
        const arr = [];
        for (let i = 0; i < n; i++) {
          arr.push(
            Object.fromEntries(LOCALES.map((loc, ci) => [loc, cols[ci][i] ?? ""])),
          );
        }
        data[f.name] = arr;
        break;
      }
    }
  }
  return data;
}

export async function saveResource(
  resourceKey: string,
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) return { error: "Unknown resource." };

  const data = parseForm(resource, formData);

  // Basic required-field validation.
  for (const f of resource.fields) {
    if (!f.required) continue;
    const v = data[f.name];
    const empty =
      v === "" ||
      v === undefined ||
      (typeof v === "object" && v !== null && "en" in v && !(v as { en: string }).en);
    if (empty) return { error: `“${f.label}” is required.` };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (prisma as any)[resource.model];
    if (id) {
      await model.update({ where: { id }, data });
    } else {
      await model.create({ data });
    }
  } catch {
    return { error: "Could not save. A unique field (e.g. slug) may already exist." };
  }

  revalidatePath("/[locale]", "layout");
  redirect(`/admin/${resourceKey}`);
}

export async function deleteResource(
  resourceKey: string,
  id: string,
  _formData?: FormData,
) {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[resource.model];
  await model.delete({ where: { id } });
  revalidatePath("/[locale]", "layout");
  redirect(`/admin/${resourceKey}`);
}
