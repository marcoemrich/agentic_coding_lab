import { describe, it, expect } from "vitest";
import { runScenario, createPolicy, type Scenario } from "./claim-office.js";

describe("Claim Office - Quote", () => {
  it(
    "should charge only the processing fee for an empty item list -- premium 5 G",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
    }
  );
  it(
    "should quote a single sword for a new customer's first contract -- premium 115 G (100 base + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    }
  );
  it(
    "should quote 2 runes without the block premium -- premium 60 G (50 base + 5 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
    }
  );
  it(
    "should quote 3 alike runes with the block premium -- premium 71 G (60 block base + 6 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    }
  );
  it(
    "should quote 4 runes without the block premium (block requires exactly 3) -- premium 115 G (100 base + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    }
  );
  it(
    "should quote 7 runes as plain components and round a fractional premium up -- premium 198 G (175 base, 197.5 rounded up to 198)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
    }
  );
  it(
    "should not treat runes and moonstones as alike (no block) -- 2 runes + 1 moonstone: premium 88 G (75 base + 7.5 first-insurance = 87.5 rounded up)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
    }
  );
  it(
    "should apply two separate blocks for 3 runes and 3 moonstones -- premium 137 G (60 + 60 base + 12 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
    }
  );
});

describe("Claim Office - Quote modifiers", () => {
  it(
    "should apply the cursed surcharge only to the cursed item, not the policy total -- cursed sword + plain amulet: premium 231 G (160 base + 50 curse on sword + 16 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true },
              { type: "amulet" },
            ],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
    }
  );
  it(
    "should apply the loyalty discount at exactly 2 years with MHPCO -- sword for a 2-year customer: premium 95 G (100 base - 20 loyalty + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
    }
  );
  it(
    "should apply the high-enchantment surcharge at exactly enchantment 5 -- enchantment 5 sword: premium 145 G (100 base + 30 surcharge + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 5 }],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
    }
  );
  it(
    "should apply both curse and high-enchantment surcharges when a sword is cursed with enchantment 5 -- premium 195 G (100 + 30 + 50 + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 5 }],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
    }
  );
  it(
    "should not apply the high-enchantment surcharge at enchantment 4 -- non-cursed sword: premium 115 G (100 base + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 4 }] },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    }
  );
  it(
    "should apply only the curse surcharge at enchantment 4 when cursed -- premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 4 }],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    }
  );
  it(
    "should quote a newcomer's first contract with a cursed sword -- integration example: premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    }
  );
  it(
    "should apply loyalty, first-insurance and follow-up-contract modifiers together -- 3-year customer, second quote, cursed enchantment 7 sword: premium 160 G (100 + 50 + 30 - 20 loyalty + 10 first-insurance - 15 follow-up + 5 fee)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 7,
                cursed: true,
              },
            ],
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 59 }, { premium: 160 }],
      });
    }
  );
});

describe("Claim Office - Claim payouts", () => {
  it(
    "should reimburse a regular steel sword damage minus deductible -- steel enchantment 3 sword, damage 500: payout 400, remainingCap 1600",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    }
  );
  it(
    "should reimburse component damage with no special clauses -- rune damage 200: payout 100 (200 - 100 deductible), premium 33, remainingCap 400",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    }
  );
  it(
    "should apply the 50% high-enchantment clause first, then the deductible -- dragon-material sword enchantment 8 damage 1000: payout 400 (500 - 100), premium 145",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 8 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    }
  );
  it(
    "should apply the 100 G deductible once per damaged item -- sword damage 500 + amulet damage 300: payout 600, remainingCap 2600, premium 181",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "amulet" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    }
  );
  it(
    "should let the 50% high-enchantment clause win over full dragon reimbursement -- dragon sword enchantment 9 damage 1000: payout 400 (500 - 100), premium 145",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    }
  );
  it(
    "should fully reimburse dragon-material damage when no high enchantment applies -- dragon sword enchantment 5 damage 800: payout 700 (800 - 100), premium 145",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 5 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    }
  );
  it(
    "should apply only the high-enchantment clause for a non-dragon sword -- steel sword enchantment 9 damage 1000: payout 400 (500 - 100), premium 145",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    }
  );
  it(
    "should round a fractional payout down -- steel sword enchantment 9 damage 901: payout 350 (450.5 - 100 = 350.5 rounded down), remainingCap 1650",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
      });
    }
  );
});

describe("Claim Office - Policy and cap", () => {
  it(
    "should set insurance sum and cap for two swords -- insurance sum 2000 G, cap 4000 G",
    () => {
      const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
      expect(policy.insuranceSum).toBe(2000);
      expect(policy.cap).toBe(4000);
    }
  );
  it(
    "should treat each damage entry for the same type as a separate damage with its own deductible -- two insured swords, damages 500 + 300: payout 600, remainingCap 3400",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "sword" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
      });
    }
  );
  it(
    "should set insurance sum and cap for a sword plus an amulet -- insurance sum 1600 G, cap 3200 G",
    () => {
      const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
      expect(policy.insuranceSum).toBe(1600);
      expect(policy.cap).toBe(3200);
    }
  );
  it(
    "should base the cap on the unmodified insurance value -- cursed sword: cap 2000 G (premium modifiers do not raise the cap)",
    () => {
      const policy = createPolicy([{ type: "sword", cursed: true }]);
      expect(policy.insuranceSum).toBe(1000);
      expect(policy.cap).toBe(2000);
    }
  );
  it(
    "should not apply the component block discount to the insurance sum -- sword + 3 runes: insurance sum 1750 G (1000 + 3 x 250)",
    () => {
      const policy = createPolicy([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]);
      expect(policy.insuranceSum).toBe(1750);
      expect(policy.cap).toBe(3500);
    }
  );
  it(
    "should reduce the payout to the remaining cap across successive claims -- sword (cap 2000), claims of 1500: first payout 1400 (cap 600), second payout 600 (cap 0)",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    }
  );
});

describe("Claim Office - Scenarios", () => {
  it(
    "should produce results matching the schema example -- 5-year customer, amulet quote then fire claim: premium 59, payout 100, remainingCap 1100",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    }
  );
});

describe("Claim Office - Errors", () => {
  it(
    "should reject a quote containing an unknown item type -- { type: broomstick } throws an error",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };
      expect(() => runScenario(scenario)).toThrow();
    }
  );
  it(
    "should reject a claim for an item that is not part of the policy -- amulet damage when only a sword is insured throws an error",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 100 }],
            },
          },
        ],
      };
      expect(() => runScenario(scenario)).toThrow();
    }
  );
  it(
    "should reject a claim with a negative damage amount -- amount -200 throws an error",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "accident",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };
      expect(() => runScenario(scenario)).toThrow();
    }
  );
  it(
    "should reject a claim with more damage entries of a type than the policy covers -- two sword damages against one insured sword throws an error",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };
      expect(() => runScenario(scenario)).toThrow();
    }
  );
  it(
    "should reject a claim whose damage entry has an unknown item type -- itemType broomstick throws an error",
    () => {
const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      };
      expect(() => runScenario(scenario)).toThrow();
    }
  );
});