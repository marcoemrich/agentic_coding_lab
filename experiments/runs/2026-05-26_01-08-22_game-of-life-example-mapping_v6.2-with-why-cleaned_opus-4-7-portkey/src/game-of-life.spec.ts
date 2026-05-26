import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0), (1,0), (0,1), (1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("live cell with 2 neighbors survives (row of 3, center survives) — center of [(0,0),(1,0),(2,0)] stays alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(new Set(next.map((c) => c.join(",")))).toContain("1,0");
  });
  it("live cell with 3 neighbors survives — T shape: (1,0) has 3 neighbors and survives", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(new Set(next.map((c) => c.join(",")))).toContain("1,0");
  });
  it("dead cell with exactly 3 neighbors becomes alive — Rule 4 example: [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(next.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("live cell with 4 neighbors dies from overpopulation — center (1,1) with 4 neighbors dies", () => {
    const next = nextGeneration([[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]]);
    expect(new Set(next.map((c) => c.join(",")))).not.toContain("1,1");
  });
  it("blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(next.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("handles negative coordinates — blinker in negative space oscillates", () => {
    const next = nextGeneration([[-5, -6], [-5, -5], [-5, -4]]);
    expect(new Set(next.map((c) => c.join(",")))).toEqual(
      new Set(["-6,-5", "-5,-5", "-4,-5"]),
    );
  });
});
