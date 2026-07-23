import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getResource } from "@/lib/admin/resources";
import { deleteResource } from "./actions";

export const dynamic = "force-dynamic";

function cell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object" && "en" in (value as object)) {
    return String((value as { en: string }).en || "—");
  }
  return String(value);
}

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[resource.model];
  const rows: Record<string, unknown>[] = await model.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{resource.label}</h1>
          <p className="mt-1 text-sm text-muted">{rows.length} item(s)</p>
        </div>
        <Link
          href={`/admin/${resource.key}/new`}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-canvas hover:bg-gold hover:text-ink"
        >
          <Plus className="size-4" />
          New {resource.singular}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="border-b border-line bg-canvas/50 text-start">
            <tr>
              {resource.columns.map((c) => (
                <th key={c.name} className="px-4 py-3 text-start font-medium text-muted">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td colSpan={resource.columns.length + 1} className="px-4 py-8 text-center text-muted">
                  Nothing here yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={String(row.id)} className="hover:bg-canvas/40">
                {resource.columns.map((c) => (
                  <td key={c.name} className="max-w-xs truncate px-4 py-3">
                    {cell(row[c.name])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/${resource.key}/${String(row.id)}`}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-ink/5 hover:text-ink"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <form action={deleteResource.bind(null, resource.key, String(row.id))}>
                      <button
                        type="submit"
                        className="inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
