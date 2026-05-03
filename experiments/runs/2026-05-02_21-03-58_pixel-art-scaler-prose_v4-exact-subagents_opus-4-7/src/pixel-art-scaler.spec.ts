// pixel-art-scaler.spec.ts
import { describe, it, expect } from "vitest";
import { scalePixelArt } from "./pixel-art-scaler.js";

describe("Pixel Art Scaler", () => {
  it("should return an empty image when given an empty image with scale 1", () => {
    expect(scalePixelArt("", 1)).toBe("");
  });
  it("should return an exact copy of a single-pixel image when scale is 1", () => {
    expect(scalePixelArt("X", 1)).toBe("X");
  });
  it("should return an exact copy of a multi-pixel image when scale is 1", () => {
    expect(scalePixelArt("AB\nCD", 1)).toBe("AB\nCD");
  });
  it("should replicate a single pixel horizontally and vertically when scale is 2", () => {
    expect(scalePixelArt("X", 2)).toBe("XX\nXX");
  });
  it("should scale a single-row image by replicating each pixel horizontally", () => {
    expect(scalePixelArt("AB", 2)).toBe("AABB\nAABB");
  });
  it("should scale a single-column image by replicating each row vertically", () => {
    expect(scalePixelArt("A\nB", 2)).toBe("AA\nAA\nBB\nBB");
  });
  it("should scale a multi-row multi-column image preserving character values", () => {
    expect(scalePixelArt("AB\nCD", 2)).toBe("AABB\nAABB\nCCDD\nCCDD");
    expect(scalePixelArt("A#\n*Z", 3)).toBe("AAA###\nAAA###\nAAA###\n***ZZZ\n***ZZZ\n***ZZZ");
  });
  it("should return an empty image when given an empty image with scale greater than 1", () => {
    expect(scalePixelArt("", 5)).toBe("");
  });
});
