"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpenCheck,
  Check,
  CircuitBoard,
  GraduationCap,
  Zap,
} from "lucide-react";
import { ExperimentListRow } from "@/components/experiment-list-row";
import { plannedExperiments } from "@/lib/planned-experiments";

const levels = [
  { id: "class-11", title: "Class 11", detail: "School level" },
  { id: "class-12", title: "Class 12", detail: "School level" },
  { id: "graduation", title: "Graduation", detail: "Undergraduate" },
] as const;

type LevelId = (typeof levels)[number]["id"];
type SubjectId = "physics" | "basic-electrical" | "digital-electronics";

const subjects = [
  {
    id: "physics",
    title: "Physics",
    Icon: Atom,
  },
  {
    id: "basic-electrical",
    title: "Basic Electrical & Electronics",
    Icon: Zap,
  },
  {
    id: "digital-electronics",
    title: "Digital Electronics",
    Icon: CircuitBoard,
  },
] as const;

export function AcademicExplorer() {
  const [level, setLevel] = useState<LevelId>("graduation");
  const [subject, setSubject] = useState<SubjectId>("digital-electronics");
  const available = level === "graduation" && subject === "digital-electronics";
  const selectedSubject = subjects.find((item) => item.id === subject) ?? subjects[2];
  function showAvailableCollection() {
    setLevel("graduation");
    setSubject("digital-electronics");
  }

  return (
    <section className="academic-explorer container" id="subject-explorer" aria-labelledby="academic-explorer-title">
      <div className="section-heading academic-explorer__heading">
        <div>
          <span className="eyebrow">Choose your learning path</span>
          <h2 id="academic-explorer-title">Pick a level. Choose a subject.</h2>
        </div>
        <p>Switch between school and undergraduate learning. The currently available collection is clearly marked.</p>
      </div>

      <div className="academic-explorer__group">
        <div className="academic-explorer__label"><GraduationCap size={17} /><span>Study level</span></div>
        <div className="academic-level-grid" role="group" aria-label="Choose a study level">
          {levels.map((item) => {
            const selected = level === item.id;
            return (
              <button
                className="academic-level"
                data-selected={selected}
                type="button"
                aria-pressed={selected}
                key={item.id}
                onClick={() => setLevel(item.id)}
              >
                <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                <span className="academic-level__mark" aria-hidden="true">{selected ? <Check size={16} /> : item.id === "graduation" ? "10" : "↗"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="academic-explorer__group">
        <div className="academic-explorer__label"><BookOpenCheck size={17} /><span>Subject</span></div>
        <div className="academic-subject-grid" role="group" aria-label="Choose a subject">
          {subjects.map(({ id, title, Icon }) => {
            const selected = subject === id;
            const hasCollection = level === "graduation" && id === "digital-electronics";
            return (
              <button
                className="academic-subject"
                data-selected={selected}
                type="button"
                aria-pressed={selected}
                key={id}
                onClick={() => setSubject(id)}
              >
                <span className="academic-subject__top">
                  <span className="academic-subject__icon"><Icon size={21} strokeWidth={1.8} /></span>
                  <span className={`academic-subject__status${hasCollection ? " academic-subject__status--ready" : ""}`}>
                    {hasCollection ? "10 experiments ready" : "Coming soon"}
                  </span>
                </span>
                <strong>{title}</strong>
                <span className="academic-subject__action">{selected ? "Selected" : "Choose subject"}<ArrowUpRight size={15} /></span>
              </button>
            );
          })}
        </div>
      </div>

      {available ? (
        <div className="academic-collection" id="available-collection" aria-live="polite">
          <div className="academic-collection__intro">
            <div>
              <span className="eyebrow">Graduation · Digital Electronics</span>
              <h3>Start anywhere in the collection.</h3>
              <p>These are the 10 Digital Electronics experiments from your photo. Open any title to reach its own page.</p>
            </div>
            <Link className="button button--primary" href="/labs/digital-electronics">Explore all 10 experiments <ArrowRight size={16} /></Link>
          </div>
          <div className="academic-collection__modules">
            <div className="section-heading section-heading--left">
              <div><span className="eyebrow">Digital Electronics · Graduation</span><h3>All 10 experiments</h3></div>
              <span>Each title opens its own experiment page.</span>
            </div>
            <div className="experiment-list">
              {plannedExperiments.map((experiment, index) => <ExperimentListRow key={experiment.slug} experiment={experiment} index={index} moduleNumber={index + 1} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className="academic-unavailable" aria-live="polite">
          <span className="academic-unavailable__icon"><selectedSubject.Icon size={22} /></span>
          <div>
            <span className="eyebrow">{level === "graduation" ? "Subject collection in progress" : "More levels coming soon"}</span>
            <h3>{level === "graduation" ? `${selectedSubject.title} labs are being prepared.` : `${levels.find((item) => item.id === level)?.title} content is being prepared.`}</h3>
            <p>For now, complete learning content is available for Graduation · Digital Electronics. Your selected options are saved here as the collection grows.</p>
          </div>
          <button className="button button--secondary academic-unavailable__action" type="button" onClick={showAvailableCollection}>View current labs <ArrowRight size={16} /></button>
        </div>
      )}
    </section>
  );
}
