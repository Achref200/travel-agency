import { prisma } from "@/lib/prisma";
import { siteConfig, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  buildContactLeadText,
  getLeadNotificationSetup,
} from "@/lib/lead-notifications";
import {
  resendAllMessages,
  resendMessage,
  setMessageHandled,
  deleteMessage,
} from "./actions";
import { Check, RotateCcw, Trash2, Mail, MessageCircle, Send } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{
    resend?: string;
    sent?: string;
    failed?: string;
  }>;
}) {
  const params = await searchParams;
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  const setup = getLeadNotificationSetup();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold">Messages</h1>
      <p className="mt-1 text-sm text-muted">{messages.length} total</p>

      <section className="mt-6 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Lead delivery</h2>
            <p className="mt-1 text-sm text-muted">
              New contact messages are sent automatically to {siteConfig.contact.phone} and {siteConfig.contact.email}.
            </p>
            <p className="mt-2 text-xs text-faint">
              WhatsApp: {setup.whatsapp ? "configured" : "needs API credentials"} · Email: {setup.email ? "configured" : "needs RESEND_API_KEY"}
            </p>
          </div>
          <form action={resendAllMessages}>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas transition-colors hover:bg-gold hover:text-ink"
            >
              <Send className="size-4" />
              Send all historical messages
            </button>
          </form>
        </div>
        {params.resend && (
          <p className="mt-4 rounded-lg bg-canvas px-3 py-2 text-sm text-muted">
            Delivery run finished: {params.sent ?? "0"} sent, {params.failed ?? "0"} failed. A record is counted as sent only when both WhatsApp and email succeed.
          </p>
        )}
      </section>

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
                <a
                  href={whatsappLink(
                    buildContactLeadText({
                      name: m.name,
                      email: m.email,
                      phone: m.phone,
                      subject: m.subject,
                      message: m.message,
                    }),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open business WhatsApp"
                  aria-label="Open business WhatsApp"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-success/10 hover:text-success"
                >
                  <MessageCircle className="size-4" />
                </a>
                <form action={resendMessage.bind(null, m.id)}>
                  <IconBtn label="Resend message notification">
                    <Send className="size-4" />
                  </IconBtn>
                </form>
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
