// pixel-art-scaler.spec.ts
import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty image for empty input regardless of scale", () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });
  it("should return unchanged copy when scale is 1", () => {
    expect(scalePixelArt([["a"]], 1)).toEqual([["a"]]);
  });
  it("should replicate single pixel horizontally by scale factor", () => {
    expect(scalePixelArt([["a"]], 3)).toEqual([
      ["a", "a", "a"],
      ["a", "a", "a"],
      ["a", "a", "a"],
    ]);
  });
  it("should replicate single row vertically by scale factor", () => {
    expect(scalePixelArt([["a"]], 2)).toEqual([["a", "a"], ["a", "a"]]);
  });
  it("should scale a single pixel image both horizontally and vertically", () => {
    expect(scalePixelArt([["x"]], 3)).toEqual([
      ["x", "x", "x"],
      ["x", "x", "x"],
      ["x", "x", "x"],
    ]);
  });
  it("should scale a multi-pixel row by scale factor", () => {
    expect(scalePixelArt([["a", "b", "c"]], 2)).toEqual([
      ["a", "a", "b", "b", "c", "c"],
      ["a", "a", "b", "b", "c", "c"],
    ]);
  });
  it("should scale a multi-row image by scale factor", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 2)).toEqual([
      ["a", "a", "b", "b"],
      ["a", "a", "b", "b"],
      ["c", "c", "d", "d"],
      ["c", "c", "d", "d"],
    ]);
  });
  it("should preserve character values exactly without blending", () => {
    expect(scalePixelArt([["#", "."], [".", "#"]], 2)).toEqual([
      ["#", "#", ".", "."],
      ["#", "#", ".", "."],
      [".", ".", "#", "#"],
      [".", ".", "#", "#"],
    ]);
  });
});
