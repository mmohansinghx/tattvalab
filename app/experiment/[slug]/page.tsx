import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PlannedExperimentPage } from "@/components/planned-experiment-page";
import { getPlannedExperiment, plannedExperiments } from "@/lib/planned-experiments";

export function generateStaticParams() {
  return plannedExperiments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getPlannedExperiment(slug);
  return experiment
    ? { title: experiment.title, description: "Digital Electronics experiment page." }
    : { title: "Experiment not found" };
}

export default function ExperimentPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ section?: string | string[] }> }) {
  return <Suspense fallback={<main id="main-content" className="experiment-page"><div className="container"><div className="workflow-card workflow-card--loading" aria-label="Loading experiment"><div className="workflow-card__top"><span>Loading experiment…</span></div><div className="workflow-content" /></div></div></main>}><ExperimentContent params={params} searchParams={searchParams} /></Suspense>;
}

async function ExperimentContent({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ section?: string | string[] }> }) {
  const [{ slug }, { section }] = await Promise.all([params, searchParams]);
  const experiment = getPlannedExperiment(slug);
  if (!experiment) notFound();

  const moduleNumber = plannedExperiments.findIndex((item) => item.slug === experiment.slug) + 1;
  const initialSection = Array.isArray(section) ? section[0] ?? "Aim" : section ?? "Aim";
  return <PlannedExperimentPage key={`${slug}-${initialSection}`} experiment={experiment} moduleNumber={moduleNumber} initialSection={initialSection} />;
}
