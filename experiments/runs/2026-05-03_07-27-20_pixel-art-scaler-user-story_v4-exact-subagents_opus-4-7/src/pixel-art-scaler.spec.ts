import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return an empty image for an empty input image", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return an unchanged copy of the input when scale factor is 1", () => {
    expect(scalePixelArt(["AB", "CD"], 1)).toEqual(["AB", "CD"]);
  });
  it("should replicate a single pixel horizontally and vertically by the scale factor", () => {
    expect(scalePixelArt(["A"], 3)).toEqual(["AAA", "AAA", "AAA"]);
  });
  it("should scale a single-row image by replicating each pixel horizontally and the row vertically", () => {
    expect(scalePixelArt(["AB"], 2)).toEqual(["AABB", "AABB"]);
  });
  it("should scale a single-column image by replicating each row vertically", () => {
    expect(scalePixelArt(["A", "B"], 2)).toEqual(["AA", "AA", "BB", "BB"]);
  });
  it("should scale a multi-row, multi-column image by replicating pixels horizontally and rows vertically", () => {
    expect(scalePixelArt(["AB", "CD"], 2)).toEqual(["AABB", "AABB", "CCDD", "CCDD"]);
  });
  it("should preserve exact character values without smoothing or blending", () => {
    expect(scalePixelArt(["#.@", ".@#"], 2)).toEqual(["##..@@", "##..@@", "..@@##", "..@@##"]);
  });
});
