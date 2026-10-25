"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { ExperimentListRow } from "@/components/experiment-list-row";
import { plannedExperiments } from "@/lib/planned-experiments";

export function LabCatalogue() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = plannedExperiments.filter((experiment) => !normalizedQuery || experiment.title.toLowerCase().includes(normalizedQuery));
    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [query, sort]);
  const hasFilters = Boolean(query) || sort !== "recommended";
  function clearFilters() { setQuery(""); setSort("recommended"); }

  return (
    <>
      <div className="catalogue-tools">
        <label className="search-field"><Search size={18} aria-hidden="true" /><span className="sr-only">Search experiments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the 10 experiments" /><kbd>/</kbd></label>
        <label className="select-field"><span className="sr-only">Sort experiments</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Photo order</option><option value="title">A to Z</option></select></label>
      </div>
      <div className="catalogue-results" aria-live="polite"><span>{filtered.length} {filtered.length === 1 ? "experiment" : "experiments"}</span>{hasFilters && <button className="text-button" onClick={clearFilters} type="button">Clear filters <X size={14} /></button>}</div>
      {filtered.length ? <div className="experiment-list">{filtered.map((experiment, index) => <ExperimentListRow key={experiment.slug} experiment={experiment} index={index} moduleNumber={sort === "recommended" ? plannedExperiments.findIndex((item) => item.slug === experiment.slug) + 1 : index + 1} />)}</div> : <div className="empty-state empty-state--catalogue"><span className="empty-state__icon"><Search size={21} /></span><h3>No experiments found</h3><p>Try a shorter search or clear the filter to see all ten topics.</p><button className="button button--secondary" type="button" onClick={clearFilters}>Reset filter</button></div>}
      <div className="catalogue-note"><Sparkles size={16} /><p>These are the 10 Digital Electronics experiment titles from your photo. Their pages are ready for the content you will add.</p></div>
    </>
  );
}
