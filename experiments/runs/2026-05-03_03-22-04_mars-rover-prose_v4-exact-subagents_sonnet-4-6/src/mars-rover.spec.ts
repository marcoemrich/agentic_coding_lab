import { describe, it, expect } from "vitest";
import { moveRover } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should return initial position and heading when given no commands", () => {
    expect(moveRover({ x: 0, y: 0, heading: "N" }, "")).toEqual({ x: 0, y: 0, heading: "N" });
  });
  it("should move forward one step north when facing north", () => {
    expect(moveRover({ x: 0, y: 0, heading: "N" }, "F")).toEqual({ x: 0, y: 1, heading: "N" });
  });
  it("should move forward one step east when facing east", () => {
    expect(moveRover({ x: 0, y: 0, heading: "E" }, "F")).toEqual({ x: 1, y: 0, heading: "E" });
  });
  it("should move forward one step south when facing south", () => {
    expect(moveRover({ x: 0, y: 0, heading: "S" }, "F")).toEqual({ x: 0, y: -1, heading: "S" });
  });
  it("should move forward one step west when facing west", () => {
    expect(moveRover({ x: 0, y: 0, heading: "W" }, "F")).toEqual({ x: -1, y: 0, heading: "W" });
  });
  it("should turn left from north to west", () => {
    expect(moveRover({ x: 0, y: 0, heading: "N" }, "L")).toEqual({ x: 0, y: 0, heading: "W" });
  });
  it("should turn right from north to east", () => {
    expect(moveRover({ x: 0, y: 0, heading: "N" }, "R")).toEqual({ x: 0, y: 0, heading: "E" });
  });
  it("should execute a sequence of multiple commands", () => {
    expect(moveRover({ x: 0, y: 0, heading: "N" }, "FRF")).toEqual({ x: 1, y: 1, heading: "E" });
  });
});
