import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ExperimentWorkflow } from "@/components/experiment-workflow";
import { PlannedExperimentPage } from "@/components/planned-experiment-page";
import { experiments, getExperiment } from "@/lib/experiments";
import { getPlannedExperiment, plannedExperiments } from "@/lib/planned-experiments";

export function generateStaticParams() { return [...experiments, ...plannedExperiments].map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getExperiment(slug);
  const plannedExperiment = getPlannedExperiment(slug);
  if (experiment) return { title: experiment.title, description: experiment.summary };
  return plannedExperiment ? { title: plannedExperiment.title, description: "Digital Electronics experiment page outline." } : { title: "Module not found" };
}

export default function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<ExperimentLoading />}><ExperimentContent params={params} /></Suspense>;
}

function ExperimentLoading() {
  return <main id="main-content" className="experiment-page"><div className="container"><div className="workflow-card workflow-card--loading" aria-label="Loading experiment"><div className="workflow-card__top"><span>Loading experiment…</span></div><div className="workflow-content" /></div></div></main>;
}

async function ExperimentContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experiment = getExperiment(slug);
  if (experiment) return <main id="main-content" className="experiment-page"><div className="container"><ExperimentWorkflow experiment={experiment} /></div></main>;
  const plannedExperiment = getPlannedExperiment(slug);
  if (!plannedExperiment) notFound();
  const moduleNumber = experiments.length + plannedExperiments.findIndex((item) => item.slug === plannedExperiment.slug) + 1;
  return <PlannedExperimentPage experiment={plannedExperiment} moduleNumber={moduleNumber} />;
}
