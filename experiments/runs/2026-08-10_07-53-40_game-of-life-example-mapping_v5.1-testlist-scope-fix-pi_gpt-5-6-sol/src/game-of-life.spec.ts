import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("a single live cell dies -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation kills two adjacent cells -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with 2 live neighbors survives", () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    expect(next).toContainEqual([0, 0]);
  });
  it("a live cell with 3 live neighbors survives -- center cell (1,1) remains alive", () => {
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("overpopulation kills a live cell with more than 3 neighbors -- center cell (1,1) dies", () => {
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduction makes a dead cell with exactly 3 neighbors live -- (1,1) becomes alive", () => {
    const next = nextGeneration([[0, 1], [1, 2], [2, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("a block is a still life -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("a vertical blinker becomes horizontal and handles negative coordinates -- [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("a blinker returns to vertical after two generations -- [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
});
