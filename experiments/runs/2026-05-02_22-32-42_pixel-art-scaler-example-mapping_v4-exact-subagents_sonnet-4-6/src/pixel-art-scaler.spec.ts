import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty input", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return identical copy for scale 1 with single row", () => {
    expect(scalePixelArt([["R", "G", "B"]], 1)).toEqual([["R", "G", "B"]]);
  });
  it("should return identical copy for scale 1 with multiple rows", () => {
    expect(scalePixelArt([["R", "G"], ["B", "W"]], 1)).toEqual([["R", "G"], ["B", "W"]]);
  });
  it("should repeat each pixel horizontally by scale factor", () => {
    expect(scalePixelArt([["R", "G"]], 2)).toEqual([["R", "R", "G", "G"], ["R", "R", "G", "G"]]);
  });
  it("should repeat each row vertically by scale factor", () => {
    expect(scalePixelArt([["R"]], 3)).toEqual([["R", "R", "R"], ["R", "R", "R"], ["R", "R", "R"]]);
  });
  it("should scale both horizontally and vertically for multi-character row", () => {
    expect(scalePixelArt([["R", "G", "B"]], 2)).toEqual([
      ["R", "R", "G", "G", "B", "B"],
      ["R", "R", "G", "G", "B", "B"],
    ]);
  });
  it("should scale a multi-row image both horizontally and vertically", () => {
    expect(scalePixelArt([["R", "G"], ["B", "W"]], 2)).toEqual([
      ["R", "R", "G", "G"],
      ["R", "R", "G", "G"],
      ["B", "B", "W", "W"],
      ["B", "B", "W", "W"],
    ]);
  });
});
