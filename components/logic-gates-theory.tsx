type GateKind = "and" | "or" | "not" | "nand" | "nor" | "xor" | "xnor";

const gateSections: {
  number: string;
  title: string;
  kind: GateKind;
  expression: string;
  explanation: string;
  headers: string[];
  rows: string[][];
  diagram: [string, string, string];
  implementation: string;
}[] = [
  {
    number: "01", title: "AND gate", kind: "and", expression: "Y = A · B",
    explanation: "An AND gate gives a high output only when every input is high. For two inputs, both A and B must be 1 for Y to become 1.",
    headers: ["A", "B", "Y"], rows: [["0", "0", "0"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "1"]],
    diagram: ["Inputs A and B", "Both conditions must be true", "Y = 1"],
    implementation: "In a resistor-transistor network, the input and transistor arrangement is chosen so the required combination of input conditions controls the output. The exact circuit depends on the logic-family design.",
  },
  {
    number: "02", title: "OR gate", kind: "or", expression: "Y = A + B",
    explanation: "An OR gate gives a high output when one or more inputs are high. It gives 0 only when every input is 0.",
    headers: ["A", "B", "Y"], rows: [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]],
    diagram: ["Input A path", "Either input can raise output", "Y = 1"],
    implementation: "A diode-resistor network can combine OR inputs: a high input can forward-bias its diode path and raise the output node. The circuit polarity and resistor arrangement determine the actual voltage levels.",
  },
  {
    number: "03", title: "NOT gate (inverter)", kind: "not", expression: "Y = A̅",
    explanation: "A NOT gate has one input and produces its opposite value. It changes 0 to 1 and 1 to 0.",
    headers: ["A", "Y"], rows: [["0", "1"], ["1", "0"]],
    diagram: ["Input A", "Transistor inverter", "Y = A̅"],
    implementation: "In a common transistor inverter, a low input leaves the transistor off and a pull-up can hold the output high. A high input turns the transistor on, pulling the output low.",
  },
  {
    number: "04", title: "NAND gate", kind: "nand", expression: "Y = (A · B)̅",
    explanation: "NAND means NOT-AND. First apply the AND rule, then invert its result. The output is low only when both inputs are high.",
    headers: ["A", "B", "Y"], rows: [["0", "0", "1"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]],
    diagram: ["AND condition", "Invert the result", "Y = (A · B)̅"],
    implementation: "The output stage reverses the AND condition. A NAND gate is a universal gate: combinations of NAND gates can be arranged to create other Boolean functions.",
  },
  {
    number: "05", title: "NOR gate", kind: "nor", expression: "Y = (A + B)̅",
    explanation: "NOR means NOT-OR. It gives a high output only when all inputs are low; any high input makes the output low.",
    headers: ["A", "B", "Y"], rows: [["0", "0", "1"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "0"]],
    diagram: ["OR condition", "Invert the result", "Y = (A + B)̅"],
    implementation: "The output is the inverted OR result. NOR is also a universal gate, so a network of NOR gates can implement any Boolean function.",
  },
  {
    number: "06", title: "Exclusive-OR (EX-OR) gate", kind: "xor", expression: "Y = A ⊕ B = A̅B + AB̅",
    explanation: "An EX-OR gate gives a high output when its two inputs are different. Exactly one input must be 1.",
    headers: ["A", "B", "Y"], rows: [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]],
    diagram: ["A̅B or AB̅", "Combine the two cases", "Y = 1 when different"],
    implementation: "The expression A̅B + AB̅ describes two separate cases: A low with B high, or A high with B low. AND, OR and NOT operations can combine those cases into an EX-OR function.",
  },
  {
    number: "07", title: "Exclusive-NOR (EX-NOR) gate", kind: "xnor", expression: "Y = (A ⊕ B)̅ = AB + A̅B̅",
    explanation: "An EX-NOR gate gives a high output when its two inputs match: both 0 or both 1.",
    headers: ["A", "B", "Y"], rows: [["0", "0", "1"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "1"]],
    diagram: ["AB or A̅B̅", "Combine the matching cases", "Y = 1 when equal"],
    implementation: "The expression AB + A̅B̅ covers the two matching cases. An EX-NOR gate is the inverted form of EX-OR and is often used to compare two binary values.",
  },
];

function GateSymbol({ kind }: { kind: GateKind }) {
  const isNot = kind === "not";
  const isInverted = kind === "nand" || kind === "nor" || kind === "xnor";
  const isOrFamily = kind === "or" || kind === "nor" || kind === "xor" || kind === "xnor";
  const body = isNot ? (
    <path d="M25 17 L57 36 L25 55 Z" />
  ) : isOrFamily ? (
    <>
      {(kind === "xor" || kind === "xnor") && <path d="M17 17 C30 27 30 45 17 55" />}
      <path d="M24 17 C38 25 38 47 24 55 C43 55 58 48 72 36 C58 24 43 17 24 17 Z" />
    </>
  ) : (
    <path d="M24 17 H43 A22 19 0 0 1 43 55 H24 Z" />
  );

  return (
    <svg className="logic-theory__gate-symbol" viewBox="0 0 100 72" role="img" aria-label={`${kind.toUpperCase()} gate symbol`}>
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {isNot ? <path d="M3 36 H25" /> : <><path d="M3 27 H24" /><path d="M3 45 H24" /></>}
        {body}
        {isNot ? <path d="M66 36 H96" /> : <path d={`M${isInverted ? 77 : 72} 36 H96`} />}
        {isInverted && <circle cx="73" cy="36" r="4.5" fill="white" />}
      </g>
    </svg>
  );
}

