import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty for a single live cell -- [(0,0)] -> [] (single cell dies)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with fewer than 2 neighbors -- [(0,1),(1,1)] -> [] (Rule 1 underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let a live cell with 2 or 3 neighbors survive -- center (1,1) with 3 neighbors survives (Rule 2)", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]])).toContainEqual([1, 1]);
  });
  it("should kill a live cell with more than 3 neighbors -- center (1,1) with 4 neighbors dies (Rule 3 overpopulation)", () => {
    const gen1 = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(gen1).not.toContainEqual([1, 1]);
  });
  it("should revive a dead cell with exactly 3 neighbors -- (1,1) becomes alive (Rule 4 reproduction)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("should rotate a blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(gen1).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(gen1).toHaveLength(3);
  });
  it("should rotate a blinker from horizontal back to vertical -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const gen1 = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(gen1).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
    expect(gen1).toHaveLength(3);
  });
});
