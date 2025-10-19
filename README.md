# 🚀 REDLINEVIRAL — Dashboard Workflow v3.1

**The Autonomous Viral Content Director**

REDLINEVIRAL è un’applicazione AI end-to-end progettata per aiutare i creator a **trasformare idee in contenuti virali**.
Analizza trend, interpreta i tuoi video, genera caption e hashtag perfetti e ti guida nella pubblicazione ottimale — tutto da un’unica dashboard reattiva.

> “Dove gli altri strumenti mostrano cosa è virale, REDLINEVIRAL ti mostra *come diventarlo*.”

---

## 🧭 0. Accesso & Layout

* **Auth:** Clerk (email/social)
* **Redirect post-login:** `/app`
* **Empty state:** se nessuna analisi, mostra CTA “Seleziona un Trend” o “Prova la Sandbox”
* **Layout a 3 colonne:**

  * **Sidebar sinistra:** Logo, Trend Hub, Video, Sandbox, Compare, Storico, Settings
  * **Colonna centrale:** Trend Hub → Analisi → Publishing Kit
  * **Colonna destra:** Smart Queue, Notifiche, Suggerimenti IA

---

## 🔹 1. Trend Hub

### Header controlli

* **Piattaforme:** TikTok / Instagram / X
* **Finestre:** 3h • 12h (default) • 24h • 72h
* **Filtri:** Nicchia (multi) + Regione (es. Italia)
* **Ricerca naturale:** “relazioni tossiche su TikTok in Italia”

### Grid Trend

Ogni trend mostra:

* Titolo
* Δ% crescita + sparkline 12-72h
* Saturazione (bassa/media/alta)
* Pulsanti → **Dettagli**, **Attiva**, **Confronta**

### Azioni

* **Dettagli:** curva zoom, fonte, freschezza, tips (“Hook consigliato”) → *Trend Lab*
* **Attiva:** aggiunge ai *Trend Attivi*
* **Confronta:** apre *Compare Tool* (2 trend max)

---

## 🧠 1.1 Trend Lab

Laboratorio di esplorazione e validazione di un trend.

* **Trend Composer:** genera 3 hook ≤5s
* **Angle Builder:** suggerisce 3 angolazioni narrative (tutorial / story-time / controintuitivo)
* **Saturazione & Longevità:** stima 48–72h, alert “⚠️ Calo previsto entro 36h”
* **Azioni:** Aggiungi ai Trend Attivi • Invia a Sandbox • Crea Kit Bozza

Metriche interne → z-score 7gg + AUC 48h + cache 15m fallback Supabase.

---

## ⚖️ 1.2 Compare Tool (Trend vs Trend)

* **Radar:** Crescita • Longevità • Saturazione • Shareability • Fit Nicchia
* **Insight IA:** “A è migliore nelle prossime 24h se pubblichi entro le 17:30”
* **CTA:** “Scegli A” → imposta A come trend principale

---

## 🎬 2. Video Sandbox

Prototipo rapido (senza upload).

* **Campi:** Hook ≤15s, Tone, Trend opzionale
* **Azione:** “Valuta prototipo”
* **Output:** Viral Potential 0–100 • Note • 2 hook migliorativi
* **CTA:** “Invia all’Analisi Video” / “Crea Kit Bozza”

Formula:

```
Score = 0.35·Hook + 0.25·Novelty + 0.20·Emotion + 0.20·TrendMatch
```

Rate-limit 5/min • temperature 0.6.

---

## 🧩 3. Analizza Video

* **Upload:** Drag & Drop + CAPTCHA Turnstile
* **Validazioni:** MIME mp4/mov/webm • ≤50 MB • H.264/AAC • ≤90 s
* **Pipeline:** FFmpeg → Whisper → Grok Vision + LLM → AJV → DB
* **Stati SSE:** `queued` → `ffmpeg_started` → `transcribing` → `analyzing` → `validating` → `persisting` → `ready`

Output READY → Radar 6 metriche + score per piattaforma + confidence + warnings + CTA (Genera Kit / Confronta / Salva)

