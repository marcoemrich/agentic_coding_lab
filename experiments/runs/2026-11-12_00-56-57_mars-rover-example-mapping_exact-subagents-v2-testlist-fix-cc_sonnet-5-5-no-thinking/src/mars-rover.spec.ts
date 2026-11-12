import { describe, it, expect } from "vitest";
import { executeCommands } from "./mars-rover.js";

describe("Mars Rover", () => {
  // Rule 5: commands executed sequentially (empty case)
  it("should leave the rover unchanged for an empty command string — (0, 0, N) stays (0, 0, N)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "")).toEqual({
      x: 0,
      y: 0,
      direction: "N",
    });
  });

  // Rule 2: Turning left
  it("should turn left from N to W — (0, 0, N) with 'L' gives (0, 0, W)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "L")).toEqual({
      x: 0,
      y: 0,
      direction: "W",
    });
  });
  it("should turn left from W to S — (0, 0, W) with 'L' gives (0, 0, S)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "W" }, "L")).toEqual({
      x: 0,
      y: 0,
      direction: "S",
    });
  });
  it("should turn left from S to E — (0, 0, S) with 'L' gives (0, 0, E)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "S" }, "L")).toEqual({
      x: 0,
      y: 0,
      direction: "E",
    });
  });
  it("should turn left from E to N — (0, 0, E) with 'L' gives (0, 0, N)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "E" }, "L")).toEqual({
      x: 0,
      y: 0,
      direction: "N",
    });
  });

  // Rule 3: Turning right (spec typo N→E→S→E→N is read as N→E→S→W→N)
  it("should turn right from N to E — (0, 0, N) with 'R' gives (0, 0, E)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "R")).toEqual({
      x: 0,
      y: 0,
      direction: "E",
    });
  });
  it("should turn right from E to S — (0, 0, E) with 'R' gives (0, 0, S)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "E" }, "R")).toEqual({
      x: 0,
      y: 0,
      direction: "S",
    });
  });
  it("should turn right from S to W — (0, 0, S) with 'R' gives (0, 0, W)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "S" }, "R")).toEqual({
      x: 0,
      y: 0,
      direction: "W",
    });
  });
  it("should turn right from W to N — (0, 0, W) with 'R' gives (0, 0, N)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "W" }, "R")).toEqual({
      x: 0,
      y: 0,
      direction: "N",
    });
  });

  // Rule 4: Moving forward
  it("should move forward north — (0, 0, N) with 'F' gives (0, 1, N)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "F")).toEqual({
      x: 0,
      y: 1,
      direction: "N",
    });
  });
  it("should move forward east — (0, 0, E) with 'F' gives (1, 0, E)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "E" }, "F")).toEqual({
      x: 1,
      y: 0,
      direction: "E",
    });
  });
  it("should move forward south — (0, 0, S) with 'F' gives (0, -1, S)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "S" }, "F")).toEqual({
      x: 0,
      y: -1,
      direction: "S",
    });
  });
  it("should move forward west — (0, 0, W) with 'F' gives (-1, 0, W)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "W" }, "F")).toEqual({
      x: -1,
      y: 0,
      direction: "W",
    });
  });

  // Constraint: coordinates can be negative
  it("should allow negative coordinates — (0, 0, S) with 'FF' gives (0, -2, S)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "S" }, "FF")).toEqual({
      x: 0,
      y: -2,
      direction: "S",
    });
  });

  // Rule 5: sequences of commands
  it("should turn around with two left turns — (0, 0, N) with 'LL' gives (0, 0, S)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "LL")).toEqual({
      x: 0,
      y: 0,
      direction: "S",
    });
  });
  it("should return to the original direction after four right turns — (0, 0, N) with 'RRRR' gives (0, 0, N)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "RRRR")).toEqual({
      x: 0,
      y: 0,
      direction: "N",
    });
  });
  it("should execute a complex sequence — (0, 0, N) with 'FFRFF' gives (2, 2, E)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "FFRFF")).toEqual({
      x: 2,
      y: 2,
      direction: "E",
    });
  });
  it("should trace three sides of a 1x1 square — (0, 0, N) with 'FRFRFRF' gives (0, 0, W)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "FRFRFRF")).toEqual({
      x: 0,
      y: 0,
      direction: "W",
    });
  });
  it("should execute a mixed sequence from the rule example — (0, 0, N) with 'FFRFLF' gives (1, 3, N)", () => {
    expect(executeCommands({ x: 0, y: 0, direction: "N" }, "FFRFLF")).toEqual({
      x: 1,
      y: 3,
      direction: "N",
    });
  });
});
