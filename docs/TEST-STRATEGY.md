# Test strategy

- **Unit:** pure gate, circuit, motion, validation, and progress parsing functions in Vitest.
- **Integration:** test workflow stages, answer submission, score persistence, and storage recovery when the component test environment is introduced.
- **UI/accessibility:** check labels, keyboard focus, reduced motion, responsive overflow, and truthful empty states.
- **End-to-end:** Playwright smoke checks for home navigation, catalogue filtering, subject routes, and workflow progression.
- **Regression:** run lint, strict TypeScript, unit tests, production build, and supported browser checks before a release.

Do not report a check as passing if it was skipped or could not run. Playwright browser availability is environment-dependent.
