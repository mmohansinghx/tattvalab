import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Atom, CircuitBoard, Zap } from "lucide-react";
import { LabCatalogue } from "@/components/lab-catalogue";
import { subjects } from "@/lib/experiments";

export const metadata: Metadata = { title: "Explore labs" };

const icons = { physics: Atom, "basic-electrical": Zap, "digital-electronics": CircuitBoard };

export default function LabsPage() {
  return <main id="main-content" className="catalogue-page"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link><span> / </span><span>Graduation labs</span></div><div className="page-hero__row"><div><span className="eyebrow">Current collection · 10 experiments</span><h1>Explore your subjects<span className="gradient-dot">.</span></h1><p>Choose from Physics, Basic Electrical &amp; Electronics, and Digital Electronics. Digital Electronics is the collection with content ready now.</p></div><div className="page-hero__stamp"><span>03</span><small>SUBJECTS</small></div></div><div className="subject-pills" id="subjects">{Object.entries(subjects).map(([id, item]) => { const Icon = icons[id as keyof typeof icons]; return <Link href={`/labs/${id}`} key={id}><Icon size={16} />{item.shortTitle}<ArrowUpRight size={14} /></Link>; })}</div></div></section><section className="section container catalogue-section"><div className="section-heading section-heading--left"><div><span className="eyebrow">Graduation · Digital Electronics</span><h2>Start with the idea you need.</h2></div><p>Each available experiment has theory, a visual diagram, important points and practice questions.</p></div><LabCatalogue /></section><div className="container catalogue-bottom-note"><ArrowDown size={15} /><span>Other subject content will be added later.</span></div></main>;
}
