import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it(
    "should kill live cells with fewer than 2 neighbors (Rule 1: underpopulation) -- [(0,1),(1,1)] -> []",
    () => {
      expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
    },
  );
  it(
    "should let a live cell with 3 neighbors survive (Rule 2: survival) -- T-shape center (1,1) survives",
    () => {
      const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
      // Center cell (1,1) has 3 live neighbors -> survives (Rule 2)
      expect(next).toContainEqual([1, 1]);
      // (1,0) also has 3 live neighbors -> survives
      expect(next).toContainEqual([1, 0]);
    },
  );
  it(
    "should kill a live cell with more than 3 neighbors (Rule 3: overpopulation) -- 3x3 ring center (1,1) dies, corners survive",
    () => {
      const ring = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ] as Cell[];
      const next = nextGeneration(ring);
      // Center (1,1) has 4+ live neighbors -> dies (overpopulation)
      expect(next).not.toContainEqual([1, 1]);
      // Corners each have 3 live neighbors -> survive
      expect(next).toContainEqual([0, 0]);
      expect(next).toContainEqual([2, 0]);
      expect(next).toContainEqual([0, 2]);
      expect(next).toContainEqual([2, 2]);
    },
  );
  it(
    "should revive a dead cell with exactly 3 neighbors (Rule 4: reproduction) -- L-shape cell (1,1) becomes alive",
    () => {
      const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      // Dead cell (1,1) has exactly 3 live neighbors -> becomes alive
      expect(next).toContainEqual([1, 1]);
      // All three original cells have 2 live neighbors -> survive
      expect(next).toContainEqual([0, 0]);
      expect(next).toContainEqual([1, 0]);
      expect(next).toContainEqual([0, 1]);
      expect(next).toHaveLength(4);
    },
  );
  it.todo(
    "should keep a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same cells",
  );
  it.todo(
    "should rotate a blinker oscillator from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]",
  );
  it.todo(
    "should rotate a blinker back to vertical on the second generation -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]",
  );
});
