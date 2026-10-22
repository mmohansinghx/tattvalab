"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock3, Printer, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { experiments, theorySectionTitles, type Experiment, type Question } from "@/lib/experiments";
import { ExperimentDiagram } from "@/components/experiment-diagram";
import { calculateCurrent, calculateMotion, evaluateGate, makeCurrentSeries, makeMotionSeries, type LogicGate } from "@/lib/simulation";
import { getProgressSnapshot, getServerProgressSnapshot, subscribeProgress, updateProgress, type ExperimentProgress } from "@/lib/progress";

const steps = ["Aim", "Theory", "Pretest", "Procedure", "Simulation", "Posttest", "References", "Feedback", "Report"] as const;
type TestKind = "preTest" | "postTest";
type TestResult = { score: number; total: number; percent: number };

function formatNumber(value: number, digits = 2) { return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value); }

function RangeControl({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return <label className="range-control"><span className="range-control__top"><span>{label}</span><strong>{formatNumber(value, step < 1 ? 1 : 0)} <small>{unit}</small></strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /><span className="range-control__limits"><span>{min} {unit}</span><span>{max} {unit}</span></span></label>;
}

function TestPanel({ questions, result, onSubmit }: { questions: Question[]; result: TestResult | null; onSubmit: (result: TestResult) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const question = questions[index];
  const allAnswered = questions.every((item) => answers[item.id] !== undefined);
  function submit() {
    if (!allAnswered) return;
    const score = questions.reduce((total, item) => total + (answers[item.id] === item.correctOption ? 1 : 0), 0);
    onSubmit({ score, total: questions.length, percent: Math.round((score / questions.length) * 100) });
  }
  return <div className="test-panel">
    <div className="test-panel__progress"><span>QUESTION {String(index + 1).padStart(2, "0")} <i /> {String(questions.length).padStart(2, "0")}</span><div><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div>
    <h3 className="test-question">{question.prompt}</h3>
    <div className="answer-list" role="group" aria-label={question.prompt}>{question.options.map((option, optionIndex) => {
      const isSelected = answers[question.id] === optionIndex;
      const isCorrect = result && optionIndex === question.correctOption;
      const isWrong = result && isSelected && !isCorrect;
      return <button className={`answer-option ${isSelected ? "answer-option--selected" : ""} ${isCorrect ? "answer-option--correct" : ""} ${isWrong ? "answer-option--wrong" : ""}`} type="button" aria-pressed={isSelected} key={option} disabled={Boolean(result)} onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}><span className="answer-option__key">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{isCorrect && <Check size={17} />}</button>;
    })}</div>
    {result && <div className="answer-explanation"><strong>{answers[question.id] === question.correctOption ? "That’s right." : "Review the concept."}</strong><p>{question.explanation}</p></div>}
    <div className="test-panel__footer"><button className="text-button" type="button" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={index === 0}><ChevronLeft size={15} /> Previous</button><span>{Object.keys(answers).length} of {questions.length} answered</span>{index < questions.length - 1 ? <button className="text-button" type="button" onClick={() => setIndex((current) => current + 1)} disabled={answers[question.id] === undefined}>Next <ChevronRight size={15} /></button> : result ? <span className="score-chip"><Check size={14} /> {result.score}/{result.total} correct</span> : <button className="button button--primary button--small" type="button" onClick={submit} disabled={!allAnswered}>Submit answers <ArrowRight size={14} /></button>}</div>
    {result && <div className="test-result"><span className="test-result__score">{result.percent}<small>%</small></span><span><strong>{result.score} correct out of {result.total}</strong><small>Your responses are saved locally with this module.</small></span></div>}
  </div>;
}

function FeedbackPanel() {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  return <form className="feedback-panel" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
    <span className="eyebrow">Learner feedback</span>
    <h3>How was this experiment?</h3>
    <p>Your feedback stays in this demo session and is not sent to a server.</p>
    <fieldset className="feedback-rating">
      <legend>How useful was this lab? Choose 1 to 5.</legend>
      {([1, 2, 3, 4, 5] as const).map((value) => <button type="button" key={value} aria-pressed={rating === value} className={rating === value ? "is-selected" : ""} onClick={() => { setRating(value); setSubmitted(false); }}>{value}</button>)}
    </fieldset>
    <label className="feedback-comment">What would you improve?<textarea rows={4} placeholder="Share a note (optional)" onChange={() => setSubmitted(false)} /></label>
    <button className="button button--primary button--small" type="submit" disabled={!rating}>Submit feedback <ArrowRight size={14} /></button>
    {submitted && <p className="feedback-thanks" role="status"><Check size={15} /> Thanks — your rating is noted for this session.</p>}
  </form>;
}

function LogicSimulation({ onObservation }: { onObservation: (inputs: string, result: string) => void }) {
  const [gate, setGate] = useState<LogicGate>("AND");
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const output = evaluateGate(gate, a, b);
  useEffect(() => {
    onObservation(`Gate ${gate}; A = ${Number(a)}${gate === "NOT" ? "" : `; B = ${Number(b)}`}`, `Y = ${Number(output)} (${output ? "HIGH" : "LOW"})`);
  }, [gate, a, b, output, onObservation]);
  const truthRows = gate === "NOT"
    ? [{ inputs: "0", output: "1" }, { inputs: "1", output: "0" }]
    : [{ a: false, b: false }, { a: false, b: true }, { a: true, b: false }, { a: true, b: true }]
      .map((row) => ({ inputs: `${Number(row.a)}  ${Number(row.b)}`, output: String(Number(evaluateGate(gate, row.a, row.b))) }));
  const inputItems = [
    { label: "Input A", value: a, set: setA },
    ...(gate === "NOT" ? [] : [{ label: "Input B", value: b, set: setB }]),
  ];

  return <div className="simulation-layout">
    <div className="sim-controls">
      <span className="eyebrow">Interactive circuit</span><h3>Choose a logic gate.</h3>
      <p>Change each input and watch the output respond to the gate’s Boolean rule.</p>
      <div className="gate-picker" role="group" aria-label="Select logic gate">
        {(["AND", "OR", "XOR", "NOT"] as LogicGate[]).map((item) => <button type="button" key={item} onClick={() => setGate(item)} aria-pressed={gate === item} className={gate === item ? "is-selected" : ""}>{item}</button>)}
      </div>
      <div className="binary-inputs">{inputItems.map((input) => <div className="binary-input" key={input.label}>
        <span>{input.label}<small>Binary state</small></span>
        <button type="button" className={`binary-switch ${input.value ? "binary-switch--on" : ""}`} aria-label={`${input.label}: ${input.value ? "1" : "0"}. Click to toggle.`} aria-pressed={input.value} onClick={() => input.set(!input.value)}><span />{input.value ? "1" : "0"}</button>
      </div>)}</div>
    </div>
    <div className="logic-stage">
      <div className="logic-stage__label">LIVE MODEL · {gate} GATE</div>
      <div className="logic-stage__circuit">
        <div className="logic-stage__inputs"><span><i className={a ? "is-on" : ""} />A <b>{Number(a)}</b></span>{gate !== "NOT" && <span><i className={b ? "is-on" : ""} />B <b>{Number(b)}</b></span>}</div>
        <div className={`logic-stage__gate logic-stage__gate--${gate.toLowerCase()}`}>
          <svg viewBox="0 0 90 64" aria-hidden="true">
            {gate === "AND" && <path d="M11 8h26a24 24 0 0 1 0 48H11z" fill="none" stroke="currentColor" strokeWidth="2.2" />}
            {(gate === "OR" || gate === "XOR") && <path d="M13 8C32 9 53 15 72 32 53 49 32 55 13 56c10-14 10-34 0-48Z" fill="none" stroke="currentColor" strokeWidth="2.2" />}
            {gate === "XOR" && <path d="M5 8c10 14 10 34 0 48" fill="none" stroke="currentColor" strokeWidth="1.8" />}
            {gate === "NOT" && <><path d="M12 8 59 32 12 56z" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="65" cy="32" r="4" fill="white" stroke="currentColor" strokeWidth="2" /></>}
          </svg>
          <strong>{gate}</strong>
        </div>
        <div className="logic-stage__output"><i className={output ? "is-on" : ""} /><span>Y <b>{Number(output)}</b></span></div>
      </div>
      <div className="logic-stage__foot"><span>DETERMINISTIC BOOLEAN MODEL</span><strong>Output {output ? "HIGH" : "LOW"}</strong></div>
      <div className="truth-table"><div className="truth-table__heading"><span>Truth table</span><small>{gate} operation</small></div><table><thead><tr><th>Inputs</th><th>Output</th></tr></thead><tbody>{truthRows.map((row) => <tr key={`${row.inputs}-${row.output}`}><td>{row.inputs}</td><td>{row.output}</td></tr>)}</tbody></table></div>
    </div>
  </div>;
}

function OhmsLawSimulation({ onObservation }: { onObservation: (inputs: string, result: string) => void }) {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(120);
  const current = calculateCurrent(voltage, resistance);
  const chartData = useMemo(() => makeCurrentSeries(voltage), [voltage]);
  useEffect(() => onObservation(`V = ${voltage} V; R = ${resistance} Ω`, `I = ${formatNumber(current, 3)} A`), [voltage, resistance, current, onObservation]);
  return <div className="simulation-layout"><div className="sim-controls"><span className="eyebrow">Ideal resistor model</span><h3>Adjust the circuit.</h3><p>Use Ohm’s law to see how current responds to voltage and resistance.</p><RangeControl label="Voltage" min={1} max={24} step={1} unit="V" value={voltage} onChange={setVoltage} /><RangeControl label="Resistance" min={10} max={500} step={10} unit="Ω" value={resistance} onChange={setResistance} /><div className="model-equation">I = V / R <span>{formatNumber(voltage)} / {formatNumber(resistance)}</span></div></div><div className="model-output-card"><span className="model-output-card__label">CALCULATED CURRENT</span><strong>{formatNumber(current, 3)}<small>A</small></strong><div className="model-output-card__equation">{formatNumber(voltage)} V ÷ {formatNumber(resistance)} Ω</div><div className="model-chart"><div className="model-chart__heading"><span>Current vs resistance</span><small>Voltage held at {voltage} V</small></div><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: -17 }}><CartesianGrid stroke="#dfe8f2" vertical={false} /><XAxis dataKey="resistance" tickLine={false} axisLine={false} tick={{ fill: "#66809b", fontSize: 13 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#66809b", fontSize: 13 }} /><Tooltip formatter={(value) => [`${formatNumber(Number(value), 3)} A`, "Current"]} labelFormatter={(value) => `${value} Ω`} contentStyle={{ borderRadius: 10, border: "1px solid #d8e4f1" }} /><Line type="monotone" dataKey="current" stroke="#1766b3" strokeWidth={3} dot={false} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div></div><p className="model-assumption"><TriangleAlert size={14} /> Ideal resistor model. Heating and component limits are not simulated.</p></div>;
}

function MotionSimulation({ onObservation }: { onObservation: (inputs: string, result: string) => void }) {
  const [initialVelocity, setInitialVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(2);
  const [time, setTime] = useState(4);
  const result = calculateMotion(initialVelocity, acceleration, time);
  const chartData = useMemo(() => makeMotionSeries(initialVelocity, acceleration, Math.max(time, 1)), [initialVelocity, acceleration, time]);
  useEffect(() => onObservation(`v₀ = ${initialVelocity} m/s; a = ${acceleration} m/s²; t = ${formatNumber(time, 1)} s`, `x = ${formatNumber(result.displacement)} m; v = ${formatNumber(result.velocity)} m/s`), [initialVelocity, acceleration, time, result.displacement, result.velocity, onObservation]);
  return <div className="simulation-layout"><div className="sim-controls"><span className="eyebrow">One-dimensional kinematics</span><h3>Set the motion.</h3><p>Choose a starting velocity, constant acceleration, and duration.</p><RangeControl label="Initial velocity" min={-10} max={30} step={1} unit="m/s" value={initialVelocity} onChange={setInitialVelocity} /><RangeControl label="Acceleration" min={-10} max={10} step={0.5} unit="m/s²" value={acceleration} onChange={setAcceleration} /><RangeControl label="Time" min={0} max={10} step={0.5} unit="s" value={time} onChange={setTime} /><div className="model-equation">v = v₀ + at <span>x = v₀t + ½at²</span></div></div><div className="model-output-card"><span className="model-output-card__label">MODEL OUTPUT AT {formatNumber(time, 1)} S</span><div className="motion-results"><div><strong>{formatNumber(result.displacement, 2)}<small>m</small></strong><span>Displacement</span></div><div><strong>{formatNumber(result.velocity, 2)}<small>m/s</small></strong><span>Final velocity</span></div></div><div className="model-chart"><div className="model-chart__heading"><span>Displacement over time</span><small>Constant acceleration</small></div><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: -17 }}><defs><linearGradient id="motionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2773b5" stopOpacity={0.2} /><stop offset="100%" stopColor="#2773b5" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#dfe8f2" vertical={false} /><XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "#66809b", fontSize: 13 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#66809b", fontSize: 13 }} /><Tooltip formatter={(value) => [`${formatNumber(Number(value))} m`, "Displacement"]} labelFormatter={(value) => `${value} s`} contentStyle={{ borderRadius: 10, border: "1px solid #d8e4f1" }} /><Area type="monotone" dataKey="displacement" stroke="#1766b3" strokeWidth={3} fill="url(#motionFill)" /></AreaChart></ResponsiveContainer></div></div><p className="model-assumption"><TriangleAlert size={14} /> Constant acceleration, one dimension, no air resistance.</p></div>;
}

