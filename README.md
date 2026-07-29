# 3 Amici Suites — Sito Vetrina

Sito web per 4 strutture ricettive a Verona: **3 Amici Suites**, **3 Amici al Teatro**, **3 Amici all'Arena**, e **3 Amici al Castello**.

## 🛠 Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** — design elegante, palette calda
- **Docker** (node:22-alpine)
- **Caddy** — reverse proxy con auto-HTTPS
- **Resend** — invio email (form contatti + alert iCal)
- **iCal Booking.com** — sincronizzazione disponibilità

## 🚀 Deploy

```bash
docker compose up -d --build
```

Il sito è servito su subpath `/3-amici-suites` via Caddy.

## 🔐 Pannello Admin

Accesso su `/admin` con password (impostata via `ADMIN_PASSWORD` env).

Lo staff può:
- Aggiornare i link iCal di Booking.com senza toccare codice
- Testare i link in tempo reale
- Vedere lo stato globale ("Verifica tutti")

Quando tutti i token iCal sono invalidi, parte un alert email automatico (via Resend, throttled a 24 ore).

## 📧 Variabili d'ambiente

| Variabile | Descrizione |
|---|---|
| `ADMIN_PASSWORD` | Password per pannello admin |
| `RESEND_API_KEY` | API key Resend |
| `CONTACT_FROM_EMAIL` | Mittente email form contatti |
| `CONTACT_TO_EMAIL` | Destinatario email form contatti |
| `NEXT_PUBLIC_BASE_PATH` | Subpath (default: `/3-amici-suites`) |

Vedi `.env.example` per i valori di esempio.
