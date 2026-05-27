import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest case
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell (subset of Rule 1 underpopulation)
  it("should kill a single live cell (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation (live cell with < 2 neighbors dies)
  it("Rule 1 Underpopulation: two adjacent cells (1 neighbor each) both die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive) -- block still life is the simplest case touching survival+reproduction
  // Use spec example: block still life (each cell has 3 neighbors)
  it("Rule 2 Survival + still life: block [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });

  // Rule 2: Survival - center cell with 3 neighbors survives (from spec)
  it("Rule 2 Survival: live cell (1,0) with 2 live neighbors survives -- ### row -> middle cell lives, ends die, two new cells reproduce above/below", () => {
    // Three cells in a horizontal row: (0,0),(1,0),(2,0).
    // Middle has 2 live neighbours -> survives (Rule 2).
    // Ends have 1 live neighbour each -> die (Rule 1).
    // (1,-1) and (1,1) each have 3 live neighbours -> reproduce (Rule 4).
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(["1,-1", "1,0", "1,1"])
    );
  });

  // Rule 3: Overpopulation - center cell with 4 neighbors dies
  it("Rule 3 Overpopulation: center cell (1,1) with >3 live neighbors dies -- ### / .#. / ### -> #.# / #.# / #.#", () => {
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    // Center cell (1,1) has 6 live neighbours (>3) -> dies (Rule 3 Overpopulation).
    // Corner cells (0,0),(2,0),(0,2),(2,2) each have 3 live neighbours -> survive (Rule 2).
    // Edge-mid cells (0,1),(2,1) each have 5 live neighbours -> die (Rule 3).
    // Edge-mid cells (1,0),(1,2) each have 3 live neighbours -> survive (Rule 2).
    // Outside cells (1,-1) and (1,3) each have 3 live neighbours -> reproduce (Rule 4).
    const expected = new Set([
      "0,0", "2,0", "0,2", "2,2",
      "1,0", "1,2",
      "1,-1", "1,3",
    ]);
    const result = new Set(nextGeneration(gen0).map(c => c.join(",")));
    expect(result).toEqual(expected);
    // Key assertion for Rule 3: center (1,1) is dead in Gen 1
    expect(result.has("1,1")).toBe(false);
  });

  // Rule 4: Reproduction example from spec
  it("Rule 4 Reproduction: dead cell (1,1) with exactly 3 neighbors becomes alive -- ##. / #.. / ... -> ##. / ##. / ...", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(new Set(nextGeneration(gen0).map(c => c.join(",")))).toEqual(expected);
  });

  // Pattern: Blinker oscillator (covers negative coordinates as well)
  it("Blinker vertical -> horizontal: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected = new Set(["-1,1", "0,1", "1,1"]);
    expect(new Set(nextGeneration(gen0).map(c => c.join(",")))).toEqual(expected);
  });
});
