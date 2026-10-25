import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenCheck, Compass, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "TattvaLab | Virtual Labs",
  description: "TattvaLab is a focused virtual learning space to explore, understand and revisit ideas at your own pace.",
};

const learningMoments = [
  { label: "Learn", Icon: BookOpenCheck },
  { label: "Explore", Icon: Compass },
  { label: "Understand", Icon: Lightbulb },
];

export default function Home() {
  return (
    <main id="main-content" className="tattvalab-home">
      <section className="tattvalab-hero container">
        <div className="tattvalab-hero__copy">
          <span className="tattvalab-kicker"><i /> TATTVA LAB <b>·</b> VIRTUAL LAB</span>
          <h1>Make space to <em>understand.</em></h1>
          <p>TattvaLab is a virtual learning space where ideas become easier to explore, revisit and understand at your own pace.</p>
          <div className="tattvalab-hero__actions">
            <Link className="button button--primary button--large" href="/labs">Explore the virtual lab <ArrowRight size={18} /></Link>
            <Link className="tattvalab-hero__link" href="#about">What is TattvaLab? <ArrowUpRight size={16} /></Link>
          </div>
          <div className="tattvalab-hero__promise"><span>Learn clearly</span><i /><span>Explore freely</span><i /><span>Move at your pace</span></div>
        </div>

        <aside className="tattvalab-visual" aria-label="TattvaLab virtual learning space">
          <div className="tattvalab-visual__top"><span><i /> YOUR VIRTUAL LEARNING SPACE</span><strong>TATTVA LAB</strong></div>
          <div className="tattvalab-visual__map">
            <div className="tattvalab-visual__orbit tattvalab-visual__orbit--outer" />
            <div className="tattvalab-visual__orbit tattvalab-visual__orbit--inner" />
            <div className="tattvalab-visual__core"><span>TL</span><strong>TattvaLab</strong><small>VIRTUAL LAB</small></div>
            {learningMoments.map(({ label, Icon }, index) => <div className={`tattvalab-visual__node tattvalab-visual__node--${index + 1}`} key={label}><Icon size={18} /><span>{label}</span></div>)}
          </div>
          <p className="tattvalab-visual__caption">A calm, clear space for learning by exploring.</p>
        </aside>
      </section>

      <section className="tattvalab-about container" id="about">
        <div className="tattvalab-about__intro">
          <span className="eyebrow">ABOUT TATTVA LAB</span>
          <h2>A virtual lab built around the way you learn.</h2>
          <p>TattvaLab brings guided digital learning into one welcoming space. Follow a clear learning flow, open the parts you need and return to ideas whenever you want.</p>
        </div>
        <div className="tattvalab-about__points">
          <article><span>01</span><div><h3>One clear space</h3><p>A focused home for virtual learning with TattvaLab.</p></div></article>
          <article><span>02</span><div><h3>Follow your curiosity</h3><p>Explore learning sections in an order that makes sense to you.</p></div></article>
          <article><span>03</span><div><h3>Learn at your pace</h3><p>Take time to understand, then return whenever you need.</p></div></article>
        </div>
      </section>

      <section className="tattvalab-invitation container">
        <div><span>YOUR VIRTUAL LAB STARTS HERE</span><h2>Step into TattvaLab.</h2><p>Explore a virtual learning space designed to make understanding feel clear.</p></div>
        <Link className="button button--primary button--large" href="/labs">Explore the virtual lab <ArrowRight size={18} /></Link>
      </section>
    </main>
  );
}
