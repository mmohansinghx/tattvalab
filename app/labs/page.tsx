import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Atom, CircuitBoard, Zap } from "lucide-react";
import { LabCatalogue } from "@/components/lab-catalogue";
import { subjects } from "@/lib/experiments";
import { plannedExperiments } from "@/lib/planned-experiments";

export const metadata: Metadata = { title: "Explore labs" };

const icons = { physics: Atom, "basic-electrical": Zap, "digital-electronics": CircuitBoard };

export default function LabsPage() {
  return <main id="main-content" className="catalogue-page"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link><span> / </span><span>Graduation labs</span></div><div className="page-hero__row"><div><span className="eyebrow">{plannedExperiments.length} Digital Electronics experiments</span><h1>Explore your subjects<span className="gradient-dot">.</span></h1><p>Choose Physics, Basic Electrical &amp; Electronics, or Digital Electronics. The photo’s 10 Digital Electronics experiments are listed below.</p></div><div className="page-hero__stamp"><span>03</span><small>SUBJECTS</small></div></div><div className="subject-pills" id="subjects">{Object.entries(subjects).map(([id, item]) => { const Icon = icons[id as keyof typeof icons]; return <Link href={`/labs/${id}`} key={id}><Icon size={16} />{item.shortTitle}<ArrowUpRight size={14} /></Link>; })}</div></div></section><section className="section container catalogue-section"><div className="section-heading section-heading--left"><div><span className="eyebrow">Graduation · Digital Electronics</span><h2>All 10 experiments</h2></div><p>Open any title to visit its separate page.</p></div><LabCatalogue /></section><div className="container catalogue-bottom-note"><ArrowDown size={15} /><span>Content for Physics and Basic Electrical &amp; Electronics will be added later.</span></div></main>;
}
