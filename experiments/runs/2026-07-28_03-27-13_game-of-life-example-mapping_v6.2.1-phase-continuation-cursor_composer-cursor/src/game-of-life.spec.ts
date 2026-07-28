import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("Game of Life", () => {
  it("should return empty grid for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill single isolated cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it(
    "should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] becomes []",
    () => {
      expect(sorted(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
    }
  );
  it(
    "should keep live cell with 2 or 3 neighbors (survival) -- center (1,1) survives with 3 neighbors",
    () => {
      const gen0: Cell[] = [
        [0, 1],
        [1, 1],
        [2, 1],
      ];
      expect(sorted(nextGeneration(gen0))).toEqual(
        sorted([
          [1, 0],
          [1, 1],
          [1, 2],
        ])
      );
    }
  );
  it(
    "should kill live cell with more than 3 neighbors (overpopulation) -- center (1,1) dies with 4 neighbors",
    () => {
      const gen0: Cell[] = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 1],
      ];
      const result = sorted(nextGeneration(gen0));
      expect(result).not.toContainEqual([1, 1]);
      expect(result).toHaveLength(8);
    }
  );
  it(
    "should birth dead cell with exactly 3 neighbors (reproduction) -- (1,1) becomes alive",
    () => {
      const gen0: Cell[] = [
        [0, 1],
        [0, 2],
        [1, 2],
      ];
      expect(sorted(nextGeneration(gen0))).toEqual(
        sorted([
          [0, 1],
          [0, 2],
          [1, 1],
          [1, 2],
        ])
      );
    }
  );
  it(
    "should leave block pattern unchanged (still life) -- [(0,0), (1,0), (0,1), (1,1)] unchanged",
    () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expect(sorted(nextGeneration(block))).toEqual(sorted(block));
    }
  );
  it(
    "should evolve blinker horizontally to vertical -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]",
    () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      expect(sorted(nextGeneration(gen0))).toEqual(
        sorted([
          [-1, 1],
          [0, 1],
          [1, 1],
        ])
      );
    }
  );
  it(
    "should evolve blinker vertical back to horizontal -- [(-1,1), (0,1), (1,1)] becomes [(0,0), (0,1), (0,2)]",
    () => {
      const gen0: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      expect(sorted(nextGeneration(gen0))).toEqual(
        sorted([
          [0, 0],
          [0, 1],
          [0, 2],
        ])
      );
    }
  );
});
