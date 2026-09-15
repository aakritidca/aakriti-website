"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Phone, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn, relativeTime } from "@/lib/utils";
import { setMessageRead, markAllRead, deleteMessage } from "./actions";

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function MessageList({
  initialMessages,
  unreadCount,
  unreadOnly,
}: {
  initialMessages: MessageItem[];
  unreadCount: number;
  unreadOnly: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggleExpand(msg: MessageItem) {
    const opening = expandedId !== msg.id;
    setExpandedId(opening ? msg.id : null);

    // Opening an unread enquiry marks it read, the way an inbox does.
    if (opening && !msg.read) {
      setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
      startTransition(async () => {
        try {
          await setMessageRead(msg.id, true);
        } catch {
          setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read: false } : m)));
          toast.error("Couldn't mark as read");
        }
      });
    }
  }

  function handleToggleRead(msg: MessageItem) {
    const next = !msg.read;
    setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read: next } : m)));
    startTransition(async () => {
      try {
        await setMessageRead(msg.id, next);
      } catch {
        setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read: !next } : m)));
        toast.error("Couldn't update this message");
      }
    });
  }

  function handleMarkAllRead() {
    const previous = messages;
    setMessages((list) => list.map((m) => ({ ...m, read: true })));
    startTransition(async () => {
      try {
        await markAllRead();
        toast.success("All messages marked as read");
      } catch {
        setMessages(previous);
        toast.error("Couldn't mark all as read");
      }
    });
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    const previous = messages;
    setMessages((list) => list.filter((m) => m.id !== confirmDeleteId));
    try {
      await deleteMessage(confirmDeleteId);
      toast.success("Message deleted");
    } catch {
      setMessages(previous);
      toast.error("Couldn't delete this message");
    }
    setConfirmDeleteId(null);
  }

  const liveUnread = messages.filter((m) => !m.read).length;

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <FilterTab href="/admin/messages" active={!unreadOnly} label="All" />
          <FilterTab
            href="/admin/messages?filter=unread"
            active={unreadOnly}
            label={unreadCount > 0 ? `Unread (${unreadCount})` : "Unread"}
          />
        </div>
        {liveUnread > 0 && (
          <Button size="sm" onClick={handleMarkAllRead} loading={isPending}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        )}
      </div>

      <div className="bg-white border border-line divide-y divide-line">
        {messages.map((msg) => {
          const expanded = expandedId === msg.id;
          return (
            <div key={msg.id} className={cn(!msg.read && "bg-teal-50/40")}>
              <button
                type="button"
                onClick={() => handleToggleExpand(msg)}
                className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-stone-50 transition-colors"
                aria-expanded={expanded}
              >
                <span className="mt-0.5 text-stone-400 shrink-0">
                  {msg.read ? <MailOpen size={16} /> : <Mail size={16} className="text-teal-600" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2.5 flex-wrap">
                    <span className={cn("text-[14px] text-stone-900", !msg.read && "font-semibold")}>
                      {msg.name}
                    </span>
                    <Badge variant={msg.read ? "neutral" : "success"}>{msg.subject}</Badge>
                  </span>
                  {!expanded && (
                    <span className="block text-[13px] text-stone-500 truncate mt-1">
                      {msg.message}
                    </span>
                  )}
                </span>
                <span className="text-[12px] text-stone-400 shrink-0 mt-0.5">
                  {relativeTime(new Date(msg.createdAt))}
                </span>
              </button>

              {expanded && (
                <div className="px-5 pb-5 pl-[52px]">
                  <p className="text-[14px] text-stone-700 whitespace-pre-line leading-relaxed mb-5">
                    {msg.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="inline-flex items-center gap-2 border border-line px-3.5 py-2 text-[13px] text-stone-700 hover:bg-stone-50"
                    >
                      <Mail size={13} /> {msg.email}
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 border border-line px-3.5 py-2 text-[13px] text-stone-700 hover:bg-stone-50"
                      >
                        <Phone size={13} /> {msg.phone}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleRead(msg)}
                      className="inline-flex items-center gap-2 border border-line px-3.5 py-2 text-[13px] text-stone-700 hover:bg-stone-50"
                    >
                      {msg.read ? <Mail size={13} /> : <MailOpen size={13} />}
                      Mark as {msg.read ? "unread" : "read"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(msg.id)}
                      className="inline-flex items-center gap-2 border border-line px-3.5 py-2 text-[13px] text-stone-500 hover:text-error hover:border-error/40"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete this message?"
        description="This permanently removes the enquiry. Make sure you have replied or noted the contact details first."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3.5 py-2 text-[13px] border transition-colors",
        active
          ? "bg-stone-900 text-white border-stone-900"
          : "border-line text-stone-600 hover:bg-white"
      )}
    >
      {label}
    </Link>
  );
}
