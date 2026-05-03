import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty image for empty input regardless of scale factor", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return unchanged image for scale factor of 1", () => {
    expect(scalePixelArt([["A", "B"], ["C", "D"]], 1)).toEqual([["A", "B"], ["C", "D"]]);
  });
  it("should scale a single pixel horizontally and vertically by factor 2", () => {
    expect(scalePixelArt([["A"]], 2)).toEqual([["A", "A"], ["A", "A"]]);
  });
  it("should replicate each pixel exactly scale times in a single-row image", () => {
    expect(scalePixelArt([["A", "B"]], 3)).toEqual([
      ["A", "A", "A", "B", "B", "B"],
      ["A", "A", "A", "B", "B", "B"],
      ["A", "A", "A", "B", "B", "B"],
    ]);
  });
  it("should replicate each row exactly scale times in a single-column image", () => {
    expect(scalePixelArt([["A"], ["B"]], 3)).toEqual([
      ["A", "A", "A"],
      ["A", "A", "A"],
      ["A", "A", "A"],
      ["B", "B", "B"],
      ["B", "B", "B"],
      ["B", "B", "B"],
    ]);
  });
  it("should scale a multi-pixel single-row image by factor 2", () => {
    expect(scalePixelArt([["A", "B"]], 2)).toEqual([
      ["A", "A", "B", "B"],
      ["A", "A", "B", "B"],
    ]);
  });
  it("should scale a multi-row image horizontally and vertically by factor 2", () => {
    expect(scalePixelArt([["A", "B"], ["C", "D"]], 2)).toEqual([
      ["A", "A", "B", "B"],
      ["A", "A", "B", "B"],
      ["C", "C", "D", "D"],
      ["C", "C", "D", "D"],
    ]);
  });
  it("should preserve character values exactly when scaling", () => {
    expect(scalePixelArt([["#FF0000", "#00FF00"]], 2)).toEqual([
      ["#FF0000", "#FF0000", "#00FF00", "#00FF00"],
      ["#FF0000", "#FF0000", "#00FF00", "#00FF00"],
    ]);
  });
});
