import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: user.id },
  });

  if (!conversation) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ data: conversation });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.conversation.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.messages !== undefined && { messages: body.messages }),
    },
  });

  return Response.json({ data: conversation });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.conversation.deleteMany({
    where: { id, userId: user.id },
  });

  return Response.json({ data: { deleted: true } });
}
