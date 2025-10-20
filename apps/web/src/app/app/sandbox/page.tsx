import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Button } from "../../../components/ui/button";

export default function SandboxPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Sandbox Creativo"
        description="Sperimenta con prompt IA, remix di format e storyboard rapidi prima di passare alla produzione."
        actions={<Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">Apri playground</Button>}
      />

      <section className="space-y-6 rounded-2xl border border-white/5 bg-neutral-900/70 p-6">
        <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900/40 p-6 text-sm text-neutral-300">
          <h3 className="text-lg font-semibold text-neutral-50">Nessuna bozza salvata</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Combina i trend attivi con i tuoi asset per generare storyboard, script e prompt di montaggio.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Usa un prompt</Button>
            <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Carica asset</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
              <div className="h-24 animate-pulse rounded-lg bg-white/5" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-3/4 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-1/2 animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
