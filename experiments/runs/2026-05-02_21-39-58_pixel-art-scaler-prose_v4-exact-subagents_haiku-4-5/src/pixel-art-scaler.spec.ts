import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty image", () => {
    expect(scale([], 2)).toEqual([]);
  });
  it("should return single pixel unchanged when scale factor is 1", () => {
    expect(scale(["#"], 1)).toEqual(["#"]);
  });
  it("should scale single pixel both horizontally and vertically by 2", () => {
    expect(scale(["#"], 2)).toEqual(["##", "##"]);
  });
  it("should scale 2x2 grid by factor of 2", () => {
    expect(scale(["#.", ".#"], 2)).toEqual(["##..", "##..", "..##", "..##"]);
  });
  it("should scale 1x3 row by factor of 2", () => {
    expect(scale(["#.#"], 2)).toEqual(["##..##", "##..##"]);
  });
  it("should scale 3x1 column by factor of 2", () => {
    expect(scale(["#", ".", "#"], 2)).toEqual(["##", "##", "..", "..", "##", "##"]);
  });
  it("should scale 2x3 grid by factor of 3", () => {
    expect(scale(["#.", ".."], 3)).toEqual(["###...", "###...", "###...", "......", "......", "......"]);
  });
});
