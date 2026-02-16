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

  const brief = await prisma.brief.findFirst({
    where: { id, userId: user.id },
  });

  if (!brief) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ data: brief });
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

  await prisma.brief.deleteMany({
    where: { id, userId: user.id },
  });

  return Response.json({ data: { deleted: true } });
}
