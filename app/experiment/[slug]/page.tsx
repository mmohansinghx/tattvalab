import type { Metadata } from "next";
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

export default async function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experiment = getPlannedExperiment(slug);
  if (!experiment) notFound();

  const moduleNumber = plannedExperiments.findIndex((item) => item.slug === experiment.slug) + 1;
  return <PlannedExperimentPage experiment={experiment} moduleNumber={moduleNumber} />;
}
