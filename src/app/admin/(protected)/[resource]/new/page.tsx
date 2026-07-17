import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getResource, defaultsFor } from "@/lib/admin/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { saveResource } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const action = saveResource.bind(null, key, null);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/admin/${resource.key}`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        {resource.label}
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">New {resource.singular}</h1>
      <div className="mt-8">
        <ResourceForm resource={resource} record={defaultsFor(resource)} action={action} />
      </div>
    </div>
  );
}
