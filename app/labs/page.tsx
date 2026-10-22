import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CircuitBoard } from "lucide-react";
import { LabCatalogue } from "@/components/lab-catalogue";
import { subjects } from "@/lib/experiments";

export const metadata: Metadata = { title: "Explore labs" };

const icons = [CircuitBoard];

export default function LabsPage() {
  return <main id="main-content" className="catalogue-page"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link><span> / </span><span>Digital Electronics</span></div><div className="page-hero__row"><div><span className="eyebrow">10 theory-led experiments</span><h1>Digital Electronics<span className="gradient-dot">.</span></h1><p>Study the circuits behind displays, data selection, arithmetic and memory.</p></div><div className="page-hero__stamp"><span>01—10</span><small>EXPERIMENTS</small></div></div><div className="subject-pills" id="subjects">{Object.entries(subjects).map(([id, item], index) => { const Icon = icons[index]; return <Link href={`/labs/${id}`} key={id}><Icon size={16} />{item.shortTitle}<ArrowUpRight size={14} /></Link>; })}</div></div></section><section className="section container catalogue-section"><div className="section-heading section-heading--left"><div><span className="eyebrow">Choose a topic</span><h2>Start with the idea you need.</h2></div><p>Each experiment has easy-to-follow theory, a visual diagram, important points and practice questions.</p></div><LabCatalogue /></section><div className="container catalogue-bottom-note"><ArrowDown size={15} /><span>Read the theory now. Interactive simulations will be connected later.</span></div></main>;
}
