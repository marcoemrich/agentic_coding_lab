import { describe, it, expect } from "vitest";
import { rover } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should return initial position and heading when command string is empty", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "")).toEqual({ x: 0, y: 0, heading: "N" });
  });
  it("should rotate left from north to west with 'L'", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "L")).toEqual({ x: 0, y: 0, heading: "W" });
  });
  it("should rotate right from north to east with 'R'", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "R")).toEqual({ x: 0, y: 0, heading: "E" });
  });
  it("should move forward north increasing y with 'F'", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "F")).toEqual({ x: 0, y: 1, heading: "N" });
  });
  it("should move forward east increasing x when facing east", () => {
    expect(rover({ x: 0, y: 0, heading: "E" }, "F")).toEqual({ x: 1, y: 0, heading: "E" });
  });
  it("should move forward south decreasing y when facing south", () => {
    expect(rover({ x: 0, y: 0, heading: "S" }, "F")).toEqual({ x: 0, y: -1, heading: "S" });
  });
  it("should move forward west decreasing x when facing west", () => {
    expect(rover({ x: 0, y: 0, heading: "W" }, "F")).toEqual({ x: -1, y: 0, heading: "W" });
  });
  it("should execute a sequence of commands in order", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "RFRFRFLF")).toEqual({ x: 0, y: -2, heading: "S" });
  });
});
