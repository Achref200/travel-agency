import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getResource } from "@/lib/admin/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { saveResource } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (prisma as any)[resource.model];
  const record = await model.findUnique({ where: { id } });
  if (!record) notFound();

  const action = saveResource.bind(null, key, id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/admin/${resource.key}`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        {resource.label}
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">Edit {resource.singular}</h1>
      <div className="mt-8">
        <ResourceForm resource={resource} record={record} action={action} />
      </div>
    </div>
  );
}
