// pixel-art-scaler.spec.ts
import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty input with scale 3", () => {
    expect(scale([], 3)).toEqual([]);
  });
  it("should return identical copy when scale is 1", () => {
    expect(scale(["#.", ".#"], 1)).toEqual(["#.", ".#"]);
  });
  it("should scale single pixel by repeating it horizontally and vertically", () => {
    expect(scale(["@"], 4)).toEqual(["@@@@", "@@@@", "@@@@", "@@@@"]);
  });
  it("should scale single row horizontally and vertically", () => {
    expect(scale(["ABC"], 3)).toEqual(["AAABBBCCC", "AAABBBCCC", "AAABBBCCC"]);
  });
  it("should scale single column horizontally and vertically", () => {
    expect(scale(["X", "Y", "Z"], 2)).toEqual(["XX", "XX", "YY", "YY", "ZZ", "ZZ"]);
  });
  it("should scale a 2x2 image by factor 2", () => {
    expect(scale(["#.", ".#"], 2)).toEqual(["##..", "##..", "..##", "..##"]);
  });
  it("should scale a 3x3 image by factor 2", () => {
    expect(scale(["#.#", ".#.", "#.#"], 2)).toEqual([
      "##..##",
      "##..##",
      "..##..",
      "..##..",
      "##..##",
      "##..##",
    ]);
  });
});
