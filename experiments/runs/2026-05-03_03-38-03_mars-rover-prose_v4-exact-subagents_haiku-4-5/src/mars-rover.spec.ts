import { describe, it, expect } from "vitest";
import { MarsRover } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should initialize rover with position and heading", () => {
    const rover = new MarsRover(0, 0, "N");
    expect(rover.x).toBe(0);
    expect(rover.y).toBe(0);
    expect(rover.heading).toBe("N");
  });
  it("should rotate left from North to West", () => {
    const rover = new MarsRover(0, 0, "N");
    rover.rotateLeft();
    expect(rover.heading).toBe("W");
  });
  it("should rotate left from East to North", () => {
    const rover = new MarsRover(0, 0, "E");
    rover.rotateLeft();
    expect(rover.heading).toBe("N");
  });
  it.todo("should rotate left from South to East");
  it.todo("should rotate left from West to South");
  it("should rotate right from North to East", () => {
    const rover = new MarsRover(0, 0, "N");
    rover.rotateRight();
    expect(rover.heading).toBe("E");
  });
  it.todo("should rotate right from East to South");
  it.todo("should rotate right from South to West");
  it.todo("should rotate right from West to North");
  it("should move forward one square when facing North", () => {
    const rover = new MarsRover(0, 0, "N");
    rover.moveForward();
    expect(rover.x).toBe(0);
    expect(rover.y).toBe(1);
  });
  it.todo("should move forward one square when facing East");
  it.todo("should move forward one square when facing South");
  it.todo("should move forward one square when facing West");
  it("should execute single command L", () => {
    const rover = new MarsRover(0, 0, "N");
    rover.execute("L");
    expect(rover.heading).toBe("W");
  });
  it("should execute single command R", () => {
    const rover = new MarsRover(0, 0, "N");
    rover.execute("R");
    expect(rover.heading).toBe("E");
  });
  it("should execute single command F", () => {
    const rover = new MarsRover(0, 0, "N");
    rover.execute("F");
    expect(rover.x).toBe(0);
    expect(rover.y).toBe(1);
  });
  it.todo("should execute multiple commands in sequence");
  it.todo("should handle negative coordinates after moving");
});
