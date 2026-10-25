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
    implementation: "A Diode-Resistance Logic (DRL) network can combine OR inputs: a high input can forward-bias its diode path and raise the output node. DRL describes the diode-resistor network; DTL adds a transistor stage to restore or invert the signal. Circuit polarity and resistor arrangement determine actual voltage levels.",
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

const booleanLaws = [
  ["Identity", "A · 1 = A", "A + 0 = A"],
  ["Null / domination", "A · 0 = 0", "A + 1 = 1"],
  ["Idempotent", "A · A = A", "A + A = A"],
  ["Complement", "A · A̅ = 0", "A + A̅ = 1"],
  ["Commutative", "A · B = B · A", "A + B = B + A"],
  ["Associative", "(A · B) · C = A · (B · C)", "(A + B) + C = A + (B + C)"],
  ["Distributive", "A · (B + C) = AB + AC", "A + BC = (A + B)(A + C)"],
  ["Absorption", "A · (A + B) = A", "A + AB = A"],
];

const workedRows = [
  ["0", "0", "0", "1", "0", "0"],
  ["0", "0", "1", "0", "0", "0"],
  ["0", "1", "0", "1", "1", "1"],
  ["0", "1", "1", "0", "0", "0"],
  ["1", "0", "0", "1", "0", "1"],
  ["1", "0", "1", "0", "0", "1"],
  ["1", "1", "0", "1", "1", "1"],
  ["1", "1", "1", "0", "0", "1"],
];

