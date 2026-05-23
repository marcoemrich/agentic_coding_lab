import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("single cell dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two adjacent cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 overpopulation: live cell with > 3 neighbors dies (center of ###/.#./### dies)", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    const resultKeys = new Set(result.map((c) => c.join(",")));
    expect(resultKeys.has("1,1")).toBe(false);
  });
  it("Rule 4 reproduction: L-shape [(0,0),(1,0),(0,1)] → block [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
    expect(result.length).toBe(4);
  });
  it("Block still life: 2x2 block stays unchanged — [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(cells.map((c) => c.join(","))),
    );
    expect(result.length).toBe(4);
  });
  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(cells);
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
    expect(result.length).toBe(3);
  });
  it("handles negative coordinates — blinker at (-100,-100) area oscillates correctly", () => {
    const cells: [number, number][] = [[-100, -100], [-100, -99], [-100, -98]];
    const result = nextGeneration(cells);
    const expected: [number, number][] = [[-101, -99], [-100, -99], [-99, -99]];
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
    expect(result.length).toBe(3);
  });
});
