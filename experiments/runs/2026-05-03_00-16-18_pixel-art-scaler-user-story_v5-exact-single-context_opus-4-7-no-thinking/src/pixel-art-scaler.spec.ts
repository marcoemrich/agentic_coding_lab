import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return an empty image when input is empty", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return unchanged copy when scale factor is 1", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 1)).toEqual([["a", "b"], ["c", "d"]]);
  });
  it("should scale a single-pixel image by factor 2", () => {
    expect(scalePixelArt([["x"]], 2)).toEqual([["x", "x"], ["x", "x"]]);
  });
  it("should scale a single-row image horizontally", () => {
    expect(scalePixelArt([["a", "b", "c"]], 2)).toEqual([
      ["a", "a", "b", "b", "c", "c"],
      ["a", "a", "b", "b", "c", "c"],
    ]);
  });
  it("should scale a single-column image vertically", () => {
    expect(scalePixelArt([["a"], ["b"], ["c"]], 2)).toEqual([
      ["a", "a"],
      ["a", "a"],
      ["b", "b"],
      ["b", "b"],
      ["c", "c"],
      ["c", "c"],
    ]);
  });
  it("should scale a multi-row multi-column image by factor 2", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 2)).toEqual([
      ["a", "a", "b", "b"],
      ["a", "a", "b", "b"],
      ["c", "c", "d", "d"],
      ["c", "c", "d", "d"],
    ]);
  });
  it("should scale by factor 3", () => {
    expect(scalePixelArt([["a", "b"]], 3)).toEqual([
      ["a", "a", "a", "b", "b", "b"],
      ["a", "a", "a", "b", "b", "b"],
      ["a", "a", "a", "b", "b", "b"],
    ]);
  });
});