function GateSymbol({ kind }: { kind: GateKind }) {
  const isNot = kind === "not";
  const isInverted = kind === "nand" || kind === "nor" || kind === "xnor";
  const hasOutputBubble = isNot || isInverted;
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
        {isNot ? <path d="M67 36 H96" /> : <path d={`M${isInverted ? 77 : 72} 36 H96`} />}
        {hasOutputBubble && <circle cx={isNot ? 62 : 73} cy="36" r="4.5" fill="white" />}
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
        <p>Digital circuits use two logic states, written as 0 and 1. A logic gate is a combinational circuit with one or more inputs and an output; it applies a defined Boolean rule, so its output depends on the inputs present now and not on a stored past state. The seven gates in this experiment are AND, OR, NOT, NAND, NOR, EX-OR and EX-NOR.</p>
        <div className="logic-theory__principle">
          <span className="logic-theory__principle-icon">0 / 1</span>
          <p><strong>Read a truth table row by row.</strong> It lists every possible input combination and the output produced by the gate. A complete table for <em>n</em> binary inputs contains 2<sup>n</sup> rows.</p>
        </div>
      </section>

      <nav className="logic-theory__contents" aria-label="Theory contents">
        <span>JUMP TO</span>
        <a href="#gate-rules">Gate rules</a>
        <a href="#boolean-algebra">Boolean algebra</a>
        <a href="#truth-tables">Truth tables</a>
        <a href="#karnaugh-map">K-map</a>
        <a href="#universal-gates">NAND / NOR</a>
        <a href="#logic-families">RTL / DTL / TTL</a>
        <a href="#solve-questions">Solve questions</a>
      </nav>

      <div className="logic-theory__gate-list" id="gate-rules">
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
      <div className="logic-theory__multi-input-note"><strong>More than two inputs?</strong><span>AND is 1 only when every input is 1; OR is 1 when any input is 1. NAND and NOR complement those complete multi-input results. For a multi-input XOR, output is 1 for an odd count of 1s; XNOR is 1 for an even count.</span></div>

      <section className="logic-theory__section logic-theory__study-section" id="boolean-algebra" aria-labelledby="boolean-algebra-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">BOOLEAN ALGEBRA</span><h4 id="boolean-algebra-title">The rules used to read and simplify circuits</h4></div>
        </div>
        <p className="logic-theory__body-copy">Boolean variables can only be 0 or 1. In an expression, multiplication means AND, addition means OR, and a bar means NOT. These are logic operations, not ordinary arithmetic.</p>
        <div className="logic-theory__notation-grid">
          <div><strong>AND · product</strong><span>A · B = 1 only if A and B are both 1.</span></div>
          <div><strong>OR + sum</strong><span>A + B = 1 if at least one input is 1.</span></div>
          <div><strong>NOT · complement</strong><span>A̅ reverses A: 0↔1. Parentheses show what a bar covers.</span></div>
        </div>
        <div className="logic-theory__table-wrap logic-theory__law-wrap" role="region" aria-label="Boolean algebra laws" tabIndex={0}>
          <table className="logic-theory__truth-table logic-theory__law-table">
            <thead><tr><th>Law</th><th>AND form</th><th>OR form</th></tr></thead>
            <tbody>{booleanLaws.map(([law, andForm, orForm]) => <tr key={law}><th scope="row">{law}</th><td>{andForm}</td><td>{orForm}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="logic-theory__highlight">
          <strong>De Morgan’s theorems · move a complement across a gate</strong>
          <div><span>(A · B)̅ = A̅ + B̅</span><span>(A + B)̅ = A̅ · B̅</span></div>
          <p>When a bar moves across an AND or OR operation, swap AND with OR and complement each input. On gate symbols, bubbles can be moved through a gate by applying this rule. Also remember the double-complement law: (A̅)̅ = A.</p>
        </div>
        <div className="logic-theory__precedence"><strong>Read expressions in this order:</strong><span>Parentheses → NOT → AND → OR</span><small>Example: A + B · C̅ means A OR (B AND NOT C), not (A OR B) AND NOT C.</small></div>
        <div className="logic-theory__worked-identity">
          <span className="logic-theory__subheading">Simplification example</span>
          <strong>A + A̅B = A + B</strong>
          <ol><li>Use distributive law: A + A̅B = (A + A̅)(A + B)</li><li>Complement law gives A + A̅ = 1</li><li>Identity law gives 1 · (A + B) = A + B</li></ol>
        </div>
      </section>

      <section className="logic-theory__section logic-theory__study-section" id="truth-tables" aria-labelledby="truth-table-method-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">TRUTH-TABLE METHOD</span><h4 id="truth-table-method-title">Evaluate a multi-gate expression without guessing</h4></div>
        </div>
        <ol className="logic-theory__steps">
          <li><strong>List the inputs.</strong> For n inputs, make 2ⁿ rows.</li>
          <li><strong>Count in binary.</strong> For A, B, C use 000, 001, 010, 011, 100, 101, 110, 111.</li>
          <li><strong>Add intermediate columns.</strong> Calculate each NOT, AND or OR stage before the final output.</li>
          <li><strong>Follow precedence and brackets.</strong> A bar over a whole expression complements the final result; a bar over one symbol complements only that variable.</li>
          <li><strong>Check every row.</strong> One row that differs means the equation or gate wiring is not equivalent.</li>
        </ol>
        <div className="logic-theory__worked-example">
          <div className="logic-theory__example-heading"><span className="eyebrow">WORKED EXAMPLE 1</span><h5>Find the output for F = A + B · C̅</h5><p>First invert C, then AND that result with B, then OR with A.</p></div>
          <div className="logic-theory__table-wrap" role="region" aria-label="Worked truth table for F equals A OR B AND NOT C" tabIndex={0}>
            <table className="logic-theory__truth-table">
              <thead><tr>{["A", "B", "C", "C̅", "B · C̅", "F"].map((label) => <th key={label}>{label}</th>)}</tr></thead>
              <tbody>{workedRows.map((row, index) => <tr key={`worked-${index}`}>{row.map((value, column) => <td key={`worked-${index}-${column}`}>{value}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="logic-theory__implementation-flow logic-theory__expression-flow" role="img" aria-label="Expression implementation: invert C, AND with B, then OR with A">
            <span className="logic-theory__flow-item"><strong>Invert C</strong></span><span className="logic-theory__flow-item"><i aria-hidden="true">→</i><strong>AND with B</strong></span><span className="logic-theory__flow-item"><i aria-hidden="true">→</i><strong>OR with A</strong></span>
          </div>
        </div>
        <div className="logic-theory__notation-grid logic-theory__forms-grid">
          <div><strong>Sum of Products (SOP)</strong><span>For every row where F=1, write an AND term; OR all those terms. In a row’s term, write a variable complemented when its input is 0.</span><em>For example, row A B C = 0 1 1 gives A̅BC.</em></div>
          <div><strong>Product of Sums (POS)</strong><span>For every row where F=0, write an OR term; AND all those terms. In a row’s sum, complement a variable when its input is 1.</span><em>Then check each zero row makes its own sum equal 0.</em></div>
        </div>
        <div className="logic-theory__canonical-note"><strong>Canonical notation:</strong> with inputs ordered ABC and counted as binary, row 101 is minterm m<sub>5</sub>. Σm(1,3,5,7) means “OR the minterms numbered 1, 3, 5 and 7”; this set is exactly the rows where C=1, so the function simplifies to F=C. ΠM lists the row numbers where output is 0.</div>
        <div className="logic-theory__kmap" id="karnaugh-map">
          <div className="logic-theory__example-heading"><span className="eyebrow">KARNAUGH MAP · THREE INPUTS</span><h5>Use Gray-code order to spot removable variables</h5><p>The columns 00, 01, 11, 10 differ by one bit between neighbours. The highlighted four cells are adjacent and share C=1, so A and B drop out.</p></div>
          <div className="logic-theory__table-wrap logic-theory__kmap-wrap" role="region" aria-label="Three variable Karnaugh map showing the function F equals C" tabIndex={0}>
            <table className="logic-theory__truth-table logic-theory__kmap-table">
              <thead><tr><th>A \ BC</th><th>00</th><th>01</th><th>11</th><th>10</th></tr></thead>
              <tbody><tr><th scope="row">0</th><td>0</td><td className="logic-theory__kmap-group">1</td><td className="logic-theory__kmap-group">1</td><td>0</td></tr><tr><th scope="row">1</th><td>0</td><td className="logic-theory__kmap-group">1</td><td className="logic-theory__kmap-group">1</td><td>0</td></tr></tbody>
            </table>
          </div>
          <ol className="logic-theory__kmap-steps"><li>Place truth-table outputs into Gray-code cells.</li><li>Group adjacent 1s in sizes 1, 2, 4, 8…; use the largest groups and cover every 1.</li><li>Edges wrap around, and groups may overlap when that reduces the expression.</li><li>For each group, keep only variables that stay fixed; OR the resulting terms.</li></ol>
          <p className="logic-theory__caption">To form a POS simplification, group 0s instead. A four-variable map has Gray-code order 00, 01, 11, 10 on both axes.</p>
        </div>
        <div className="logic-theory__example-check"><strong>Fast recognition:</strong> F=1 for rows 001, 011, 101, 111 means F=C. A, B, or both can vary; only C stays 1 in every output-1 row.</div>
      </section>

      <section className="logic-theory__section logic-theory__study-section" id="universal-gates" aria-labelledby="universal-gates-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">UNIVERSAL GATES</span><h4 id="universal-gates-title">Build other gates using only NAND or only NOR</h4></div>
        </div>
        <p className="logic-theory__body-copy">A gate is called universal when networks made from that gate alone can realise any Boolean function. NAND and NOR are universal because they can make NOT, AND and OR; those operations can then be combined to form other functions.</p>
        <div className="logic-theory__universal-grid">
          <div className="logic-theory__universal-card"><span className="eyebrow">NAND-ONLY NETWORKS</span>
            <div><strong>NOT A</strong><code>A NAND A = A̅</code></div>
            <div><strong>AND</strong><code>(A NAND B) NAND (A NAND B) = A · B</code></div>
            <div><strong>OR</strong><code>(A NAND A) NAND (B NAND B) = A + B</code></div>
          </div>
          <div className="logic-theory__universal-card"><span className="eyebrow">NOR-ONLY NETWORKS</span>
            <div><strong>NOT A</strong><code>A NOR A = A̅</code></div>
            <div><strong>OR</strong><code>(A NOR B) NOR (A NOR B) = A + B</code></div>
            <div><strong>AND</strong><code>(A NOR A) NOR (B NOR B) = A · B</code></div>
          </div>
        </div>
        <p className="logic-theory__bubble-note"><strong>Bubble rule:</strong> a small circle at a gate pin means inversion. The circle at the output complements the complete gate function; a circle at an input complements that input before the gate evaluates it.</p>
      </section>

      <section className="logic-theory__section logic-theory__study-section" id="logic-families" aria-labelledby="logic-families-title">
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
        <div className="logic-theory__family-detail-grid">
          <div><span className="logic-theory__subheading">RTL · example: NOR</span><p>In a simple RTL NOR, input resistors meet at a transistor base. If either input is high, the transistor conducts and pulls the collector output low. If both inputs are low, the transistor is off and the collector pull-up makes the output high.</p></div>
          <div><span className="logic-theory__subheading">DTL · example: NAND</span><p>Input diodes form the decision network and a transistor provides inversion and signal restoration. In a common DTL NAND, any low input can clamp the transistor drive so the output stays high; when every input is high, the transistor stage pulls the output low.</p></div>
          <div><span className="logic-theory__subheading">TTL · typical NAND path</span><p>A common standard-TTL NAND uses a multi-emitter input transistor, a phase-splitter stage and a totem-pole output pair. The input stage evaluates the combination, while the output pair actively drives HIGH or LOW. Other TTL parts can use open-collector outputs, which need an external pull-up; never join outputs unless their data sheets allow it.</p></div>
        </div>
        <div className="logic-theory__table-wrap logic-theory__family-table-wrap" role="region" aria-label="Comparison of RTL, DTL and TTL" tabIndex={0}>
          <table className="logic-theory__truth-table logic-theory__family-table">
            <thead><tr><th>Family</th><th>Input / logic element</th><th>Typical example</th><th>What to identify in a circuit</th></tr></thead>
            <tbody>
              <tr><th scope="row">RTL</th><td>Resistor network with a BJT switch</td><td>NOR</td><td>Input resistors feed the transistor base; collector load establishes the opposite output level.</td></tr>
              <tr><th scope="row">DTL</th><td>Diode input network and a BJT stage</td><td>NAND</td><td>Input diodes evaluate the combination; the transistor stage inverts and restores the signal.</td></tr>
              <tr><th scope="row">TTL</th><td>Transistor input and switching stages</td><td>NAND</td><td>Look for the input transistor, switching/phase-splitter stage, and specified output structure.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="logic-theory__caption">Do not infer exact delay, drive current or power from the family name alone: variants within a family have different specifications.</p>
        <p className="logic-theory__caption"><strong>Diagram.</strong> Simplified functional view; actual internal circuits depend on the gate and IC design.</p>
        <div className="logic-theory__electrical">
          <div className="logic-theory__section-heading"><div><span className="eyebrow">ELECTRICAL CHARACTERISTICS</span><h4>Logic 0 and 1 are voltage ranges</h4></div></div>
          <p className="logic-theory__body-copy">The Boolean table uses ideal 0 and 1. A real IC recognises guaranteed input-low and input-high ranges, and promises output-low and output-high ranges. The gap between the guaranteed input ranges is undefined; never design around a voltage in that gap.</p>
          <div className="logic-theory__voltage-grid">
            <div><strong>V<sub>IL(max)</sub></strong><span>Largest input voltage guaranteed to count as LOW</span></div>
            <div><strong>V<sub>IH(min)</sub></strong><span>Smallest input voltage guaranteed to count as HIGH</span></div>
            <div><strong>V<sub>OL(max)</sub></strong><span>Largest output voltage guaranteed to count as LOW</span></div>
            <div><strong>V<sub>OH(min)</sub></strong><span>Smallest output voltage guaranteed to count as HIGH</span></div>
          </div>
          <div className="logic-theory__margin-formulas"><strong>Noise margin</strong><span>HIGH: NM<sub>H</sub> = V<sub>OH(min)</sub> − V<sub>IH(min)</sub></span><span>LOW: NM<sub>L</sub> = V<sub>IL(max)</sub> − V<sub>OL(max)</sub></span><p>A larger positive margin leaves more room for noise while keeping the next gate’s input in a guaranteed range.</p></div>
          <div className="logic-theory__characteristic-list">
            <p><strong>Fan-in:</strong> number of input signals a gate accepts. Larger fan-in can change internal loading and delay.</p>
            <p><strong>Fan-out:</strong> number of compatible gate inputs one output can drive while meeting its voltage and current limits. Check HIGH and LOW separately because source and sink current limits can differ.</p>
            <p><strong>Propagation delay:</strong> time between an input transition and its output response. Datasheets may list t<sub>PLH</sub> (output LOW→HIGH) and t<sub>PHL</sub> (HIGH→LOW); for a multi-gate path, check the slowest path.</p>
            <p><strong>Power dissipation:</strong> power used by the device. Speed, load, supply, and logic-family choice affect real circuit performance.</p>
            <p><strong>Interfacing:</strong> a driver’s guaranteed V<sub>OH(min)</sub> must satisfy the receiver’s V<sub>IH(min)</sub>, and V<sub>OL(max)</sub> must satisfy V<sub>IL(max)</sub>. Also check supply, ground and output-current limits.</p>
          </div>
          <p className="logic-theory__logic-convention"><strong>Logic convention:</strong> this guide uses positive logic, where the higher valid voltage is logic 1 and the lower valid voltage is logic 0. In negative logic, that mapping is reversed, so the same electrical signal can be described with a different Boolean interpretation.</p>
          <p className="logic-theory__part-example"><strong>Part-specific example:</strong> TI’s SN7400 datasheet identifies a quad two-input positive-NAND TTL device and lists V<sub>IH</sub> = 2 V and V<sub>IL</sub> = 0.8 V for that part. These are not universal voltage rules for every TTL, LS-TTL, HCT or CMOS IC; use the exact part’s datasheet.</p>
        </div>
      </section>

      <section className="logic-theory__section logic-theory__study-section" id="solve-questions" aria-labelledby="solve-questions-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">QUESTION-SOLVING GUIDE</span><h4 id="solve-questions-title">A repeatable method for unfamiliar problems</h4></div>
        </div>
        <div className="logic-theory__method-grid">
          <div><span>01</span><strong>Expression → truth table</strong><ol><li>List the variables and count rows.</li><li>Make a column for each complemented or intermediate operation.</li><li>Evaluate from parentheses outward, using NOT, AND, then OR.</li><li>Read the final output column.</li></ol></div>
          <div><span>02</span><strong>Truth table → expression</strong><ol><li>Mark every row where output is 1.</li><li>Write one product term per marked row.</li><li>OR those terms for SOP; alternatively use zero rows to form POS.</li><li>Simplify with Boolean laws and verify all rows.</li></ol></div>
          <div><span>03</span><strong>Gate diagram → equation</strong><ol><li>Start at inputs and label every gate output.</li><li>Apply each gate’s rule; a bubble complements that signal.</li><li>Write an equation for each intermediate wire.</li><li>Substitute those equations into the final output.</li></ol></div>
          <div><span>04</span><strong>Equation → circuit</strong><ol><li>Respect parentheses and operation order.</li><li>Draw NOT gates for complemented variables.</li><li>Draw AND blocks for products and OR blocks for sums.</li><li>Use De Morgan’s laws to convert to NAND-only or NOR-only form if required.</li></ol></div>
        </div>
        <div className="logic-theory__worked-identity logic-theory__worked-proof">
          <span className="logic-theory__subheading">How to prove two designs are equivalent</span>
          <p>Build a truth table for both expressions using the same input order. If every output row matches, they implement the same Boolean function. If one row differs, inspect that input combination and trace the first intermediate column where the values diverge.</p>
        </div>
        <div className="logic-theory__common-errors">
          <span className="eyebrow">COMMON EXAM AND LAB TRAPS</span>
          <ul>
            <li><strong>OR is not arithmetic addition:</strong> 1 + 1 in Boolean algebra is 1.</li>
            <li><strong>XOR is not OR:</strong> when A=B=1, OR is 1 but XOR is 0.</li>
            <li><strong>Watch the bar:</strong> (A+B)̅ differs from A+B̅.</li>
            <li><strong>For more than two XOR inputs,</strong> output is 1 when an odd number of inputs are 1; XNOR is 1 for an even number.</li>
            <li><strong>Do not leave physical inputs floating.</strong> Tie unused inputs to a defined legal logic state as the IC datasheet recommends.</li>
            <li><strong>Do not treat logic values as exact voltages:</strong> logic thresholds and safe output levels depend on the device family and part number.</li>
          </ul>
        </div>
        <details className="logic-theory__self-check">
          <summary>Quick self-check · reveal the answers</summary>
          <div><p><strong>1.</strong> If A=0, B=1, C=0, what is F=A+B·C̅? <strong>Answer: 1</strong>, because C̅=1, B·C̅=1 and 0+1=1.</p><p><strong>2.</strong> For A=1, B=1, what are NAND and NOR? <strong>Answer: NAND=0, NOR=0.</strong> AND and OR are both 1 before their outputs are inverted.</p><p><strong>3.</strong> What gate gives 1 only for equal two-bit inputs? <strong>Answer: XNOR.</strong></p></div>
        </details>
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
