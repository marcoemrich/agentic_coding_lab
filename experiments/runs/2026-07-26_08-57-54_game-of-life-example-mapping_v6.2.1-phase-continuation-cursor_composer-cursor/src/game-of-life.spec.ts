import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array for empty grid -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill single isolated cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it(
    "should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] becomes []",
    () => {
      expect(
        nextGeneration([
          [0, 1],
          [1, 1],
        ]),
      ).toEqual([]);
    },
  );
  it(
    "should keep live cell with 2 neighbors (survival) -- [(0,0), (1,0), (2,0)] middle cell survives",
    () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]);
      expect(result).toContainEqual([1, 0]);
    },
  );
  it(
    "should keep live cell with 3 neighbors (survival) -- center (1,1) with 3 neighbors survives",
    () => {
      const result = nextGeneration([
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 1],
      ]);
      expect(result).toContainEqual([1, 1]);
    },
  );
  it(
    "should kill live cell with more than 3 neighbors (overpopulation) -- center (1,1) with 4 neighbors dies",
    () => {
      const result = nextGeneration([
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ]);
      expect(result).not.toContainEqual([1, 1]);
    },
  );
  it(
    "should birth dead cell with exactly 3 neighbors (reproduction) -- [(0,1), (0,2), (1,2)] becomes including (1,1)",
    () => {
      expect(
        nextGeneration([
          [0, 1],
          [0, 2],
          [1, 2],
        ]),
      ).toContainEqual([1, 1]);
    },
  );
  it(
    "should leave block pattern unchanged (still life) -- [(0,0), (1,0), (0,1), (1,1)] unchanged",
    () => {
      const block: Cell[] = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      expect(nextGeneration(block)).toEqual(block);
    },
  );
  it(
    "should oscillate blinker from vertical to horizontal -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]",
    () => {
      expect(
        nextGeneration([
          [0, 0],
          [0, 1],
          [0, 2],
        ]),
      ).toEqual([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    },
  );
  it(
    "should oscillate blinker from horizontal back to vertical -- [(-1,1), (0,1), (1,1)] becomes [(0,0), (0,1), (0,2)]",
    () => {
      expect(
        nextGeneration([
          [-1, 1],
          [0, 1],
          [1, 1],
        ]),
      ).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
    },
  );
});
