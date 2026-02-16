import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the provider token from the current Supabase session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const providerToken = session?.provider_token;

  if (!providerToken) {
    return Response.json(
      { error: "No GitHub token available. Please sign in with GitHub to connect." },
      { status: 400 }
    );
  }

  await prisma.connection.upsert({
    where: {
      userId_provider: { userId: user.id, provider: "GITHUB" },
    },
    update: {
      accessToken: providerToken,
      refreshToken: session?.provider_refresh_token ?? null,
    },
    create: {
      userId: user.id,
      provider: "GITHUB",
      accessToken: providerToken,
      refreshToken: session?.provider_refresh_token ?? null,
      scopes: "repo,read:user",
    },
  });

  return Response.json({ data: { connected: true } });
}
