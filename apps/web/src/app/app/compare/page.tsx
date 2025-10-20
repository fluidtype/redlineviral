import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Button } from "../../../components/ui/button";

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Compare"
        description="Confronta creator, campagne e formati per capire cosa replicare o evitare."
        actions={<Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">Crea confronto</Button>}
      />

      <section className="space-y-6 rounded-2xl border border-white/5 bg-neutral-900/70 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-50">Nessun confronto salvato</h3>
            <p className="text-sm text-neutral-400">
              Aggiungi competitor o creator per generare report automatici su performance e velocità di crescita.
            </p>
          </div>
          <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Importa elenco</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
              <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((__, idx) => (
                  <div key={idx} className="h-2 w-full animate-pulse rounded-full bg-white/10" />
                ))}
              </div>
              <div className="h-2 w-1/2 animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900/40 p-6 text-center text-sm text-neutral-300">
          <p className="font-medium text-neutral-200">Abbina i segnali demografici</p>
          <p className="mt-2 text-xs text-neutral-500">
            Connetti i tuoi strumenti di analytics per arricchire le analisi comparative.
          </p>
          <Button variant="ghost" className="mt-4 bg-emerald-500 text-black hover:bg-emerald-400">Collega integrazione</Button>
        </div>
      </section>
    </div>
  );
}
