import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - next generation", () => {
  it("returns no living cells when the generation is empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each by underpopulation -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with three live neighbors by survival -- center (1,1) remains alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills a live cell with more than three neighbors by overpopulation -- center (1,1) dies", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]])).not.toContainEqual([1, 1]);
  });
  it("creates a dead cell with exactly three neighbors by reproduction -- (1,1) becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("keeps a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("turns a vertical blinker into a horizontal blinker across negative coordinates -- [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(result)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns the horizontal blinker back into the original vertical blinker after generation two -- [(0,0),(0,1),(0,2)]", () => {
    const generationZero: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(nextGeneration(generationZero)))).toEqual(sorted(generationZero));
  });
});
