import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty output for empty input", () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });
  it("should return identical copy when scale is 1", () => {
    expect(scalePixelArt(["#.", ".#"], 1)).toEqual(["#.", ".#"]);
  });
  it("should scale a single pixel by factor 4", () => {
    expect(scalePixelArt(["@"], 4)).toEqual(["@@@@", "@@@@", "@@@@", "@@@@"]);
  });
  it("should scale a single row by factor 3", () => {
    expect(scalePixelArt(["ABC"], 3)).toEqual([
      "AAABBBCCC",
      "AAABBBCCC",
      "AAABBBCCC",
    ]);
  });
  it("should scale a single column by factor 2", () => {
    expect(scalePixelArt(["X", "Y", "Z"], 2)).toEqual([
      "XX",
      "XX",
      "YY",
      "YY",
      "ZZ",
      "ZZ",
    ]);
  });
  it("should scale a 2x2 image by factor 2", () => {
    expect(scalePixelArt(["#.", ".#"], 2)).toEqual([
      "##..",
      "##..",
      "..##",
      "..##",
    ]);
  });
  it("should scale a 3x3 complex pattern by factor 2", () => {
    expect(scalePixelArt(["#.#", ".#.", "#.#"], 2)).toEqual([
      "##..##",
      "##..##",
      "..##..",
      "..##..",
      "##..##",
      "##..##",
    ]);
  });
});
