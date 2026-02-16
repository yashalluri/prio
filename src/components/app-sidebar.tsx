"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  Zap,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Chat", href: "/chat", icon: MessageSquare },
  { title: "Briefs", href: "/briefs", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface ConversationItem {
  id: string;
  title: string;
  updatedAt: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then(({ data }) => setConversations(data || []))
      .catch(() => {});
  }, [pathname]);

  const initials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Zap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-heading truncate font-semibold">
                    Prio
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    AI Product Manager
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="New Chat">
                  <Link href="/chat">
                    <Plus className="size-4" />
                    <span>New Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {conversations.slice(0, 10).map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/chat/${conv.id}`}
                    tooltip={conv.title}
                  >
                    <Link href={`/chat/${conv.id}`}>
                      <MessageSquare className="size-4" />
                      <span className="truncate">{conv.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <Avatar className="size-6">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">
                {user?.user_metadata?.full_name || user?.email || "User"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
