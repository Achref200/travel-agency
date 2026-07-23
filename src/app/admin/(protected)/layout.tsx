import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-dvh md:flex">
      <AdminNav email={session.email} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
