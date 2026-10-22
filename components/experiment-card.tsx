import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { DiagramKind, Experiment } from "@/lib/experiments";

const conceptMarks: Record<DiagramKind, string> = {
  "seven-segment": "BCD → 7 SEG",
  "logic-families": "TTL · CMOS",
  "boolean-logic": "F = A′B + AC",
  multiplexer: "4 : 1 MUX",
  decoder: "2 → 4",
  comparator: "A  ?  B",
  arithmetic: "SUM + CARRY",
  "flip-flop": "D → Q",
  "shift-register": "Q₀ → Q₁ → Q₂",
  alu: "ALU(A, B, OP)",
};

export function ExperimentCard({ experiment, index = 0 }: { experiment: Experiment; index?: number }) {
  return (
    <article className="experiment-card" style={{ animationDelay: `${index * 45}ms` }}>
      <div className={`experiment-card__visual experiment-card__visual--${experiment.diagram}`} aria-hidden="true">
        <span className="experiment-card__module">MODULE {String(index + 1).padStart(2, "0")}</span>
        <strong>{conceptMarks[experiment.diagram]}</strong>
        <div className="experiment-card__signal"><i /><i /><i /><i /><i /></div>
      </div>
      <div className="experiment-card__body">
        <div className="experiment-card__category">{experiment.category}<span>·</span>{experiment.difficulty}</div>
        <h3>{experiment.title}</h3>
        <p className="experiment-card__summary">{experiment.summary}</p>
      </div>
      <div className="experiment-card__meta"><span><Clock3 size={15} /> {experiment.duration} min</span><span>Diagram + theory</span></div>
      <Link className="experiment-card__link" href={`/experiment/${experiment.slug}`} aria-label={`Open ${experiment.title}`}>
        Open lab <ArrowUpRight size={17} />
      </Link>
    </article>
  );
}
