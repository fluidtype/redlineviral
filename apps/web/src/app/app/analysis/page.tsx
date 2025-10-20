import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Button } from "../../../components/ui/button";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Video / Analisi"
        description="Carica o collega le tue clip per ottenere analisi IA sul ritmo, sui hook e sull’engagement."
        actions={<Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">Carica video</Button>}
      />

      <section className="space-y-6 rounded-2xl border border-white/5 bg-neutral-900/70 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-50">Nessun video attivo</h3>
            <p className="text-sm text-neutral-400">
              Aggiungi un video per generare breakdown automatici e consigli ottimizzati per piattaforma.
            </p>
          </div>
          <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Avvia analisi</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
              <div className="h-40 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900">
                <div className="h-full w-full animate-pulse rounded-lg bg-white/5" />
              </div>
              <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-1/2 animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900/40 p-6 text-center text-sm text-neutral-300">
          <p className="font-medium text-neutral-200">Importa automaticamente da YouTube o TikTok</p>
          <p className="mt-2 text-xs text-neutral-500">
            Connetti gli account per vedere suggerimenti IA su ritmo, CTA e retention.
          </p>
          <Button variant="ghost" className="mt-4 bg-emerald-500 text-black hover:bg-emerald-400">Collega account</Button>
        </div>
      </section>
    </div>
  );
}
