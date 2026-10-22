export type LogicGate = "AND" | "OR" | "XOR" | "NOT";

export function evaluateGate(gate: LogicGate, a: boolean, b: boolean): boolean {
  switch (gate) {
    case "AND": return a && b;
    case "OR": return a || b;
    case "XOR": return a !== b;
    case "NOT": return !a;
  }
}

export function calculateCurrent(voltage: number, resistance: number): number {
  if (!Number.isFinite(voltage) || !Number.isFinite(resistance) || voltage < 0 || resistance <= 0) {
    throw new RangeError("Voltage must be non-negative and resistance must be positive.");
  }
  return voltage / resistance;
}

export function calculateMotion(initialVelocity: number, acceleration: number, time: number) {
  if (![initialVelocity, acceleration, time].every(Number.isFinite) || time < 0) {
    throw new RangeError("Inputs must be finite and time must be non-negative.");
  }
  return {
    velocity: initialVelocity + acceleration * time,
    displacement: initialVelocity * time + 0.5 * acceleration * time ** 2,
  };
}

export function makeMotionSeries(initialVelocity: number, acceleration: number, duration: number, samples = 20) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const time = (duration * index) / samples;
    const { displacement } = calculateMotion(initialVelocity, acceleration, time);
    return { time, displacement };
  });
}

export function makeCurrentSeries(voltage: number, minResistance = 10, maxResistance = 500, samples = 24) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const resistance = minResistance + ((maxResistance - minResistance) * index) / samples;
    return { resistance, current: calculateCurrent(voltage, resistance) };
  });
}
