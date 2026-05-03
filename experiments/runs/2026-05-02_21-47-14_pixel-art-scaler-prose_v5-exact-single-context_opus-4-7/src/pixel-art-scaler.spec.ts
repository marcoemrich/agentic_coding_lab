import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("returns empty output for empty input regardless of scale", () => {
    expect(scale([], 5)).toEqual([]);
  });
  it("returns exact copy when scale factor is 1", () => {
    expect(scale([["a", "b"], ["c", "d"]], 1)).toEqual([["a", "b"], ["c", "d"]]);
  });
  it("scales a single pixel by factor 2 into a 2x2 block", () => {
    expect(scale([["x"]], 2)).toEqual([["x", "x"], ["x", "x"]]);
  });
  it("scales a single row horizontally and vertically by factor 2", () => {
    expect(scale([["a", "b"]], 2)).toEqual([
      ["a", "a", "b", "b"],
      ["a", "a", "b", "b"],
    ]);
  });
  it("scales a multi-row image by factor 2", () => {
    expect(scale([["a", "b"], ["c", "d"]], 2)).toEqual([
      ["a", "a", "b", "b"],
      ["a", "a", "b", "b"],
      ["c", "c", "d", "d"],
      ["c", "c", "d", "d"],
    ]);
  });
  it("scales an image by factor 3", () => {
    expect(scale([["a", "b"]], 3)).toEqual([
      ["a", "a", "a", "b", "b", "b"],
      ["a", "a", "a", "b", "b", "b"],
      ["a", "a", "a", "b", "b", "b"],
    ]);
  });
});
