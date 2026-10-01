import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliOutcome {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return {
      status: failure.status ?? 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

// Test list for the MHPCO Claim Office kata.
//
// Observable contract for rejection cases: the specification states that the
// CLI "exits with a non-zero status code and writes an error description to
// stderr". The chosen reading is that the domain layer signals rejection by
// throwing an Error, and the CLI adapter translates a thrown Error into a
// non-zero exit code plus a stderr message. The specification does not
// establish an error subtype or message text, so tests assert `Error` only.

describe("MHPCO Claim Office", () => {
  describe("quote -- processing fee and empty policy", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(results).toEqual([{ premium: 5 }]);
    });
  });

  describe("quote -- main item base premiums (price list)", () => {
    it("a plain sword -> base premium 100 G; with the 10 % first-insurance surcharge and the 5 G fee -> premium 115 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("a plain amulet -> base premium 60 G; with first insurance and fee -> premium 71 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(results).toEqual([{ premium: 71 }]);
    });
    it("a plain staff -> base premium 80 G; with first insurance and fee -> premium 93 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(results).toEqual([{ premium: 93 }]);
    });
    it("a plain potion -> base premium 40 G; with first insurance and fee -> premium 49 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(results).toEqual([{ premium: 49 }]);
    });
  });

  describe("quote -- component base premiums", () => {
    it("1 rune -> base premium 25 G; with first insurance and fee -> 32.5 G, rounded up to premium 33 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(results).toEqual([{ premium: 33 }]);
    });
    it("1 moonstone -> base premium 25 G; with first insurance and fee -> 32.5 G, rounded up to premium 33 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });
      expect(results).toEqual([{ premium: 33 }]);
    });
    it("2 runes -> base premium 50 G; with first insurance and fee -> premium 60 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(results).toEqual([{ premium: 60 }]);
    });
    it("3 runes -> base premium 60 G (block applies); with first insurance and fee -> premium 71 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });
      expect(results).toEqual([{ premium: 71 }]);
    });
    it("4 runes -> base premium 100 G (no block -- block requires exactly 3); with first insurance and fee -> premium 115 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("7 runes -> base premium 175 G; with first insurance and fee -> 197.5 G, rounded up to premium 198 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
      });
      expect(results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone -> base premium 75 G (no block: different types); with first insurance and fee -> 87.5 G, rounded up to premium 88 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        ],
      });
      expect(results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks); with first insurance and fee -> premium 137 G", () => {
      const results = runScenario({
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
      expect(results).toEqual([{ premium: 137 }]);
    });
    it("3 moonstones -> base premium 60 G (block applies to moonstones too); with first insurance and fee -> premium 71 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array.from({ length: 3 }, () => ({ type: "moonstone" })) },
        ],
      });
      expect(results).toEqual([{ premium: 71 }]);
    });
  });

  describe("quote -- item-specific modifiers", () => {
    it("a cursed sword -> 100 G base + 50 G curse surcharge + 10 G first insurance + 5 G fee = 165 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });
      expect(results).toEqual([{ premium: 165 }]);
    });
    it("a cursed amulet -> 60 G base + 30 G curse surcharge + 6 G first insurance + 5 G fee = 101 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet", cursed: true }] }],
      });
      expect(results).toEqual([{ premium: 101 }]);
    });
    it("a sword with enchantment 5 -> high-enchantment surcharge applies: 100 + 30 + 10 first insurance + 5 = 145 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(results).toEqual([{ premium: 145 }]);
    });
    it("a sword with enchantment 4 -> no high-enchantment surcharge: 100 + 10 first insurance + 5 = 115 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("a sword with enchantment 9 -> high-enchantment surcharge applies: 100 + 30 + 10 first insurance + 5 = 145 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 9 }] }],
      });
      expect(results).toEqual([{ premium: 145 }]);
    });
    it("a cursed sword with enchantment 5 -> both surcharges apply: 100 + 50 + 30 + 10 first insurance + 5 = 195 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
      });
      expect(results).toEqual([{ premium: 195 }]);
    });
    it("a cursed sword with enchantment 4 -> only curse surcharge: 100 + 50 + 10 first insurance + 5 = 165 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }],
      });
      expect(results).toEqual([{ premium: 165 }]);
    });
  });

  describe("quote -- modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet -> policy base 160 G, curse adds 50 G (50 % of the cursed item's base, not the policy total) + 16 G first insurance + 5 G fee = 231 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
        ],
      });
      expect(results).toEqual([{ premium: 231 }]);
    });
    it("plain sword + amulet with enchantment 5 -> policy base 160 G, high-enchantment adds 18 G (30 % of the amulet's base) + 16 G first insurance + 5 G fee = 199 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet", enchantment: 5 }] },
        ],
      });
      expect(results).toEqual([{ premium: 199 }]);
    });
  });

  describe("quote -- policy-wide modifiers", () => {
    it("customer with 2 years with MHPCO -> loyalty discount applies: plain sword 100 - 20 + 10 first insurance + 5 = 95 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 95 }]);
    });
    it("customer with 1 year with MHPCO -> no loyalty discount: plain sword 100 + 10 first insurance + 5 = 115 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("customer with 3 years with MHPCO -> loyalty discount applies: plain sword 100 - 20 + 10 first insurance + 5 = 95 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 95 }]);
    });
    it("loyalty discount is 20 % of the policy base premium (sum of all item base premiums): sword + amulet, 2 years -> 160 - 32 + 16 first insurance + 5 = 149 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
      });
      expect(results).toEqual([{ premium: 149 }]);
    });
    it("first insurance surcharge: 10 % of the policy base premium applies to every quote -- each item in a quote is treated as a first insurance regardless of customer history", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 95 }]);
    });
    it("follow-up contract discount: the second quote in a scenario gets 15 % off the policy base premium -> 100 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("the third quote in a scenario also gets the 15 % follow-up discount -> 100 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
    });
    it("the first quote in a scenario gets no follow-up discount -> 115 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("the processing fee is added once at the very end, after all percentage modifiers: sword, 2 years -> 90 G + 5 G fee = 95 G (not 105 x 0.9 = 94.5 G)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(results).toEqual([{ premium: 95 }]);
    });
  });

  describe("quote -- rounding in the MHPCO's favor", () => {
    it("a premium calculation that yields 197.5 G -> final premium 198 G (rounded up)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
      });
      expect(results).toEqual([{ premium: 198 }]);
    });
    it("intermediate amounts are kept as fractions; only the final premium is rounded: 1 rune, 2 years -> 22.5 + 5 = 27.5 -> 28 G (not 27 G from a rounded intermediate)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(results).toEqual([{ premium: 28 }]);
    });
  });

  describe("quote -- integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed steel sword, enchantment 3 -> premium 165 G (100 base + 50 curse + 10 first insurance = 160 + 5 fee)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(results).toEqual([{ premium: 165 }]);
    });
    it("3-year customer, second quote, cursed steel sword, enchantment 7 -> premium 160 G (100 + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote -- rejections", () => {
    it("a quote with an item of unknown type (e.g. broomstick) is rejected -- the domain throws an Error and no results are produced", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow(Error);
    });
  });

  describe("claim -- standard reimbursement and deductible", () => {
    it("regular steel sword, enchantment 3, damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G (runes have no enchantment or material, so no special clause applies)", () => {
      const results = runScenario({
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
      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("damage below the deductible, e.g. 50 G -> payout 0 G (chosen reading: a damage smaller than the deductible reimburses nothing rather than a negative amount)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 50 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
  });

  describe("claim -- high enchantment clause", () => {
    it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible: 500 - 100)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("steel sword, enchantment 8, damage 1000 G -> payout 400 G (threshold is enchantment >= 8)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("steel sword, enchantment 7, damage 1000 G -> payout 900 G (no high-enchantment clause: 1000 - 100)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
    });
  });

  describe("claim -- dragon material clause", () => {
    it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword, enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim -- deductible per damage event", () => {
    it("a dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -> payout 600 G (the 100 G deductible applies once per damaged item)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
      expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim -- multiple items of the same type", () => {
    it("a policy covering two swords has insurance sum 2000 G and cap 4000 G (observed via remainingCap 3900 after a 200 G damage)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 3900 });
    });
    it("two sword damages against a two-sword policy -> each entry is a separate damage with its own deductible: (500-100) + (300-100) = 600 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
      });
      expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) is rejected -- the domain throws an Error and the whole claim is rejected", () => {
      expect(() =>
        runScenario({
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
        }),
      ).toThrow(Error);
    });
  });

  describe("claim -- insurance sum and cap", () => {
    it("a policy covering a sword and an amulet has insurance sum 1600 G (= 1000 + 600) and cap 3200 G (observed via remainingCap 3100 after a 200 G damage)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("a cursed sword (premium with modifiers 165 G) has cap 2000 G -- the cap is based on the unmodified insurance value (observed via remainingCap 1900 after a 200 G damage)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results).toEqual([{ premium: 165 }, { payout: 100, remainingCap: 1900 }]);
    });
    it("a policy covering a sword and 3 runes has insurance sum 1750 G (= 1000 + 3x250) -- the block discount affects the premium only, not the insurance sum (observed via remainingCap 3400 after a 200 G damage)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
  });

  describe("claim -- cap exhaustion across successive claims", () => {
    it("sword policy (cap 2000 G), first claim of 1500 G -> payout 1400 G, remainingCap 600 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("sword policy (cap 2000 G), second claim of 1500 G after the first -> payout 600 G, remainingCap 0 G (the desired 1400 G is reduced to the remaining cap)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("a third claim after the cap is exhausted -> payout 0 G, remainingCap 0 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "theft", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      expect(results[3]).toEqual({ payout: 0, remainingCap: 0 });
    });
  });

  describe("claim -- rounding in the MHPCO's favor", () => {
    it("a payout calculation that yields 350.5 G -> final payout 350 G (rounded down): enchantment 9 sword, damage 901 -> 450.5 - 100 = 350.5", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
    it("intermediate amounts are kept as fractions; only the final payout is rounded: two enchantment-9 damages of 901 -> 350.5 + 350.5 = 701 G (not 700 G from rounding each damage)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9 },
              { type: "sword", material: "steel", enchantment: 9 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 901 },
                { itemType: "sword", amount: 901 },
              ],
            },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 701, remainingCap: 3299 });
    });
  });

  describe("claim -- rejections", () => {
    it("a damage entry whose item is not part of the policy (amulet damaged when only a sword is insured) is rejected -- the domain throws an Error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
            },
          ],
        }),
      ).toThrow(Error);
    });
    it("a damage entry with an unknown item type is rejected -- the domain throws an Error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
            },
          ],
        }),
      ).toThrow(Error);
    });
    it("a damage entry with amount: -200 is rejected -- the domain throws an Error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
      ).toThrow(Error);
    });
    it("a claim referencing a policy step index that is not a quote is rejected -- the domain throws an Error naming the missing policy", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 99,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
            },
          ],
        }),
      ).toThrow(/policy/i);
    });
  });

  describe("scenario -- sequencing and result shape", () => {
    it("results has the same length and order as steps", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });
      expect(results).toHaveLength(3);
      expect(results.map((result) => Object.keys(result).sort().join(","))).toEqual([
        "premium",
        "payout,remainingCap",
        "premium",
      ]);
    });
    it("a quote result contains only premium; a claim result contains payout and remainingCap", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });
      expect(Object.keys(results[0])).toEqual(["premium"]);
      expect(Object.keys(results[1]).sort()).toEqual(["payout", "remainingCap"]);
    });
    it("the schema example scenario (5-year customer, amulet quote then 200 G amulet claim) -> premium 59 G (60 - 12 loyalty + 6 first insurance + 5 fee), payout 100 G, remainingCap 1100 G", () => {
      const results = runScenario({
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
      });
      expect(results).toEqual([
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ]);
    });
    it("a claim refers to the policy created by the quote step at its zero-based policy index, not to the most recent quote", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results[2]).toEqual({ payout: 100, remainingCap: 1900 });
    });
  });

  describe("CLI", () => {
    it("reads a JSON scenario from stdin and writes {results: [...]} as JSON to stdout", () => {
      const outcome = runCli({
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
      });
      expect(JSON.parse(outcome.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("exits with status 0 on a valid scenario", () => {
      const outcome = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(outcome.status).toBe(0);
    });
    it("on a rejected scenario exits with a non-zero status code, writes an error description to stderr, and writes no results to stdout", () => {
      const outcome = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(outcome.status).not.toBe(0);
      expect(outcome.stdout).toBe("");
      expect(outcome.stderr).toContain("broomstick");
      expect(outcome.stderr).not.toContain("at ");
    });
  });
});
