import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("single cell dies (underpopulation, 0 neighbors) -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells die (underpopulation, 1 neighbor each) -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("cell with 2 neighbors survives (survival) -- still present in next generation", () => {
    // L-shape: cell (0,0) has neighbors (1,0) and (0,1)
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    expect(next).toContainEqual([0, 0]);
  });
  it("cell with 3 neighbors survives (survival) -- still present in next generation", () => {
    // Horizontal line of 3: center cell (1,1) has 2 neighbors
    // Let's use a 2x2 block minus one: cells (0,0),(1,0),(0,1),(1,1) each have 3 neighbors
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(cells);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([1, 0]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([1, 1]);
  });
  it("cell with 4 neighbors dies (overpopulation) -- absent in next generation", () => {
    // Cross pattern: center (0,0) has 4 neighbors
    const cells: [number, number][] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    const next = nextGeneration(cells);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) -- new cell present", () => {
    // L-shape: dead cell at (1,1) should become alive
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    expect(next).toContainEqual([1, 1]);
  });
  it("block still life (each cell has 3 neighbors) -- unchanged", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(cells);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([1, 0]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([1, 1]);
    expect(next).toHaveLength(4);
  });
  it("blinker oscillator from horizontal -- vertical line", () => {
    const gen0: [number, number][] = [([-1, 0] as [number,number]), ([0, 0] as [number,number]), ([1, 0] as [number,number])];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([0, -1]);
    expect(gen1).toContainEqual([0, 0]);
    expect(gen1).toContainEqual([0, 1]);
    expect(gen1).toHaveLength(3);
  });
  it("blinker oscillator from vertical -- horizontal line", () => {
    const gen1: [number, number][] = [([0, -1] as [number,number]), ([0, 0] as [number,number]), ([0, 1] as [number,number])];
    const gen2 = nextGeneration(gen1);
    expect(gen2).toContainEqual([-1, 0]);
    expect(gen2).toContainEqual([0, 0]);
    expect(gen2).toContainEqual([1, 0]);
    expect(gen2).toHaveLength(3);
  });
});
