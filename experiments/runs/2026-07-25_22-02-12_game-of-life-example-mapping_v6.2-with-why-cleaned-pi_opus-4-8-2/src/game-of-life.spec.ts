import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 Overpopulation: center cell with 4 neighbors dies", () => {
    // Gen 0: ### / .#. / ### with y increasing downward
    // rows y=0: (0,0),(1,0),(2,0); y=1: (1,1); y=2: (0,2),(1,2),(2,2)
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "2,0", "1,0", "0,2", "2,2", "1,2", "1,-1", "1,3"]),
    );
  });
  it("Rule 2 Survival: cell with 2 or 3 neighbors lives on", () => {
    // Gen 0: ### / ... / .#.  center (1,0) has 2 live neighbors (0,0),(2,0) -> survives
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // Gen 0: ##. / #.. / ...  dead (1,1) has neighbors (0,0),(1,0),(0,1) = 3 -> alive
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life is unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("Blinker oscillates -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
});
