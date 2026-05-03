import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty output for empty input regardless of scale", () => {
    expect(scale([], 3)).toEqual([]);
  });
  it("should return an exact copy of a single-pixel image when scale is 1", () => {
    expect(scale([["A"]], 1)).toEqual([["A"]]);
  });
  it("should produce a 2x2 grid from a single-pixel image when scale is 2", () => {
    expect(scale([["A"]], 2)).toEqual([["A", "A"], ["A", "A"]]);
  });
  it("should return an exact copy of a multi-row image when scale is 1", () => {
    expect(
      scale(
        [
          ["A", "B"],
          ["C", "D"],
        ],
        1,
      ),
    ).toEqual([
      ["A", "B"],
      ["C", "D"],
    ]);
  });
  it("should replicate each pixel horizontally and each row vertically when scale is 2", () => {
    expect(
      scale(
        [
          ["A", "B"],
          ["C", "D"],
        ],
        2,
      ),
    ).toEqual([
      ["A", "A", "B", "B"],
      ["A", "A", "B", "B"],
      ["C", "C", "D", "D"],
      ["C", "C", "D", "D"],
    ]);
  });
  it("should replicate each pixel and row by scale factor 3 for a multi-row image", () => {
    expect(
      scale(
        [
          ["X", "O"],
          ["O", "X"],
        ],
        3,
      ),
    ).toEqual([
      ["X", "X", "X", "O", "O", "O"],
      ["X", "X", "X", "O", "O", "O"],
      ["X", "X", "X", "O", "O", "O"],
      ["O", "O", "O", "X", "X", "X"],
      ["O", "O", "O", "X", "X", "X"],
      ["O", "O", "O", "X", "X", "X"],
    ]);
  });
});
