import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Atom, BookOpenCheck, ChevronRight, CircuitBoard, Zap } from "lucide-react";
import { ExperimentCard } from "@/components/experiment-card";
import { experimentsFor, subjects, type SubjectId } from "@/lib/experiments";

const iconMap = {
  physics: Atom,
  "basic-electrical": Zap,
  "digital-electronics": CircuitBoard,
};

export function SubjectLanding({ subject }: { subject: SubjectId }) {
  const details = subjects[subject];
  const Icon = iconMap[subject];
  const modules = experimentsFor(subject);
  const hasModules = modules.length > 0;

  return (
    <main>
      <section className={`subject-hero subject-hero--${subject}`}>
        <div className="container">
          <div className="breadcrumbs"><Link href="/labs"><ArrowLeft size={14} /> All subjects</Link><ChevronRight size={14} /><span>{details.title}</span></div>
          <div className="subject-hero__content">
            <div><span className="eyebrow">Graduation subject · {details.number}</span><h1>{details.title}<span className="gradient-dot">.</span></h1><p>{details.description}</p></div>
            <div className="subject-hero__icon"><Icon size={48} strokeWidth={1.3} /><span>{String(modules.length).padStart(2, "0")} <small>{hasModules ? "experiments" : "available"}</small></span></div>
          </div>
          <div className="subject-hero__bottom"><span><BookOpenCheck size={16} /> Graduation level</span><span>{hasModules ? "Collection ready" : "Content coming soon"}</span></div>
        </div>
      </section>
      <section className="section container subject-modules">
        {hasModules ? (
          <>
            <div className="section-heading section-heading--left"><div><span className="eyebrow">Pick a topic</span><h2>Ten experiments to explore</h2></div><Link className="text-link" href="/labs">Browse all subjects <ArrowUpRight size={16} /></Link></div>
            <div className="experiment-grid">{modules.map((experiment, index) => <ExperimentCard key={experiment.slug} experiment={experiment} index={index} />)}</div>
            <div className="faculty-note"><div className="faculty-note__icon"><BookOpenCheck size={20} /></div><div><strong>Graduation collection</strong><p>Choose any module to open its learning steps.</p></div></div>
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
