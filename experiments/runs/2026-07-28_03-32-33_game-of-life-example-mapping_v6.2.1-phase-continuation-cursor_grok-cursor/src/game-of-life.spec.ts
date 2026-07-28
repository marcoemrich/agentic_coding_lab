import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("single live cell dies -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: two adjacent live cells die -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("survival: live cell with 2 neighbors lives on -- [(0,0), (1,0), (2,0)] middle (1,0) survives in [(1,-1), (1,0), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
    expect(result).toHaveLength(3);
  });
  it("block still life unchanged -- [(0,0), (1,0), (0,1), (1,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("overpopulation: live cell with more than 3 neighbors dies -- center of ###/.#/### dies", () => {
    // Gen 0: ### / .#. / ### — center (1,1) has 6 live neighbors → dies
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
    expect(result).toEqual(expect.arrayContaining([[0, 0], [2, 0], [0, 2], [2, 2]]));
  });
  it("blinker oscillator gen0 to gen1 -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("blinker oscillator gen1 to gen2 -- [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
});
