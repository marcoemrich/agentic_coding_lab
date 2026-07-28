import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty when single live cell dies -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep live cells with 2 or 3 neighbors alive (survival) -- L-shape originals survive", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(next).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [0, 1],
      ])
    );
  });
  it("should kill live cell with more than 3 neighbors (overpopulation) -- center (1,1) dies", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("should birth dead cell with exactly 3 neighbors (reproduction) -- [(0,0),(1,0),(0,1)] → includes (1,1)", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(next).toContainEqual([1, 1]);
  });
  it("should leave block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("should evolve blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(next).toEqual(
      expect.arrayContaining([
        [-1, 1],
        [0, 1],
        [1, 1],
      ])
    );
    expect(next).toHaveLength(3);
  });
  it("should evolve blinker from horizontal back to vertical -- [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(next).toEqual(
      expect.arrayContaining([
        [0, 0],
        [0, 1],
        [0, 2],
      ])
    );
    expect(next).toHaveLength(3);
  });
});
