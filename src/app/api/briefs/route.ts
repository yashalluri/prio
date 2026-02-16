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

  const briefs = await prisma.brief.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({ data: briefs });
}