Errori gestiti: file corrotto • timeout • oversize • rate-limit → messaggi chiari + retry idempotente.

---

## 📊 4. Comparative Analytics (Video vs Video)

Radar sovrapposto + tab Differenze chiave + Insight “Piano V2.0” (3 modifiche prioritarie).
CTA: Genera Kit V2 / Duplica Analisi • Versioning su `parent_analysis_id`.

---

## ✍️ 5. Publishing Kit

Slide-over destra.

* Selettori: piattaforma • tono • target • lingua • max 15 hashtag
* Output: title • caption • hashtags • music keywords • thumbnail text • best hour/day
* Azioni: Copia • Rigenera • Salva • Smart Queue
* Filtri: dedup + banwords • i18n auto

---

## 🗂️ 6. Storico Analisi

Lista + filtri + azioni (Apri • Rigenera • Confronta • Duplica • Elimina)
FTS Postgres su `title caption trend_tags` • RLS per `user_id`.

---

## 🔔 7. Smart Queue & Notifiche

To-do dinamici (“Analizza video AI girlfriend”, “Pubblica alle 17:30”).
Quick actions • Notifiche live • Snooze / Done • SSE token firmato per sicurezza.

---

## ⚙️ 8. Settings

Nicchia • Area/Lingua • Tema • Notifiche • Default 12h trend.
Esempio RLS:

```sql
create policy "user_is_owner"
on public.analysis for all
using (auth.uid() = user_id);
```

Quota base 10 analisi/giorno • moderazione automatica.

---

## 💾 9. Stati, Errori & Shortcut

UX chiara (Empty / Loading / Error) • Idempotency-key su upload • Shortcuts `/ U K C G`.

---

## 🧱 Tech Stack Completo

**Frontend:** Next 14 TS • Tailwind + shadcn/ui + Framer + Recharts • TanStack Query + Zustand
**Auth:** Clerk (+ Svix webhook opz.)
**DB:** Supabase Postgres + RLS + Realtime + FTS
**Queue:** Redis (Upstash) + BullMQ + QueueScheduler + DLQ + bull-board
**Storage:** Cloudflare R2 privato + presigned URL + ClamAV + CDN cache
**AI Pipeline:** FFmpeg / Whisper / Grok Vision / GPT-4o fallback / AJV validation
**Sicurezza:** Rate Limit Upstash • Idempotency • CSP • CSRF • DOMPurify • Env Vault
**Observability:** Sentry • OpenTelemetry • PostHog • Slack alert • Health checks
**Testing:** Vitest • Testing Library • Playwright E2E
**Deploy:** Web → Vercel • Worker → Railway/Fly • Dockerfile incluso
**CI/CD:** GitHub Actions (lint → test → build → deploy)

---

## 🗃️ Schema DB (mini ER)

| Tabella           | Scopo           | Campi principali                          |
| ----------------- | --------------- | ----------------------------------------- |
| `profiles`        | Utenti          | id, email, niche[], region                |
| `videos`          | Upload          | id, user_id, url, duration_s, has_audio   |
| `analysis`        | Job pipeline    | id, video_id, status, started_at          |
| `analysis_result` | Output          | radar jsonb, scores jsonb, warnings jsonb |
| `trends_cache`    | Trend API cache | platform, region, payload, cached_at      |
| `kits`            | Publishing      | analysis_id, caption, hashtags            |
| `notifications`   | Smart Queue     | type, payload, read_at                    |

---

## 🌍 Environment Variables (.env.example)

```bash
# Core
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=

# Auth
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI / Storage
OPENAI_API_KEY=
GROK_API_KEY=
R2_ACCOUNT_ID=
R2_BUCKET=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=

# Redis / Queue
REDIS_URL=
BULLMQ_PREFIX=

# Security
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET=
WORKER_JWT_SECRET=

# Analytics / Email / Logs
RESEND_API_KEY=
SENTRY_DSN=
POSTHOG_API_KEY=

# Optional
STRIPE_KEY=
```

---

