import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { setMessageHandled, deleteMessage } from "./actions";
import { Check, RotateCcw, Trash2, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold">Messages</h1>
      <p className="mt-1 text-sm text-muted">{messages.length} total</p>

      <div className="mt-6 space-y-3">
        {messages.length === 0 && (
          <p className="rounded-xl border border-line bg-surface p-6 text-muted">
            No messages yet.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-xl border bg-surface p-5",
              m.handled ? "border-line" : "border-gold/40",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  {!m.handled && (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold-deep">
                      new
                    </span>
                  )}
                  <span className="text-xs text-faint">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-ink">
                    <Mail className="size-3.5" />
                    {m.email}
                  </a>
                  {m.phone && <span>{m.phone}</span>}
                  {m.subject && <span>· {m.subject}</span>}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-ink/90">
                  {m.message}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {m.handled ? (
                  <form action={setMessageHandled.bind(null, m.id, false)}>
                    <IconBtn label="Mark unread">
                      <RotateCcw className="size-4" />
                    </IconBtn>
                  </form>
                ) : (
                  <form action={setMessageHandled.bind(null, m.id, true)}>
                    <IconBtn label="Mark handled" tone="success">
                      <Check className="size-4" />
                    </IconBtn>
                  </form>
                )}
                <form action={deleteMessage.bind(null, m.id)}>
                  <IconBtn label="Delete" tone="danger">
                    <Trash2 className="size-4" />
                  </IconBtn>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconBtn({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: "success" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors",
        tone === "success" && "hover:bg-success/10 hover:text-success",
        tone === "danger" && "hover:bg-danger/10 hover:text-danger",
        !tone && "hover:bg-ink/5 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
