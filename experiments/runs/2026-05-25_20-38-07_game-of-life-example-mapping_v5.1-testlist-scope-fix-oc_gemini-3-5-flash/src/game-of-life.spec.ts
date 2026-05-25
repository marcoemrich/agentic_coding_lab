import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Empty & Single Cell (simplest cases)
  it("empty grid should return empty -- nextGeneration([]) -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies -- nextGeneration([[0,0]]) -> []", () => {
    expect(nextGeneration([[0,0]])).toEqual([]);
  });

  // Rule 1: Underpopulation (< 2 neighbors dies)
  it("underpopulation: two horizontal adjacent cells die -- nextGeneration([[0,1], [1,1]]) -> []", () => {
    expect(nextGeneration([[0,1], [1,1]])).toEqual([]);
  });

  // Rule 2: Survival (2 or 3 neighbors lives on)
  it("survival: cell with 3 live neighbors lives on -- nextGeneration([[0,1], [1,1], [2,1], [1,0]]) -> includes [1,1]", () => {
    const result = nextGeneration([[0,1], [1,1], [2,1], [1,0]]);
    const hasCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCell).toBe(true);
  });

  // Rule 3: Overpopulation (> 3 neighbors dies)
  it("overpopulation: cell with 4 live neighbors dies -- nextGeneration([[0,1], [1,1], [2,1], [1,0], [1,2]]) -> does not include [1,1]", () => {
    const result = nextGeneration([[0,1], [1,1], [2,1], [1,0], [1,2]]);
    const hasCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCell).toBe(false);
  });

  // Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("reproduction: dead cell with 3 live neighbors becomes alive -- nextGeneration([[0,1], [1,1], [0,0]]) -> includes [1,0]", () => {
    const result = nextGeneration([[0,1], [1,1], [0,0]]);
    const hasCell = result.some(([x, y]) => x === 1 && y === 0);
    expect(hasCell).toBe(true);
  });

  // Pattern Examples
  it("blinker oscillator: three vertical cells rotate to horizontal -- nextGeneration([[0,0], [0,1], [0,2]]) -> [[-1,1], [0,1], [1,1]]", () => {
    const result = nextGeneration([[0,0], [0,1], [0,2]]);
    const sortedResult = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortedResult).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("block still life: four cells forming a 2x2 block remain unchanged -- nextGeneration([[0,0], [1,0], [0,1], [1,1]]) -> [[0,0], [1,0], [0,1], [1,1]]", () => {
    const result = nextGeneration([[0,0], [1,0], [0,1], [1,1]]);
    // Ensure both arrays are sorted the exact same way for comparison.
    // [0,0], [1,0], [0,1], [1,1] in sorting order (a[0] - b[0] || a[1] - b[1]) is:
    // [0,0] (x=0, y=0)
    // [0,1] (x=0, y=1)
    // [1,0] (x=1, y=0)
    // [1,1] (x=1, y=1)
    // So expected sorted output should be [[0, 0], [0, 1], [1, 0], [1, 1]]
    const sortedResult = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortedResult).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
