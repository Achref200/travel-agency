"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
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

/** Parse a JSON field submitted by a client component, tolerating bad input. */
function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseForm(resource: AdminResource, formData: FormData) {
  const data: Record<string, unknown> = {};
  for (const f of resource.fields) {
    switch (f.type) {
      case "imageList": {
        const list = parseJsonField<unknown[]>(formData, f.name, []);
        data[f.name] = list.filter(
          (item): item is string => typeof item === "string" && item.trim() !== "",
        );
        break;
      }
      case "address": {
        const parts = parseJsonField<Record<string, string>>(formData, f.name, {});
        // Store null rather than an object of empty strings, so "no address"
        // stays falsy for the UI.
        data[f.name] = Object.values(parts).some((v) => String(v ?? "").trim())
          ? parts
          : null;
        break;
      }
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

/**
 * Copy any externally-hosted image into Cloudinary before saving.
 *
 * Admins can paste a link from anywhere, but storing that link would leave the
 * site depending on someone else's server — those go dark without warning, and
 * local /uploads paths do not survive a deploy. Ingesting on save means the
 * database only ever holds URLs we control. A failed copy keeps the original
 * URL rather than losing the admin's work.
 */
async function ingestExternalImages(
  resource: AdminResource,
  data: Record<string, unknown>,
): Promise<void> {
  if (!cloudinaryConfigured()) return;

  const needsIngest = (src: unknown): src is string =>
    typeof src === "string" &&
    /^https?:\/\//i.test(src) &&
    !src.includes("res.cloudinary.com");

  const ingest = async (src: string): Promise<string> => {
    try {
      return (await uploadToCloudinary(src)).url;
    } catch (error) {
      console.error("image_ingest_failed", { src, error });
      return src;
    }
  };

  for (const field of resource.fields) {
    if (field.type === "image" && needsIngest(data[field.name])) {
      data[field.name] = await ingest(data[field.name] as string);
    }
    if (field.type === "imageList" && Array.isArray(data[field.name])) {
      const list = data[field.name] as string[];
      data[field.name] = await Promise.all(
        list.map((src) => (needsIngest(src) ? ingest(src) : Promise.resolve(src))),
      );
    }
  }
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
  await ingestExternalImages(resource, data);

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

  updateTag(CONTENT_TAG);
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
  updateTag(CONTENT_TAG);
  revalidatePath("/[locale]", "layout");
  redirect(`/admin/${resourceKey}`);
}
