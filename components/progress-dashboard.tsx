"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, BookOpen, ChartNoAxesColumnIncreasing, Clock3, RotateCcw } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { experiments } from "@/lib/experiments";
import { getProgressSnapshot, getServerProgressSnapshot, subscribeProgress } from "@/lib/progress";

export function ProgressDashboard({ compact = false }: { compact?: boolean }) {
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const completed = useMemo(() => experiments.filter((experiment) => progress[experiment.slug]?.completedAt).map((experiment) => ({ experiment, record: progress[experiment.slug] })).sort((a, b) => (b.record.completedAt ?? "").localeCompare(a.record.completedAt ?? "")), [progress]);
  const scores = useMemo(() => completed.flatMap(({ experiment, record }) => [
    record.preTestScore === null ? null : { name: experiment.title.replace(" explorer", ""), stage: "Pre-test", score: record.preTestScore },
    record.postTestScore === null ? null : { name: experiment.title.replace(" explorer", ""), stage: "Post-test", score: record.postTestScore },
  ].filter((item): item is { name: string; stage: string; score: number } => item !== null)), [completed]);
  if (compact) {
    return <div className="progress-preview">
      {completed.length ? <><div className="progress-preview__count"><span>{String(completed.length).padStart(2, "0")}</span><small>experiments completed</small></div><div className="progress-preview__recent">{completed.slice(0, 2).map(({ experiment }) => <span key={experiment.slug}><span className="progress-check">✓</span>{experiment.title}</span>)}</div></> : <div className="progress-preview__empty"><span className="progress-preview__icon"><BookOpen size={20} /></span><span><strong>Your progress starts here</strong><small>Complete a lab to see your activity.</small></span></div>}
      <Link href="/progress" className="text-link">View progress <ArrowRight size={15} /></Link>
    </div>;
  }
  return <div className="progress-dashboard">
    <div className="progress-metrics">
      <div className="metric-card"><span className="metric-card__icon"><BookOpen size={18} /></span><strong>{completed.length}<small>/{experiments.length}</small></strong><span>Modules completed</span></div>
      <div className="metric-card"><span className="metric-card__icon"><ChartNoAxesColumnIncreasing size={18} /></span><strong>{scores.length ? `${Math.round(scores.reduce((sum, item) => sum + item.score, 0) / scores.length)}%` : "—"}</strong><span>Average assessment score</span></div>
      <div className="metric-card"><span className="metric-card__icon"><Clock3 size={18} /></span><strong>{completed.length ? new Date(completed[0].record.completedAt!).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—"}</strong><span>Most recent activity</span></div>
    </div>
    <div className="progress-panels">
      <section className="panel score-panel"><div className="panel-heading"><div><span className="eyebrow">Assessment history</span><h2>Your scores</h2></div><span className="local-badge">Saved on this device</span></div>
        {scores.length ? <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={scores} margin={{ top: 18, right: 12, left: -16, bottom: 4 }}><defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2773b5" stopOpacity={0.2} /><stop offset="95%" stopColor="#2773b5" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#dfe8f2" vertical={false} /><XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fill: "#66809b", fontSize: 13 }} /><YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#66809b", fontSize: 13 }} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #d8e4f1", boxShadow: "0 8px 28px #15345b12" }} formatter={(value) => [`${value}%`, "Score"]} /><Area type="monotone" dataKey="score" stroke="#1766b3" strokeWidth={3} fill="url(#scoreFill)" activeDot={{ r: 5, fill: "#1766b3" }} /></AreaChart></ResponsiveContainer></div> : <div className="chart-empty"><span><ChartNoAxesColumnIncreasing size={21} /></span><strong>Your score history will appear here</strong><p>Finish an experiment to start tracking assessment results.</p><Link href="/labs" className="button button--secondary">Explore experiments <ArrowRight size={15} /></Link></div>}
      </section>
      <section className="panel activity-panel"><div className="panel-heading"><div><span className="eyebrow">Keep your momentum</span><h2>Recent activity</h2></div></div>
        {completed.length ? <div className="activity-list">{completed.map(({ experiment, record }) => <Link href={`/experiment/${experiment.slug}`} className="activity-item" key={experiment.slug}><span className="activity-item__mark">✓</span><span><strong>{experiment.title}</strong><small>{new Date(record.completedAt!).toLocaleString(undefined, { dateStyle: "medium" })}</small></span><ArrowRight size={15} /></Link>)}</div> : <div className="activity-empty"><span className="activity-empty__icon"><RotateCcw size={19} /></span><strong>Nothing logged yet</strong><p>Your completed modules will show here. Progress stays in this browser.</p><Link href="/labs" className="text-link">Choose a module <ArrowRight size={14} /></Link></div>}
      </section>
    </div>
    <p className="privacy-note">This is anonymous progress stored in your browser. It is not a student record and does not sync across devices.</p>
  </div>;
}
