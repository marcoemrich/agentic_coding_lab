import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("blinker oscillates (horizontal -> vertical)", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const next = nextGeneration(horizontal);
    expect(normalize(next)).toEqual(normalize([[0, -1], [0, 0], [0, 1]]));
  });

  it("blinker oscillates back (vertical -> horizontal)", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const next = nextGeneration(vertical);
    expect(normalize(next)).toEqual(normalize([[-1, 0], [0, 0], [1, 0]]));
  });

  it("block is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-100, -50], [-100, -51], [-100, -52]];
    const next = nextGeneration(blinker);
    expect(normalize(next)).toEqual(
      normalize([[-101, -51], [-100, -51], [-99, -51]])
    );
  });

  it("dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L-shape: three cells around (1,1)
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    // (1,1) has 3 neighbors -> alive
    const norm = normalize(next);
    expect(norm).toContain("1,1");
  });

  it("live cell with 4 neighbors dies (overpopulation)", () => {
    // Center surrounded by 4 cells diagonally + center alive
    const cells: Cell[] = [
      [0, 0],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];
    const next = nextGeneration(cells);
    const norm = normalize(next);
    expect(norm).not.toContain("0,0");
  });

  it("glider moves correctly after one generation", () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const next = nextGeneration(glider);
    expect(normalize(next)).toEqual(
      normalize([
        [0, 1],
        [2, 1],
        [1, 2],
        [2, 2],
        [1, 3],
      ])
    );
  });

  it("does not return duplicate cells", () => {
    const cells: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const next = nextGeneration(cells);
    const keys = next.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