function Simulation({ experiment, onObservation }: { experiment: Experiment; onObservation: (inputs: string, result: string) => void }) {
  if (experiment.simulation === "logic-gates") return <LogicSimulation onObservation={onObservation} />;
  if (experiment.simulation === "ohms-law") return <OhmsLawSimulation onObservation={onObservation} />;
  if (experiment.simulation === "constant-acceleration") return <MotionSimulation onObservation={onObservation} />;
  return <div className="simulation-placeholder"><span className="simulation-placeholder__number">01</span><div><span className="eyebrow">SIMULATION WILL BE ADDED LATER</span><h3>The theory and diagram are ready.</h3><p>For now, use the observation table and procedure to work through the concept. The interactive model can be connected here later.</p></div></div>;
}

function ExternalSimulation({ url, title }: { url: string; title: string }) {
  let isPublicReplitUrl = false;
  try {
    const parsedUrl = new URL(url);
    isPublicReplitUrl = parsedUrl.protocol === "https:" && (parsedUrl.hostname === "replit.app" || parsedUrl.hostname.endsWith(".replit.app"));
  } catch {
    // Keep malformed or non-public URLs from being loaded into the embedded frame.
  }

  if (!isPublicReplitUrl) return <div className="external-simulation__notice" role="status">Add the public HTTPS <code>.replit.app</code> deployment URL to show this simulation here.</div>;

  return <div className="external-simulation">
    <div className="external-simulation__bar"><span><span className="external-simulation__dot" /> Replit simulation</span><a className="text-link" href={url} target="_blank" rel="noopener noreferrer">Open in new tab <ArrowRight size={14} /></a></div>
    <iframe title={`${title} interactive simulation`} src={url} loading="lazy" allow="fullscreen; clipboard-write" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock" />
    <p>If the Replit app does not appear here, use “Open in new tab”.</p>
  </div>;
}

