"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, GraduationCap } from "lucide-react";

const levels = [
  { id: "class-11", title: "Class 11", detail: "School level", status: "Coming soon", Icon: BookOpen },
  { id: "class-12", title: "Class 12", detail: "School level", status: "Coming soon", Icon: BookOpen },
  { id: "graduation", title: "Graduation", detail: "Undergraduate", status: "TLab available", Icon: GraduationCap },
] as const;

type LevelId = (typeof levels)[number]["id"];

export function HomeLevelSelector() {
  const [selectedLevel, setSelectedLevel] = useState<LevelId>("graduation");
  const selected = levels.find((level) => level.id === selectedLevel) ?? levels[2];
  const isAvailable = selectedLevel === "graduation";

  return (
    <section className="home-levels container" aria-labelledby="home-levels-title">
      <div className="home-levels__heading">
        <span className="eyebrow">CHOOSE YOUR LEARNING LEVEL</span>
        <h2 id="home-levels-title">Start at the right level.</h2>
        <p>Select a level to see the TLab options.</p>
      </div>

      <div className="home-level-grid" role="group" aria-label="Choose a study level">
        {levels.map(({ id, title, detail, status, Icon }) => (
          <button className="home-level" data-selected={selectedLevel === id} type="button" aria-pressed={selectedLevel === id} key={id} onClick={() => setSelectedLevel(id)}>
            <span className="home-level__icon"><Icon size={20} /></span>
            <span className="home-level__text"><strong>{title}</strong><small>{detail}</small></span>
            <span className={`home-level__status${id === "graduation" ? " home-level__status--ready" : ""}`}>{status}</span>
            {selectedLevel === id && <span className="home-level__check"><Check size={15} /></span>}
          </button>
        ))}
      </div>

      <div className="home-levels__response" aria-live="polite">
        <div><span>{isAvailable ? "AVAILABLE NOW" : "COMING SOON"}</span><p>{isAvailable ? "Graduation TLab content is available now." : `${selected.title} TLab content will be added later.`}</p></div>
        <Link className="button button--primary" href="/labs">{isAvailable ? "Enter TLab" : "Open current TLab"} <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}
