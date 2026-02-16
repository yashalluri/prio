import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/settings-content";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const connections = await prisma.connection.findMany({
    where: { userId: user.id },
    select: { provider: true },
  });

  const connectedProviders = connections.map((c) => c.provider);

  return <SettingsContent connectedProviders={connectedProviders} />;
}
