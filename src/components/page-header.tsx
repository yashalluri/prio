"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/chat": "Chat",
  "/briefs": "Briefs",
  "/settings": "Settings",
};

export function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const title =
    Object.entries(pageTitles)
      .filter(([path]) =>
        path === "/" ? pathname === "/" : pathname.startsWith(path)
      )
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] || "Prio";

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
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="font-heading text-sm font-semibold">{title}</h1>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ring-ring flex items-center gap-2 rounded-full outline-none focus-visible:ring-2"
            >
              <Avatar className="size-7">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user && (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="mr-2 size-4" />
              ) : (
                <Moon className="mr-2 size-4" />
              )}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
