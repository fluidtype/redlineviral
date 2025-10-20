import type { ReactNode } from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { RightRail } from "../../components/dashboard/RightRail";
import { Topbar } from "../../components/dashboard/Topbar";
import { ShortcutRouter } from "../../components/dashboard/ShortcutRouter";
import { DashboardProviders } from "../../components/dashboard/DashboardProviders";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProviders>
      <ShortcutRouter />
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto flex h-svh max-w-[1440px] flex-col gap-4 px-3 py-4 sm:px-4 md:px-6">
          <div className="grid flex-1 gap-4 md:auto-rows-[minmax(0,1fr)] md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)_340px]">
            <Sidebar className="order-1 min-h-0 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/70 backdrop-blur" />
            <div className="order-2 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/60 backdrop-blur">
              <Topbar />
              <div className="relative flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-8 pb-12">
                  {children}
                </div>
              </div>
            </div>
            <RightRail className="order-3 min-h-0 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/70 backdrop-blur" />
          </div>
        </div>
      </div>
    </DashboardProviders>
  );
}
