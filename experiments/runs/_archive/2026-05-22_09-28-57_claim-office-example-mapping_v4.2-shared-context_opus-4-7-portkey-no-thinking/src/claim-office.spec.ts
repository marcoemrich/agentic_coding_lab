import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";
import { runScenario } from "./cli.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums and fee", () => {
    it("empty item list returns premium 5 G (processing fee only)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
    });
    it("single plain sword (year 0, first contract) returns 115 G (100 base + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
    });
    it("single plain amulet (year 0, first contract) returns 71 G (60 base + 6 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);
    });
    it("single plain staff (year 0, first contract) returns 93 G (80 base + 8 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff", material: "wood", enchantment: 0, cursed: false }])).toBe(93);
    });
    it("single plain potion (year 0, first contract) returns 49 G (40 base + 4 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
    });
  });

  describe("Quote — components and block discount", () => {
    it("2 runes returns 60 G (50 base + 5 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
      ])).toBe(60);
    });
    it("3 runes returns 71 G (60 block base + 6 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])).toBe(71);
    });
    it("4 runes returns 115 G (100 base + 10 first-insurance + 5 fee; no block since not exactly 3)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])).toBe(115);
    });
    it("7 runes returns 198 G (175 base + 17.5 first-insurance + 5 fee = 197.5 rounded up)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])).toBe(198);
    });
    it("2 runes + 1 moonstone returns 88 G (75 base + 7.5 first-insurance + 5 fee = 87.5 rounded up; alike means same type)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ])).toBe(88);
    });
    it("3 runes + 3 moonstones returns 137 G (120 base from two blocks + 12 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ])).toBe(137);
    });
  });

  describe("Quote — item-specific modifiers", () => {
    it("cursed sword (steel, ench 3, year 0, first contract) returns 165 G (100 + 50 curse + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("cursed sword + plain amulet (year 0, first contract) returns 231 G (curse applies only to sword: 100+50+60 base + 10+6 first-ins + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ])).toBe(231);
    });
    it("sword with enchantment exactly 5 (year 0) returns 145 G (100 + 30 high-ench + 10 first-ins + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
    });
    it("sword with enchantment 4 (year 0) returns 115 G (no high-ench surcharge)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("cursed sword with enchantment 5 (year 0) returns 195 G (100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
  });

  describe("Quote — policy-wide modifiers", () => {
    it("2-year customer with plain sword, first contract returns 95 G (100 + 10 first-ins − 20 loyalty + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(95);
    });
    it("3-year customer's second quote of cursed sword ench 7 returns 160 G (100 + 50 curse + 30 high-ench + 10 first-ins − 20 loyalty − 15 follow-up + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 3, previousContracts: 1 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }])).toBe(160);
    });
  });

  describe("Claim — standard reimbursement and deductible", () => {
    it("steel sword ench 3 damaged 500 G returns payout 400 G and remainingCap 1600 (cap 2000 − 400)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] };
      const incident = { damages: [{ itemType: "sword", amount: 500 }] };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damaged 200 G returns payout 100 G and remainingCap 400 (cap 500 − 100; no special clause for components)", () => {
      const policy = { items: [{ type: "rune" }] };
      const incident = { damages: [{ itemType: "rune", amount: 200 }] };
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("dragon attack damages sword 500 G + amulet 300 G returns payout 600 G (deductible per damage event: 400 + 200)", () => {
      const policy = { items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ] };
      const incident = { damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ] };
      expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim — special reimbursement clauses", () => {
    it("steel sword ench 9 damaged 1000 G returns payout 400 G (50% rule then deductible)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] };
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword ench 5 damaged 800 G returns payout 700 G (full reimbursement then deductible)", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] };
      const incident = { damages: [{ itemType: "sword", amount: 800 }] };
      expect(claim(policy, incident)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword ench 9 damaged 1000 G returns payout 400 G (both clauses: 50% wins, then deductible)", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] };
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword ench exactly 8 damaged 1000 G returns payout 400 G (50% applies at threshold)", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] };
      const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim — cap behavior", () => {
    it("sword insured; two successive 1500 G claims: first payout 1400 remainingCap 600, second payout 600 remainingCap 0", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] };
      const incident = { damages: [{ itemType: "sword", amount: 1500 }] };
      const first = claim(policy, incident);
      expect(first).toEqual({ payout: 1400, remainingCap: 600 });
      const policyAfter = { ...policy, remainingCap: first.remainingCap };
      const second = claim(policyAfter, incident);
      expect(second).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("cursed sword's cap remains 2000 G (premium modifiers do not raise the cap)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] };
      const incident = { damages: [{ itemType: "sword", amount: 3000 }] };
      expect(claim(policy, incident)).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("sword + 3 runes: insurance sum 1750 G, cap 3500 G (block discount affects premium only, not insurance sum)", () => {
      const policy = { items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ] };
      const incident = { damages: [{ itemType: "sword", amount: 4000 }] };
      expect(claim(policy, incident)).toEqual({ payout: 3500, remainingCap: 0 });
    });
    it("policy with two swords: insurance sum 2000 G, cap 4000 G; both damaged 500 G each returns payout 800 G", () => {
      const policy = { items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ] };
      const incident = { damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ] };
      expect(claim(policy, incident)).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("payout calculation yielding 350.5 G is rounded down to 350 G (sword ench 9 damaged 901 G: 450.5 − 100 = 350.5 → 350)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] };
      const incident = { damages: [{ itemType: "sword", amount: 901 }] };
      expect(claim(policy, incident)).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("CLI — JSON stdin/stdout interface", () => {
    it("quote-only scenario via stdin produces {results:[{premium:<int>}]} on stdout", () => {
      const scenario = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          },
        ],
      });
      const result = runScenario(scenario);
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }] });
    });
    it("quote-then-claim scenario produces results with {premium} then {payout, remainingCap}", () => {
      const scenario = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      const result = runScenario(scenario);
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
    });
    it("quote with unknown item type ({type:'broomstick'}) exits non-zero, writes error to stderr, writes no results to stdout", () => {
      const scenario = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" }],
          },
        ],
      });
      const result = runScenario(scenario);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("claim referencing item type not present in policy exits non-zero with stderr error", () => {
      const scenario = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      const result = runScenario(scenario);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("claim with negative damage amount (amount: -200) exits non-zero with stderr error", () => {
      const scenario = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      });
      const result = runScenario(scenario);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("claim with more damage entries of a type than the policy contains (2 sword damages, 1 sword insured) exits non-zero with stderr error", () => {
      const scenario = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });
      const result = runScenario(scenario);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
  });
});
