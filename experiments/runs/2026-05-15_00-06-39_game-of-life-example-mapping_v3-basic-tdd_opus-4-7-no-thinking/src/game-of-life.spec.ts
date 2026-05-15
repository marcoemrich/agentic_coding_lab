import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

// Helper to compare arrays of cells regardless of order
function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectCellsEqual(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("Rule 1 - a single cell dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 - two adjacent cells die from underpopulation", () => {
    // [(0,1), (1,1)] each has 1 neighbor
    expectCellsEqual(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it("Rule 2 - cell with 2 neighbors survives", () => {
    // Blinker vertical: (0,0), (0,1), (0,2)
    // Center (0,1) has 2 neighbors -> survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });

  it("Rule 3 - overpopulation: cell with 4 neighbors dies", () => {
    // Gen 0:
    //  ###
    //  .#.
    //  ###
    // Cells: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // Center (1,1) has 4 neighbors -> dies
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("Rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // Gen 0:
    //  ##.
    //  #..
    //  ...
    // Cells: (0,0),(1,0),(0,1)
    // Dead cell (1,1) has 3 live neighbors -> becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  it("Blinker oscillates: vertical -> horizontal", () => {
    // Gen 0 vertical blinker: (0,0), (0,1), (0,2)
    // Gen 1 horizontal: (-1,1), (0,1), (1,1)
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expectCellsEqual(result, [[-1, 1], [0, 1], [1, 1]]);
  });

  it("Blinker oscillates back to vertical after 2 generations", () => {
    const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const gen2 = nextGeneration(gen1);
    expectCellsEqual(gen2, [[0, 0], [0, 1], [0, 2]]);
  });

  it("Block is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCellsEqual(nextGeneration(block), block);
  });

  it("dead cell with exactly 3 neighbors becomes alive (rule 4 variant)", () => {
    // Gen 0:
    //  ###
    //  ...
    //  .#.
    // Cells: (0,0),(1,0),(2,0),(1,2)
    // Dead cell (1,1) has 4 neighbors: (0,0),(1,0),(2,0),(1,2) - stays dead
    // Dead cell (0,1) has 2 neighbors - stays dead
    // (1,0) live has 2 neighbors: (0,0),(2,0) - survives
    // Actually let's just check rule 4 with the example from prompt
    // Gen 0: ##. / #.. / ...  - cells (0,0),(1,0),(0,1)
    // Dead (1,1) has 3 live neighbors -> alive
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });

  it("handles negative coordinates", () => {
    // Blinker at negative coords
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expectCellsEqual(result, [[-6, -4], [-5, -4], [-4, -4]]);
  });

  it("overpopulation full example - 3x3 ring transforms correctly", () => {
    // Gen 0:
    //  ###
    //  .#.
    //  ###
    // Center (1,1) has 6 live neighbors -> dies (overpopulation)
    // (1,0) live: neighbors (0,0),(2,0),(1,1) = 3 -> survives
    // (1,2) live: similarly survives
    // (0,0) live: neighbors (1,0),(1,1) = 2 -> survives
    // (2,0),(0,2),(2,2) corners: each has 2 live neighbors -> survives
    // (0,1) dead: 5 neighbors -> stays dead
    // (2,1) dead: 5 neighbors -> stays dead
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    // Also dead cells (1,-1) and (1,3) each have 3 live neighbors -> become alive
    const expected: Cell[] = [
      [1, -1],
      [0, 0], [1, 0], [2, 0],
      [0, 2], [1, 2], [2, 2],
      [1, 3],
    ];
    expectCellsEqual(nextGeneration(cells), expected);
  });

  it("does not mutate input array", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const copy: Cell[] = [[0, 0], [0, 1], [0, 2]];
    nextGeneration(cells);
    expect(cells).toEqual(copy);
  });

  it("handles duplicate cells in input gracefully", () => {
    // Even if duplicates exist, result should reflect logical state
    const result = nextGeneration([[0, 0], [0, 0]]);
    expect(result).toEqual([]);
  });
});
