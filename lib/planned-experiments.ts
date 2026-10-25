export type PlannedExperiment = {
  slug: string;
  title: string;
};

export const plannedExperiments: PlannedExperiment[] = [
  { slug: "logic-gates-rtl-dtl-ttl", title: "Logic gates using RTL, DTL and TTL" },
  { slug: "logic-functions-gate-ics", title: "Logic functions using logic gate ICs" },
  { slug: "half-full-adders", title: "Half Adder and Full Adder circuits" },
  { slug: "half-full-subtractors", title: "Half Subtractor and Full Subtractor circuits" },
  { slug: "binary-gray-conversion", title: "Binary to Grey and Grey to Binary code conversion" },
  { slug: "multiplexers-basic-gates", title: "2×1 and 4×1 Multiplexers using basic gates" },
  { slug: "bcd-excess-3-conversion", title: "BCD to Excess-3 code conversion using basic gates" },
  { slug: "flip-flops-types", title: "RS, D, JK and T Flip-Flops" },
  { slug: "counters", title: "Study of Counters" },
  { slug: "four-bit-shift-register", title: "4-bit Shift Register using D Flip-Flop" },
];

export function getPlannedExperiment(slug: string) {
  return plannedExperiments.find((experiment) => experiment.slug === slug);
}
