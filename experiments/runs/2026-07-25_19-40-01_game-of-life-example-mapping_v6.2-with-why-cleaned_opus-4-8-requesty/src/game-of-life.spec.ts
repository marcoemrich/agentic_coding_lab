import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — [(0,1),(1,1),(0,0)] includes (1,0)", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toContainEqual([1, 0]);
  });
  it("Rule 2 Survival: live cell with 2 neighbors lives on — center of a row of 3 [(0,0),(1,0),(2,0)] survives (1,0)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: live cell with more than 3 neighbors dies — center of ### / .#. / ### dies", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillator flips orientation — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    for (const cell of [[-1, 1], [0, 1], [1, 1]] as [number, number][]) {
      expect(result).toContainEqual(cell);
    }
  });
});
