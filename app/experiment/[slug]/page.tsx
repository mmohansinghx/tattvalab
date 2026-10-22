import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ExperimentWorkflow } from "@/components/experiment-workflow";
import { experiments, getExperiment } from "@/lib/experiments";

export function generateStaticParams() { return experiments.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getExperiment(slug);
  return experiment ? { title: experiment.title, description: experiment.summary } : { title: "Module not found" };
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
  if (!experiment) notFound();
  return <main id="main-content" className="experiment-page"><div className="container"><ExperimentWorkflow experiment={experiment} /></div></main>;
}
