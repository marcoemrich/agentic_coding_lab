import { describe, it, expect } from "vitest";
import { execute } from "./mars-rover.js";

describe("Mars Rover", () => {
  it("should return initial position and heading when given no commands", () => {
    expect(execute("")).toBe("0:0:N");
  });
  it("should rotate left from N to W", () => {
    expect(execute("L")).toBe("0:0:W");
  });
  it("should rotate right from N to E", () => {
    expect(execute("R")).toBe("0:0:E");
  });
  it("should move forward facing N by incrementing y", () => {
    expect(execute("F")).toBe("0:1:N");
  });
  it("should move forward facing E by incrementing x", () => {
    expect(execute("RF")).toBe("1:0:E");
  });
  it("should move forward facing S by decrementing y", () => {
    expect(execute("RRF")).toBe("0:-1:S");
  });
  it("should move forward facing W by decrementing x", () => {
    expect(execute("LF")).toBe("-1:0:W");
  });
  it("should rotate left through full cycle (N->W->S->E->N)", () => {
    expect(execute("LLLL")).toBe("0:0:N");
  });
  it("should rotate right through full cycle (N->E->S->W->N)", () => {
    expect(execute("RRRR")).toBe("0:0:N");
  });
  it("should execute a sequence of mixed commands", () => {
    expect(execute("FFRFF")).toBe("2:2:E");
  });
});
