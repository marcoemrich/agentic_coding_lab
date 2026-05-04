import { describe, it, expect } from "vitest";
import { GameOfLife } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should create empty grid", () => {
    const gol = new GameOfLife();
    expect(gol.getCells()).toEqual([]);
  });
  it("should add a live cell to the grid", () => {
    const gol = new GameOfLife();
    gol.addCell(2, 3);
    expect(gol.getCells()).toEqual([[2, 3]]);
  });
  it("should count zero neighbors for isolated cell", () => {
    const gol = new GameOfLife();
    gol.addCell(5, 5);
    expect(gol.countNeighbors(5, 5)).toBe(0);
  });
  it("should count one neighbor for single adjacent cell", () => {
    const gol = new GameOfLife();
    gol.addCell(5, 5);
    gol.addCell(6, 6);
    expect(gol.countNeighbors(5, 5)).toBe(1);
  });
  it("should count multiple neighbors for adjacent cells", () => {
    const gol = new GameOfLife();
    gol.addCell(5, 5);
    gol.addCell(4, 4);
    gol.addCell(4, 5);
    gol.addCell(4, 6);
    expect(gol.countNeighbors(5, 5)).toBe(3);
  });
  it("should kill live cell with less than 2 neighbors", () => {
    const gol = new GameOfLife();
    gol.addCell(5, 5);
    gol.addCell(6, 6);
    const nextGen = gol.nextGeneration();
    expect(nextGen).toEqual([]);
  });
  it("should keep live cell with 2 neighbors (survival)", () => {
    const gol = new GameOfLife();
    gol.addCell(5, 5);
    gol.addCell(4, 4);
    gol.addCell(4, 5);
    const nextGen = gol.nextGeneration();
    expect(nextGen).toEqual([[4, 4], [4, 5], [5, 4], [5, 5]]);
  });
  it("should keep live cell with 3 neighbors (survival)", () => {
    const gol = new GameOfLife();
    gol.addCell(5, 5);
    gol.addCell(4, 4);
    gol.addCell(4, 5);
    gol.addCell(4, 6);
    const nextGen = gol.nextGeneration();
    expect(nextGen).toEqual([[3, 5], [4, 4], [4, 5], [4, 6], [5, 4], [5, 5], [5, 6]]);
  });
  it("should kill live cell with more than 3 neighbors", () => {
    const gol = new GameOfLife();
    gol.addCell(5, 5);
    gol.addCell(4, 4);
    gol.addCell(4, 5);
    gol.addCell(4, 6);
    gol.addCell(5, 6);
    const nextGen = gol.nextGeneration();
    expect(nextGen).toEqual([[3, 5], [4, 4], [4, 6], [5, 4], [5, 6]]);
  });
  it("should resurrect dead cell with exactly 3 neighbors (reproduction)", () => {
    const gol = new GameOfLife();
    gol.addCell(4, 4);
    gol.addCell(4, 5);
    gol.addCell(4, 6);
    const nextGen = gol.nextGeneration();
    expect(nextGen).toEqual([[3, 5], [4, 5], [5, 5]]);
  });
  it("should advance one generation", () => {
    const gol = new GameOfLife();
    // Blinker pattern: vertical line that becomes horizontal
    gol.addCell(2, 1);
    gol.addCell(2, 2);
    gol.addCell(2, 3);
    const nextGen = gol.nextGeneration();
    // After one generation, blinker should be horizontal
    expect(nextGen).toEqual([[1, 2], [2, 2], [3, 2]]);
  });
  it("should handle negative coordinates", () => {
    const gol = new GameOfLife();
    gol.addCell(-2, -3);
    gol.addCell(-1, -2);
    gol.addCell(0, -3);
    const nextGen = gol.nextGeneration();
    expect(nextGen).toEqual([[-1, -3], [-1, -2], [0, -2]]);
  });
  it("should keep empty grid empty", () => {
    const gol = new GameOfLife();
    const nextGen = gol.nextGeneration();
    expect(nextGen).toEqual([]);
  });
});
