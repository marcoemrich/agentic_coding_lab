import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("a sword → base premium 100 G, premium 115 G (100 + 10 first insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("an amulet → base premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a staff → base premium 80 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a potion → base premium 40 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
              ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword adds a 50 % risk surcharge on the item's base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with enchantment 5 → high-enchantment surcharge of 30 % applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("sword with enchantment 5 and cursed → both surcharges apply", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G (only on the sword) → 210 G before further modifiers and fee", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("first insurance carries a 10 % initial assessment surcharge on the policy base premium", () => {
      // the cursed sword's base premium is 100 G and its curse surcharge 50 G;
      // the initial assessment adds 10 G — 10 % of the policy base, not of the 150 G
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year with MHPCO → no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("second contract of a scenario → 15 % follow-up discount on the policy base premium", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("first insurance surcharge still applies on a follow-up contract", () => {
      const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      });

      expect((result.results[1] as { premium: number }).premium).toBe(160);
    });
    it("a 5 G processing fee is added at the very end of every premium", () => {
      const loyal = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 base + 10 first insurance − 20 loyalty = 90, + 5 fee (not discounted) = 95
      expect(loyal).toEqual({ results: [{ premium: 95 }] });
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
      // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
      // 5 runes, loyal customer: base 125, +12.5 first insurance, −25 loyalty
      // = 112.5, + 5 fee = 117.5 → 118. Rounding each intermediate would give 119.
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: Array.from({ length: 5 }, () => ({ type: "rune" })) },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 118 }] });
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed sword (steel, ench. 3) → premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer (3 years), second quote, cursed sword (steel, ench. 7) → premium 160 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      });

      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (deductible 100 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("claim — special clauses", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (100 G deductible per damaged item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
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
      });

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
      // enchantment 9 → 50 % of 901 = 450.5, minus the 100 G deductible = 350.5
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });

      // payout 0 (100 damage − 100 deductible) leaves the full cap of 3200 G
      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
    });
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword, sword] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
    });
    it("a cursed sword → cap 2000 G (based on unmodified insurance value)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 165 });
      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
    });
    it("sword (cap 2000 G), two successive claims of 1500 G each → first payout 1400 G, remainingCap 600 G", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          claim,
          claim,
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("second of the two 1500 G claims → payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          claim,
          claim,
        ],
      });

      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("policy covers two swords, damages contains two sword entries → each treated as a separate damage with its own deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 1000 },
              ],
            },
          },
        ],
      });

      // one sword pays in full (500 − 100 = 400), the enchantment-9 sword at half
      // rate (500 − 100 = 400); each damage carries its own deductible
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("more damage entries of a type than the policy covers → error (whole claim rejected)", () => {
      expect(() =>
        runScenario({
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
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 500 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("errors", () => {
    it("quote includes an item with an unknown type (e.g. broomstick) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow(/broomstick/);
    });
    it("claim references a damage entry whose item is not part of the policy → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        }),
      ).toThrow(/amulet/);
    });
    it("claim references a damage entry with an unknown item type → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
            },
          ],
        }),
      ).toThrow(/broomstick/);
    });
    it("claim contains a damage entry with amount -200 → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
      ).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    it("reads a scenario from stdin and writes {results: [...]} to stdout, same length and order as steps", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };

      const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf8",
      });

      expect(run.status).toBe(0);
      expect(JSON.parse(run.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("exits with a non-zero status code and writes an error description to stderr on invalid input", () => {
      const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
        encoding: "utf8",
      });

      expect(run.status).not.toBe(0);
      expect(run.stdout).toBe("");
      expect(run.stderr).toMatch(/broomstick/);
      // a description for the reader, not a stack trace dumped at them
      expect(run.stderr).not.toMatch(/\bat\s+\w+.*:\d+:\d+/);
    });
  });
});
