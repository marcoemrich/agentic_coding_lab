import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty output for empty input regardless of scale", () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });
  it("should return an exact copy when scale is 1", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 1)).toEqual([["a", "b"], ["c", "d"]]);
  });
  it("should double a single pixel when scale is 2", () => {
    expect(scalePixelArt([["x"]], 2)).toEqual([["x", "x"], ["x", "x"]]);
  });
  it("should scale a single row horizontally by the scale factor", () => {
    expect(scalePixelArt([["a", "b", "c"]], 3)).toEqual([
      ["a", "a", "a", "b", "b", "b", "c", "c", "c"],
      ["a", "a", "a", "b", "b", "b", "c", "c", "c"],
      ["a", "a", "a", "b", "b", "b", "c", "c", "c"],
    ]);
  });
  it("should scale a single column vertically by the scale factor", () => {
    expect(scalePixelArt([["a"], ["b"], ["c"]], 2)).toEqual([
      ["a", "a"],
      ["a", "a"],
      ["b", "b"],
      ["b", "b"],
      ["c", "c"],
      ["c", "c"],
    ]);
  });
  it("should scale a multi-row multi-column grid both horizontally and vertically", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 2)).toEqual([
      ["a", "a", "b", "b"],
      ["a", "a", "b", "b"],
      ["c", "c", "d", "d"],
      ["c", "c", "d", "d"],
    ]);
  });
});
