import { describe, it, expect } from "vitest";
import { rover } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should return the initial position and heading when given an empty command string", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "")).toEqual({ x: 0, y: 0, heading: "N" });
  });
  it("should rotate left from north to west with command 'L'", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "L")).toEqual({ x: 0, y: 0, heading: "W" });
  });
  it("should rotate right from north to east with command 'R'", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "R")).toEqual({ x: 0, y: 0, heading: "E" });
  });
  it("should move forward north (increase y) with command 'F'", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "F")).toEqual({ x: 0, y: 1, heading: "N" });
  });
  it("should move forward east (increase x) when facing east", () => {
    expect(rover({ x: 0, y: 0, heading: "E" }, "F")).toEqual({ x: 1, y: 0, heading: "E" });
  });
  it("should move forward south (decrease y) when facing south", () => {
    expect(rover({ x: 0, y: 0, heading: "S" }, "F")).toEqual({ x: 0, y: -1, heading: "S" });
  });
  it("should move forward west (decrease x) when facing west", () => {
    expect(rover({ x: 0, y: 0, heading: "W" }, "F")).toEqual({ x: -1, y: 0, heading: "W" });
  });
  it("should execute a sequence of commands in order", () => {
    expect(rover({ x: 0, y: 0, heading: "N" }, "RFRF")).toEqual({ x: 1, y: -1, heading: "S" });
  });
});
