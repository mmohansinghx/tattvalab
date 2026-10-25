import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { PlannedExperiment } from "@/lib/planned-experiments";

export function PlannedExperimentCard({ experiment, index, moduleNumber = index + 1 }: { experiment: PlannedExperiment; index: number; moduleNumber?: number }) {
  return (
    <article className="experiment-card experiment-card--planned" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="experiment-card__visual experiment-card__visual--planned" aria-hidden="true">
        <span className="experiment-card__module">MODULE {String(moduleNumber).padStart(2, "0")}</span>
        <strong>PAGE OUTLINE</strong>
        <div className="experiment-card__signal"><i /><i /><i /><i /><i /></div>
      </div>
      <div className="experiment-card__body">
        <div className="experiment-card__category">Digital Electronics <span>·</span> Content pending</div>
        <h3>{experiment.title}</h3>
        <p className="experiment-card__summary">Page structure is ready for your content.</p>
      </div>
      <div className="experiment-card__meta"><span><FileText size={15} /> Page outline</span><span>Content pending</span></div>
      <Link className="experiment-card__link" href={`/experiment/${experiment.slug}`} aria-label={`Open ${experiment.title}`}>
        Open page <ArrowUpRight size={17} />
      </Link>
    </article>
  );
}
