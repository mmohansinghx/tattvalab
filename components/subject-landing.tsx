import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, ChevronRight, CircuitBoard } from "lucide-react";
import { ExperimentCard } from "@/components/experiment-card";
import { experimentsFor, subjects, type SubjectId } from "@/lib/experiments";

const iconMap = { "digital-electronics": CircuitBoard };

export function SubjectLanding({ subject }: { subject: SubjectId }) {
  const details = subjects[subject];
  const Icon = iconMap[subject];
  const modules = experimentsFor(subject);
  return (
    <main>
      <section className={`subject-hero subject-hero--${subject}`}>
        <div className="container">
          <div className="breadcrumbs"><Link href="/labs"><ArrowLeft size={14} /> All labs</Link><ChevronRight size={14} /><span>{details.title}</span></div>
          <div className="subject-hero__content">
            <div><span className="eyebrow">Subject collection · {details.number}</span><h1>{details.title}<span className="gradient-dot">.</span></h1><p>{details.description}</p></div>
            <div className="subject-hero__icon"><Icon size={48} strokeWidth={1.3} /><span>{String(modules.length).padStart(2, "0")} <small>experiments</small></span></div>
          </div>
          <div className="subject-hero__bottom"><span><BookOpenCheck size={16} /> Simple theory · diagrams · examples</span><span>Simulations planned next</span></div>
        </div>
      </section>
      <section className="section container subject-modules">
        <div className="section-heading section-heading--left"><div><span className="eyebrow">Pick a topic</span><h2>Ten experiments to explore</h2></div><Link className="text-link" href="/labs">Browse the collection <ArrowUpRight size={16} /></Link></div>
        <div className="experiment-grid">{modules.map((experiment, index) => <ExperimentCard key={experiment.slug} experiment={experiment} index={index} />)}</div>
        <div className="faculty-note"><div className="faculty-note__icon"><BookOpenCheck size={20} /></div><div><strong>Theory-first collection</strong><p>Each topic includes an original explanation, a diagram and examples. Interactive simulations will be connected later.</p></div></div>
      </section>
    </main>
  );
}
