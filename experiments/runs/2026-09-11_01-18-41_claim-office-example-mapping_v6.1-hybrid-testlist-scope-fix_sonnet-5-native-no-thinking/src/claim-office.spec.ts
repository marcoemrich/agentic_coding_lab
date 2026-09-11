import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim, basePremium, policyBasePremium } from "./claim-office.js";

function runCli(input: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums and edge cases", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const premium = quote({ yearsWithMHPCO: 0 }, []);
      expect(premium).toBe(5);
    });
    it("quote includes an item with an unknown type (e.g. 'broomstick') → error", () => {
      expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow();
    });
  });

  describe("Quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("4 runes → 100 G base premium (no block — requires exactly 3)", () => {
      expect(
        basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])
      ).toBe(100);
    });
    it("7 runes → 175 G base premium", () => {
      expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
    });
  });

  describe("Quote — 'alike' components (same type, not same family)", () => {
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      expect(
        basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])
      ).toBe(75);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      expect(
        basePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ])
      ).toBe(120);
    });
  });

  describe("Quote — modifier scope on multi-item policies", () => {
    it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G + 50 G curse (item-specific, not policy-wide) = 210 G before further modifiers and fee", () => {
      const premium = policyBasePremium([
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]);
      expect(premium).toBe(210);
    });
  });

  describe("Quote — modifier thresholds", () => {
    it("customer with exactly 2 years with MHPCO → loyalty discount applies", () => {
      // amulet base 60: +10% first insurance -20% loyalty = 60*0.9 = 54, +5 fee = 59
      const premium = quote({ yearsWithMHPCO: 2 }, [{ type: "amulet" }]);
      expect(premium).toBe(59);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
      expect(policyBasePremium([{ type: "sword", enchantment: 5 }])).toBe(130);
    });
    it("sword with exactly enchantment 5, cursed → both surcharges apply", () => {
      expect(policyBasePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(180);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      expect(policyBasePremium([{ type: "sword", enchantment: 4 }])).toBe(100);
    });
    it("sword with enchantment 4, cursed → curse surcharge applies alone", () => {
      expect(policyBasePremium([{ type: "sword", enchantment: 4, cursed: true }])).toBe(150);
    });
  });

  describe("Quote — rounding in the MHPCO's favor", () => {
    it("a premium calculation yielding an X.5 G intermediate value → final premium rounded up", () => {
      // sword (enchantment 5): 100*(1+0.3+0.1)=140; rune: 25*(1+0.1)=27.5; sum=167.5, +5 fee=172.5 → 173
      const premium = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }, { type: "rune" }]);
      expect(premium).toBe(173);
    });
  });

  describe("Quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
      const premium = quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]);
      expect(premium).toBe(165);
    });
    it("long-standing customer (3 years), second quote in scenario, cursed sword (steel, enchantment 7) → premium 160 G (first-insurance surcharge still applies per item; follow-up contract discount applies to the policy)", () => {
      const premium = quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        true
      );
      expect(premium).toBe(160);
    });
  });

  describe("Claim — standard reimbursement (no special clauses)", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus 100 G deductible)", () => {
      const result = claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        [{ itemType: "sword", amount: 500 }]
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (no enchantment/material, so no special clause)", () => {
      const result = claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim — enchantment threshold vs. dragon material", () => {
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        [{ itemType: "sword", amount: 1000 }]
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; 50% rule wins, then deductible)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }]
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only dragon-material clause applies: full reimbursement, then deductible)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        [{ itemType: "sword", amount: 800 }]
      );
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause applies: 50% first, then deductible)", () => {
      const result = claim(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }]
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim — deductible per damage event", () => {
    it("dragon attack damages an insured sword (500 G) and an insured amulet (300 G) → payout 600 G (100 G deductible applies once per damaged item)", () => {
      const result = claim(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]
      );
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim — multiple items of the same type", () => {
    it("a policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = claim([{ type: "sword" }, { type: "sword" }], []);
      expect(result).toEqual({ payout: 0, remainingCap: 4000 });
    });
    it("a dragon attack damages both swords via two separate damage entries → each treated as a separate damage with its own deductible", () => {
      const result = claim(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]
      );
      expect(result).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("damages array contains more entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
      expect(() =>
        claim(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ]
        )
      ).toThrow();
    });
  });

  describe("Claim — cap exhaustion", () => {
    it("a policy covers a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = claim([{ type: "sword" }, { type: "amulet" }], []);
      expect(result).toEqual({ payout: 0, remainingCap: 3200 });
    });
    it("a cursed sword (insurance value 1000 G, premium with modifiers 165 G) → cap 2000 G (based on unmodified insurance value; premium modifiers do not raise the cap)", () => {
      const result = claim([{ type: "sword", cursed: true, enchantment: 3 }], []);
      expect(result).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("a policy covers a sword and 3 runes (a block) → insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
      const result = claim(
        [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        []
      );
      expect(result).toEqual({ payout: 0, remainingCap: 3500 });
    });
    it("a sword is insured (cap 2000 G); first of two successive 1500 G claims → payout 1400 G, remaining cap 600 G", () => {
      const result = claim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }]);
      expect(result).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("same sword policy; second successive 1500 G claim after the first → payout 600 G, remaining cap 0 G (desired 1400 G reduced to remaining cap)", () => {
      const result = claim(
        [{ type: "sword" }],
        [{ itemType: "sword", amount: 1500 }],
        1400
      );
      expect(result).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Claim — rounding in the MHPCO's favor", () => {
    it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
      // enchantment 8 -> 50% rate: 901*0.5=450.5, -100 deductible = 350.5 -> floor 350
      const result = claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]);
      expect(result).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("Claim — edge cases", () => {
    it("claim references a damage entry whose item is not part of the policy (e.g. amulet damaged when only a sword is insured) → error", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])
      ).toThrow();
    });
    it("claim references a damage entry with an unknown item type → error", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])
      ).toThrow();
    });
    it("claim contains a damage entry with amount: -200 → error", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])
      ).toThrow();
    });
  });

  describe("CLI — stdin/stdout integration", () => {
    it("reads a scenario JSON from stdin and writes a results JSON array of the same length/order to stdout (schema example: amulet quote + claim)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };

      const { status, stdout } = runCli(scenario);

      expect(status).toBe(0);
      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("quote step with an unknown item type → CLI exits with non-zero status and writes an error description to stderr; no results written to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      const { status, stdout, stderr } = runCli(scenario);

      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
      expect(stdout).toBe("");
    });
    it("claim step with an out-of-policy item, unknown item type, or negative damage amount → CLI exits with non-zero status and writes an error description to stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };

      const { status, stderr } = runCli(scenario);

      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
    });
  });
});
