import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return Response.json({ data: conversations });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: body.title || "New Conversation",
    },
    select: { id: true, title: true },
  });

  return Response.json({ data: conversation });
}
