import { describe, expect, it } from "vitest";
import { calculateCurrent, calculateMotion, evaluateGate } from "./simulation";
import { parseProgress, PROGRESS_KEY, safeWriteProgress, type ProgressMap } from "./progress";

describe("Boolean gate model", () => {
  it("evaluates every common two-input gate rule", () => {
    expect(evaluateGate("AND", true, false)).toBe(false);
    expect(evaluateGate("OR", true, false)).toBe(true);
    expect(evaluateGate("XOR", true, false)).toBe(true);
    expect(evaluateGate("XOR", true, true)).toBe(false);
    expect(evaluateGate("NOT", false, false)).toBe(true);
  });
});

describe("electrical and motion models", () => {
  it("calculates ideal-resistor current and rejects invalid resistance", () => {
    expect(calculateCurrent(12, 6)).toBe(2);
    expect(() => calculateCurrent(12, 0)).toThrow(RangeError);
    expect(() => calculateCurrent(-1, 4)).toThrow(RangeError);
  });

  it("calculates constant-acceleration position and velocity", () => {
    expect(calculateMotion(0, 2, 3)).toEqual({ velocity: 6, displacement: 9 });
    expect(() => calculateMotion(0, 1, -1)).toThrow(RangeError);
  });
});

describe("local progress parsing", () => {
  it("returns an empty object for missing or malformed data", () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress("not json")).toEqual({});
    expect(parseProgress("[]")).toEqual({});
  });

  it("keeps valid scores and drops malformed fields safely", () => {
    const parsed = parseProgress(JSON.stringify({
      "logic-gate-explorer": { preTestScore: 50, postTestScore: "bad", completedAt: null, updatedAt: "2026-10-22T00:00:00.000Z" },
      ignored: null,
    }));
    expect(parsed["logic-gate-explorer"].preTestScore).toBe(50);
    expect(parsed["logic-gate-explorer"].postTestScore).toBeNull();
    expect(parsed.ignored).toBeUndefined();
  });

  it("writes progress through the supplied storage interface", () => {
    const values = new Map<string, string>();
    const storage = { setItem: (key: string, value: string) => values.set(key, value) };
    const progress: ProgressMap = { demo: { preTestScore: 100, postTestScore: null, completedAt: null, updatedAt: "2026-10-22T00:00:00.000Z" } };
    expect(safeWriteProgress(storage, progress)).toBe(true);
    expect(JSON.parse(values.get(PROGRESS_KEY) ?? "{}").demo.preTestScore).toBe(100);
  });
});
