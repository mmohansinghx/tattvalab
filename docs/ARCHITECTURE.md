# Architecture

## Application layers

- **Routes:** Next.js App Router files in `app/` compose page-level UI and metadata.
- **Shared UI:** `components/` owns navigation, catalogue filters, progress views, and the reusable experiment workflow.
- **Content:** `lib/experiments.ts` defines subjects, experiment metadata, assumptions, and separate pre/post question sets in typed data.
- **Models:** `lib/simulation.ts` contains pure deterministic calculations with explicit validation.
- **Persistence:** `lib/progress.ts` parses and safely writes a versioned localStorage record.

## Data flow

The route resolves an experiment slug from the typed registry. The workflow receives that experiment, displays its theory/question data, and selects the matching simulation component. Simulation components call pure model functions. Assessment results and completion timestamps update the local progress map. The progress route reads and validates the same map in the browser.

## Boundaries

- Content does not depend on React components.
- Simulation math does not depend on browser APIs or React.
- localStorage access occurs only in client components after mount or after user action.
- No authentication, server database, API keys, or external paid services are required.

## Adding a module

Add a typed registry entry, define a `SimulationKind`, implement validated pure functions, connect the UI to those functions, add question sets and model assumptions, and update the relevant tests and documentation.
