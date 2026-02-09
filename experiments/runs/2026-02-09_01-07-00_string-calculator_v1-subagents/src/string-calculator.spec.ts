import { describe, it, expect } from "vitest";
import { add } from "./string-calculator.js";

describe("String Calculator", () => {
  it("should return 0 for empty string", () => {
    expect(add("")).toBe(0);
  });
  it("should return the number for a single number", () => {
    expect(add("5")).toBe(5);
  });
  it("should return sum for two comma-separated numbers", () => {
    expect(add("1,2")).toBe(3);
  });
  it("should return sum for multiple comma-separated numbers", () => {
    expect(add("1,2,3,4,5")).toBe(15);
  });
});
