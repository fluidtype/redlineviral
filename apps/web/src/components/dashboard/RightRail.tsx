import { clsx } from "clsx";

type RightRailProps = {
  className?: string;
};

const cards = [
  {
    title: "Smart Queue",
    body:
      "Programma automaticamente le uscite con la coda intelligente. Aggiungi contenuti per vedere suggerimenti su tempi e format."
  },
  {
    title: "Notifiche",
    body:
      "Rimani aggiornato su menzioni, collaborazioni e cambi di algoritmo. Le notifiche appariranno qui non appena collegate le fonti."
  },
  {
    title: "Suggerimenti IA",
    body:
      "L’assistente IA analizzerà i tuoi dati per generare insight e prompt creativi. Connetti gli account per sbloccarli."
  }
];

export function RightRail({ className }: RightRailProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4 overflow-y-auto p-4 lg:h-full",
        "bg-gradient-to-b from-neutral-950/50 to-neutral-950/20",
        className
      )}
    >
      {cards.map((card) => (
        <section
          key={card.title}
          className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-neutral-900/60 p-4 text-sm text-neutral-300"
        >
          <header className="space-y-1">
            <h3 className="text-base font-semibold text-neutral-50">{card.title}</h3>
            <p className="text-xs text-neutral-500">Aggiornamenti in arrivo</p>
          </header>
          <p>{card.body}</p>
          <div className="space-y-2">
            <div className="h-2 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-2 w-2/3 animate-pulse rounded-full bg-white/10" />
          </div>
          <button className="inline-flex w-fit items-center rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-white/30 hover:text-white">
            Mostra dettagli
          </button>
        </section>
      ))}
    </div>
  );
}
