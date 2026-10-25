import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { AcademicExplorer } from "@/components/academic-explorer";
import { ProgressDashboard } from "@/components/progress-dashboard";

export default function Home() {
  return (
    <main id="main-content" className="home-lab">
      <section className="home-lab-hero container">
        <div className="home-lab-hero__copy">
          <span className="home-lab-kicker"><i /> VIRTUAL LABS · THREE SUBJECTS · THREE LEVELS</span>
          <h1>Learn it clearly.<br /><em>See ideas connect.</em></h1>
          <p>Choose Physics, Basic Electrical &amp; Electronics, or Digital Electronics. Select your level and jump straight into the learning path.</p>
          <div className="home-lab-hero__actions">
            <Link className="button button--primary button--large" href="#subject-explorer">Choose your level <ArrowRight size={18} /></Link>
            <Link className="home-lab-hero__text-link" href="/experiment/logic-gates-rtl-dtl-ttl">Start with logic gates <ArrowUpRight size={17} /></Link>
          </div>
          <div className="home-lab-hero__facts">
            <span><strong>3</strong> subjects</span><i />
            <span><strong>3</strong> study levels</span><i />
            <span><Clock3 size={16} /> 10 Digital Electronics experiments</span>
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
          <p className="logic-preview__caption">A small example from the Graduation Digital Electronics collection.</p>
        </aside>
      </section>

      <AcademicExplorer />

      <section className="home-progress container">
        <div className="home-progress__intro"><span className="eyebrow">Your work stays yours</span><h2>Pick up where you left off.</h2><p>Progress tracking will be available when experiment content is added.</p><Link href="/progress" className="text-link">View my progress <ArrowRight size={16} /></Link></div>
        <div className="home-progress__panel"><ProgressDashboard compact /></div>
      </section>
      <p className="home-disclaimer container">TattvaLab is an independent learning resource and is not an official Medi-Caps University product or student record.</p>
    </main>
  );
}
