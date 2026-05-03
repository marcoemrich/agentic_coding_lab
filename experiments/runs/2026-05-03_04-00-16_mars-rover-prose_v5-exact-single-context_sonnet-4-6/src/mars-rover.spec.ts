import { describe, it, expect } from "vitest";
import { moveRover } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should return initial position and heading when given no commands", () => {
    expect(moveRover(0, 0, "N", "")).toEqual({ x: 0, y: 0, heading: "N" });
  });
  it("should move north when facing north and given F command", () => {
    expect(moveRover(0, 0, "N", "F")).toEqual({ x: 0, y: 1, heading: "N" });
  });
  it("should move east when facing east and given F command", () => {
    expect(moveRover(0, 0, "E", "F")).toEqual({ x: 1, y: 0, heading: "E" });
  });
  it("should move south when facing south and given F command", () => {
    expect(moveRover(0, 0, "S", "F")).toEqual({ x: 0, y: -1, heading: "S" });
  });
  it("should move west when facing west and given F command", () => {
    expect(moveRover(0, 0, "W", "F")).toEqual({ x: -1, y: 0, heading: "W" });
  });
  it("should rotate left from north when given L command", () => {
    expect(moveRover(0, 0, "N", "L")).toEqual({ x: 0, y: 0, heading: "W" });
  });
  it("should rotate right from north when given R command", () => {
    expect(moveRover(0, 0, "N", "R")).toEqual({ x: 0, y: 0, heading: "E" });
  });
  it("should execute multiple commands in sequence", () => {
    expect(moveRover(0, 0, "N", "FRF")).toEqual({ x: 1, y: 1, heading: "E" });
  });
});
