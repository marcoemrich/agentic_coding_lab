import { describe, it, expect } from "vitest";
import { execute } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should return the initial position and heading for an empty command string", () => {
    expect(execute("")).toBe("0:0:N");
  });
  it("should rotate left from north to west", () => {
    expect(execute("L")).toBe("0:0:W");
  });
  it("should rotate right from north to east", () => {
    expect(execute("R")).toBe("0:0:E");
  });
  it("should move forward one square when facing north", () => {
    expect(execute("F")).toBe("0:1:N");
  });
  it("should move forward one square when facing east", () => {
    expect(execute("RF")).toBe("1:0:E");
  });
  it("should move forward one square when facing south", () => {
    expect(execute("RRF")).toBe("0:-1:S");
  });
  it("should move forward one square when facing west", () => {
    expect(execute("LF")).toBe("-1:0:W");
  });
  it("should rotate left through all four headings (N->W->S->E->N)", () => {
    expect(execute("LLLL")).toBe("0:0:N");
  });
  it("should rotate right through all four headings (N->E->S->W->N)", () => {
    expect(execute("RRRR")).toBe("0:0:N");
  });
  it("should execute a sequence of commands in order", () => {
    expect(execute("FFRFF")).toBe("2:2:E");
  });
});
