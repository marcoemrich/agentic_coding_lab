// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single cell die (underpopulation: 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two neighboring cells die (underpopulation: 1 neighbor each)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ])
    ).toEqual([]);
  });
  it("should keep a live cell with 2 live neighbors alive (survival)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ])
    ).toContainEqual([0, 1]);
  });
  it("should keep a live cell with 3 live neighbors alive (survival)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ])
    ).toContainEqual([1, 1]);
  });
  it("should let a live cell with 4 live neighbors die (overpopulation)", () => {
    expect(
      nextGeneration([
        [1, 1],
        [0, 1],
        [2, 1],
        [1, 0],
        [1, 2],
      ])
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ])
    ).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should oscillate a vertical blinker to a horizontal blinker (negative coordinates)", () => {
    const verticalBlinker: [number, number][] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});
