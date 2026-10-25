# Product requirements

## Goal

Provide a dependable and approachable TLab foundation for engineering students. The MVP demonstrates the learning loop and supports later integration of course-specific material.

## Users and needs

- Engineering students need a clear path from theory to an experiment and a way to review what they learned.
- Instructors and content authors need a typed registry and repeatable content contracts for future modules.
- Visitors need to distinguish sample content from faculty-reviewed or officially adopted university material.

## MVP scope

- Homepage, catalogue, three subject collections, reusable experiment route, progress dashboard.
- Search, subject/difficulty filters, sorting, and empty state.
- Three labelled sample models: Boolean gates, Ohm’s law for an ideal resistor, and one-dimensional constant acceleration.
- TLab Aim, Theory, Theory Test, Procedure, Simulation, Final Test, References, Feedback, and printable Report stages. Every stage can be opened directly.
- Anonymous progress stored locally in the browser.
- Responsive design, keyboard operation, reduced motion, and accessible labels.

## Non-goals

- Authentication, institutional student records, cross-device sync, payments, paid APIs, deployment, or faculty content management.
- Claiming official university affiliation, endorsement, or validated course material.
- Building every engineering experiment before the source content is supplied.

## Acceptance criteria

- All listed routes render and meaningful navigation is available.
- Catalogue filters operate against the typed registry.
- Each demonstration uses a deterministic calculation model and visible assumptions.
- Invalid/malformed local progress data does not crash the page.
- Reports can be printed through the browser.
- Automated checks are reported only after they actually run.
