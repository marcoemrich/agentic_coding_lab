import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it(
    "two adjacent live cells die from underpopulation (Rule 1) -- [(0,1), (1,1)] → []",
    () => {
      expect(
        nextGeneration([
          [0, 1],
          [1, 1],
        ])
      ).toEqual([]);
    }
  );
  it(
    "dead cell with exactly 3 neighbors becomes alive (Rule 4) -- [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]",
    () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]);
      expect(result).toEqual(
        expect.arrayContaining([
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ])
      );
      expect(result).toHaveLength(4);
    }
  );
  it(
    "live cell with 2 neighbors survives (Rule 2) -- [(0,0), (1,0), (2,0), (1,2)] → [(1,0), (0,1), (2,1), (1,-1)]",
    () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 2],
      ]);
      expect(result).toEqual(
        expect.arrayContaining([
          [1, 0],
          [0, 1],
          [2, 1],
          [1, -1],
        ])
      );
      expect(result).toHaveLength(4);
      expect(result).toContainEqual([1, 0]); // survival with 2 neighbors
    }
  );
  it(
    "live cell with more than 3 neighbors dies from overpopulation (Rule 3) -- center (1,1) dies",
    () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ]);
      expect(result).not.toContainEqual([1, 1]);
      expect(result).toEqual(
        expect.arrayContaining([
          [0, 0],
          [2, 0],
          [0, 2],
          [2, 2],
          [1, -1],
          [1, 3],
          [1, 0],
          [1, 2],
        ])
      );
      expect(result).toHaveLength(8);
    }
  );
  it(
    "block still life remains unchanged -- [(0,0), (1,0), (0,1), (1,1)] → same cells",
    () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
      expect(result).toEqual(
        expect.arrayContaining([
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ])
      );
      expect(result).toHaveLength(4);
    }
  );
  it(
    "blinker oscillates horizontally to vertically -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]",
    () => {
      const result = nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
      expect(result).toEqual(
        expect.arrayContaining([
          [-1, 1],
          [0, 1],
          [1, 1],
        ])
      );
      expect(result).toHaveLength(3);
    }
  );
});
