import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("single cell dies -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: live cell with < 2 neighbors dies -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(result).toHaveLength(4);
  });
  it("survival: live cell with 2 or 3 neighbors lives on -- center (1,1) with 3 neighbors survives", () => {
    // (1,1) has live neighbors (0,0), (1,0), (2,0)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("overpopulation: live cell with > 3 neighbors dies -- center (1,1) with 4 neighbors dies", () => {
    // plus shape: center (1,1) has 4 live neighbors
    const result = nextGeneration([
      [1, 0],
      [0, 1], [1, 1], [2, 1],
      [1, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("block still life -- [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
  it("blinker oscillator gen0 → gen1 -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it("blinker oscillator gen1 → gen2 -- [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
    expect(result).toHaveLength(3);
  });
});
