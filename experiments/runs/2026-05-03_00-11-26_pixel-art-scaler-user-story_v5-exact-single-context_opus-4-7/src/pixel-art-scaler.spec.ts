import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return an empty image when input is empty", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return an unchanged copy when scale factor is 1", () => {
    expect(scalePixelArt([["a"]], 1)).toEqual([["a"]]);
  });
  it("should replicate a single pixel into a 2x2 block when scale factor is 2", () => {
    expect(scalePixelArt([["a"]], 2)).toEqual([["a", "a"], ["a", "a"]]);
  });
  it("should scale a single-row multi-pixel image horizontally", () => {
    expect(scalePixelArt([["a", "b", "c"]], 2)).toEqual([
      ["a", "a", "b", "b", "c", "c"],
      ["a", "a", "b", "b", "c", "c"],
    ]);
  });
  it("should scale a multi-row image both horizontally and vertically", () => {
    expect(scalePixelArt([["a", "b"], ["c", "d"]], 2)).toEqual([
      ["a", "a", "b", "b"],
      ["a", "a", "b", "b"],
      ["c", "c", "d", "d"],
      ["c", "c", "d", "d"],
    ]);
  });
  it("should scale by an arbitrary factor (e.g., 3) preserving each character", () => {
    expect(scalePixelArt([["#", "."], [".", "#"]], 3)).toEqual([
      ["#", "#", "#", ".", ".", "."],
      ["#", "#", "#", ".", ".", "."],
      ["#", "#", "#", ".", ".", "."],
      [".", ".", ".", "#", "#", "#"],
      [".", ".", ".", "#", "#", "#"],
      [".", ".", ".", "#", "#", "#"],
    ]);
  });
});
