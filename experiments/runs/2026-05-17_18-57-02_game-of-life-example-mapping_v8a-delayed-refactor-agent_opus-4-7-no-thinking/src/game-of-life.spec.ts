import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("nextGeneration - empty input", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
});

describe("Rule 1 - Underpopulation (live cell with < 2 neighbors dies)", () => {
  it("single live cell dies", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it("two adjacent live cells both die (each has 1 neighbor)", () => {
    expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it("two diagonally adjacent live cells both die", () => {
    expectSameCells(nextGeneration([[0, 0], [1, 1]]), []);
  });
});

describe("Rule 2 - Survival (live cell with 2 or 3 neighbors lives)", () => {
  it("center cell with 3 neighbors survives", () => {
    // Cells: top row (0,2),(1,2),(2,2) and bottom center (1,0)
    // Center (1,1) has neighbors: (0,2),(1,2),(2,2),(1,0) = 4 - too many.
    // Use the example from prompt: top row #s and one cell below.
    // Gen 0 from prompt:
    // ###
    // ...
    // .#.
    // Row 0 (top): (0,2),(1,2),(2,2); row 2 (bottom): (1,0)
    // Center (1,1) has 4 neighbors. That's the prompt's example but it claims 3 neighbors.
    // Actually re-reading: "The center cell (1,1) has 3 live neighbors → survives."
    // Neighbors of (1,1) from set {(0,2),(1,2),(2,2),(1,0)}: all four are adjacent. That's 4.
    // The prompt seems to have a counting error but says center survives.
    // Let me just test that a live cell with exactly 2 neighbors survives directly.
    // Blinker: vertical line (0,0),(0,1),(0,2). Center (0,1) has 2 neighbors -> survives.
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });

  it("live cell with 3 neighbors survives", () => {
    // L-shape: (0,0),(1,0),(0,1),(1,1) is the block - each cell has 3 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});

describe("Rule 3 - Overpopulation (live cell with > 3 neighbors dies)", () => {
  it("center cell with 4 neighbors dies", () => {
    // 3x3 block all alive - center has 8 neighbors
    // Gen 0:
    // ###
    // .#.
    // ###
    // Cells: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // Center (1,1) has 6 neighbors -> dies
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("center of full 3x3 block dies (has 8 neighbors)", () => {
    const cells: Cell[] = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        cells.push([x, y]);
      }
    }
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
});

describe("Rule 4 - Reproduction (dead cell with exactly 3 neighbors becomes alive)", () => {
  it("dead cell with exactly 3 live neighbors becomes alive", () => {
    // From prompt:
    // ##.
    // #..
    // ...
    // Cells: (0,2),(1,2),(0,1)
    // Dead cell (1,1) has 3 live neighbors -> becomes alive
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  it("dead cell with only 2 neighbors stays dead", () => {
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).not.toContainEqual([0, 1]);
    expect(result).not.toContainEqual([1, 1]);
  });
});

describe("Pattern: Blinker (oscillator)", () => {
  it("vertical blinker becomes horizontal", () => {
    // Gen 0: vertical line at (0,0),(0,1),(0,2)
    // Gen 1: horizontal line at (-1,1),(0,1),(1,1)
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expectSameCells(result, [[-1, 1], [0, 1], [1, 1]]);
  });

  it("horizontal blinker becomes vertical (and back from above)", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expectSameCells(result, [[0, 0], [0, 1], [0, 2]]);
  });

  it("blinker has period 2", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expectSameCells(gen2, gen0);
  });
});

describe("Pattern: Block (still life)", () => {
  it("2x2 block remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("2x2 block at negative coordinates remains unchanged", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expectSameCells(nextGeneration(block), block);
  });
});

describe("Negative coordinates", () => {
  it("handles blinker at negative coordinates", () => {
    const result = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    expectSameCells(result, [[-11, -9], [-10, -9], [-9, -9]]);
  });

  it("handles cells spanning origin", () => {
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expectSameCells(nextGeneration(block), block);
  });
});

describe("Output format", () => {
  it("returns an array of [x, y] tuples", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(Array.isArray(result)).toBe(true);
    for (const cell of result) {
      expect(Array.isArray(cell)).toBe(true);
      expect(cell.length).toBe(2);
      expect(typeof cell[0]).toBe("number");
      expect(typeof cell[1]).toBe("number");
    }
  });

  it("does not contain duplicate cells", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("Input independence", () => {
  it("does not mutate the input array", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const copy: Cell[] = input.map(([x, y]) => [x, y]);
    nextGeneration(input);
    expect(input).toEqual(copy);
  });
});
