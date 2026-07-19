# AI Fluency Navigator

AI Fluency Navigator is a polished, local-only behavioral diagnostic for everyday AI users. In 10 short questions it shows a five-part fluency profile, highlights current strengths, selects one highest-impact growth area, and gives one practical exercise plus a ready-to-use prompt.

## Stack

- React + TypeScript
- Vite
- Vitest
- Structured CSS
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Test and build

```bash
npm run test
npm run build
```

The production output is written to `dist/` and can be deployed to any static host configured with an SPA fallback to `index.html`.

## Content and scoring

The source-of-truth product content is stored in `src/data/content.json`. Each answer keeps its permanent option ID and hidden score. Two questions contribute to each of five dimensions; the browser maps each 2–8 component score to its own level. There is no overall score or overall level.

Strongest-capability ties, growth-area ties, balanced-profile special cases, level descriptions, traps, exercises, and prompts all follow the rules and wording in the supplied content file.

## Privacy

All diagnostic calculations run locally in the browser. No answers are sent to a server.

Only the current question, selected option IDs, per-question randomized option order, and completion state are stored in versioned browser `localStorage`.

## MVP limitations

This prototype intentionally has no accounts, backend, result history, analytics, API calls, exports, or generated content. Results stay in the current browser. Direct deployment of the clean `/diagnostic` and `/result` paths requires the static host to route unknown paths to `index.html`.
