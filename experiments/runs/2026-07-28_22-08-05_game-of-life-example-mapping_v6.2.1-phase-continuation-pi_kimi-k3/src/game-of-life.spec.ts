import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it(
    "should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1),(1,1)] -> []",
    () => {
      expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
    },
  );
  it(
    "should revive a dead cell with exactly 3 live neighbors (reproduction) -- [(0,0),(1,0),(0,1)] -> adds (1,1)",
    () => {
      const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      expect(next).toHaveLength(4);
      expect(next).toContainEqual([0, 0]);
      expect(next).toContainEqual([1, 0]);
      expect(next).toContainEqual([0, 1]);
      expect(next).toContainEqual([1, 1]);
    },
  );
  it(
    "should keep a live cell with 2 or 3 live neighbors alive (survival) -- center (1,1) with 3 neighbors survives",
    () => {
      // Gen 0: row0 ###, row2 .#. -> center (1,1) has 3 live neighbors
      const next = nextGeneration([
        [0, 0], [1, 0], [2, 0],
        [1, 2],
      ]);
      expect(next).toContainEqual([1, 1]);
      expect(next).toContainEqual([1, 0]);
      expect(next).toContainEqual([1, 2]);
      expect(next).toHaveLength(3);
    },
  );
  it.todo(
    "should kill a live cell with more than 3 live neighbors (overpopulation) -- center (1,1) with 4 neighbors dies",
  );
  it.todo(
    "should keep a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same",
  );
  it.todo(
    "should rotate a blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]",
  );
  it.todo(
    "should rotate a blinker from horizontal back to vertical -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]",
  );
  it.todo(
    "should handle negative coordinates -- block at [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] stays unchanged",
  );
});
