import { Button } from "../ui/button";

export function Topbar() {
  return (
    <header className="flex flex-col gap-3 border-b border-white/5 bg-neutral-900/60 px-4 py-4 text-sm text-neutral-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Redlineviral</p>
        <h2 className="text-lg font-semibold text-neutral-50">Command Center</h2>
        <p className="text-xs text-neutral-500">Allinea il tuo team su cosa pubblicare e quando.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          className="border border-white/10 bg-neutral-900/40 text-neutral-200 hover:border-white/30 hover:bg-neutral-800/70"
        >
          Aggiorna
        </Button>
        <Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">
          Nuova iniziativa
        </Button>
      </div>
    </header>
  );
}
