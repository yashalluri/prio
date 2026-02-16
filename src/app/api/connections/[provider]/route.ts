import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import type { Provider } from "@/generated/prisma/client";

const validProviders = ["github", "linear", "notion", "slack"];

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider } = await params;

  if (!validProviders.includes(provider)) {
    return Response.json({ error: "Invalid provider" }, { status: 400 });
  }

  const providerEnum = provider.toUpperCase() as Provider;

  await prisma.connection.deleteMany({
    where: { userId: user.id, provider: providerEnum },
  });

  return Response.json({ data: { deleted: true } });
}
