"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lightbulb, LogOut, User } from "lucide-react";

type Role = "student" | "teacher" | "parent";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: Record<Role, NavLink[]> = {
  student: [],
  teacher: [
    { href: "/teacher/dashboard", label: "仪表盘" },
    { href: "/teacher/students", label: "学生管理" },
  ],
  parent: [
    { href: "/parent/dashboard", label: "首页" },
  ],
};

const HOME_PATHS: Record<Role, string> = {
  student: "/dashboard",
  teacher: "/teacher/dashboard",
  parent: "/parent/dashboard",
};

const ROLE_LABELS: Record<Role, string> = {
  student: "学生",
  teacher: "教师",
  parent: "家长",
};

interface NavbarProps {
  userName?: string;
  role?: Role;
}

export function Navbar({ userName, role = "student" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials = userName ? userName.slice(0, 1) : "U";
  const navLinks = NAV_LINKS[role];
  const homePath = HOME_PATHS[role];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href={homePath} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">零一优创</span>
            {role !== "student" && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                {ROLE_LABELS[role]}
              </span>
            )}
          </Link>
          {navLinks.length > 0 && (
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-muted-foreground text-sm">
              <User className="mr-2 h-4 w-4" />
              {userName || "用户"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
