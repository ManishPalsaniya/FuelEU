"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/routes", label: "🚢 Routes" },
  { href: "/compare", label: "📊 Compare" },
  { href: "/banking", label: "🏦 Banking" },
  { href: "/pooling", label: "💧 Pooling" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-10 text-lg font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 rounded-md border border-transparent transition-all hover:bg-accent/10 hover:border-primary hover:text-primary ${pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60"
            }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
