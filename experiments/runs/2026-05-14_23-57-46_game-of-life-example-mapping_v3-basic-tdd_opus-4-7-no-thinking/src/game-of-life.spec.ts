import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function normalize(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("rule 1 - single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("rule 1 - two adjacent live cells both die (underpopulation)", () => {
    const result = nextGeneration([
      [0, 1],
      [1, 1],
    ]);
    expect(result).toEqual([]);
  });

  it("rule 2 - cell with 2 neighbors survives", () => {
    // Blinker horizontal -> vertical
    // Gen 0: (-1,1), (0,1), (1,1)
    // Gen 1: (0,0), (0,1), (0,2)
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(normalize(result)).toEqual(
      normalize([
        [0, 0],
        [0, 1],
        [0, 2],
      ])
    );
  });

  it("rule 3 - overpopulation: cell with > 3 neighbors dies", () => {
    // Gen 0:
    //  ###
    //  .#.
    //  ###
    // Center (1,1) has 4 neighbors -> dies
    // Actually with full 8-cell config, let's verify
    // Cells: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // Wait, original example has 8 cells around plus center
    // ###
    // .#.
    // ###
    // means (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // Center (1,1) has neighbors: (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) = 6 neighbors -> dies
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const result = nextGeneration(cells);
    // (1,1) should not be in result
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it("rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // Gen 0:
    //  ##.
    //  #..
    //  ...
    // Cells: (0,0),(1,0),(0,1)
    // Dead cell (1,1) has 3 live neighbors -> becomes alive
    // Result should be:
    //  ##.
    //  ##.
    //  ...
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(normalize(result)).toEqual(
      normalize([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ])
    );
  });

  it("block pattern is stable (still life)", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });

  it("blinker oscillates correctly", () => {
    // Vertical blinker -> horizontal
    const vertical: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const horizontal: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(normalize(nextGeneration(vertical))).toEqual(normalize(horizontal));
    expect(normalize(nextGeneration(horizontal))).toEqual(normalize(vertical));
  });

  it("handles negative coordinates", () => {
    // Block in negative coords
    const block: Cell[] = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });

  it("does not contain duplicates in output", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    const seen = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(seen.size).toBe(result.length);
  });
});
