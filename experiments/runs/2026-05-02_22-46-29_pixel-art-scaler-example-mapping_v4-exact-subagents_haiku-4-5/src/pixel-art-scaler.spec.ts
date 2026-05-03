import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty input", () => {
    expect(scale([], 2)).toEqual([]);
  });
  it("should return identical copy for scale factor 1", () => {
    const input = ["abc", "def"];
    expect(scale(input, 1)).toEqual(input);
  });
  it("should scale single pixel horizontally by 2x", () => {
    expect(scale(["X"], 2)).toEqual(["XX"]);
  });
  it("should scale single pixel vertically by 2x", () => {
    expect(scale(["X"], 2)).toEqual(["X", "X"]);
  });
  it("should scale single row horizontally by 2x", () => {
    expect(scale(["ABC"], 2)).toEqual(["AABBCC"]);
  });
  it("should scale single row vertically by 2x", () => {
    expect(scale(["ABC"], 2)).toEqual(["ABC", "ABC"]);
  });
  it("should scale single column horizontally by 2x", () => {
    expect(scale(["A", "B"], 2)).toEqual(["AA", "BB"]);
  });
  it("should scale single column vertically by 2x", () => {
    expect(scale(["A", "B"], 2)).toEqual(["A", "A", "B", "B"]);
  });
  it("should scale 2x2 grid by 2x", () => {
    expect(scale(["AB", "CD"], 2)).toEqual(["AABB", "AABB", "CCDD", "CCDD"]);
  });
  it("should scale single row by 3x", () => {
    expect(scale(["ABC"], 3)).toEqual(["AAABBBCCC"]);
  });
  it("should scale single pixel by 4x", () => {
    expect(scale(["X"], 4)).toEqual(["X", "X", "X", "X"]);
  });
  it.todo("should scale 2x3 grid by 2x");
});