export function LogicGatesTheory() {
  return (
    <article className="logic-theory" aria-label="Logic gates theory">
      <section className="logic-theory__intro">
        <span className="eyebrow">THEORY · DIGITAL LOGIC</span>
        <h3>Verification and interpretation of logic-gate truth tables</h3>
        <h4>Introduction</h4>
        <p>Digital circuits use two logic states, written as 0 and 1. A logic gate is a circuit with one or more inputs and an output; it applies a defined Boolean rule to those input states. The seven gates in this experiment are AND, OR, NOT, NAND, NOR, EX-OR and EX-NOR.</p>
        <div className="logic-theory__principle">
          <span className="logic-theory__principle-icon">0 / 1</span>
          <p><strong>Read a truth table row by row.</strong> It lists every possible input combination and the output produced by the gate. A complete table for <em>n</em> binary inputs contains 2<sup>n</sup> rows.</p>
        </div>
      </section>

      <div className="logic-theory__gate-list">
        {gateSections.map((gate) => (
          <section className="logic-theory__gate-section" key={gate.kind} aria-labelledby={`logic-gate-${gate.kind}`}>
            <div className="logic-theory__gate-heading">
              <span className="eyebrow">GATE {gate.number}</span>
              <h4 id={`logic-gate-${gate.kind}`}>{gate.title}</h4>
            </div>
            <p className="logic-theory__gate-explanation">{gate.explanation}</p>
            <div className="logic-theory__gate-layout">
              <div className="logic-theory__symbol-card">
                <span className="logic-theory__subheading">Logic symbol</span>
                <GateSymbol kind={gate.kind} />
                <strong className="logic-theory__equation">{gate.expression}</strong>
              </div>
              <div className="logic-theory__table-card">
                <div className="logic-theory__table-title"><span className="logic-theory__subheading">Truth table</span><small>1 = HIGH · 0 = LOW</small></div>
                <table className="logic-theory__truth-table">
                  <thead><tr>{gate.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                  <tbody>{gate.rows.map((row, index) => <tr key={`${gate.kind}-${index}`}>{row.map((value, column) => <td key={`${gate.kind}-${index}-${column}`}>{value}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </div>
            <div className="logic-theory__implementation">
              <span className="logic-theory__subheading">Implementation idea</span>
              <div className="logic-theory__implementation-flow" role="img" aria-label={`${gate.title} conceptual implementation diagram`}>
                {gate.diagram.map((item, index) => <span className="logic-theory__flow-item" key={item}>{index > 0 && <i aria-hidden="true">→</i>}<strong>{item}</strong></span>)}
              </div>
              <p>{gate.implementation}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="logic-theory__section" aria-labelledby="logic-families-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">CIRCUIT FAMILIES</span><h4 id="logic-families-title">RTL, DTL and TTL</h4></div>
        </div>
        <p className="logic-theory__body-copy">The truth table tells us what the gate does; RTL, DTL and TTL describe different circuit technologies used to realise logic functions. Their internal designs differ, but the Boolean rule being implemented remains the reference for the output.</p>
        <div className="logic-theory__family-diagram" role="img" aria-label="Conceptual comparison of RTL, DTL and TTL logic circuit stages">
          <div className="logic-theory__family-row"><strong>RTL</strong><span>Resistor input network</span><i>→</i><span>Transistor switching</span><i>→</i><span>Output</span></div>
          <div className="logic-theory__family-row"><strong>DTL</strong><span>Diode input network</span><i>→</i><span>Transistor switching</span><i>→</i><span>Output</span></div>
          <div className="logic-theory__family-row"><strong>TTL</strong><span>Transistor input stage</span><i>→</i><span>Transistor switching</span><i>→</i><span>Output driver</span></div>
        </div>
        <div className="logic-theory__family-notes">
          <p><strong>RTL:</strong> resistors feed transistor control terminals; transistor switching and output polarity create the required logic result.</p>
          <p><strong>DTL:</strong> diodes combine input conditions before a transistor stage processes the signal.</p>
          <p><strong>TTL:</strong> transistor stages handle the inputs and switching, with an output stage designed to drive the next circuit.</p>
        </div>
        <p className="logic-theory__caption"><strong>Diagram.</strong> Simplified functional view; actual internal circuits depend on the gate and IC design.</p>
      </section>

      <section className="logic-theory__takeaways" aria-label="Important points">
        <span className="eyebrow">IMPORTANT POINTS</span>
        <ul>
          <li><strong>NAND and NOR are universal gates:</strong> networks of either can be used to implement other logic functions.</li>
          <li><strong>EX-OR detects different inputs;</strong> EX-NOR detects matching inputs.</li>
          <li><strong>For a physical circuit, check the exact IC datasheet</strong> for voltage levels, output drive and timing.</li>
        </ul>
      </section>
    </article>
  );
}
