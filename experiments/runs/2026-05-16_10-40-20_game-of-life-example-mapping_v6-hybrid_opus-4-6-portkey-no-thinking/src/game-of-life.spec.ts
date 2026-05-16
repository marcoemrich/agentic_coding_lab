import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("returns empty array for empty grid");
  it.todo("single live cell dies from underpopulation");
  it.todo("two adjacent live cells die from underpopulation");
  it.todo("live cell with two neighbors survives");
  it.todo("live cell with three neighbors survives");
  it.todo("live cell with more than three neighbors dies from overpopulation");
  it.todo("dead cell with exactly three live neighbors becomes alive");
  it.todo("block pattern remains stable across generations");
});
