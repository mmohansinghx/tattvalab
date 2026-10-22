import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ProgressDashboard } from "@/components/progress-dashboard";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  return <main id="main-content" className="progress-page"><section className="page-hero page-hero--short"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link><span> / </span><span>My progress</span></div><div className="page-hero__row"><div><span className="eyebrow">A record of your learning</span><h1>My progress<span className="gradient-dot">.</span></h1><p>See the modules you have explored and the ideas you are taking with you.</p></div><div className="privacy-stamp"><ShieldCheck size={19} /><span>PRIVATE BY DESIGN</span></div></div></div></section><section className="section container progress-page__content"><ProgressDashboard /><div className="progress-next-step"><div><span className="eyebrow">A good next step</span><h2>Keep your curiosity moving.</h2></div><Link className="button button--primary" href="/labs">Explore a module <ArrowRight size={16} /></Link></div></section></main>;
}
