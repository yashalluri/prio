import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import type { UIMessage } from "ai";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { id } = await params;
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: user.id },
  });

  if (!conversation) notFound();

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <ChatInterface
        conversationId={conversation.id}
        initialMessages={conversation.messages as unknown as UIMessage[]}
      />
    </div>
  );
}
