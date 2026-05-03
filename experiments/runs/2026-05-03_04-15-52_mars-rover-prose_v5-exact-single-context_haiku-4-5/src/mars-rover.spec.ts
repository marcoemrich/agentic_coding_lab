import { describe, it, expect } from "vitest";
import { executeCommands } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should return initial position and heading with empty command string", () => {
    const result = executeCommands(0, 0, "N", "");
    expect(result).toEqual({ x: 0, y: 0, heading: "N" });
  });
  it("should rotate left 90 degrees from North to West", () => {
    const result = executeCommands(0, 0, "N", "L");
    expect(result).toEqual({ x: 0, y: 0, heading: "W" });
  });
  it("should rotate right 90 degrees from North to East", () => {
    const result = executeCommands(0, 0, "N", "R");
    expect(result).toEqual({ x: 0, y: 0, heading: "E" });
  });
  it("should move forward one square north when facing North", () => {
    const result = executeCommands(0, 0, "N", "F");
    expect(result).toEqual({ x: 0, y: 1, heading: "N" });
  });
  it("should move forward one square east when facing East", () => {
    const result = executeCommands(0, 0, "E", "F");
    expect(result).toEqual({ x: 1, y: 0, heading: "E" });
  });
  it("should move forward one square south when facing South", () => {
    const result = executeCommands(0, 0, "S", "F");
    expect(result).toEqual({ x: 0, y: -1, heading: "S" });
  });
  it("should move forward one square west when facing West", () => {
    const result = executeCommands(0, 0, "W", "F");
    expect(result).toEqual({ x: -1, y: 0, heading: "W" });
  });
  it("should execute multiple rotations in sequence", () => {
    const result = executeCommands(0, 0, "N", "LL");
    expect(result).toEqual({ x: 0, y: 0, heading: "S" });
  });
  it("should execute multiple forward movements in sequence", () => {
    const result = executeCommands(0, 0, "N", "FFF");
    expect(result).toEqual({ x: 0, y: 3, heading: "N" });
  });
  it("should execute mixed rotations and movements in correct order", () => {
    const result = executeCommands(0, 0, "N", "LFLFRFF");
    expect(result).toEqual({ x: -3, y: -1, heading: "W" });
  });
});
