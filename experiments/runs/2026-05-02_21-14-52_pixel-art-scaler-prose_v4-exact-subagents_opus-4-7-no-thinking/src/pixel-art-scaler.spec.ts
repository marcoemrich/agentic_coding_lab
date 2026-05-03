import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty grid for empty input with scale 1", () => {
    expect(scalePixelArt([], 1)).toEqual([]);
  });
  it("should return exact copy of single pixel grid with scale 1", () => {
    expect(scalePixelArt([["A"]], 1)).toEqual([["A"]]);
  });
  it("should return exact copy of multi-pixel grid with scale 1", () => {
    expect(scalePixelArt([["A", "B"], ["C", "D"]], 1)).toEqual([["A", "B"], ["C", "D"]]);
  });
  it("should double a single pixel grid with scale 2", () => {
    expect(scalePixelArt([["A"]], 2)).toEqual([["A", "A"], ["A", "A"]]);
  });
  it("should scale a single pixel grid by factor 3", () => {
    expect(scalePixelArt([["X"]], 3)).toEqual([["X", "X", "X"], ["X", "X", "X"], ["X", "X", "X"]]);
  });
  it("should scale a single-row multi-pixel grid horizontally with scale 2", () => {
    expect(scalePixelArt([["A", "B"]], 2)).toEqual([["A", "A", "B", "B"], ["A", "A", "B", "B"]]);
  });
  it("should scale a multi-row single-column grid vertically with scale 2", () => {
    expect(scalePixelArt([["A"], ["B"]], 2)).toEqual([["A", "A"], ["A", "A"], ["B", "B"], ["B", "B"]]);
  });
  it("should scale a multi-row multi-column grid by scale 2", () => {
    expect(scalePixelArt([["A", "B"], ["C", "D"]], 2)).toEqual([
      ["A", "A", "B", "B"],
      ["A", "A", "B", "B"],
      ["C", "C", "D", "D"],
      ["C", "C", "D", "D"],
    ]);
  });
  it("should return empty grid for empty input with scale > 1", () => {
    expect(scalePixelArt([], 5)).toEqual([]);
  });
});
