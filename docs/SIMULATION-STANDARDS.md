# Simulation standards

Every simulation must document its accepted inputs and units, valid range, mathematical model, assumptions, outputs, boundary behavior, invalid-input behavior, and reference examples.

## Current models

### Boolean gates

- Inputs: Boolean A and B (NOT uses A only).
- Model: deterministic AND, OR, XOR, and NOT truth rules.
- Outputs: Boolean Y and a truth-table view.
- Assumptions: ideal binary logic; no delay, voltage thresholds, or loading model.

### Ohm’s law

- Inputs: voltage in V (0 or greater) and resistance in Ω (greater than zero).
- Model: `I = V / R` for a linear ideal resistor.
- Outputs: current in A and a current-versus-resistance chart.
- Assumptions: constant resistance; heating and component limits are excluded. UI controls keep voltage between 1–24 V and resistance between 10–500 Ω.

### Constant acceleration

- Inputs: initial velocity in m/s, acceleration in m/s², time in s (time must be non-negative).
- Model: `v = v₀ + at`, `x = v₀t + ½at²`.
- Outputs: final velocity and displacement with a displacement-time chart.
- Assumptions: one-dimensional motion, constant acceleration, no drag, SI units. UI controls keep values within visible bounds.

## Validation

Reject non-finite values, negative time, negative voltage, and non-positive resistance in pure calculation functions. Components should constrain input controls and state units. Add tests for representative values and invalid boundaries before adding a model to the catalogue.
