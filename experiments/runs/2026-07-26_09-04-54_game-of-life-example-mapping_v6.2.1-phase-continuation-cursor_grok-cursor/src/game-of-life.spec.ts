import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it(
    "two adjacent live cells die (underpopulation, rule 1) -- [(0,1), (1,1)] → []",
    () => {
      expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
    },
  );
  it(
    "dead cell with exactly 3 live neighbors becomes alive (reproduction, rule 4) -- [(0,0), (1,0), (0,1)] → includes (1,1)",
    () => {
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      expect(result).toEqual(
        expect.arrayContaining([[1, 1], [0, 0], [1, 0], [0, 1]]),
      );
      expect(result).toHaveLength(4);
    },
  );
  it(
    "live cell with 3 neighbors survives (survival, rule 2) -- center (1,1) of ### / ... / .#. pattern lives on",
    () => {
      // (1,1) has neighbors (0,1), (2,1), (1,0) — exactly 3 → survives
      const result = nextGeneration([
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 0],
      ]);
      expect(result).toEqual(expect.arrayContaining([[1, 1]]));
    },
  );
  it(
    "live cell with more than 3 neighbors dies (overpopulation, rule 3) -- center (1,1) of ### / .#. / ### dies",
    () => {
      // Plus shape: (1,1) has 4 live neighbors → dies
      const result = nextGeneration([
        [1, 2],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 0],
      ]);
      expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    },
  );
  it(
    "block still life remains unchanged -- [(0,0), (1,0), (0,1), (1,1)] → same cells",
    () => {
      const block: [number, number][] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(block);
      expect(result).toHaveLength(4);
      expect(result).toEqual(expect.arrayContaining(block));
    },
  );
  it(
    "blinker oscillator gen 0 to gen 1 -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]",
    () => {
      const result = nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          [-1, 1],
          [0, 1],
          [1, 1],
        ]),
      );
    },
  );
  it(
    "blinker oscillator gen 1 to gen 2 returns to vertical -- [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]",
    () => {
      const result = nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          [0, 0],
          [0, 1],
          [0, 2],
        ]),
      );
    },
  );
});
