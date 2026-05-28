import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid given empty input -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with fewer than 2 live neighbors (underpopulation) -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a live cell with 2 live neighbors (survival)", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(cells);
    expect(result.length).toBe(3);
    expect(result).toEqual(expect.arrayContaining([[1, 0], [1, -1], [1, 1]]));
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    const cells: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("should revive a dead cell with exactly 3 live neighbors (reproduction)", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result.length).toBe(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep a 2x2 block unchanged as a still life -- [(0,0), (1,0), (0,1), (1,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(result.length).toBe(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should transform a horizontal blinker to vertical blinker (oscillator) -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(cells);
    expect(result.length).toBe(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
});