"use client";

import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, Search, Sparkles, X } from "lucide-react";
import { ExperimentCard } from "@/components/experiment-card";
import { PlannedExperimentCard } from "@/components/planned-experiment-card";
import { experiments } from "@/lib/experiments";
import { plannedExperiments } from "@/lib/planned-experiments";

export function LabCatalogue() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState("recommended");
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = experiments.filter((experiment) => {
      const matchesQuery = !normalizedQuery || `${experiment.title} ${experiment.summary} Digital Electronics`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (difficulty === "all" || experiment.difficulty === difficulty);
    });
    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "duration") result.sort((a, b) => a.duration - b.duration);
    return result;
  }, [query, difficulty, sort]);
  const filteredOutlines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (difficulty !== "all") return [];
    const result = plannedExperiments.filter((experiment) => !normalizedQuery || `${experiment.title} Digital Electronics`.toLowerCase().includes(normalizedQuery));
    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [query, difficulty, sort]);
  const resultCount = filtered.length + filteredOutlines.length;
  const hasFilters = query || difficulty !== "all" || sort !== "recommended";
  function clearFilters() { setQuery(""); setDifficulty("all"); setSort("recommended"); }

  return (
    <>
      <div className="catalogue-tools">
        <label className="search-field"><Search size={18} aria-hidden="true" /><span className="sr-only">Search experiments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search experiments or topics" /><kbd>/</kbd></label>
        <label className="select-field"><span className="sr-only">Filter by difficulty</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="all">Any level</option><option>Introductory</option><option>Intermediate</option></select></label>
        <label className="select-field"><ArrowDownWideNarrow size={16} aria-hidden="true" /><span className="sr-only">Sort experiments</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="title">A to Z</option><option value="duration">Shortest first</option></select></label>
      </div>
      <div className="catalogue-results" aria-live="polite"><span>{resultCount} {resultCount === 1 ? "module" : "modules"}</span>{hasFilters && <button className="text-button" onClick={clearFilters} type="button">Clear filters <X size={14} /></button>}</div>
      {resultCount ? <div className="experiment-grid">{filtered.map((experiment, index) => <ExperimentCard key={experiment.slug} experiment={experiment} index={index} />)}{filteredOutlines.map((experiment, index) => <PlannedExperimentCard key={experiment.slug} experiment={experiment} index={filtered.length + index} moduleNumber={experiments.length + plannedExperiments.findIndex((item) => item.slug === experiment.slug) + 1} />)}</div> : <div className="empty-state empty-state--catalogue"><span className="empty-state__icon"><Search size={21} /></span><h3>No modules found</h3><p>Try a shorter search or clear the filters to see all available pages.</p><button className="button button--secondary" type="button" onClick={clearFilters}>Reset filters</button></div>}
      <div className="catalogue-note"><Sparkles size={16} /><p>10 existing experiments have learning content. The 10 new page outlines are ready for your additions.</p></div>
    </>
  );
}
