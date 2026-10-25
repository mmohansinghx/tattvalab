const gateCards = [
  { name: "AND", symbol: "and", expression: "Y = A · B", rule: "The output is 1 only when both inputs are 1." },
  { name: "OR", symbol: "or", expression: "Y = A + B", rule: "The output is 1 when at least one input is 1." },
  { name: "NOT", symbol: "not", expression: "Y = A̅", rule: "A single input is reversed: 0 becomes 1, and 1 becomes 0." },
  { name: "NAND", symbol: "nand", expression: "Y = (A · B)̅", rule: "This is the inverted AND result; it is 0 only when both inputs are 1." },
  { name: "NOR", symbol: "nor", expression: "Y = (A + B)̅", rule: "This is the inverted OR result; it is 1 only when both inputs are 0." },
  { name: "EX-OR", symbol: "xor", expression: "Y = A ⊕ B", rule: "The output is 1 when the two inputs are different." },
  { name: "EX-NOR", symbol: "xnor", expression: "Y = (A ⊕ B)̅", rule: "The output is 1 when the two inputs are the same." },
] as const;

function GateSymbol({ kind }: { kind: (typeof gateCards)[number]["symbol"] }) {
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
        <h3>Logic gates turn binary inputs into a defined output.</h3>
        <p>Digital circuits represent information with two states, written as 0 and 1. A logic gate applies a rule to its input signals and produces an output. Because a gate has no memory, its output depends on the input values present at that moment.</p>
        <div className="logic-theory__principle">
          <span className="logic-theory__principle-icon">0 / 1</span>
          <p><strong>One rule, every possible input.</strong> A truth table lists all input combinations and the output for each one. With <em>n</em> binary inputs, there are 2<sup>n</sup> combinations to check.</p>
        </div>
      </section>

      <section className="logic-theory__section" aria-labelledby="logic-gate-rules-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">01 · GATE RULES</span><h4 id="logic-gate-rules-title">Seven gates, seven ways to decide</h4></div>
          <p>Read the symbol, then connect its equation to the output rule.</p>
        </div>
        <div className="logic-theory__gate-grid">
          {gateCards.map((gate) => (
            <section className="logic-theory__gate-card" key={gate.name}>
              <div className="logic-theory__gate-card-top"><span>{gate.name}</span><GateSymbol kind={gate.symbol} /></div>
              <strong className="logic-theory__equation">{gate.expression}</strong>
              <p>{gate.rule}</p>
            </section>
          ))}
        </div>
        <p className="logic-theory__caption"><strong>Diagram 1.</strong> Original logic-symbol sketches for the seven gates in this experiment. The small output circle marks an inverted result.</p>
        <div className="logic-theory__identity">
          <span className="eyebrow">BUILDING THE PARITY GATES</span>
          <p><strong>XOR:</strong> Y = A̅B + AB̅ &nbsp;·&nbsp; <strong>XNOR:</strong> Y = AB + A̅B̅. Each expression combines two cases: unlike inputs for XOR, matching inputs for XNOR.</p>
        </div>
      </section>

      <section className="logic-theory__section" aria-labelledby="logic-truth-table-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">02 · COMPLETE OUTPUTS</span><h4 id="logic-truth-table-title">Compare every two-input case</h4></div>
          <span className="logic-theory__table-tag">1 = HIGH · 0 = LOW</span>
        </div>
        <p className="logic-theory__body-copy">For two inputs, write the four input pairs once. The NOT columns show the inversion of each input; the remaining columns show the output of each two-input gate.</p>
        <div className="logic-theory__table-wrap" role="region" aria-label="Truth table for logic gates" tabIndex={0}>
          <table className="logic-theory__truth-table">
            <thead><tr><th>A</th><th>B</th><th>NOT A</th><th>NOT B</th><th>AND</th><th>OR</th><th>NAND</th><th>NOR</th><th>XOR</th><th>XNOR</th></tr></thead>
            <tbody>
              <tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
              <tr><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
              <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
              <tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
            </tbody>
          </table>
        </div>
        <p className="logic-theory__caption"><strong>Diagram 2.</strong> Truth table for all input pairs. NOT A and NOT B are listed separately because NOT gates each act on one signal.</p>
      </section>

      <section className="logic-theory__section" aria-labelledby="logic-families-title">
        <div className="logic-theory__section-heading">
          <div><span className="eyebrow">03 · CIRCUIT FAMILIES</span><h4 id="logic-families-title">How RTL, DTL and TTL build the rule</h4></div>
        </div>
        <p className="logic-theory__body-copy">The truth table describes what a gate does. RTL, DTL and TTL describe different ways of building the electronic circuit that performs that rule. The exact component arrangement depends on the gate and circuit design.</p>
        <div className="logic-theory__family-diagram" role="img" aria-label="Conceptual comparison of RTL, DTL and TTL logic circuit stages">
          <div className="logic-theory__family-row"><strong>RTL</strong><span>Resistor input network</span><i>→</i><span>Transistor switching</span><i>→</i><span>Output</span></div>
          <div className="logic-theory__family-row"><strong>DTL</strong><span>Diode input network</span><i>→</i><span>Transistor switching</span><i>→</i><span>Output</span></div>
          <div className="logic-theory__family-row"><strong>TTL</strong><span>Transistor input stage</span><i>→</i><span>Transistor switching</span><i>→</i><span>Output driver</span></div>
        </div>
        <div className="logic-theory__family-notes">
          <p><strong>RTL</strong> uses resistors to feed transistor control terminals. The transistor network switches a load; its connections and output polarity determine the gate function. A transistor inverter is a useful example: when the transistor is off, a pull-up can make the output high; when it turns on, it pulls the output low.</p>
          <p><strong>DTL</strong> combines input conditions with diodes before a transistor stage. In an OR-style diode network, a high input can forward-bias its diode path and raise the network output; the following transistor stage conditions that signal.</p>
          <p><strong>TTL</strong> uses transistors in its input and switching stages. Many TTL designs use a multi-emitter input transistor and a separate output stage, with the output arrangement chosen to suit its load and the next circuit.</p>
        </div>
        <p className="logic-theory__caption"><strong>Diagram 3.</strong> Simplified functional view of common logic-family stages; individual IC internals vary.</p>
      </section>

      <section className="logic-theory__takeaways" aria-label="Important points">
        <span className="eyebrow">IMPORTANT POINTS</span>
        <ul>
          <li><strong>NAND and NOR are universal gates:</strong> suitable combinations of either gate can reproduce the other basic logic functions.</li>
          <li><strong>XOR checks for a difference:</strong> its output is 1 when exactly one of two inputs is 1; XNOR is 1 when the inputs match.</li>
          <li><strong>Logic family changes electrical behaviour,</strong> such as input requirements, output drive and delay. For hardware, use the particular IC’s datasheet.</li>
        </ul>
      </section>
    </article>
  );
}
