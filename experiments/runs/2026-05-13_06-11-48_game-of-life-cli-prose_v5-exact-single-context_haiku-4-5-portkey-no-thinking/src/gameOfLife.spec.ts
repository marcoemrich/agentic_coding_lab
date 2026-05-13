import { describe, it, expect } from "vitest";
import { step } from "./gameOfLife.js";

describe("Game of Life", () => {
  it.todo("should return empty set when given empty configuration");
  it.todo("should return empty set when single cell dies of underpopulation");
  it.todo("should return two cells after one step with three cells in a line");
  it.todo("should keep three cells stable as a vertical line with block above");
  it.todo("should return correct configuration after single step with blinker pattern");
  it.todo("should return correct configuration after multiple steps");
  it.todo("should handle negative coordinates correctly");
  it.todo("should return cells in lexicographically sorted order");
});
