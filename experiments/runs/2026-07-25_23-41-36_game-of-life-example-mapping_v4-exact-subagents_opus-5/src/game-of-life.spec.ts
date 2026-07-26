import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const verticalBlinker: Cell[] = [
  [0, 0],
  [0, 1],
  [0, 2],
];

const horizontalBlinker: Cell[] = [
  [-1, 1],
  [0, 1],
  [1, 1],
];

const block: Cell[] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for a single live cell with no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return an empty grid for two adjacent cells that each have one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with three live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([
      1, 1,
    ]);
  });
  it("should kill a live cell with four live neighbors", () => {
    expect(
      nextGeneration([
        [1, 1],
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly three live neighbors to life", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should turn a vertical blinker into a horizontal blinker", () => {
    expect(sorted(nextGeneration(verticalBlinker))).toEqual(
      sorted(horizontalBlinker),
    );
  });
  it("should turn a horizontal blinker back into a vertical blinker", () => {
    expect(sorted(nextGeneration(horizontalBlinker))).toEqual(
      sorted(verticalBlinker),
    );
  });
  it("should leave a block unchanged", () => {
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("should compute the next generation for cells at negative coordinates", () => {
    const negativeVerticalBlinker: Cell[] = [
      [-5, -6],
      [-5, -5],
      [-5, -4],
    ];
    const negativeHorizontalBlinker: Cell[] = [
      [-6, -5],
      [-5, -5],
      [-4, -5],
    ];
    expect(sorted(nextGeneration(negativeVerticalBlinker))).toEqual(
      sorted(negativeHorizontalBlinker),
    );
  });
});
