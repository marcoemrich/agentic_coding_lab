import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty image", () => {
    expect(scalePixelArt([], 1)).toEqual([]);
  });
  it("should return single pixel unchanged with scale factor of 1", () => {
    expect(scalePixelArt(["A"], 1)).toEqual(["A"]);
  });
  it("should replicate single pixel horizontally with scale factor of 2", () => {
    expect(scalePixelArt(["A"], 2)).toEqual(["AA"]);
  });
  it("should replicate single pixel both horizontally and vertically with scale factor of 2", () => {
    expect(scalePixelArt(["A"], 2)).toEqual(["AA", "AA"]);
  });
  it("should scale single row with multiple pixels and scale factor of 2", () => {
    expect(scalePixelArt(["AB"], 2)).toEqual(["AABB"]);
  });
  it("should scale multiple rows with scale factor of 2", () => {
    expect(scalePixelArt(["A", "B"], 2)).toEqual(["AA", "AA", "BB", "BB"]);
  });
  it("should scale image with scale factor of 3", () => {
    expect(scalePixelArt(["AB"], 3)).toEqual(["AAABBB", "AAABBB", "AAABBB"]);
  });
  it("should preserve character values exactly without modification", () => {
    expect(scalePixelArt(["XYZ"], 2)).toEqual(["XXYYZZ", "XXYYZZ"]);
  });
});
