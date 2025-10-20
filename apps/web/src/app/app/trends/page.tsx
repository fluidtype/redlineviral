import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Sparkline } from "../../../components/viz/Sparkline";
import { Button } from "../../../components/ui/button";

const kpis = [
  { label: "Reach potenziale", value: "2.3M", delta: "+12%" },
  { label: "Creator attivi", value: "184", delta: "+4.2%" },
  { label: "Trend emergenti", value: "36", delta: "+8" },
  { label: "Opportunità salvate", value: "89", delta: "+18" }
];

const mockTopics = [
  { name: "AI TikTok Filters", volume: "Alto", updated: "4 min fa" },
  { name: "CapCut Viral", volume: "Medio", updated: "12 min fa" },
  { name: "Micro-vlog", volume: "In crescita", updated: "28 min fa" },
  { name: "Street interview", volume: "Stabile", updated: "1 h fa" },
  { name: "Drop challenge", volume: "Basso", updated: "3 h fa" }
];

export default function TrendsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Trend Hub"
        description="Visualizza KPI e segnali in tempo reale per scegliere il prossimo contenuto virale."
        actions={<Button variant="ghost" className="bg-emerald-500 text-black hover:bg-emerald-400">Esplora raccolte</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-neutral-900/70 p-4 text-neutral-200"
          >
            <p className="text-sm text-neutral-400">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-neutral-50">{kpi.value}</span>
              <span className="text-xs text-emerald-400">{kpi.delta}</span>
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-neutral-900/70 p-6">
          <div className="flex flex-col gap-1 text-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-50">Trend momentum</h3>
            <p className="text-sm text-neutral-400">
              La curva mostra il ritmo di crescita delle menzioni rispetto alla media della settimana.
            </p>
          </div>
          <Sparkline />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-xl border border-white/5 bg-neutral-900/50 p-4">
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="h-2 w-3/4 animate-pulse rounded-full bg-white/10" />
                <div className="h-2 w-1/2 animate-pulse rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-col rounded-2xl border border-white/5 bg-neutral-900/70 p-6 text-sm text-neutral-200">
          <header className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-neutral-50">Radar argomenti</h3>
            <p className="text-xs text-neutral-500">Aggiorniamo le liste ogni pochi minuti.</p>
          </header>
          <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-white/5">
            <table className="min-w-full divide-y divide-white/5 text-left">
              <thead className="bg-neutral-900/80 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Topic</th>
                  <th className="px-4 py-2 font-medium">Volume</th>
                  <th className="px-4 py-2 font-medium">Aggiornato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockTopics.map((topic) => (
                  <tr key={topic.name} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-100">{topic.name}</td>
                    <td className="px-4 py-3 text-xs text-neutral-400">{topic.volume}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{topic.updated}</td>
                  </tr>
                ))}
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-4 py-3">
                      <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded-full bg-white/10" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 space-y-3 rounded-xl border border-dashed border-white/10 bg-neutral-900/40 p-4 text-center">
            <h4 className="text-sm font-semibold text-neutral-200">Collega un social graph</h4>
            <p className="text-xs text-neutral-500">
              Importa le sorgenti per vedere segnali su creator, community e nuove opportunità.
            </p>
            <Button variant="ghost" className="bg-white/10 text-neutral-100 hover:bg-white/20">Connetti ora</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
