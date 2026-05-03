import { describe, it, expect } from "vitest";
import {
  Cell,
  cellKey,
  nextGeneration,
  nextGenerationFromCells,
  toLivingCells,
} from "./game-of-life.js";

function setOfKeys(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => cellKey(x, y)));
}

describe("Game of Life", () => {
  it("an empty grid stays empty", () => {
    const next = nextGeneration(new Set<string>());
    expect(next.size).toBe(0);
  });

  it("a single cell dies from underpopulation", () => {
    const living = toLivingCells([[0, 0]]);
    const next = nextGeneration(living);
    expect(next.size).toBe(0);
  });

  it("two adjacent cells both die from underpopulation", () => {
    const living = toLivingCells([
      [0, 0],
      [1, 0],
    ]);
    const next = nextGeneration(living);
    expect(next.size).toBe(0);
  });

  it("a living cell with two live neighbors survives", () => {
    // A horizontal blinker: middle cell has 2 neighbors
    const living = toLivingCells([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    const next = nextGeneration(living);
    // Middle cell (1,0) survives
    expect(next.has(cellKey(1, 0))).toBe(true);
  });

  it("a living cell with three live neighbors survives", () => {
    // L-shape: (0,0), (1,0), (0,1) all have 2 neighbors,
    // and (1,1) is dead with 3 neighbors so it becomes alive
    const living = toLivingCells([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    const next = nextGeneration(living);
    expect(next.has(cellKey(0, 0))).toBe(true);
    expect(next.has(cellKey(1, 0))).toBe(true);
    expect(next.has(cellKey(0, 1))).toBe(true);
    expect(next.has(cellKey(1, 1))).toBe(true);
  });

  it("a living cell with more than three neighbors dies (overpopulation)", () => {
    // Center cell with 4 neighbors
    const living = toLivingCells([
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
    const next = nextGeneration(living);
    expect(next.has(cellKey(0, 0))).toBe(false);
  });

  it("a dead cell with exactly three neighbors becomes alive (reproduction)", () => {
    const living = toLivingCells([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    const next = nextGeneration(living);
    // (1,1) is dead but has exactly 3 live neighbors
    expect(next.has(cellKey(1, 1))).toBe(true);
  });

  it("a dead cell with two live neighbors stays dead", () => {
    const living = toLivingCells([
      [0, 0],
      [2, 0],
    ]);
    const next = nextGeneration(living);
    expect(next.has(cellKey(1, 0))).toBe(false);
  });

  it("blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const next1 = setOfKeys(nextGenerationFromCells(horizontal));
    const expectedVertical = setOfKeys([
      [1, -1],
      [1, 0],
      [1, 1],
    ]);
    expect(next1).toEqual(expectedVertical);

    // Apply once more should give back horizontal
    const next2 = setOfKeys(
      nextGenerationFromCells([
        [1, -1],
        [1, 0],
        [1, 1],
      ])
    );
    expect(next2).toEqual(setOfKeys(horizontal));
  });

  it("block (still life) is unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const next = setOfKeys(nextGenerationFromCells(block));
    expect(next).toEqual(setOfKeys(block));
  });

  it("handles negative coordinates correctly", () => {
    const living = toLivingCells([
      [-1, -1],
      [0, -1],
      [1, -1],
    ]);
    const next = nextGeneration(living);
    // Vertical blinker at column 0: (-1, 0), (0, -1), (0, 0), (0, -2)... wait
    // Horizontal blinker at row -1 -> vertical at column 0, rows -2,-1,0
    expect(next.has(cellKey(0, -2))).toBe(true);
    expect(next.has(cellKey(0, -1))).toBe(true);
    expect(next.has(cellKey(0, 0))).toBe(true);
    expect(next.size).toBe(3);
  });

  it("glider moves diagonally after 4 generations", () => {
    // Standard glider
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      cells = nextGenerationFromCells(cells);
    }
    // After 4 generations, glider has translated by (1,1)
    const expected = setOfKeys([
      [2, 1],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
    expect(setOfKeys(cells)).toEqual(expected);
  });

  it("does not return cells that have no live neighbors", () => {
    const living = toLivingCells([
      [0, 0],
      [100, 100],
    ]);
    const next = nextGeneration(living);
    expect(next.size).toBe(0);
  });
});
