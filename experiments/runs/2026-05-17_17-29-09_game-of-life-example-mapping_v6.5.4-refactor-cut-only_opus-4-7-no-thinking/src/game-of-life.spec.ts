import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with only 1 neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged as a still life (survival)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("should transform a vertical blinker into a horizontal blinker (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(vertical).map((c) => c.join(",")))).toEqual(
      new Set(horizontal.map((c) => c.join(","))),
    );
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = new Set(nextGeneration(input).map((c) => c.join(",")));
    expect(result.has("1,1")).toBe(false);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = new Set(nextGeneration(input).map((c) => c.join(",")));
    expect(result.has("1,1")).toBe(true);
  });
  it("should handle negative coordinates", () => {
    const verticalBlinker: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const expectedHorizontal: [number, number][] = [[-6, 0], [-5, 0], [-4, 0]];
    expect(new Set(nextGeneration(verticalBlinker).map((c) => c.join(",")))).toEqual(
      new Set(expectedHorizontal.map((c) => c.join(","))),
    );
  });
});
