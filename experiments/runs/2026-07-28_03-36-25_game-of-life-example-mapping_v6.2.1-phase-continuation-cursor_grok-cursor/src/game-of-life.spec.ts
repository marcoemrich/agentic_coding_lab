import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("single cell dies -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: live cells with 1 neighbor die -- [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(result).toHaveLength(4);
  });
  it("survival: live cell with 3 neighbors lives on -- center (1,1) survives in pattern", () => {
    // ### / .#.  — (1,1) has 3 live neighbors and must survive
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("overpopulation: live cell with more than 3 neighbors dies -- center (1,1) dies → [#.# / #.# / #.#]", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    // Center has 6 neighbors (>3) and must die; births occur above/below the pattern
    expect(result).not.toContainEqual([1, 1]);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0], [1, 0], [2, 0],
        [0, 2], [1, 2], [2, 2],
        [1, -1], [1, 3],
      ]),
    );
    expect(result).toHaveLength(8);
  });
  it("block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
  it("blinker oscillator gen0 to gen1 -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(
      expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]),
    );
    expect(result).toHaveLength(3);
  });
});
