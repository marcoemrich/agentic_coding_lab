// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single cell die (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two neighboring cells die (underpopulation, 1 neighbor each)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ])
    ).toEqual([]);
  });
  it("should keep a live cell with 3 live neighbors alive (survival)", () => {
    // ###   <- (0,0), (1,0), (2,0)
    // .#.   <- (1,1) has exactly 3 live neighbors -> survives
    const nextGen = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(nextGen).toContainEqual([1, 1]);
  });
  it("should let a live cell with 4 live neighbors die (overpopulation)", () => {
    // ###   <- (0,0), (1,0), (2,0)
    // .#.   <- (1,1) has 4 live neighbors -> dies
    // ###   <- (0,2), (1,2), (2,2)
    const nextGen = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(nextGen).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // ##.   <- (0,0), (1,0)
    // #..   <- (0,1); dead cell (1,1) has exactly 3 live neighbors -> comes to life
    const nextGen = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(nextGen).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged", () => {
    // ##   <- (0,0), (1,0)
    // ##   <- (0,1), (1,1); every cell has exactly 3 neighbors -> block stays
    const nextGen = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(nextGen).toHaveLength(4);
    expect(nextGen).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ])
    );
  });
  it("should oscillate a vertical blinker to a horizontal blinker (negative coordinates)", () => {
    // .#.   <- (0,0)
    // .#.   <- (0,1)
    // .#.   <- (0,2)
    // becomes a horizontal blinker at y=1: (-1,1), (0,1), (1,1)
    const nextGen = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(nextGen).toHaveLength(3);
    expect(nextGen).toEqual(
      expect.arrayContaining([
        [-1, 1],
        [0, 1],
        [1, 1],
      ])
    );
  });
});
