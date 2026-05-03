import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return empty array for empty input", () => {
    expect(scalePixelArt([], 2)).toEqual([]);
  });
  it("should return exact copy for scale factor of 1 with single pixel", () => {
    expect(scalePixelArt([[255]], 1)).toEqual([[255]]);
  });
  it("should return exact copy for scale factor of 1 with single row", () => {
    expect(scalePixelArt([[255, 0, 128]], 1)).toEqual([[255, 0, 128]]);
  });
  it("should return exact copy for scale factor of 1 with multiple rows", () => {
    expect(scalePixelArt([[255, 0], [128, 64]], 1)).toEqual([[255, 0], [128, 64]]);
  });
  it("should replicate single pixel horizontally by scale factor", () => {
    expect(scalePixelArt([[255]], 2)).toEqual([[255, 255], [255, 255]]);
  });
  it("should replicate single pixel both horizontally and vertically by scale factor", () => {
    expect(scalePixelArt([[255]], 2)).toEqual([[255, 255], [255, 255]]);
  });
  it("should replicate each pixel in a single row horizontally by scale factor", () => {
    expect(scalePixelArt([[255, 0]], 2)).toEqual([[255, 255, 0, 0], [255, 255, 0, 0]]);
  });
  it("should replicate each row vertically by scale factor", () => {
    expect(scalePixelArt([[255, 0], [128, 64]], 2)).toEqual([[255, 255, 0, 0], [255, 255, 0, 0], [128, 128, 64, 64], [128, 128, 64, 64]]);
  });
  it("should scale a multi-row multi-column image by scale factor", () => {
    expect(scalePixelArt([[1, 2], [3, 4]], 3)).toEqual([
      [1, 1, 1, 2, 2, 2],
      [1, 1, 1, 2, 2, 2],
      [1, 1, 1, 2, 2, 2],
      [3, 3, 3, 4, 4, 4],
      [3, 3, 3, 4, 4, 4],
      [3, 3, 3, 4, 4, 4],
    ]);
  });
});
