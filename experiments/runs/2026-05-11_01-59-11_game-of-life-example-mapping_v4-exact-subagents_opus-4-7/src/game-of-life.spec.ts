import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty set when given empty set", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a live cell with two live neighbors (survival)", () => {
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("should keep alive a live cell with three live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than three live neighbors (overpopulation)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring to life a dead cell with exactly three live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should preserve a block still life unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    const expectedSet = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(resultSet).toEqual(expectedSet);
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    const expectedSet = new Set(["-1,1", "0,1", "1,1"]);
    expect(resultSet).toEqual(expectedSet);
  });
  it("should support negative coordinates", () => {
    const result = nextGeneration([[-5, -5], [-4, -5], [-5, -4], [-4, -4]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    const expectedSet = new Set(["-5,-5", "-4,-5", "-5,-4", "-4,-4"]);
    expect(resultSet).toEqual(expectedSet);
  });
});
