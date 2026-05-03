import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty output for empty input", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return exact copy when scale is 1", () => {
    expect(scalePixelArt(["ab", "cd"], 1)).toEqual(["ab", "cd"]);
  });
  it("should scale a single pixel by factor 2", () => {
    expect(scalePixelArt(["a"], 2)).toEqual(["aa", "aa"]);
  });
  it("should scale a single row with multiple pixels by factor 2", () => {
    expect(scalePixelArt(["ab"], 2)).toEqual(["aabb", "aabb"]);
  });
  it("should scale multiple rows by factor 2", () => {
    expect(scalePixelArt(["ab", "cd"], 2)).toEqual(["aabb", "aabb", "ccdd", "ccdd"]);
  });
});
