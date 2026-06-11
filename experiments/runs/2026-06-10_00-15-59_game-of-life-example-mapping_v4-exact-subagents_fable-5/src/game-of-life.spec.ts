// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single cell die (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two neighboring cells die, each having only 1 neighbor (underpopulation)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should let a live cell with 3 live neighbors survive (survival)", () => {
    // Gen 0:        Gen 1 (at minimum):
    //  ###           (1,1) survives — it has exactly
    //  .#.           3 live neighbors: (0,0),(1,0),(2,0)
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should let a live cell with 4 live neighbors die (overpopulation)", () => {
    // Gen 0:        Center (1,1) has exactly 4 live
    //  #.#          neighbors: (0,0),(2,0),(0,2),(2,2)
    //  .#.          → dies of overpopulation
    //  #.#
    expect(
      nextGeneration([
        [1, 1],
        [0, 0],
        [2, 0],
        [0, 2],
        [2, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // Gen 0:        Gen 1:
    //  ##.           ##.
    //  #..     →     ##.
    //  ...           ...
    // Dead cell (1,1) has exactly 3 live neighbors: (0,0),(1,0),(0,1)
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker from vertical to horizontal, producing negative coordinates", () => {
    // Gen 0 (vertical):   Gen 1 (horizontal):
    //  .#.                 ...
    //  .#.          →      ###   ← includes negative x at (-1,1)
    //  .#.                 ...
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [0, 1],
          [0, 2],
        ]),
      ),
    ).toEqual(
      sorted([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("should keep a block (still life) unchanged", () => {
    // Gen 0:        Gen 1:
    //  ##            ##    ← every cell has exactly 3 live
    //  ##            ##      neighbors, no dead cell has 3
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ]),
      ),
    ).toEqual(
      sorted([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  // NOT: input validation, duplicate-cell handling, performance,
  // other patterns (glider, toad, etc.) - not in the spec
});
