import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function sorted(cells: [number, number][]): [number, number][] {
  return [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

describe("Game of Life - nextGeneration", () => {
  it("should return empty grid for empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with 0 neighbors (underpopulation) -- [(0,0)] -> []", () => {
    expect(sorted(nextGeneration([[0, 0]]))).toEqual(sorted([]));
  });
  it("should kill two adjacent cells each with 1 neighbor (underpopulation) -- [(0,0),(1,0)] -> []", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0]]))).toEqual(sorted([]));
  });
  it("should kill center cell with 4 neighbors (overpopulation) and outer cells with 1 neighbor (underpopulation), and reproduce at diagonal dead cells with 3 neighbors", () => {
    const input: [number, number][] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    const expected: [number, number][] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(input))).toEqual(sorted(expected));
  });
  it("should keep three L-shaped cells alive with 2 neighbors each, and reproduce dead cell with 3 neighbors -- [(0,0),(0,1),(1,0)] -> [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [1, 0]]))).toEqual(sorted([[0, 0], [0, 1], [1, 0], [1, 1]]));
  });
  it("should keep 2x2 block unchanged (still life) -- [(0,0),(0,1),(1,0),(1,1)] -> same", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1]]))).toEqual(sorted([[0, 0], [0, 1], [1, 0], [1, 1]]));
  });
  it("should transform vertical blinker to horizontal blinker (oscillator) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
});