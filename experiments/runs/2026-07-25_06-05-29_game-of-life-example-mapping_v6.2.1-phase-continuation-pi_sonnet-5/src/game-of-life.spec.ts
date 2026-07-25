import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single live cell dies (no neighbors) -- [(0,0)] -> [] (Single cell dies example)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 - Underpopulation: live cell with 1 neighbor dies -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive -- L-tromino [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)] (becomes a block)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
  });

  it("Rule 2 - Survival: live cell with 3 neighbors lives on -- T-tetromino [(0,0),(1,0),(2,0),(1,1)] keeps (1,1) alive in Gen 1", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });

  it("Rule 3 - Overpopulation: live cell with 4 neighbors dies -- plus-shape [(1,0),(0,1),(1,1),(2,1),(1,2)] -> (1,1) is dead in Gen 1", () => {
    const result = nextGeneration([
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ]);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });

  it("Block (still life) remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });

  it("Blinker (oscillator) Gen0 -> Gen1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });

  it("Blinker (oscillator) Gen1 -> Gen2 returns to original vertical shape -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
  });

  it("handles negative coordinates correctly -- blinker shifted to negative quadrant [(-5,-5),(-5,-4),(-5,-3)] -> [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ]),
    );
  });
});
