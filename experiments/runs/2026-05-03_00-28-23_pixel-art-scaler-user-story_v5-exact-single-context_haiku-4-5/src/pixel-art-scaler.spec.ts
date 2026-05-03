import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty input", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return unchanged image for scale factor 1", () => {
    expect(scalePixelArt(["A"], 1)).toEqual(["A"]);
  });
  it("should scale a single character by 2", () => {
    expect(scalePixelArt(["A"], 2)).toEqual(["AA", "AA"]);
  });
  it("should scale a single row horizontally by 2", () => {
    expect(scalePixelArt(["AB"], 2)).toEqual(["AABB", "AABB"]);
  });
  it("should scale a single column vertically by 2", () => {
    expect(scalePixelArt(["A", "B"], 2)).toEqual(["AA", "AA", "BB", "BB"]);
  });
  it("should scale a 2x2 grid by 2", () => {
    expect(scalePixelArt(["AB", "CD"], 2)).toEqual(["AABB", "AABB", "CCDD", "CCDD"]);
  });
});
