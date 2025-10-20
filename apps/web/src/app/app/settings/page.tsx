import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Button } from "../../../components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Settings"
        description="Gestisci workspace, ruoli e connessioni per mantenere il team allineato."
        actions={<Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">Modifica piano</Button>}
      />

      <section className="space-y-6 rounded-2xl border border-white/5 bg-neutral-900/70 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
            <h3 className="text-lg font-semibold text-neutral-50">Workspace</h3>
            <div className="space-y-3 text-sm text-neutral-400">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Nome</p>
                <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-white/10" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Logo</p>
                <div className="mt-2 h-12 w-12 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
            <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Aggiorna info</Button>
          </div>
          <div className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
            <h3 className="text-lg font-semibold text-neutral-50">Ruoli e accessi</h3>
            <p className="text-sm text-neutral-400">Configura ruoli granulari e abilita approvazioni veloci.</p>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
                    <div className="h-2 w-24 animate-pulse rounded-full bg-white/10" />
                  </div>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-white/10" />
                </div>
              ))}
            </div>
            <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Invita membro</Button>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900/40 p-6 text-sm text-neutral-300">
          <p className="font-medium text-neutral-200">Integrazioni</p>
          <p className="mt-2 text-xs text-neutral-500">
            Collega Slack, Notion e i tuoi strumenti di analytics per automatizzare i workflow.
          </p>
          <Button variant="ghost" className="mt-4 bg-emerald-500 text-black hover:bg-emerald-400">Gestisci integrazioni</Button>
        </div>
      </section>
    </div>
  );
}