## ⚡ Getting Started (Dev Setup)

```bash
git clone https://github.com/michael/redlineviral.git
cd redlineviral
pnpm install
cp .env.example .env.local
docker compose up -d
pnpm dev        # App → http://localhost:3000
pnpm worker     # Start BullMQ worker
```

---

## 🧰 Dev Scripts Utili

| Comando       | Descrizione             |
| ------------- | ----------------------- |
| `pnpm dev`    | Avvia Next in dev       |
| `pnpm build`  | Build produzione        |
| `pnpm lint`   | Lint check              |
| `pnpm test`   | Unit + integration      |
| `pnpm e2e`    | Playwright E2E          |
| `pnpm worker` | Avvia BullMQ worker     |
| `pnpm queues` | Apre bull-board console |

---

## ☁️ Deployment

**Web:** Vercel (`pnpm deploy:web`)
**Worker:** Railway / Fly.io (`pnpm deploy:worker`)
**Staging:** `staging.redlineviral.com`
**Production:** `app.redlineviral.com`
Dockerfile (`apps/worker/Dockerfile`) con `ffmpeg`, `clamav`, `faster-whisper`.

---

## 🔄 Branch & Contributing Policy

| Branch                                                             | Uso            |
| ------------------------------------------------------------------ | -------------- |
| `main`                                                             | Produzione     |
| `dev`                                                              | Sviluppo       |
| `feat/*`                                                           | Nuove funzioni |
| `fix/*`                                                            | Bugfix         |
| PR → Dev → Main dopo test CI verdi • Lint e unit test obbligatori. |                |

---

## ⚠️ Known Issues / Limitazioni

* Worker GPU non disponibile su Fly free-tier
* Rate-limit Grok 10/min → cache fallback 15 m
* Billing non attivo (quote base)
* Musiche → solo pattern/keyword no asset protetti
* Pubblicazione diretta TikTok API non ancora abilitata

---

## 🧭 Roadmap Prossime Release

* [ ] Abbonamento Pro (Stripe Plans)
* [ ] Integrazione pubblicazione diretta TikTok / Instagram API
* [ ] Chat real-time AI Editor collaborativo
* [ ] Dashboard Analytics avanzata (share rate vs benchmark)
* [ ] API pubblica `/api/v2/*` con token sviluppatori

---

## 📈 Diagramma (High-Level)

```
[Client]
   ↓ SSE/HTTP
[Next.js API] → [BullMQ Queue] → [Worker: FFmpeg/Whisper/Grok]
   ↓                               ↓
[Supabase DB] ← persist results ← |
   ↓
[Publishing Kit → Smart Queue → User]
```

---

## ✅ Acceptance Criteria (Estratto)

1. Upload > 50 MB → errore leggibile
2. Audio assente → READY + warning `NO_AUDIO_DETECTED`
3. SSE ≥ 5 eventi progress
4. Trend fallback badge “cached ≤ 15 m”
5. Sandbox rate-limit → 429
6. Compare → radar 5 dimensioni
7. Publishing Kit → ≤ 15 hashtag unici
8. RLS → dati isolati per utente
9. Idempotency → 1 job per click
10. FTS query 1 k record < 200 ms

---

## 🔒 Observability & Reliability

**Error taxonomy:** USER_INPUT • RATE_LIMIT • PROVIDER_DOWN • VALIDATION_FAIL • INTERNAL
**SLO:** 80 % analisi < 90 s • 95 % webhook < 1 s • error rate < 2 %
**Monitoring:** Sentry + PostHog + Slack alert DLQ > 5 job • cron cleanup 72 h

---

# 🧩 API Routes (Next.js App Router)

