"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Shortcut = {
  key: string;
  path: Route;
};

const shortcuts: Shortcut[] = [
  { key: "u", path: "/app/analysis" as Route },
  { key: "k", path: "/app/kits" as Route },
  { key: "c", path: "/app/compare" as Route },
  { key: "g", path: "/app/trends" as Route }
];

export function ShortcutRouter() {
  const router = useRouter();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.altKey || event.ctrlKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      const isEditable =
        target?.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";

      if (event.key === "/") {
        const searchField = document.getElementById("global-search") as HTMLInputElement | null;
        if (searchField) {
          event.preventDefault();
          searchField.focus();
          searchField.select();
        }
        return;
      }

      if (isEditable) {
        return;
      }

      const shortcut = shortcuts.find((item) => item.key === event.key.toLowerCase());
      if (shortcut) {
        event.preventDefault();
        router.push(shortcut.path);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return null;
}
