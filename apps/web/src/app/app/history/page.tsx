import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Button } from "../../../components/ui/button";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Storico"
        description="Ripercorri decisioni, task e risultati per capire cosa ha funzionato meglio."
        actions={<Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">Esporta report</Button>}
      />

      <section className="space-y-6 rounded-2xl border border-white/5 bg-neutral-900/70 p-6">
        <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900/40 p-6 text-sm text-neutral-300">
          <h3 className="text-lg font-semibold text-neutral-50">Cronologia in attesa di dati</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Collega le tue piattaforme per tracciare campagne, collaborazioni e cambi di strategia.
          </p>
          <Button variant="ghost" className="mt-4 bg-white/10 text-neutral-100 hover:bg-white/20">Connetti integrazioni</Button>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
                  <div className="h-2 w-48 animate-pulse rounded-full bg-white/10" />
                </div>
              </div>
              <div className="h-2 w-full animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
