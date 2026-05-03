import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty input", () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });
  it("should return identical image when scale is 1", () => {
    expect(scalePixelArt(["#.", ".#"], 1)).toEqual(["#.", ".#"]);
  });
  it("should scale a single pixel by repeating it into a block", () => {
    expect(scalePixelArt(["@"], 4)).toEqual(["@@@@", "@@@@", "@@@@", "@@@@"]);
  });
  it("should scale a single row horizontally and vertically", () => {
    expect(scalePixelArt(["ABC"], 3)).toEqual(["AAABBBCCC", "AAABBBCCC", "AAABBBCCC"]);
  });
  it("should scale multiple rows in both dimensions", () => {
    expect(scalePixelArt(["#.", ".#"], 2)).toEqual(["##..", "##..", "..##", "..##"]);
  });
  it("should scale a complex multi-row pattern", () => {
    expect(scalePixelArt(["#.#", ".#.", "#.#"], 2)).toEqual([
      "##..##", "##..##",
      "..##..", "..##..",
      "##..##", "##..##",
    ]);
  });
});
