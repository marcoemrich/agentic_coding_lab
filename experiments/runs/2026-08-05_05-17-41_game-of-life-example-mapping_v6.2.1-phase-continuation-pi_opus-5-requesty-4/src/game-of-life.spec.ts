import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single lone cell -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live cell with 2 live neighbors lives on -- [(0,0),(0,1),(0,2)] -> includes (0,1)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("Rule 3 Overpopulation: cell with more than 3 live neighbors dies -- 3x3 block -> center (1,1) not alive", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> includes (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("Blinker: vertical [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect([...result].sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("Blinker: oscillates back to vertical after two generations -- [(0,0),(0,1),(0,2)]", () => {
    const gen2 = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect([...gen2].sort()).toEqual([[0, 0], [0, 1], [0, 2]].sort());
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect([...nextGeneration(block)].sort()).toEqual([...block].sort());
  });
  it("should handle negative coordinates -- blinker [(-5,-5),(-5,-4),(-5,-3)] -> [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect([...result].sort()).toEqual([[-6, -4], [-5, -4], [-4, -4]].sort());
  });
});
