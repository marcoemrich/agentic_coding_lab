import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty output for empty input", () => {
    expect(scale([], 3)).toEqual([]);
  });
  it("should return identical copy when scale is 1", () => {
    expect(scale(["#.", ".#"], 1)).toEqual(["#.", ".#"]);
  });
  it("should scale a single pixel by factor 2", () => {
    expect(scale(["@"], 2)).toEqual(["@@", "@@"]);
  });
  it("should scale a single row horizontally", () => {
    expect(scale(["ABC"], 3)).toEqual([
      "AAABBBCCC",
      "AAABBBCCC",
      "AAABBBCCC",
    ]);
  });
  it("should scale a single column vertically", () => {
    expect(scale(["X", "Y", "Z"], 2)).toEqual([
      "XX",
      "XX",
      "YY",
      "YY",
      "ZZ",
      "ZZ",
    ]);
  });
  it("should scale a 2x2 grid by factor 2", () => {
    expect(scale(["#.", ".#"], 2)).toEqual([
      "##..",
      "##..",
      "..##",
      "..##",
    ]);
  });
  it("should scale a complex pattern by factor 2", () => {
    expect(scale(["#.#", ".#.", "#.#"], 2)).toEqual([
      "##..##",
      "##..##",
      "..##..",
      "..##..",
      "##..##",
      "##..##",
    ]);
  });
  it("should scale a single pixel by factor 4", () => {
    expect(scale(["@"], 4)).toEqual(["@@@@", "@@@@", "@@@@", "@@@@"]);
  });
});
