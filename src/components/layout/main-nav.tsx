"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart2, Banknote, Map, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/routes", label: "Routes", icon: Map },
  { href: "/compare", label: "Compare", icon: BarChart2 },
  { href: "/banking", label: "Banking", icon: Banknote },
  { href: "/pooling", label: "Pooling", icon: Users },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={{ children: item.label }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
