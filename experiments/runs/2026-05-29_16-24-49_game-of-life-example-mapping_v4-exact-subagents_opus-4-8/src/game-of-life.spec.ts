import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells that each have only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let a live cell with 2 or 3 neighbors survive", () => {
    // Gen 0: ### (horizontal triple / blinker)
    // The center cell (1,0) has exactly 2 live neighbors → it SURVIVES.
    // The end cells (0,0) and (2,0) each have only 1 live neighbor → they DIE.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]); // center survives (2 neighbors)
    expect(result).not.toContainEqual([0, 0]); // end cell dies (1 neighbor)
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Gen 0: ###/.#./### shape
    // Center (1,1) has 6 live neighbors → dies (overpopulation).
    // Corner (0,0) has 2 live neighbors → survives.
    // Dead cell (0,1) has 5 live neighbors → stays dead (birth needs exactly 3).
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]); // center dies: overpopulation (6 neighbors)
    expect(result).toContainEqual([0, 0]); // corner survives (2 neighbors)
    expect(result).not.toContainEqual([0, 1]); // dead cell with 5 neighbors stays dead (birth needs exactly 3)
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // Gen 0: ##. / #.. / ...  (three cells of a 2x2 block)
    // The dead cell (1,1) has exactly 3 live neighbors → becomes alive.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]); // dead cell with exactly 3 neighbors becomes alive
  });
  it("should keep a block still life unchanged", () => {
    // Gen 0: a 2x2 block (still life)
    // Each live cell has exactly 3 live neighbors → all survive.
    // No dead cell has exactly 3 live neighbors → no births.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a blinker from vertical to horizontal", () => {
    // Gen 0: vertical bar at x=0, y=0..2
    // Gen 1: horizontal bar at y=1, x=-1..1 (note negative x coordinate)
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });
});
