import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input (no living cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - Underpopulation: live cells with < 2 neighbors die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 - Survival: live cell with 2 or 3 neighbors lives on -- center (1,1) survives", () => {
    // Gen 0:
    // ###  row y=0: (0,0),(1,0),(2,0)
    // .#.  row y=1: (1,1)
    // ...  row y=2: none
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
    ];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 - Overpopulation: live cell with > 3 neighbors dies -- center (1,1) with 4+ neighbors dies", () => {
    // Gen 0:
    // ###  row y=0: (0,0),(1,0),(2,0)
    // .#.  row y=1: (1,1)
    // ###  row y=2: (0,2),(1,2),(2,2)
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive -- (1,1) born", () => {
    // Gen 0:
    // ##.  row y=0: (0,0),(1,0)
    // #..  row y=1: (0,1)
    // ...  row y=2: none
    const gen0: [number, number][] = [
      [0, 0], [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillator gen 0 -> gen 1: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    expect(result).toHaveLength(3);
    for (const cell of [[-1, 1], [0, 1], [1, 1]] as [number, number][]) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillator gen 1 -> gen 2: [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(gen1);
    expect(result).toHaveLength(3);
    for (const cell of [[0, 0], [0, 1], [0, 2]] as [number, number][]) {
      expect(result).toContainEqual(cell);
    }
  });
});
