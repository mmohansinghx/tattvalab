import type { DiagramKind } from "@/lib/experiments";

const labels: Record<DiagramKind, { title: string; caption: string }> = {
  "seven-segment": { title: "BCD decoder and seven-segment display", caption: "Four BCD input bits become seven segment-control signals." },
  "logic-families": { title: "TTL and CMOS logic families", caption: "Different transistor technologies follow the same logic rules, but their electrical limits must be checked." },
  "boolean-logic": { title: "Boolean expression made from gates", caption: "This gate arrangement represents F = A′B + AC." },
  multiplexer: { title: "Four-to-one multiplexer", caption: "S₁ and S₀ choose which data input reaches the output." },
  decoder: { title: "Two-to-four decoder", caption: "Each two-bit code selects one output line in the active-high model." },
  comparator: { title: "Four-bit magnitude comparator", caption: "The comparison circuit reports greater-than, equal-to or less-than." },
  arithmetic: { title: "One-bit arithmetic blocks", caption: "Adders and subtractors return a result bit plus carry or borrow information." },
  "flip-flop": { title: "D flip-flop stores one bit", caption: "At its active clock edge, the value at D is copied to Q." },
  "shift-register": { title: "Four-stage serial-in parallel-out register", caption: "Each clock edge moves the stored bits one stage to the right." },
  alu: { title: "Arithmetic logic unit", caption: "Select lines choose the operation applied to the input words." },
};

