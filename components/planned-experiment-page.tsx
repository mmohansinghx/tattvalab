"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, FileText } from "lucide-react";
import type { PlannedExperiment } from "@/lib/planned-experiments";
import { LogicGatesTheory } from "@/components/logic-gates-theory";
import { LogicGatesPretest } from "@/components/logic-gates-pretest";

const stages = ["Aim", "Theory", "Pretest", "Procedure", "Simulation", "Posttest", "References", "Feedback", "Report"] as const;

export function PlannedExperimentPage({ experiment, moduleNumber, initialSection = "Aim" }: { experiment: PlannedExperiment; moduleNumber: number; initialSection?: string }) {
  const requestedIndex = stages.findIndex((item) => item.toLowerCase() === initialSection.toLowerCase());
  const [stepIndex, setStepIndex] = useState(requestedIndex < 0 ? 0 : requestedIndex);
  const stage = stages[stepIndex];

  return (
    <main id="main-content" className="experiment-page">
      <div className="container">
        <div className="experiment-experience">
          <div className="experiment-crumbs"><Link href="/labs/digital-electronics"><ArrowLeft size={15} /> Digital Electronics</Link><span>/</span><span>{experiment.title}</span></div>
          <section className="experiment-hero" aria-labelledby="experiment-title">
            <div className="experiment-hero__copy">
              <div className="experiment-hero__eyebrow"><span>MODULE {String(moduleNumber).padStart(2, "0")}</span><i /> DIGITAL ELECTRONICS</div>
              <h1 id="experiment-title">{experiment.title}<span>.</span></h1>
              <p>{experiment.hasTheory ? "Study the logic rules, symbols, and truth tables behind seven common gates." : "This experiment page is ready for your content."}</p>
              <div className="experiment-hero__meta"><span><FileText size={16} /> Experiment</span><i /><span>{experiment.hasTheory ? "Theory available" : "Content pending"}</span><i /><span>Digital Electronics</span></div>
              <div className="experiment-hero__actions">
                <button className="button button--hero" type="button" onClick={() => setStepIndex(1)}><BookOpen size={18} /> Open theory section <ArrowRight size={17} /></button>
                <Link className="experiment-hero__secondary" href="/labs/digital-electronics">All Digital Electronics modules <ArrowRight size={16} /></Link>
              </div>
            </div>
            <aside className="experiment-hero__route" aria-label="Experiment sections">
              <span className="experiment-hero__route-kicker">PAGE STRUCTURE</span>
              <div><b>01</b><span><strong>Learn</strong><small>Aim and theory sections</small></span></div>
              <div><b>02</b><span><strong>Try</strong><small>Tests and procedure sections</small></span></div>
              <div><b>03</b><span><strong>Review</strong><small>References and report sections</small></span></div>
              <span className="experiment-hero__route-line" />
            </aside>
          </section>

          <section className="workflow-card" aria-label="Experiment page structure">
            <div className="workflow-card__top">
              <div><span className="eyebrow">YOUR EXPERIMENT · {stage === "Theory" && experiment.hasTheory ? "THEORY READY" : stage === "Pretest" && experiment.hasPretest ? "20-QUESTION TEST READY" : "CONTENT PENDING"}</span><h2>{stage}</h2><p>{stage === "Theory" && experiment.hasTheory ? "Review the gate symbols, Boolean rules and complete truth table." : stage === "Pretest" && experiment.hasPretest ? "Test your understanding from easy fundamentals through advanced logic." : `Add your ${stage.toLowerCase()} content here when ready.`}</p></div>
              <span className="workflow-card__count"><strong>{String(stepIndex + 1).padStart(2, "0")}</strong><i />{String(stages.length).padStart(2, "0")} SECTIONS</span>
            </div>
            <div className="workflow-stepper" role="group" aria-label="Experiment sections">
              {stages.map((item, index) => <button className={`workflow-step ${index === stepIndex ? "workflow-step--active" : ""} ${index < stepIndex ? "workflow-step--done" : ""}`} key={item} type="button" aria-current={index === stepIndex ? "step" : undefined} onClick={() => setStepIndex(index)}><span>{index < stepIndex ? <Check size={13} /> : String(index + 1).padStart(2, "0")}</span><small>{item}</small></button>)}
            </div>
            <div className="workflow-content">
              {stage === "Theory" && experiment.hasTheory ? (
                <LogicGatesTheory />
              ) : stage === "Pretest" && experiment.hasPretest ? (
                <LogicGatesPretest experimentSlug={experiment.slug} />
              ) : stage === "Aim" && experiment.aim ? (
                <div className="planned-stage-aim">
                  <span className="eyebrow">EXPERIMENT AIM</span>
                  <p>{experiment.aim}</p>
                </div>
              ) : (
                <div className="empty-state planned-stage">
                  <span className="empty-state__icon"><FileText size={21} /></span>
                  <h3>{stage}</h3>
                  <p>Content will be added here.</p>
                </div>
              )}
            </div>
            <div className="workflow-card__footer">
              <button className="text-button" type="button" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}><ArrowLeft size={15} /> Previous</button>
              <div className="workflow-footer__center"><span>Section {stepIndex + 1} of {stages.length}</span></div>
              {stepIndex < stages.length - 1 ? <button className="button button--primary button--small" type="button" onClick={() => setStepIndex((current) => Math.min(stages.length - 1, current + 1))}>Next section <ArrowRight size={15} /></button> : <Link className="text-link" href="/labs/digital-electronics">Back to modules <ArrowRight size={15} /></Link>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
