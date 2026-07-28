import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it(
    "should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] becomes []",
    () => {
      expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
    },
  );
  it(
    "should keep live cell alive with 2 or 3 neighbors (survival) -- center (1,1) survives in horizontal bar pattern",
    () => {
      const gen0: [number, number][] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toContainEqual([1, 1]);
    },
  );
  it(
    "should kill live cell with more than 3 neighbors (overpopulation) -- center (1,1) dies in cross pattern",
    () => {
      const gen0: [number, number][] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ];
      const gen1 = nextGeneration(gen0);
      expect(gen1).not.toContainEqual([1, 1]);
    },
  );
  it(
    "should birth dead cell with exactly 3 live neighbors (reproduction) -- (1,1) becomes alive",
    () => {
      const gen0: [number, number][] = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toContainEqual([1, 1]);
    },
  );
  it(
    "should leave block pattern unchanged (still life) -- [(0,0), (1,0), (0,1), (1,1)] unchanged",
    () => {
      const block: [number, number][] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expect(nextGeneration(block)).toEqual(block);
    },
  );
  it(
    "should oscillate blinker horizontally -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]",
    () => {
      const gen0: [number, number][] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toEqual([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    },
  );
});
