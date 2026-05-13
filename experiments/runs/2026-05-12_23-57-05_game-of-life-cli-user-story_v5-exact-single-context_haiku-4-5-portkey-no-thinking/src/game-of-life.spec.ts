import { describe, it, expect } from "vitest";
import { step, simulate } from "./game-of-life.js";

describe("Game of Life", () => {
  it.todo("should return empty array when given empty configuration");
  it.todo("should return empty array after one step with isolated single cell");
  it.todo("should keep two adjacent cells alive if they are neighbors");
  it.todo("should apply underpopulation rule to isolated cells");
  it.todo("should resurrect dead cells with exactly three living neighbors");
  it.todo("should advance multiple steps correctly");
  it.todo("should return lexicographically sorted cells");
  it.todo("should handle negative coordinates");
});
