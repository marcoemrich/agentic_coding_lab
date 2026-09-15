import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to [(0,1),(1,1)], producing [] because each cell has one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps the center cell (1,1) alive with exactly three live neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("reproduces the dead cell (1,1) from [(0,0),(1,0),(0,1)], producing the 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("kills a live center cell with four live neighbors by overpopulation", () => {
    const next = nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns the blinker back to its initial coordinates after two generations", () => {
    const second = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));

    expect(second).toHaveLength(3);
    expect(second).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("evolves a translated blinker at negative x and y coordinates on the infinite grid", () => {
    const next = nextGeneration([[-3, -4], [-3, -3], [-3, -2]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-4, -3], [-3, -3], [-2, -3]]));
  });
});
