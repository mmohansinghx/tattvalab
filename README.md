# TattvaLab

TattvaLab is an independent, theory-led learning site for Digital Electronics. It guides learners through ten experiment modules with clear explanations, circuit diagrams, examples, and practice questions. Its blue visual theme is inspired by Medi-Caps University; TattvaLab is not an official university product.

## Run locally

Requirements: Node.js 20.9 or later and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Learning flow

Each module has direct navigation through Aim, Theory, Theory Test, Procedure, Simulation, Final Test, References, Feedback, and Report. Theory uses original, introductory explanations with key points, examples, and diagrams. Interactive simulations are planned and can be added to the Simulation step later.

The ten Digital Electronics modules are:

1. BCD to 7-segment display
2. Digital logic families
3. Boolean functions with logic gates
4. Logic functions using a multiplexer
5. Logic functions using decoders
6. Digital comparator
7. Adders and subtractors
8. Flip-flops and one-bit memory
9. Shift registers
10. Arithmetic Logic Unit (ALU)

## Routes

- `/` — homepage and learning paths
- `/labs` — experiment catalogue
- `/labs/digital-electronics` — Digital Electronics collection
- `/experiment/[slug]` — guided experiment workflow
- `/progress` — browser-local progress dashboard

`/TattvaLab-final.html` serves a single-file HTML version with its styles, scripts, and lab content embedded.

## Project structure

- `app/` — Next.js App Router pages and global styles
- `components/` — shared navigation, catalogue, diagrams, progress, and experiment workflow
- `lib/experiments.ts` — typed Digital Electronics module content and assessment questions
- `lib/progress.ts` — browser-local progress storage
- `lib/simulation.ts` — deterministic simulation calculation helpers
- `docs/` — product, design, workflow, and assessment notes

Progress is stored in the current browser using `localStorage`; it is not an institutional student record and does not sync between devices.

## Commands

```bash
pnpm lint        # ESLint
pnpm typecheck   # TypeScript check
pnpm test        # Vitest unit tests
pnpm test:e2e    # Playwright smoke tests
pnpm build       # production build
pnpm start       # serve the production build
```
