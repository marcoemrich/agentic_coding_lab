import { describe, it, expect } from "vitest";
import { quote, claim, createPolicy } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - basic functionality", () => {
    it("should return 0 premium for empty item list", () => {
      expect(quote([])).toBe(0);
    });
    it("should return 100G base premium for single sword", () => {
      expect(quote([{ type: "sword" }])).toBe(100);
    });
    it("should return 60G base premium for single amulet", () => {
      expect(quote([{ type: "amulet" }])).toBe(60);
    });
    it("should return 80G base premium for single staff", () => {
      expect(quote([{ type: "staff" }])).toBe(80);
    });
    it("should return 40G base premium for single potion", () => {
      expect(quote([{ type: "potion" }])).toBe(40);
    });
    it("should sum premiums for two different items", () => {
      expect(quote([{ type: "sword" }, { type: "amulet" }])).toBe(160);
    });
    it("should sum premiums for multiple items", () => {
      expect(quote([{ type: "sword" }, { type: "amulet" }, { type: "staff" }])).toBe(240);
    });
    it("should calculate base premium for single component", () => {
      expect(quote([{ type: "component" }])).toBe(25);
    });
    it("should apply 60G discount for three identical components", () => {
      expect(quote([{ type: "component", count: 3 }])).toBe(35);
    });
    it("should sum premiums correctly with mixed items and components", () => {
      expect(quote([{ type: "sword" }, { type: "component", count: 3 }])).toBe(135);
    });
  });

  describe("claim - basic functionality", () => {
    it("should reject claim on non-existent policy", () => {
      const result = claim("non-existent", 500);
      expect(result).toEqual({ policyId: "non-existent", payout: 0, error: "Policy not found" });
    });
    it("should apply 100G deductible to damage claim", () => {
      const policy = createPolicy([{ type: "sword" }]);
      const result = claim(policy.id, 150);
      expect(result.payout).toBe(50);
    });
    it("should return 0 payout when damage equals deductible", () => {
      const policy = createPolicy([{ type: "sword" }]); // 100G premium = 100G deductible
      const result = claim(policy.id, 100); // damage = 100, after deductible = 0
      expect(result.payout).toBe(0);
    });
    it("should cap payout at 2x insurance sum", () => {
      const policy = createPolicy([{ type: "sword" }]); // 100G premium
      const result = claim(policy.id, 400); // damage = 400, after deductible = 300, cap at 2x premium = 200
      expect(result.payout).toBe(200); // Should be capped at 2x (200G max)
    });
    it("should process valid claim with correct payout after deductible", () => {
      const policy = createPolicy([{ type: "amulet" }]); // 60G premium = 60G deductible
      const result = claim(policy.id, 150); // damage = 150, after deductible = 50, under 2x cap
      expect(result.payout).toBe(50);
    });
  });
});