| Route                | Metodo    | Scopo                      | Note                 |
| -------------------- | --------- | -------------------------- | -------------------- |
| `/api/trends`        | GET       | Ottiene trend da Grok      | Cache Supabase 15 m  |
| `/api/sandbox`       | POST      | Valuta hook testuale       | Rate-limit 5/min     |
| `/api/upload`        | POST      | Genera presigned URL R2    | Idempotency key      |
| `/api/analyze`       | POST      | Enqueue video in BullMQ    | Restituisce `job_id` |
| `/api/job/[id]`      | GET (SSE) | Stream stato job           | Eventi pipeline      |
| `/api/kits`          | POST      | Genera caption e hashtag   | GPT-4o + filters     |
| `/api/notifications` | GET       | Smart Queue / todo         | SSE signed token     |
| `/api/settings`      | GET/PUT   | Lettura/salvataggio utente | Auth Clerk           |

---

# 🔧 Worker Flow (BullMQ Worker)

**Queue:** `analysis-jobs`
**Concurrency:** 3 job per worker
**Retry:** 3 tentativi • backoff esponenziale 2 s
**Timeout:** 120 s totale

1. **Fetch video:** recupera file da R2 via presigned URL
2. **Step 1 – FFmpeg:** estrai audio e frame (1 frame ogni 5 s)
3. **Step 2 – Whisper:** trascrizione → `transcript.json`
4. **Step 3 – Grok Vision + Text:** analizza frame e trascrizione → JSON intermedio
5. **Step 4 – AJV:** valida output vs `analysis_result_schema`
6. **Step 5 – Persist:** salva in `analysis_result` via Supabase Client (Service Key)
7. **Step 6 – Emit SSE:** invia `ready` + update Smart Queue

Error handling → on fail : `status='failed'` + DLQ log + Slack alert.

---

# 🧠 LLM Input / Output Models

### **A. Grok – Trend Discovery**

**Input Prompt**

```text
Analizza le ultime tendenze su {platform} in {region} nelle ultime {hours}.
Restituisci in JSON:
[{ "title": string, "growth_rate": float, "saturation": "low|medium|high", "examples": string[], "created_at": ISO8601 }]
```

**Output Schema**

```json
[
  {
    "title": "AI Girlfriend Trend",
    "growth_rate": 0.82,
    "saturation": "medium",
    "examples": ["POV Girlfriend AI", "ChatGPT Love Simulation"],
    "created_at": "2025-10-19T10:00:00Z"
  }
]
```

---

### **B. GPT-4o – Sandbox Evaluation**

**Input Prompt**

```text
Valuta


questo hook: "{text}" in base a originalità, emozione, ritmo e coerenza con il trend {trend_name}.
Restituisci JSON con punteggi e 2 alternative migliorative.

````
**Output Schema**
```json
{
  "scores": {
    "hook": 78,
    "novelty": 65,
    "emotion": 84,
    "trendMatch": 90
  },
  "improvements": [
    "Nessuno ti dirà questa verità sulle relazioni...",
    "Hai mai notato che tutti fanno QUESTO errore?"
  ],
  "notes": "Hook buono, ma finale poco incisivo"
}
````

---

### **C. GPT-4o – Video Analysis**

**Input Prompt**

```text
Analizza il seguente transcript e descrizione video.
Restituisci un JSON con 6 metriche di viralità (hook, emotion, clarity, novelty, trendMatch, storytelling), eventuali warning e 3 raccomandazioni pratiche.
```

**Output Schema**

```json
{
  "scores": {
    "hook": 82,
    "emotion": 79,
    "clarity": 91,
    "novelty": 67,
    "trendMatch": 88,
    "storytelling": 85
  },
  "warnings": ["Hook troppo lungo", "Testo overlay mancante"],
  "recommendations": [
    "Aggiungi claim iniziale più diretto",
    "Inserisci testo dinamico nei primi 2 secondi",
    "Riduci durata totale a 45s"
  ]
}
```

---

## 📜 Licenza

```
MIT License © 2025 redline
```

---

## 🗒️ Change Log

## 🧩 Version 3.1
* Fix prompt Sandbox (rimozione riga vuota + formato corretto)
* Aggiunto schema AJV "analysis_result_schema" per validazione risultati nel Worker

---

**REDLINEVIRAL v3.1**
Made with fluidtype corp. — powered by Next.js 14, Supabase, Grok & GPT-4o.

---