export function ExperimentWorkflow({ experiment }: { experiment: Experiment }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(() => new Set([0]));
  const [testResults, setTestResults] = useState<Record<TestKind, TestResult | null>>({ preTest: null, postTest: null });
  const [liveObservation, setLiveObservation] = useState<{ inputs: string; result: string } | null>(null);
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const [savedLocally, setSavedLocally] = useState(true);

  const stage = steps[stepIndex];
  function navigateToStep(index: number) {
    setStepIndex(index);
    setVisitedSteps((current) => new Set(current).add(index));
    window.requestAnimationFrame(() => document.querySelector(".workflow-card")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  const recordObservation = useCallback((inputs: string, result: string) => setLiveObservation({ inputs, result }), []);
  function savePatch(patch: Partial<ExperimentProgress>) {
    const current = getProgressSnapshot();
    const previous = current[experiment.slug] ?? { preTestScore: null, postTestScore: null, completedAt: null, updatedAt: new Date().toISOString() };
    const next = { ...current, [experiment.slug]: { ...previous, ...patch, updatedAt: new Date().toISOString() } };
    setSavedLocally(updateProgress(next));
  }
  function handleResult(kind: TestKind, result: TestResult) {
    setTestResults((current) => ({ ...current, [kind]: result }));
    savePatch(kind === "preTest" ? { preTestScore: result.percent } : { postTestScore: result.percent });
  }
  function continueWorkflow() {
    if (stepIndex === 2 && !testResults.preTest) return;
    if (stepIndex === 5 && !testResults.postTest) return;
    if (stepIndex < steps.length - 1) {
      if (stepIndex === 5) savePatch({ completedAt: new Date().toISOString() });
      navigateToStep(stepIndex + 1);
    }
  }
  function resetWorkflow() {
    setStepIndex(0); setVisitedSteps(new Set([0])); setTestResults({ preTest: null, postTest: null }); setLiveObservation(null);
  }
  const currentRecord = progress[experiment.slug];
  const storedPre = currentRecord?.preTestScore;
  const storedPost = currentRecord?.postTestScore;
  const equationItems = experiment.equation.split(/\s+·\s+/);
  const moduleNumber = String(Math.max(0, experiments.findIndex((item) => item.slug === experiment.slug)) + 1).padStart(2, "0");
  const stageCopy: Record<(typeof steps)[number], { title: string; description: string }> = {
    Aim: { title: "Start with the aim", description: "Know what you will understand before you begin." },
    Theory: { title: "Understand the idea", description: "Read the concept, follow the diagram, then check the rule." },
    Pretest: { title: "Check what you already know", description: "A quick self-check gives you a useful starting point." },
    Procedure: { title: "Work through the steps", description: "Use the procedure to practise the concept on paper." },
    Simulation: { title: "Interactive simulation", description: "The interactive model will be connected here when it is ready." },
    Posttest: { title: "Check what makes sense now", description: "Try the same core ideas again and review each explanation." },
    References: { title: "Go a little further", description: "Use these references to explore the subject in more depth." },
    Feedback: { title: "Help improve this lab", description: "Share a quick rating and a note about the learning experience." },
    Report: { title: "Your lab summary", description: "Review your answers, notes and experiment conclusion." },
  };

  return <div className="experiment-experience">
    <div className="experiment-crumbs"><Link href="/labs/digital-electronics"><ArrowLeft size={15} /> Digital Electronics</Link><span>/</span><span>{experiment.title}</span></div>
    <section className="experiment-hero" aria-labelledby="experiment-title">
      <div className="experiment-hero__copy">
        <div className="experiment-hero__eyebrow"><span>LAB {moduleNumber}</span><i /> {experiment.category.toUpperCase()}</div>
        <h1 id="experiment-title">{experiment.title}<span>.</span></h1>
        <p>{experiment.summary}</p>
        <div className="experiment-hero__meta"><span><Clock3 size={16} /> About {experiment.duration} min</span><i /><span>{experiment.difficulty}</span><i /><span>Digital Electronics</span></div>
        <div className="experiment-hero__actions">
          <button className="button button--hero" type="button" onClick={() => navigateToStep(1)}><BookOpen size={18} /> Start with theory <ArrowRight size={17} /></button>
          <button className="experiment-hero__secondary" type="button" onClick={() => navigateToStep(2)}>Take the pre-test <ArrowUpRight size={16} /></button>
        </div>
      </div>
      <aside className="experiment-hero__route" aria-label="How this lab works">
        <span className="experiment-hero__route-kicker">YOUR LEARNING ROUTE</span>
        <div><b>01</b><span><strong>Understand</strong><small>Theory and a visual diagram</small></span></div>
        <div><b>02</b><span><strong>Try it</strong><small>Procedure and quick checks</small></span></div>
        <div><b>03</b><span><strong>Review</strong><small>Post-test and lab summary</small></span></div>
        <span className="experiment-hero__route-line" />
      </aside>
    </section>

  <section className="workflow-card" aria-label="Experiment learning workflow">
    <div className="workflow-card__top"><div><span className="eyebrow">YOUR LAB · {experiment.category}</span><h2>{stageCopy[stage].title}</h2><p>{stageCopy[stage].description}</p></div><span className="workflow-card__count"><strong>{String(stepIndex + 1).padStart(2, "0")}</strong><i />{String(steps.length).padStart(2, "0")} STAGES</span></div>
    <div className="workflow-stepper" role="group" aria-label="Experiment stages">{steps.map((item, index) => <button className={`workflow-step ${index === stepIndex ? "workflow-step--active" : ""} ${visitedSteps.has(index) && index !== stepIndex ? "workflow-step--done" : ""}`} key={item} type="button" aria-current={index === stepIndex ? "step" : undefined} onClick={() => navigateToStep(index)}><span>{visitedSteps.has(index) && index !== stepIndex ? <Check size={13} /> : String(index + 1).padStart(2, "0")}</span><small>{item}</small></button>)}</div>
    <div className="workflow-content">
      {stage === "Aim" && <div className="aim-layout"><div className="aim-main"><span className="status-pill status-pill--large"><span /> THEORY READY · SIMULATION TO FOLLOW</span><span className="eyebrow">THE AIM</span><h3>{experiment.aim}</h3><p className="overview-summary">{experiment.summary}</p><div className="objective-list"><div><span>01</span><p><strong>By the end, you can</strong>{experiment.objective}</p></div><div><span>02</span><p><strong>Time needed</strong>About {experiment.duration} minutes, at your own pace</p></div></div><section className="theory-detail-card aim-apparatus"><span className="theory-label">WHAT YOU MAY NEED</span><ul>{experiment.apparatus.map((item) => <li key={item}>{item}</li>)}</ul></section></div><aside className="overview-aside"><span className="eyebrow">Before you begin</span><strong>Helpful prerequisites</strong><ul>{experiment.prerequisites.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul><div className="sample-note"><Sparkles size={15} /><p>First understand the idea and follow the diagram. The interactive model can be added here later.</p></div></aside></div>}
      {stage === "Theory" && <div className="theory-layout">
        <div className="theory-copy">
          <section className="theory-opening"><div><span className="theory-label">FIRST, THE BIG IDEA</span><h3>{experiment.aim}</h3><p>{experiment.introduction}</p></div><div className="theory-opening__tag"><span>LEARNING GOAL</span><strong>{experiment.objective}</strong></div></section>
          <ExperimentDiagram kind={experiment.diagram} />
          <div className="equation-block"><span>THE CORE RULE</span><div className="equation-block__expressions">{equationItems.map((item) => <strong key={item}>{item}</strong>)}</div></div>
          <section className="theory-chapters" aria-label="Theory explained in steps">{experiment.theory.map((paragraph, index) => <article className="theory-chapter" key={paragraph}><div className="theory-chapter__index">{String(index + 1).padStart(2, "0")}</div><div><span>CONCEPT {String(index + 1).padStart(2, "0")}</span><h4>{theorySectionTitles[experiment.slug]?.[index] ?? `Build the idea · ${index + 1}`}</h4><p>{paragraph}</p></div></article>)}</section>
          <div className="theory-highlights"><section className="theory-fact"><span className="theory-highlight__label">DID YOU KNOW?</span><p>{experiment.quickFact}</p></section><section className="theory-key-points"><span className="theory-highlight__label">KEEP THESE IN MIND</span><ul>{experiment.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul></section></div>
          <section className="theory-example"><span className="theory-label">LET’S APPLY IT</span><h4>Worked example</h4><p>{experiment.calculationExample}</p></section>
          <section className="theory-section theory-observations"><div className="theory-section__heading"><div><span className="theory-label">CHECK YOUR UNDERSTANDING</span><h4>Observation table</h4></div><span className="theory-section__badge">{experiment.observations.rows.length} cases</span></div><div className="observations-table"><table><thead><tr>{experiment.observations.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{experiment.observations.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div><p className="theory-note">{experiment.observations.note}</p></section>
          <section className="theory-detail-card theory-assumptions"><span className="theory-label">ASSUMPTIONS AND LIMITS</span>{experiment.assumptions.map((item) => <p key={item}>{item}</p>)}<div className="assumption-card__footer"><RotateCcw size={14} /> Use the observation table to practise. The interactive simulation will be added later.</div></section>
        </div>
      </div>}
      {stage === "Pretest" && <div className="assessment-layout"><div className="assessment-intro"><span className="eyebrow">PRETEST · BEFORE THE SIMULATION</span><h3>What do you already know?</h3><p>Check your starting understanding. Your score is for reflection and stays on this device.</p><span className="assessment-meta">{experiment.preTest.length} QUESTIONS <i /> UNGRADED PRACTICE</span></div><TestPanel key={`${experiment.slug}-pre`} questions={experiment.preTest} result={testResults.preTest} onSubmit={(result) => handleResult("preTest", result)} /></div>}
      {stage === "Procedure" && <div className="procedure-content"><div className="procedure-intro"><span className="eyebrow">PROCEDURE</span><h3>Work through these steps.</h3><p>Use the diagram and truth table to check each result. Hardware is optional for this theory activity.</p></div><ol className="procedure-list">{experiment.procedure.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol><section className="theory-detail-card procedure-precautions"><span className="theory-label">PRECAUTIONS</span><ul>{experiment.precautions.map((item) => <li key={item}>{item}</li>)}</ul></section></div>}
      {stage === "Simulation" && <>{experiment.simulationUrl ? <><div className="simulation-intro"><span className="eyebrow">Interactive model</span><p>Run the interactive Replit model below. Use the open button if the embed is blocked.</p></div><ExternalSimulation url={experiment.simulationUrl} title={experiment.title} /></> : <Simulation experiment={experiment} onObservation={recordObservation} />}</>}
      {stage === "Posttest" && <div className="assessment-layout"><div className="assessment-intro"><span className="eyebrow">POSTTEST · AFTER THE THEORY</span><h3>What makes more sense now?</h3><p>Use the idea once more. Review each explanation to see why an answer works.</p><span className="assessment-meta">{experiment.postTest.length} QUESTIONS <i /> UNGRADED PRACTICE</span></div><TestPanel key={`${experiment.slug}-post`} questions={experiment.postTest} result={testResults.postTest} onSubmit={(result) => handleResult("postTest", result)} /></div>}
      {stage === "References" && <div className="references-content"><span className="eyebrow">FURTHER READING</span><h3>Explore the topic further</h3><p>These digital-design books cover the ideas in this module with more examples and exercises.</p><ol>{experiment.references.map((reference) => <li key={reference}>{reference}</li>)}</ol></div>}
      {stage === "Feedback" && <FeedbackPanel />}
      {stage === "Report" && <div className="report-layout"><div className="report-head"><div><span className="eyebrow">TattvaLab · Digital Electronics</span><h3>Experiment summary</h3><p>{experiment.title} · {new Date().toLocaleDateString(undefined, { dateStyle: "long" })}</p></div><button type="button" className="button button--secondary no-print" onClick={() => window.print()}><Printer size={16} /> Print report</button></div><div className="report-facts"><div><span>AIM</span><p>{experiment.aim}</p></div><div><span>MODEL</span><p>{experiment.equation}</p></div><div><span>PRE-TEST</span><p>{testResults.preTest ? `${testResults.preTest.score}/${testResults.preTest.total} (${testResults.preTest.percent}%)` : storedPre === null || storedPre === undefined ? "Not recorded" : `${storedPre}%`}</p></div><div><span>POST-TEST</span><p>{testResults.postTest ? `${testResults.postTest.score}/${testResults.postTest.total} (${testResults.postTest.percent}%)` : storedPost === null || storedPost === undefined ? "Not recorded" : `${storedPost}%`}</p></div><div className="report-facts__wide"><span>SIMULATION OBSERVATION</span><p>{liveObservation ? `${liveObservation.inputs} → ${liveObservation.result}` : experiment.simulationUrl ? "This Replit simulation runs separately, so its live values are not read by TattvaLab. Record your results in your lab notes." : "Simulation not connected yet. Use the theory, diagram and observation table for now."}</p></div><div className="report-facts__wide"><span>ASSUMPTIONS</span><p>{experiment.assumptions.join(" ")}</p></div><div className="report-facts__wide"><span>CONCLUSION</span><p>{experiment.conclusion}</p></div></div><div className="report-footer"><span>{currentRecord?.completedAt ? `Completed ${new Date(currentRecord.completedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}` : "Complete the module to save this activity."}</span><span className="report-saved">{savedLocally ? "Saved in this browser" : "Could not save in this browser"}</span></div></div>}
    </div>
    {!savedLocally && <p className="storage-warning" role="status"><TriangleAlert size={14} /> Browser storage is unavailable. Your progress will not be saved.</p>}
    <div className="workflow-card__footer"><button className="text-button" type="button" onClick={() => navigateToStep(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}><ArrowLeft size={15} /> Previous</button><div className="workflow-footer__center">{stepIndex === steps.length - 1 ? <Link href="/labs" className="text-link">Choose another module <ArrowRight size={15} /></Link> : <span>Step {stepIndex + 1} of {steps.length}</span>}</div>{stepIndex < steps.length - 1 ? <button className="button button--primary button--small" type="button" onClick={continueWorkflow} disabled={(stepIndex === 2 && !testResults.preTest) || (stepIndex === 5 && !testResults.postTest)}>{stepIndex === 2 ? "Continue to procedure" : stepIndex === 5 ? "Continue to references" : stepIndex === 7 ? "Continue to report" : "Continue"}<ArrowRight size={15} /></button> : <button className="text-button" type="button" onClick={resetWorkflow}><RotateCcw size={15} /> Start again</button>}</div>
  </section></div>;
}
