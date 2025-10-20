import { create } from "zustand";
type AppState = { ready: boolean; setReady(v: boolean): void };
export const useApp = create<AppState>((set) => ({ ready: false, setReady: (v) => set({ ready: v }) }));
