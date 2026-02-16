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
import type { LucideIcon } from "lucide-react";

const integrations: {
  name: string;
  description: string;
  connected: boolean;
  icon: LucideIcon;
}[] = [
  {
    name: "Linear",
    description: "Issue tracking and project management",
    connected: false,
    icon: Triangle,
  },
  {
    name: "Notion",
    description: "Documents, wikis, and databases",
    connected: false,
    icon: FileText,
  },
  {
    name: "Slack",
    description: "Team communication and feedback",
    connected: false,
    icon: Hash,
  },
  {
    name: "GitHub",
    description: "Code repositories and pull requests",
    connected: false,
    icon: GitBranch,
  },
];

export default function SettingsPage() {
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
        {integrations.map((integration) => (
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
                  <CardDescription>{integration.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={integration.connected ? "default" : "outline"}
                >
                  {integration.connected ? "Connected" : "Not connected"}
                </Badge>
                <Button
                  variant={integration.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() =>
                    toast.info(
                      `${integration.name} OAuth flow coming soon.`
                    )
                  }
                >
                  {integration.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
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
