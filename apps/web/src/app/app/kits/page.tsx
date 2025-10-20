import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Button } from "../../../components/ui/button";

export default function KitsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Content Kits"
        description="Raccogli asset, prompt e template per replicare format vincenti con il tuo team."
        actions={<Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">Nuovo kit</Button>}
      />

      <section className="space-y-6 rounded-2xl border border-white/5 bg-neutral-900/70 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-50">Nessun kit pubblicato</h3>
            <p className="text-sm text-neutral-400">
              Crea un kit per condividere script, asset e checklist pronte per la produzione.
            </p>
          </div>
          <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Sfoglia template</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
              <div className="h-32 animate-pulse rounded-lg bg-white/5" />
              <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-3/4 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-2/3 animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900/40 p-6 text-center text-sm text-neutral-300">
          <p className="font-medium text-neutral-200">Invita collaboratori esterni</p>
          <p className="mt-2 text-xs text-neutral-500">
            Condividi i kit con creator e clienti per accelerare l’approvazione dei contenuti.
          </p>
          <Button variant="ghost" className="mt-4 bg-emerald-500 text-black hover:bg-emerald-400">Invia invito</Button>
        </div>
      </section>
    </div>
  );
}
