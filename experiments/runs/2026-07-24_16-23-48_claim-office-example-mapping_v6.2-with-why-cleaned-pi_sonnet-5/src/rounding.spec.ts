import { describe, it, expect } from "vitest";
import { roundPremium, roundPayout } from "./rounding.js";

describe("Rounding in the MHPCO's favor", () => {
  it("rounds a premium fraction up -- 197.5 G becomes 198 G", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("rounds a payout fraction down -- 350.5 G becomes 350 G", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
});