function DiagramSvg({ kind }: { kind: DiagramKind }) {
  const markerId = `diagram-arrow-${kind}`;
  const arrow = <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" className="diagram-arrowhead" /></marker></defs>;
  const line = (d: string) => <path d={d} className="diagram-line" markerEnd={`url(#${markerId})`} />;
  const box = (x: number, y: number, width: number, height: number, title: string, subtitle?: string) => <g><rect x={x} y={y} width={width} height={height} rx="12" className="diagram-box" /><text x={x + width / 2} y={y + (subtitle ? 35 : height / 2 + 5)} className="diagram-label" textAnchor="middle">{title}</text>{subtitle && <text x={x + width / 2} y={y + 59} className="diagram-sub-label" textAnchor="middle">{subtitle}</text>}</g>;

  if (kind === "seven-segment") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>BCD to seven-segment decoder path</title>{arrow}<text x="32" y="47" className="diagram-small">BCD INPUT</text>{["D₃", "D₂", "D₁", "D₀"].map((name, i) => <g key={name}><text x="42" y={82 + i * 31} className="diagram-label">{name}</text>{line(`M82 ${77 + i * 31} H188 V115 H226`)}</g>)}{box(226, 72, 160, 88, "BCD decoder", "4 inputs → 7 outputs")}{line("M386 116 H492")}
    <g transform="translate(535 45)"><text x="36" y="-5" className="diagram-small" textAnchor="middle">DISPLAY</text><path d="M12 12 H60 L54 19 H18 Z" className="segment-on" /><path d="M62 16 L68 22 V62 L61 56 Z" className="segment-off" /><path d="M61 66 L68 61 V102 L61 108 Z" className="segment-on" /><path d="M12 112 H60 L54 105 H18 Z" className="segment-on" /><path d="M4 66 L11 61 V102 L4 108 Z" className="segment-off" /><path d="M4 16 L11 22 V62 L4 56 Z" className="segment-on" /><path d="M12 62 H60 L54 69 H18 Z" className="segment-on" /><text x="84" y="29" className="diagram-sub-label">a</text><text x="76" y="52" className="diagram-sub-label">b</text><text x="76" y="91" className="diagram-sub-label">c</text><text x="84" y="113" className="diagram-sub-label">d</text><text x="-6" y="91" className="diagram-sub-label">e</text><text x="-6" y="52" className="diagram-sub-label">f</text><text x="84" y="72" className="diagram-sub-label">g</text></g><text x="660" y="119" className="diagram-callout">digit 5</text></svg>;

  if (kind === "logic-families") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>TTL and CMOS technology families and electrical checks</title>{arrow}{box(40, 56, 165, 80, "TTL", "bipolar transistors")}{box(40, 146, 165, 62, "CMOS", "MOS transistors")}{line("M205 96 H294")}{line("M205 177 H294")}{box(294, 83, 142, 94, "Logic gate", "same Boolean rules")}{line("M436 130 H522")}{box(522, 81, 198, 98, "Check the datasheet", "levels · margin · load · delay")}</svg>;

  if (kind === "boolean-logic") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>Gate diagram for F equals not A and B, or A and C</title>{arrow}{textNode(30, 69, "A")}{line("M49 64 H104")}{box(104, 35, 104, 62, "NOT", "A becomes A′")}{line("M208 66 H266 V71 H298")}{line("M49 64 H71 V171 H298")}{textNode(30, 117, "B")}{line("M49 112 H246 V82 H298")}{box(298, 38, 126, 68, "AND", "A′B")}{textNode(30, 190, "C")}{line("M49 185 H266 V174 H298")}{box(298, 140, 126, 68, "AND", "AC")}{line("M424 72 H469 V101 H520")}{line("M424 174 H469 V139 H520")}{box(520, 85, 108, 70, "OR", "combine")}{line("M628 120 H690")}{textNode(655, 111, "F")}</svg>;

  if (kind === "multiplexer") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>Four data inputs selected by two control bits</title>{arrow}{["D₀", "D₁", "D₂", "D₃"].map((name, i) => <g key={name}><text x="37" y={54 + i * 39} className="diagram-label">{name}</text>{line(`M75 ${48 + i * 39} H250 V${74 + i * 27} H312`)}</g>)}{box(312, 49, 162, 132, "4 : 1 MUX", "one input is selected")}{line("M474 115 H605")}{textNode(630, 121, "Y")}{textNode(324, 211, "S₁")}{textNode(414, 211, "S₀")}{line("M343 194 V181")}{line("M433 194 V181")}</svg>;

  if (kind === "decoder") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>Two input bits select one of four decoder outputs</title>{arrow}{textNode(45, 95, "A₁")}{textNode(45, 146, "A₀")}{line("M72 90 H231")}{line("M72 141 H231")}{box(231, 55, 180, 122, "2-to-4", "decoder + enable")}{["Y₀", "Y₁", "Y₂", "Y₃"].map((name, i) => <g key={name}>{line(`M411 ${78 + i * 31} H600`)}<text x="620" y={84 + i * 31} className="diagram-label">{name}</text></g>)}<text x="483" y="207" className="diagram-small">ONE OUTPUT SELECTED</text></svg>;

  if (kind === "comparator") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>Four-bit values A and B enter a magnitude comparator</title>{arrow}{textNode(46, 91, "A₃ A₂ A₁ A₀")}{textNode(46, 151, "B₃ B₂ B₁ B₀")}{line("M154 86 H286")}{line("M154 146 H286")}{box(286, 55, 184, 124, "4-bit", "comparator")}{["A > B", "A = B", "A < B"].map((name, i) => <g key={name}>{line(`M470 ${79 + i * 38} H604`)}<text x="624" y={85 + i * 38} className="diagram-label">{name}</text></g>)}</svg>;

  if (kind === "arithmetic") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>Adder and subtractor input and result signals</title>{arrow}{box(226, 31, 196, 72, "Full adder", "A, B, carry-in")}{box(226, 130, 196, 72, "Full subtractor", "A, B, borrow-in")}{line("M422 67 H567")}{line("M422 88 H520 V100 H567")}{line("M422 166 H567")}{line("M422 187 H520 V177 H567")}{textNode(596, 73, "Sum")}{textNode(596, 106, "Carry out")}{textNode(596, 172, "Difference")}{textNode(596, 205, "Borrow out")}</svg>;

  if (kind === "flip-flop") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>D flip-flop with data input, clock, Q and complementary output</title>{arrow}{textNode(85, 95, "D")}{line("M108 90 H277")}{box(277, 45, 170, 140, "D flip-flop", "stores one bit")}{pathEl("M277 132 L292 140 L277 148 Z", "diagram-clock")}{textNode(225, 146, "CLK")}{line("M447 92 H618")}{line("M447 145 H618")}{textNode(643, 98, "Q")}{textNode(643, 151, "Q′")}{textNode(357, 211, "Q(next) = D at active edge")}</svg>;

  if (kind === "shift-register") return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>Four D flip-flops connected as a serial-in parallel-out shift register</title>{arrow}{textNode(22, 117, "Serial in")}{line("M92 111 H145")}{[0, 1, 2, 3].map((i) => <g key={i}>{box(145 + i * 128, 72, 104, 84, `DFF ${i}`, `Q${i}`)}{i < 3 && line(`M${249 + i * 128} 112 H${273 + i * 128}`)}<path d={`M${197 + i * 128} 156 V188`} className="diagram-line" /><text x={197 + i * 128} y="211" className="diagram-sub-label" textAnchor="middle">CLK</text></g>)}<text x="318" y="36" className="diagram-small">CLOCK MOVES EACH BIT ONE STAGE</text></svg>;

  return <svg viewBox="0 0 760 230" role="img" aria-labelledby={`${markerId}-title`}><title id={`${markerId}-title`}>ALU receives two operands and operation-select control</title>{arrow}{textNode(40, 89, "A (n bits)")}{textNode(40, 153, "B (n bits)")}{line("M127 84 H264")}{line("M127 148 H264")}{box(264, 57, 192, 122, "ALU", "arithmetic + logic")}{textNode(284, 218, "operation select")}{line("M367 199 V179")}{line("M456 91 H616")}{textNode(640, 97, "Result")}{line("M456 146 H616")}{textNode(640, 152, "Flags")}</svg>;
}

function textNode(x: number, y: number, value: string) {
  return <text x={x} y={y} className="diagram-label">{value}</text>;
}

function pathEl(d: string, className: string) {
  return <path d={d} className={className} />;
}

export function ExperimentDiagram({ kind }: { kind: DiagramKind }) {
  const item = labels[kind];
  return <figure className="experiment-diagram">
    <div className="experiment-diagram__heading"><span>CONCEPT DIAGRAM</span><strong>{item.title}</strong></div>
    <div className="experiment-diagram__canvas"><DiagramSvg kind={kind} /></div>
    <figcaption>{item.caption}</figcaption>
    <p className="experiment-diagram__hint">On a small screen, swipe sideways to see the full diagram.</p>
  </figure>;
}
