export type PretestDifficulty = "Easy" | "Medium" | "Hard" | "Advanced";

export type PretestQuestion = {
  id: number;
  difficulty: PretestDifficulty;
  prompt: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
};

export const logicGatesPretest: PretestQuestion[] = [
  {
    id: 1, difficulty: "Easy", prompt: "For A = 1 and B = 1, what is the output of an AND gate?",
    options: ["0", "1", "A + B", "It cannot be determined"], answerIndex: 1,
    explanation: "AND is 1 only when every input is 1. Both inputs are high, so Y = A · B = 1.",
  },
  {
    id: 2, difficulty: "Easy", prompt: "A two-input OR gate has A = 0 and B = 0. What is Y?",
    options: ["0", "1", "2", "A̅"], answerIndex: 0,
    explanation: "OR is 1 if at least one input is 1. Here both inputs are 0, so Y = 0.",
  },
  {
    id: 3, difficulty: "Easy", prompt: "What does a NOT gate output when its input A is 0?",
    options: ["0", "1", "A", "Undefined"], answerIndex: 1,
    explanation: "A NOT gate reverses its single input. Therefore A = 0 gives Y = A̅ = 1.",
  },
  {
    id: 4, difficulty: "Easy", prompt: "For A = 1 and B = 1, what is the output of a NAND gate?",
    options: ["0", "1", "A · B", "A + B"], answerIndex: 0,
    explanation: "NAND is the complement of AND. AND gives 1 for inputs 11, so NAND gives 0.",
  },
  {
    id: 5, difficulty: "Easy", prompt: "What is A ⊕ B when A = 1 and B = 0?",
    options: ["0", "1", "A · B", "A + B̅"], answerIndex: 1,
    explanation: "EX-OR is 1 when its two inputs differ. The pair 10 is different, so the output is 1.",
  },
  {
    id: 6, difficulty: "Medium", prompt: "For which two-input combination is a NOR gate's output 1?",
    options: ["A = 0, B = 0", "A = 0, B = 1", "A = 1, B = 0", "A = 1, B = 1"], answerIndex: 0,
    explanation: "NOR = (A + B)̅. It is 1 only when the OR result is 0, which occurs for inputs 00.",
  },
  {
    id: 7, difficulty: "Medium", prompt: "An EX-NOR gate receives A = 0 and B = 1. What is its output?",
    options: ["0", "1", "A + B", "A · B"], answerIndex: 0,
    explanation: "EX-NOR is 1 when the inputs match. The inputs 0 and 1 differ, so Y = 0.",
  },
  {
    id: 8, difficulty: "Medium", prompt: "Evaluate F = A + B · C̅ for A = 0, B = 1, C = 0.",
    options: ["0", "1", "A̅", "Cannot be determined"], answerIndex: 1,
    explanation: "Apply NOT first: C̅ = 1. Then B · C̅ = 1 · 1 = 1. Finally, A + 1 = 0 + 1 = 1.",
  },
  {
    id: 9, difficulty: "Medium", prompt: "How many rows are needed for a complete truth table with three binary inputs?",
    options: ["3", "6", "8", "9"], answerIndex: 2,
    explanation: "There are 2ⁿ input combinations. With n = 3, the table needs 2³ = 8 rows.",
  },
  {
    id: 10, difficulty: "Medium", prompt: "Which expression is equivalent to a two-input EX-OR gate?",
    options: ["AB + A̅B̅", "A̅B + AB̅", "A + B", "(A + B)̅"], answerIndex: 1,
    explanation: "EX-OR is 1 for the two unlike-input cases: A̅B and AB̅. OR those product terms: A̅B + AB̅.",
  },
  {
    id: 11, difficulty: "Hard", prompt: "Simplify F = A + A̅B using Boolean algebra.",
    options: ["A", "B", "AB", "A + B"], answerIndex: 3,
    explanation: "Use the identity A + A̅B = (A + A̅)(A + B) = 1 · (A + B) = A + B.",
  },
  {
    id: 12, difficulty: "Hard", prompt: "Apply De Morgan's theorem to (A + B)̅.",
    options: ["A̅ + B̅", "A̅ · B̅", "A · B", "A + B"], answerIndex: 1,
    explanation: "A complement over an OR becomes an AND of the complemented inputs: (A + B)̅ = A̅ · B̅.",
  },
  {
    id: 13, difficulty: "Hard", prompt: "Evaluate F = A · B + C when A = 1, B = 0 and C = 1.",
    options: ["0", "1", "A̅", "B̅"], answerIndex: 1,
    explanation: "First A · B = 1 · 0 = 0. Then F = 0 + C = 0 + 1 = 1.",
  },
  {
    id: 14, difficulty: "Hard", prompt: "A three-input NAND gate receives 1, 1, 1. What is its output?",
    options: ["0", "1", "3", "It needs only two inputs"], answerIndex: 0,
    explanation: "A multi-input NAND complements the AND of all its inputs. AND(1,1,1) = 1, so NAND = 0.",
  },
  {
    id: 15, difficulty: "Hard", prompt: "For input order ABC, F = 1 at rows 001, 011, 101 and 111. What is the simplest expression?",
    options: ["A", "B", "C", "A + B"], answerIndex: 2,
    explanation: "In every listed row C = 1, while A and B vary. The function is therefore F = C (equivalently, Σm(1,3,5,7)).",
  },
  {
    id: 16, difficulty: "Advanced", prompt: "Which NAND-only circuit implements OR, Y = A + B?",
    options: ["(A NAND A) NAND (B NAND B)", "(A NAND B) NAND (A NAND B)", "A NAND B", "(A NAND A) NAND B"], answerIndex: 0,
    explanation: "Tying each NAND's inputs together makes A̅ and B̅. NAND them: (A̅ · B̅)̅ = A + B by De Morgan's theorem.",
  },
  {
    id: 17, difficulty: "Advanced", prompt: "In a three-variable Karnaugh map, all the 1s occupy the BC columns 01 and 11 for both A rows. What does the group simplify to?",
    options: ["A", "B", "C", "A + B"], answerIndex: 2,
    explanation: "Across that four-cell group A and B each change, but C stays 1. Variables that change cancel, leaving F = C.",
  },
  {
    id: 18, difficulty: "Advanced", prompt: "In a simple RTL NOR circuit, what happens when either input goes high?",
    options: ["The transistor turns on and the collector output goes low", "The transistor turns off and output goes high", "The output becomes high impedance", "The output equals the OR result"], answerIndex: 0,
    explanation: "A high input supplies base drive through its resistor. The transistor conducts and pulls the collector output low, which is the NOR response when any input is high.",
  },
  {
    id: 19, difficulty: "Advanced", prompt: "In a common DTL NAND, one input is low while the other is high. What is the expected output action?",
    options: ["The input diode network clamps transistor drive; the transistor is off and output is high", "All input diodes block; the transistor turns on and output is low", "The output is always low for mixed inputs", "The circuit behaves as an XOR"], answerIndex: 0,
    explanation: "A low input forward-biases its diode path and clamps the transistor drive. With the transistor off, the output pull-up holds Y high, as required by NAND.",
  },
  {
    id: 20, difficulty: "Advanced", prompt: "According to the TI SN7400 datasheet, what logic functions are inside one SN7400 package?",
    options: ["Four independent two-input positive-NAND gates", "One four-input NOR gate", "Two two-input EX-OR gates", "One NOT gate and three AND gates"], answerIndex: 0,
    explanation: "The SN7400 datasheet specifies four independent, two-input positive-NAND gates. Pin layout and electrical limits should still be checked for the exact package and part variant.",
  },
];
