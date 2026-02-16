import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email ?? "",
      name:
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        null,
      image: user.user_metadata?.avatar_url ?? null,
    },
    create: {
      id: user.id,
      email: user.email ?? "",
      name:
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        null,
      image: user.user_metadata?.avatar_url ?? null,
    },
  });

  return Response.json({ data: { synced: true } });
}
