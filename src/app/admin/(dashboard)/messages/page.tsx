import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/ui/EmptyState";
import { Inbox } from "lucide-react";
import { MessageList } from "./MessageList";

export const metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const unreadOnly = filter === "unread";

  const [messages, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where: unreadOnly ? { read: false } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <div className="p-8 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-stone-900">Messages</h1>
      </div>

      <p className="text-[13px] text-stone-500 -mt-5 mb-6">
        Enquiries submitted through the contact form on the public website.
      </p>

      {messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={unreadOnly ? "No unread messages" : "No messages yet"}
          description={
            unreadOnly
              ? "Everything here has been read. Switch to All to see earlier enquiries."
              : "When someone submits the contact form on your website, their enquiry will appear here."
          }
        />
      ) : (
        <MessageList
          initialMessages={messages.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone,
            subject: m.subject,
            message: m.message,
            read: m.read,
            createdAt: m.createdAt.toISOString(),
          }))}
          unreadCount={unreadCount}
          unreadOnly={unreadOnly}
        />
      )}
    </div>
  );
}
