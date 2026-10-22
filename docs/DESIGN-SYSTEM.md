# Design system

## Tokens

- Deep blue `#273E91`, purple `#642A72`, burgundy `#87244F`, crimson `#B51F3B`.
- Ink `#1D2433`, muted text `#667085`, white `#FFFFFF`, quiet neutral/lavender backgrounds.
- Primary gradient: blue → purple → burgundy. Use it for primary actions, selected states, and small brand accents.

## Typography and spacing

Use the system UI font stack for reliable rendering without a remote font dependency. Headings use compact tracking and moderate weight. Body copy uses comfortable line-height. Layout spacing follows a 4/8px rhythm with generous section gaps.

## Components

Shared pieces include the original SVG T monogram, responsive navigation, gradient primary buttons, subject and experiment cards, badges, breadcrumbs, form controls, workflow stages, assessment answers, empty states, and progress panels.

## Interaction states

Controls expose hover, focus-visible, selected, disabled, and validation/result states. Search and filters update the catalogue immediately. Learning stages become available as the learner reaches them.

## Responsive behavior

Three-column cards collapse to one column on mobile. Navigation becomes a keyboard-accessible menu. Simulation controls and results stack at narrow widths. Forms and reports avoid horizontal overflow.

## Accessibility

Use semantic landmarks, skip link, visible focus, named controls, aria states, text summaries, contrast-aware colors, and reduced-motion styles. Re-check contrast and screen-reader behavior during content review.
