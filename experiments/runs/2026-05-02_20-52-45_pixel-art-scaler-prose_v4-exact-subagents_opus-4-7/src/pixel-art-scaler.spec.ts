import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return an empty image for an empty input regardless of scale", () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });
  it("should return an exact copy of the input when scale is 1", () => {
    expect(scalePixelArt(["#"], 1)).toEqual(["#"]);
  });
  it("should replicate a single pixel horizontally by the scale factor", () => {
    expect(scalePixelArt(["#"], 2)[0]).toEqual("##");
  });
  it("should replicate a single-row image vertically by the scale factor", () => {
    expect(scalePixelArt(["#"], 3)).toEqual(["###", "###", "###"]);
  });
  it("should scale a single pixel in both dimensions by the scale factor", () => {
    expect(scalePixelArt(["X"], 2)).toEqual(["XX", "XX"]);
  });
  it("should scale a multi-pixel row horizontally preserving pixel order", () => {
    expect(scalePixelArt(["AB"], 2)).toEqual(["AABB", "AABB"]);
  });
  it("should scale a multi-row image vertically preserving row order", () => {
    expect(scalePixelArt(["A", "B"], 2)).toEqual(["AA", "AA", "BB", "BB"]);
  });
  it("should scale a multi-row multi-pixel image in both dimensions", () => {
    expect(scalePixelArt(["AB", "CD"], 2)).toEqual(["AABB", "AABB", "CCDD", "CCDD"]);
  });
});
