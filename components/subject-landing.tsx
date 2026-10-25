import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Atom, BookOpenCheck, ChevronRight, CircuitBoard, Zap } from "lucide-react";
import { ExperimentCard } from "@/components/experiment-card";
import { PlannedExperimentCard } from "@/components/planned-experiment-card";
import { experimentsFor, subjects, type SubjectId } from "@/lib/experiments";
import { plannedExperiments } from "@/lib/planned-experiments";

const iconMap = {
  physics: Atom,
  "basic-electrical": Zap,
  "digital-electronics": CircuitBoard,
};

export function SubjectLanding({ subject }: { subject: SubjectId }) {
  const details = subjects[subject];
  const Icon = iconMap[subject];
  const modules = experimentsFor(subject);
  const pageOutlines = subject === "digital-electronics" ? plannedExperiments : [];
  const moduleCount = modules.length + pageOutlines.length;
  const hasModules = moduleCount > 0;

  return (
    <main>
      <section className={`subject-hero subject-hero--${subject}`}>
        <div className="container">
          <div className="breadcrumbs"><Link href="/labs"><ArrowLeft size={14} /> All subjects</Link><ChevronRight size={14} /><span>{details.title}</span></div>
          <div className="subject-hero__content">
            <div><span className="eyebrow">Graduation subject · {details.number}</span><h1>{details.title}<span className="gradient-dot">.</span></h1><p>{details.description}</p></div>
            <div className="subject-hero__icon"><Icon size={48} strokeWidth={1.3} /><span>{String(moduleCount).padStart(2, "0")} <small>{hasModules ? "modules" : "available"}</small></span></div>
          </div>
          <div className="subject-hero__bottom"><span><BookOpenCheck size={16} /> Graduation level</span><span>{hasModules ? `${modules.length} labs ready · ${pageOutlines.length} page outlines` : "Content coming soon"}</span></div>
        </div>
      </section>
      <section className="section container subject-modules">
        {hasModules ? (
          <>
            <div className="section-heading section-heading--left"><div><span className="eyebrow">Pick a topic</span><h2>{moduleCount} Digital Electronics modules</h2></div><Link className="text-link" href="/labs">Browse all subjects <ArrowUpRight size={16} /></Link></div>
            <div className="experiment-grid">{modules.map((experiment, index) => <ExperimentCard key={experiment.slug} experiment={experiment} index={index} />)}</div>
            {pageOutlines.length > 0 && <>
              <div className="section-heading section-heading--left planned-modules-heading"><div><span className="eyebrow">Your experiment list</span><h2>10 page outlines · content pending</h2></div><p>Each module opens on its own page with the experiment section structure.</p></div>
              <div className="experiment-grid">{pageOutlines.map((experiment, index) => <PlannedExperimentCard key={experiment.slug} experiment={experiment} index={modules.length + index} />)}</div>
            </>}
            <div className="faculty-note"><div className="faculty-note__icon"><BookOpenCheck size={20} /></div><div><strong>Graduation collection</strong><p>Choose a ready lab or open one of the page outlines.</p></div></div>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon"><Icon size={21} /></span>
            <h3>Content for this subject will be added later.</h3>
            <p>The subject is available as a navigation option. For now, the Graduation Digital Electronics labs are ready.</p>
            <Link className="button button--secondary" href="/labs/digital-electronics">Open Digital Electronics <ArrowRight size={16} /></Link>
          </div>
        )}
      </section>
    </main>
  );
}
