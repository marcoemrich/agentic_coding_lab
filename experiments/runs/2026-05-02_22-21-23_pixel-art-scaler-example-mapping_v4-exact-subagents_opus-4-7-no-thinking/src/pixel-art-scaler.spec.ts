import { describe, it, expect } from "vitest";
import { scale } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty output for empty image with any scale", () => {
    expect(scale([], 1)).toEqual([]);
    expect(scale([], 5)).toEqual([]);
  });
  it("should return identical copy when scale is 1", () => {
    expect(scale(["@"], 1)).toEqual(["@"]);
  });
  it("should return 4x4 grid of @ for single pixel @ with scale 4", () => {
    expect(scale(["@"], 4)).toEqual(["@@@@", "@@@@", "@@@@", "@@@@"]);
  });
  it("should return 3 rows of AAABBBCCC for single row ABC with scale 3", () => {
    expect(scale(["ABC"], 3)).toEqual(["AAABBBCCC", "AAABBBCCC", "AAABBBCCC"]);
  });
  it("should return [XX, XX, YY, YY, ZZ, ZZ] for single column [X, Y, Z] with scale 2", () => {
    expect(scale(["X", "Y", "Z"], 2)).toEqual(["XX", "XX", "YY", "YY", "ZZ", "ZZ"]);
  });
  it("should return [##.., ##.., ..##, ..##] for 2x2 input [#., .#] with scale 2", () => {
    expect(scale(["#.", ".#"], 2)).toEqual(["##..", "##..", "..##", "..##"]);
  });
  it("should scale 3x3 complex pattern with scale 2", () => {
    expect(scale(["#.#", ".#.", "#.#"], 2)).toEqual([
      "##..##",
      "##..##",
      "..##..",
      "..##..",
      "##..##",
      "##..##",
    ]);
  });
});
