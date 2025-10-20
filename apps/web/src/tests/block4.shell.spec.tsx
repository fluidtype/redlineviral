import React, { type ComponentType, type ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/app/trends",
  useRouter: () => ({ push: vi.fn() })
}));

let AppLayout!: ComponentType<{ children: ReactNode }>;
let TrendsPage!: ComponentType;

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(async () => {
  (globalThis as Record<string, unknown>).ResizeObserver = ResizeObserverStub;
  AppLayout = (await import("../app/app/layout")).default;
  TrendsPage = (await import("../app/app/trends/page")).default;
});

afterEach(() => {
  cleanup();
});

describe("Block 4 dashboard shell", () => {
  it("renders sidebar navigation links", () => {
    render(
      <AppLayout>
        <div />
      </AppLayout>
    );

    expect(screen.getByRole("link", { name: /Trend Hub/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Video\/Analisi/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Settings/i })).toBeTruthy();
  });

  it("renders right rail cards", () => {
    render(
      <AppLayout>
        <div />
      </AppLayout>
    );

    expect(screen.getByRole("heading", { name: /Smart Queue/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Notifiche/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Suggerimenti IA/i })).toBeTruthy();
  });

  it("shows trend hub header and sparkline", () => {
    render(
      <AppLayout>
        <TrendsPage />
      </AppLayout>
    );

    expect(screen.getByRole("heading", { name: /Trend Hub/i })).toBeTruthy();
    expect(screen.getByTestId("sparkline-chart")).toBeTruthy();
  });
});
