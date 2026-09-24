import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sorted = (cells: Cell[]): Cell[] => cells.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("nextGeneration", () => {
  it("empty living-cell grid remains empty: [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell (0,0) with zero neighbors dies: []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells (0,1),(1,1) each with one neighbor die: []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live center (1,1) with two neighbors survives: (1,1) remains alive", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("live center (1,1) with three neighbors survives: (1,1) remains alive (Rule 2 prose)", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("live center (1,1) with four neighbors dies: (1,1) is absent (Rule 3 prose)", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]])).not.toContainEqual([1, 1]);
  });
  it("dead cell (1,1) with three neighbors (0,1),(1,0),(0,0) is born: (1,1) is alive", () => {
    expect(nextGeneration([[0, 1], [1, 0], [0, 0]])).toContainEqual([1, 1]);
  });
  it("reproduction example (0,0),(1,0),(0,1) → (0,0),(1,0),(0,1),(1,1)", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("dead cell with two neighbors remains dead: (1,1) is absent", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).not.toContainEqual([1, 1]);
  });
  it("dead cell with four neighbors remains dead: (1,1) is absent", () => {
    expect(nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("block (0,0),(1,0),(0,1),(1,1) remains unchanged after one generation", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("vertical blinker (0,0),(0,1),(0,2) becomes (-1,1),(0,1),(1,1)", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("horizontal blinker (-1,1),(0,1),(1,1) becomes (0,0),(0,1),(0,2) in generation two", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(nextGeneration(first))).toEqual(sorted([[0, 0], [0, 1], [0, 2]]));
  });
  it("translated blinker in negative x and y crosses negative coordinates without grid bounds", () => {
    expect(sorted(nextGeneration([[-100, -101], [-100, -100], [-100, -99]]))).toEqual(
      sorted([[-101, -100], [-100, -100], [-99, -100]])
    );
  });
});
