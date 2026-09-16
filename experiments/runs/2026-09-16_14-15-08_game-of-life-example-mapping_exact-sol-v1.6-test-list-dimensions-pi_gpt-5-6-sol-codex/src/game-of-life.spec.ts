import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function coordinateKeys(cells: [number, number][]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell at (0,0) dies, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells each have one neighbor and die, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell (1,1) with two live neighbors survives", () => {
    const next = nextGeneration([[0, 1], [1, 1], [2, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("live cell (1,1) with three live neighbors survives", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("center cell (1,1) with more than three neighbors dies in the overpopulation example", () => {
    const next = nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("dead cell (1,1) with exactly three neighbors is born, producing a 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(coordinateKeys(next)).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("vertical blinker becomes [(-1,1),(0,1),(1,1)] and returns to vertical after a second generation", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const second = nextGeneration(first);

    expect(coordinateKeys(first)).toEqual(["-1,1", "0,1", "1,1"]);
    expect(coordinateKeys(second)).toEqual(["0,0", "0,1", "0,2"]);
  });
  it("2x2 block remains [(0,0),(1,0),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);

    expect(coordinateKeys(next)).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("rules apply across negative coordinates on the infinite grid", () => {
    const next = nextGeneration([[-2, -2], [-1, -2], [-2, -1]]);

    expect(coordinateKeys(next)).toEqual(["-1,-1", "-1,-2", "-2,-1", "-2,-2"]);
  });
});
