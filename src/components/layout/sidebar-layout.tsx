"use client";

import { MainNav } from './main-nav';
import { Ship } from 'lucide-react';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col py-6 gap-12">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Ship className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-primary">Fuel EU Compliance</span>
              <span className="text-sm text-muted-foreground">Maritime Dashboard</span>
            </div>
          </div>
          <div className="w-full border-t pt-2">
            <MainNav />
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-7xl px-6 lg:px-8 py-6 w-full">
        {children}
      </main>
    </div>
  );
}
