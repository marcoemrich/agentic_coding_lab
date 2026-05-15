import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("block (still life) remains stable", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });

  it("blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expect(normalize(nextGeneration(horizontal))).toEqual(normalize(vertical));
    expect(normalize(nextGeneration(vertical))).toEqual(normalize(horizontal));
  });

  it("blinker returns to original after two generations", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const next1 = nextGeneration(horizontal);
    const next2 = nextGeneration(next1);
    expect(normalize(next2)).toEqual(normalize(horizontal));
  });

  it("dead cell with exactly three live neighbors becomes alive", () => {
    // L-shape: cells at (0,0), (1,0), (0,1). Cell (1,1) has 3 neighbors -> born.
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });

  it("handles negative coordinates correctly (blinker around origin)", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expect(normalize(nextGeneration(horizontal))).toEqual(normalize(vertical));
  });

  it("handles large coordinates", () => {
    const block: Cell[] = [
      [1000000, 1000000],
      [1000001, 1000000],
      [1000000, 1000001],
      [1000001, 1000001],
    ];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });

  it("live cell with four or more live neighbors dies (overpopulation)", () => {
    // Center cell at (0,0) surrounded by 4 neighbors
    const input: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const result = nextGeneration(input);
    const keys = normalize(result);
    expect(keys).not.toContain("0,0");
  });

  it("does not produce duplicate cells", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(input);
    const keys = normalize(result);
    const unique = new Set(keys);
    expect(keys.length).toBe(unique.size);
  });

  it("glider moves diagonally after 4 generations", () => {
    // Classic glider
    let cells: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    for (let i = 0; i < 4; i++) {
      cells = nextGeneration(cells);
    }
    // After 4 generations, glider should be translated by (1, 1)
    const expected: Cell[] = [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]];
    expect(normalize(cells)).toEqual(normalize(expected));
  });
});
