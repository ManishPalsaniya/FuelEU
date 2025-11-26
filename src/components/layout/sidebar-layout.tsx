"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { MainNav } from './main-nav';
import { Ship } from 'lucide-react';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Ship className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">FuelWise</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <MainNav />
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">Compliance Dashboard</h1>
          </div>
        </header>        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
