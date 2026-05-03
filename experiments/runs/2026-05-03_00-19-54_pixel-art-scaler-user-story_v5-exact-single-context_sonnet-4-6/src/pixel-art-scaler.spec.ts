import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty image when input is empty", () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });
  it("should return unchanged image when scale is 1", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 1)).toEqual([["a", "b"], ["c", "d"]]);
  });
  it("should scale a single pixel by factor 2", () => {
    expect(scalePixelArt([["a"]], 2)).toEqual([["a", "a"], ["a", "a"]]);
  });
  it("should scale a single row of pixels horizontally", () => {
    expect(scalePixelArt([["a", "b"]], 2)).toEqual([["a", "a", "b", "b"], ["a", "a", "b", "b"]]);
  });
  it("should scale a single pixel vertically by repeating rows", () => {
    expect(scalePixelArt([["a"], ["b"]], 2)).toEqual([["a", "a"], ["a", "a"], ["b", "b"], ["b", "b"]]);
  });
  it("should scale a 2x2 grid by factor 2", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 2)).toEqual([
      ["a", "a", "b", "b"],
      ["a", "a", "b", "b"],
      ["c", "c", "d", "d"],
      ["c", "c", "d", "d"],
    ]);
  });
});
