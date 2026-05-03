import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("returns empty output for empty input regardless of scale", () => {
    expect(scale([], 3)).toEqual([]);
  });
  it("returns exact copy when scale is 1", () => {
    expect(scale([["a", "b"], ["c", "d"]], 1)).toEqual([["a", "b"], ["c", "d"]]);
  });
  it("scales a single pixel to a 2x2 block when scale is 2", () => {
    expect(scale([["x"]], 2)).toEqual([["x", "x"], ["x", "x"]]);
  });
  it("replicates pixels horizontally within a row", () => {
    expect(scale([["r", "g", "b"]], 2)).toEqual([
      ["r", "r", "g", "g", "b", "b"],
      ["r", "r", "g", "g", "b", "b"],
    ]);
  });
  it("replicates rows vertically", () => {
    expect(scale([["a"], ["b"], ["c"]], 2)).toEqual([
      ["a", "a"],
      ["a", "a"],
      ["b", "b"],
      ["b", "b"],
      ["c", "c"],
      ["c", "c"],
    ]);
  });
  it("scales a multi-row multi-column grid by an arbitrary factor", () => {
    expect(scale([["a", "b"], ["c", "d"]], 3)).toEqual([
      ["a", "a", "a", "b", "b", "b"],
      ["a", "a", "a", "b", "b", "b"],
      ["a", "a", "a", "b", "b", "b"],
      ["c", "c", "c", "d", "d", "d"],
      ["c", "c", "c", "d", "d", "d"],
      ["c", "c", "c", "d", "d", "d"],
    ]);
  });
});
