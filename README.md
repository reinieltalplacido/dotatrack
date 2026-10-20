# DotaTrack

Open-source Dota 2 analytics and player tracking web app. Built with Next.js 16, React 19, and Tailwind CSS v4, powered by public data from the [OpenDota API](https://docs.opendota.com) and Liquipedia.

---

## Features

- **Player Tracker** — Search players by 32-bit Account ID, 64-bit Steam ID, or Steam Community profile URL. View match history, win rates, hero pools, rank tier estimations, and teammate synergy records.
- **Match Analyzer** — Inspect individual matches with breakdown graphs for net worth and XP advantage, lane phase CS@10 trading metrics, ability upgrade paths, and item timings.
- **Meta Trends** — Tier lists and win rate / pick rate / ban rate shifts across Herald to Immortal brackets for Patch 7.37e.
- **Tournaments** — Pro tournament tracker covering live series, upcoming schedules, group stage standings, and Liquipedia tournament metadata.
- **Hero Database** — Comprehensive hero attributes, base stats, facets, and talent trees.
- **Command Palette** — Press `⌘K` or `Ctrl+K` anywhere on the site for instant navigation and player lookup.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & State**: React 19, Framer Motion
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Data Providers**: OpenDota API, Liquipedia

---

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/reinieltalplacido/dotatrack.git
   cd dotatrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up your environment variables:
   DotaTrack works out of the box using public OpenDota endpoints. If you want higher rate limits, get a free key from [OpenDota](https://www.opendota.com/api-keys) and add it to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Inside `.env.local`:
   ```env
   OPENDOTA_API_KEY=your_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
dotatrack/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Internal API proxy routes (players, matches, tournaments)
│   ├── heroes/           # Hero codex and details
│   ├── match-data/       # Match analyzer route
│   ├── meta-trends/      # Meta tier lists and bracket trends
│   ├── player/           # Dynamic player profiles ([accountId])
│   └── tournaments/      # Pro tournaments and Liquipedia view
├── components/           # Reusable UI components
│   ├── heroes/           # Hero cards, filters, and modals
│   ├── match/            # Match graphs, combat logs, overview banners
│   ├── meta/             # Meta tier tables, trend charts
│   ├── player/           # Player tabs, hero performance, teammate lists
│   └── tournaments/      # Live match strips, tournament brackets
├── lib/                  # Utilities, API client, types, and schemas
│   ├── opendota/         # OpenDota API client, cache logic, hero constants
│   └── validation.ts     # Steam ID and input validation helpers
└── public/               # Static assets, hero icons, brand images
```

---

## Contributing

Contributions of any kind are welcome — whether it's fixing a bug, adding a new analytical metric, improving mobile responsiveness, or adding tests.

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and verify that types and lint checks pass:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
3. Commit your changes with a descriptive commit message:
   ```bash
   git commit -m "feat: add lane efficiency stat to match analyzer"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request on GitHub.

If you find a bug or have a suggestion, feel free to [open an issue](https://github.com/reinieltalplacido/dotatrack/issues).

---

## Disclaimer

DotaTrack is an independent open-source fan project and is not affiliated with, sponsored, or endorsed by Valve Corporation. Dota 2, the Dota 2 logo, and Steam are registered trademarks of Valve Corporation.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
