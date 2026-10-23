import { describe, it, expect } from "vitest";
import { processScenario } from "./scenario.js";

describe("scenario processing", () => {
  describe("basic sequential processing", () => {
    it("quote then claim: returns results in order, claim references quote by index", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      expect(result.results).toHaveLength(2);
      expect(result.results[0]).toEqual({ premium: expect.any(Number) });
      expect(result.results[1]).toEqual({
        payout: expect.any(Number),
        remainingCap: expect.any(Number),
      });
    });
  });

  describe("follow-up contract", () => {
    it("first quote has no follow-up contract discount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("second quote in same scenario applies follow-up contract discount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
        ],
      });
      // First quote: 115 (no follow-up)
      // Second quote: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("cap across multiple claims", () => {
    it("two successive claims on the same policy track remainingCap", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      // First: payout 1400, remainingCap 600
      // Second: payout 600 (capped), remainingCap 0
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("errors propagate", () => {
    it("rejects claim referencing non-existent policy index", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: 100 }],
              },
            },
          ],
        }),
      ).toThrow(/Invalid policy index/);
    });
  });
});
