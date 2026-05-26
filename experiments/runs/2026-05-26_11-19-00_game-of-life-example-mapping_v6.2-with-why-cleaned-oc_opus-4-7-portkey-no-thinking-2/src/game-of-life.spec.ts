import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation, 1 neighbor each) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
    expect(result).toHaveLength(4);
  });
  it("live cell with > 3 neighbors dies (overpopulation) -- center (1,1) of Rule 3 example dies; corner (0,0) survives", () => {
    // Gen 0: ###/.#./###  -> 7 cells
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    const resultSet = new Set(result.map(c => c.join(",")));
    // Rule 3: center dies (had 6 neighbors)
    expect(resultSet.has("1,1")).toBe(false);
    // Corner (0,0) had 2 neighbors (1,0) and (1,1) -> survives (Rule 2)
    expect(resultSet.has("0,0")).toBe(true);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) -- L-shape produces block", () => {
    // Gen 0: (0,0),(1,0),(0,1) -> Gen 1: block (0,0),(1,0),(0,1),(1,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const resultSet = new Set(result.map(c => c.join(",")));
    expect(resultSet).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("blinker oscillates vertical -> horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const resultSet = new Set(result.map(c => c.join(",")));
    expect(resultSet).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("handles negative coordinates -- horizontal blinker at origin -> vertical", () => {
    // Horizontal blinker [(-1,0),(0,0),(1,0)] -> Vertical [(0,-1),(0,0),(0,1)]
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    const resultSet = new Set(result.map(c => c.join(",")));
    expect(resultSet).toEqual(new Set(["0,-1", "0,0", "0,1"]));
  });
});
