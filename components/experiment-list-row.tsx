import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PlannedExperiment } from "@/lib/planned-experiments";

const quickSections = [
  { label: "Aim", section: "aim" },
  { label: "Theory", section: "theory" },
  { label: "Pre-test", section: "pretest" },
  { label: "Simulation", section: "simulation" },
  { label: "Report", section: "report" },
];

export function ExperimentListRow({ experiment, index, moduleNumber = index + 1 }: { experiment: PlannedExperiment; index: number; moduleNumber?: number }) {
  const pageHref = `/experiment/${experiment.slug}`;

  return (
    <article className="experiment-list-row" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="experiment-list-row__main">
        <div className="experiment-list-row__meta"><span>Experiment {String(moduleNumber).padStart(2, "0")}</span><i />Digital Electronics</div>
        <h3><Link href={pageHref}>{experiment.title}</Link></h3>
        <div className="experiment-list-row__sections" aria-label={`Quick links for ${experiment.title}`}>
          {quickSections.map(({ label, section }) => <Link href={`${pageHref}?section=${section}`} key={section}>{label}<ArrowUpRight size={13} /></Link>)}
        </div>
      </div>
      <Link className="experiment-list-row__action" href={pageHref} aria-label={`Open ${experiment.title}`}>
        <span>Graduation · Digital Electronics</span>
        <strong>Open experiment <ArrowUpRight size={18} /></strong>
      </Link>
    </article>
  );
}
