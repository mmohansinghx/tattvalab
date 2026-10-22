import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenCheck, CircuitBoard, Clock3, Cpu, Layers } from "lucide-react";
import { ExperimentCard } from "@/components/experiment-card";
import { ProgressDashboard } from "@/components/progress-dashboard";
import { experiments } from "@/lib/experiments";

const tracks = [
  {
    number: "01",
    title: "Start with logic",
    description: "Get comfortable with binary rules and the electrical signals behind them.",
    icon: CircuitBoard,
    slugs: ["logic-gate-explorer", "digital-logic-families"],
    accent: "logic",
  },
  {
    number: "02",
    title: "Combine and calculate",
    description: "Select data, decode inputs, compare words and do binary arithmetic.",
    icon: Cpu,
    slugs: ["multiplexer-logic-design", "decoder-logic-design", "digital-comparator", "adders-and-subtractors", "bcd-7-segment-decoder"],
    accent: "combine",
  },
  {
    number: "03",
    title: "Store and move bits",
    description: "See how clocked circuits remember data and shift it between stages.",
    icon: Layers,
    slugs: ["flip-flops", "shift-registers"],
    accent: "memory",
  },
  {
    number: "04",
    title: "Put the pieces together",
    description: "Meet the arithmetic logic unit at the heart of a processor datapath.",
    icon: BookOpenCheck,
    slugs: ["arithmetic-logic-unit"],
    accent: "system",
  },
];

export default function Home() {
  const experimentsBySlug = new Map(experiments.map((experiment) => [experiment.slug, experiment]));

  return (
    <main id="main-content" className="home-lab">
      <section className="home-lab-hero container">
        <div className="home-lab-hero__copy">
          <span className="home-lab-kicker"><i /> DIGITAL ELECTRONICS · GUIDED LABS</span>
          <h1>Digital logic, made clear.<br /><em>One circuit at a time.</em></h1>
          <p>Explore 10 guided labs with clear theory, circuit diagrams, worked examples and quick checks.</p>
          <div className="home-lab-hero__actions">
            <Link className="button button--primary button--large" href="/labs/digital-electronics">Explore all 10 labs <ArrowRight size={18} /></Link>
            <Link className="home-lab-hero__text-link" href="/experiment/logic-gate-explorer">Start with logic gates <ArrowUpRight size={17} /></Link>
          </div>
          <div className="home-lab-hero__facts">
            <span><strong>10</strong> focused experiments</span><i />
            <span><strong>3</strong> learning phases</span><i />
            <span><Clock3 size={16} /> Work at your pace</span>
          </div>
        </div>

        <aside className="logic-preview" aria-label="AND gate concept example">
          <div className="logic-preview__top"><span><i /> CONCEPT PREVIEW</span><strong>AND GATE</strong></div>
          <div className="logic-preview__question"><span>When does the output turn on?</span><strong>Only when <em>both</em> inputs are 1.</strong></div>
          <div className="logic-preview__circuit">
            <div className="logic-preview__inputs"><span><i className="is-high" /> A <b>1</b></span><span><i /> B <b>0</b></span></div>
            <svg viewBox="0 0 106 74" role="img" aria-label="Two inputs connected to an AND gate">
              <path d="M13 10h32a27 27 0 0 1 0 54H13z" fill="none" stroke="currentColor" strokeWidth="2.6" />
              <path d="M0 25h13M0 49h13M72 37h25" stroke="currentColor" strokeWidth="2.6" />
              <circle cx="5" cy="25" r="3" fill="#81bce8" /><circle cx="5" cy="49" r="3" fill="#9aa9c4" />
            </svg>
            <div className="logic-preview__result"><span>Y</span><strong>0</strong><small>LOW</small></div>
          </div>
          <div className="logic-preview__rule"><span>BOOLEAN RULE</span><strong>Y = A · B</strong></div>
          <div className="logic-preview__table"><span>A</span><span>B</span><span>Y</span><b>0</b><b>0</b><b>0</b><b>0</b><b>1</b><b>0</b><b>1</b><b>0</b><b>0</b><b>1</b><b>1</b><b className="is-output">1</b></div>
          <p className="logic-preview__caption">A small example of the kind of idea you’ll learn to explain.</p>
        </aside>
      </section>

      <section className="learning-map container" aria-labelledby="learning-map-title">
        <div className="section-heading learning-map__heading">
          <div><span className="eyebrow">A clear route through the subject</span><h2 id="learning-map-title">Choose a starting point.</h2></div>
          <p>Follow the learning path, or jump straight to the experiment you need.</p>
        </div>
        <div className="learning-map__grid">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <article className={`learning-track learning-track--${track.accent}`} key={track.number}>
                <div className="learning-track__top"><span>{track.number}</span><Icon size={21} strokeWidth={1.8} /></div>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <div className="learning-track__links">
                  {track.slugs.map((slug) => {
                    const experiment = experimentsBySlug.get(slug);
                    if (!experiment) return null;
                    return <Link href={`/experiment/${slug}`} key={slug}>{experiment.title}<ArrowUpRight size={14} /></Link>;
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-experiment-list container" aria-labelledby="all-experiments-title">
        <div className="section-heading">
          <div><span className="eyebrow">Theory · diagrams · practice</span><h2 id="all-experiments-title">All ten experiments.</h2></div>
          <Link href="/labs/digital-electronics" className="text-link">Open the full catalogue <ArrowRight size={16} /></Link>
        </div>
        <div className="experiment-grid">{experiments.map((experiment, index) => <ExperimentCard key={experiment.slug} experiment={experiment} index={index} />)}</div>
      </section>

      <section className="home-progress container">
        <div className="home-progress__intro"><span className="eyebrow">Your work stays yours</span><h2>Pick up where you left off.</h2><p>Experiment scores and completion live in this browser on your device.</p><Link href="/progress" className="text-link">View my progress <ArrowRight size={16} /></Link></div>
        <div className="home-progress__panel"><ProgressDashboard compact /></div>
      </section>
      <p className="home-disclaimer container">TattvaLab is an independent learning resource and is not an official Medi-Caps University product or student record.</p>
    </main>
  );
}
