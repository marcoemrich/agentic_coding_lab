import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("single cell dies -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: live cell with 1 neighbor dies -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: live cells with 2 neighbors live on -- [(0,0), (1,0), (0,1)] keep originals", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1]]));
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0), (1,0), (0,1)] → includes (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("overpopulation: live cell with more than 3 neighbors dies -- center (1,1) dies", () => {
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("block still life -- [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("blinker oscillator Gen 0 → Gen 1 -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it("blinker oscillator Gen 1 → Gen 2 -- [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
    expect(result).toHaveLength(3);
  });
});
