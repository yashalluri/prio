"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Triangle, FileText, Hash, GitBranch } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LucideIcon } from "lucide-react";

const integrations: {
  name: string;
  provider: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    name: "Linear",
    provider: "LINEAR",
    description: "Issue tracking and project management",
    icon: Triangle,
  },
  {
    name: "Notion",
    provider: "NOTION",
    description: "Documents, wikis, and databases",
    icon: FileText,
  },
  {
    name: "Slack",
    provider: "SLACK",
    description: "Team communication and feedback",
    icon: Hash,
  },
  {
    name: "GitHub",
    provider: "GITHUB",
    description: "Code repositories and pull requests",
    icon: GitBranch,
  },
];

export function SettingsContent({
  connectedProviders,
}: {
  connectedProviders: string[];
}) {
  const router = useRouter();

  const handleConnect = async (provider: string) => {
    if (provider === "GITHUB") {
      const supabase = createClient();
      await supabase.auth.linkIdentity({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
          scopes: "repo read:user",
        },
      });
      return;
    }
    toast.info(`${provider} OAuth flow coming soon.`);
  };

  const handleDisconnect = async (provider: string) => {
    await fetch(`/api/connections/${provider.toLowerCase()}`, {
      method: "DELETE",
    });
    toast.success(`${provider} disconnected.`);
    router.refresh();
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Settings
        </h2>
        <p className="text-muted-foreground text-sm">
          Manage your tool connections and preferences.
        </p>
      </div>

      <div className="grid gap-4">
        <h3 className="font-heading text-lg font-semibold">Integrations</h3>
        {integrations.map((integration) => {
          const connected = connectedProviders.includes(integration.provider);
          return (
            <Card key={integration.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <integration.icon className="text-foreground size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {integration.name}
                    </CardTitle>
                    <CardDescription>
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={connected ? "default" : "outline"}>
                    {connected ? "Connected" : "Not connected"}
                  </Badge>
                  {connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(integration.name)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration.provider)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="font-heading text-lg font-semibold">Preferences</h3>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>
                Toggle between light and dark mode using the avatar menu in the
                header.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
