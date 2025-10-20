"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useMemo } from "react";

type SidebarProps = {
  className?: string;
};

type NavItem = {
  label: string;
  href: Route;
  description: string;
};

const navItems: NavItem[] = [
  {
    label: "Trend Hub",
    href: "/app/trends" as Route,
    description: "Monitor live trend signals"
  },
  {
    label: "Video/Analisi",
    href: "/app/analysis" as Route,
    description: "Analizza le performance video"
  },
  {
    label: "Sandbox",
    href: "/app/sandbox" as Route,
    description: "Sperimenta nuove idee"
  },
  {
    label: "Compare",
    href: "/app/compare" as Route,
    description: "Confronta campagne e creator"
  },
  {
    label: "Storico",
    href: "/app/history" as Route,
    description: "Ripercorri attività passate"
  },
  {
    label: "Settings",
    href: "/app/settings" as Route,
    description: "Configura il workspace"
  }
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const activeMap = useMemo(() => {
    const entries = navItems.map((item) => {
      const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
      return [item.href, isActive] as const;
    });
    return new Map(entries);
  }, [pathname]);

  return (
    <div
      className={clsx(
        "flex h-full flex-col gap-6 overflow-y-auto bg-gradient-to-b from-neutral-950/60 to-neutral-950/30 p-4",
        "text-sm text-neutral-300",
        className
      )}
    >
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Redlineviral</span>
        <h1 className="text-xl font-semibold text-neutral-50">Control Center</h1>
        <p className="text-xs text-neutral-500">
          Naviga tra gli strumenti per trovare insight e opportunità.
        </p>
      </div>
      <div>
        <label className="sr-only" htmlFor="global-search">
          Cerca
        </label>
        <input
          id="global-search"
          type="search"
          placeholder="Cerca canali, idee o creator..."
          className="w-full rounded-xl border border-white/5 bg-neutral-900/70 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        />
      </div>
      <nav aria-label="Dashboard">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeMap.get(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "group block rounded-xl border border-transparent px-3 py-3 transition",
                    "hover:border-white/10 hover:bg-white/5",
                    isActive
                      ? "border-emerald-400/60 bg-emerald-400/10 text-neutral-50 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]"
                      : "text-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-neutral-500 group-hover:text-neutral-400">
                        {item.description}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        "hidden rounded-full px-2 py-0.5 text-[11px] font-medium text-emerald-300/80",
                        isActive ? "bg-emerald-500/20 lg:inline" : "lg:inline"
                      )}
                    >
                      {isActive ? "Attivo" : "Vai"}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto space-y-2 rounded-xl border border-white/5 bg-neutral-900/50 p-4 text-xs text-neutral-400">
        <p className="font-semibold text-neutral-200">Suggerimento</p>
        <p>
          Usa <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px]">/</span> per cercare e i tasti rapidi per
          saltare tra le viste.
        </p>
      </div>
    </div>
  );
}
