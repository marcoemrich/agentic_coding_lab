import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  type Item,
  basePremium,
  payoutCap,
  quote,
  runScenario,
} from "./claim-office.js";

// Observable contract chosen for rejection cases:
// The specification says the CLI "exits with a non-zero status code and writes
// an error description to stderr". The domain layer signals this by throwing an
// Error; the CLI adapter translates a thrown Error into exit code 1 plus a
// stderr message and writes no `results` to stdout. Tests below state which of
// the two levels they observe. The specification does not establish an error
// subtype, so only "throws an Error" is asserted at the domain level.
//
// Two observation levels are used for premiums, mirroring the specification's
// own vocabulary: `basePremium` is the policy base premium (the sum of the item
// base premiums, including item-level surcharges where stated), while `quote`
// is the CLI-observable total premium after policy-wide modifiers and the fee.
// The specification's per-rule examples quote base premiums; its integration
// examples quote total premiums.

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

const runCli = (stdin: unknown) =>
  new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = execFile("npx", ["tsx", CLI], (error, stdout, stderr) => {
      resolve({ code: error === null ? 0 : ((error as { code?: number }).code ?? 1), stdout, stderr });
    });
    child.stdin?.end(JSON.stringify(stdin));
  });

const claimOn = (policy: number, damages: { itemType: string; amount: number }[]) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "dragon attack", damages },
});

const payoutFor = (items: Item[], damages: { itemType: string; amount: number }[]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote" as const, items }, claimOn(0, damages)],
  }).results[1];

const swordQuotes = (count: number) =>
  Array.from({ length: count }, () => ({ op: "quote" as const, items: [{ type: "sword" }] }));

const runes = (count: number): Item[] => Array.from({ length: count }, () => ({ type: "rune" }));
const moonstones = (count: number): Item[] =>
  Array.from({ length: count }, () => ({ type: "moonstone" }));

describe("MHPCO claim office", () => {
  describe("quote -- processing fee and empty policy", () => {
    it("charges the 5 G processing fee alone for an empty item list -- premium 5 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
    });
  });

  describe("quote -- base premium per item type", () => {
    it("quotes a plain sword -- base premium 100 G", () => {
      expect(basePremium([{ type: "sword" }])).toBe(100);
    });
    it("quotes a plain amulet -- base premium 60 G", () => {
      expect(basePremium([{ type: "amulet" }])).toBe(60);
    });
    it("quotes a plain staff -- base premium 80 G", () => {
      expect(basePremium([{ type: "staff" }])).toBe(80);
    });
    it("quotes a plain potion -- base premium 40 G", () => {
      expect(basePremium([{ type: "potion" }])).toBe(40);
    });
    it("quotes a single rune component -- base premium 25 G", () => {
      expect(basePremium([{ type: "rune" }])).toBe(25);
    });
    it("quotes a single moonstone component -- base premium 25 G", () => {
      expect(basePremium([{ type: "moonstone" }])).toBe(25);
    });
  });

  describe("quote -- multiple items sum their base premiums", () => {
    it("quotes a sword and an amulet -- base premium 160 G (base premiums sum)", () => {
      expect(basePremium([{ type: "sword" }, { type: "amulet" }])).toBe(160);
    });
  });

  describe("quote -- building block of 3 alike components", () => {
    it("quotes 2 runes -- base premium 50 G (no block)", () => {
      expect(basePremium(runes(2))).toBe(50);
    });
    it("quotes 3 runes -- base premium 60 G (block applies)", () => {
      expect(basePremium(runes(3))).toBe(60);
    });
    it("quotes 4 runes -- base premium 100 G (no block; block requires exactly 3)", () => {
      expect(basePremium(runes(4))).toBe(100);
    });
    it("quotes 7 runes -- base premium 175 G (no block at 7 components)", () => {
      expect(basePremium(runes(7))).toBe(175);
    });
    it("quotes 3 moonstones -- base premium 60 G (block applies to moonstones too)", () => {
      expect(basePremium(moonstones(3))).toBe(60);
    });
  });

  describe("quote -- 'alike' means the same component type, not the same family", () => {
    it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: different types)", () => {
      expect(basePremium([...runes(2), ...moonstones(1)])).toBe(75);
    });
    it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
      expect(basePremium([...runes(3), ...moonstones(3)])).toBe(120);
    });
  });

  describe("quote -- item-level modifier: curse surcharge 50 %", () => {
    it("adds 50 G for a cursed sword -- base premium 100 G + 50 G curse", () => {
      expect(basePremium([{ type: "sword", cursed: true }])).toBe(150);
    });
    it("adds 30 G for a cursed amulet -- 50 % of that item's own base premium 60 G", () => {
      expect(basePremium([{ type: "amulet", cursed: true }])).toBe(90);
    });
  });

  describe("quote -- item-level modifier: high enchantment (level >= 5) 30 %", () => {
    it("adds no surcharge for a sword with enchantment 4 -- below the threshold", () => {
      expect(basePremium([{ type: "sword", enchantment: 4 }])).toBe(100);
    });
    it("adds 30 G for a sword with exactly enchantment 5 -- threshold is inclusive", () => {
      expect(basePremium([{ type: "sword", enchantment: 5 }])).toBe(130);
    });
    it("adds 30 G for a sword with enchantment 7 -- above the threshold", () => {
      expect(basePremium([{ type: "sword", enchantment: 7 }])).toBe(130);
    });
    it("adds both surcharges for a cursed sword with exactly enchantment 5 -- 100 + 50 + 30", () => {
      expect(basePremium([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(180);
    });
    it("adds only the curse surcharge for a cursed sword with enchantment 4 -- 100 + 50", () => {
      expect(basePremium([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(150);
    });
  });

  describe("quote -- item-level modifiers apply per item, not policy-wide", () => {
    it("charges a cursed sword plus a plain amulet -- 160 G base + 50 G curse = 210 G before policy modifiers and fee", () => {
      expect(basePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
    });
  });

  describe("quote -- policy-level modifier: loyalty discount 20 % (>= 2 years)", () => {
    it("grants no loyalty discount at 1 year with MHPCO -- below the threshold", () => {
      expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
    });
    it("grants a 20 G loyalty discount at exactly 2 years for a 100 G sword policy -- threshold is inclusive", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
    });
    it("applies the loyalty discount to the policy base premium -- 20 % of the sum of all item base premiums", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }, { type: "amulet" }])).toBe(149);
    });
  });

  describe("quote -- policy-level modifier: first insurance surcharge 10 %", () => {
    it("adds a 10 G first-insurance surcharge on a 100 G sword policy -- 10 % of the policy base premium", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
    });
    it("still adds the first-insurance surcharge on a long-standing customer's follow-up quote -- each quoted item is a first insurance", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote" as const, items: [{ type: "amulet" }] },
          { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 7 }] },
        ],
      };
      expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote -- policy-level modifier: follow-up contract discount 15 %", () => {
    it("grants no follow-up discount on the customer's first quote in the scenario", () => {
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: swordQuotes(1) }).results).toEqual([
        { premium: 115 },
      ]);
    });
    it("grants a 15 G follow-up discount on a 100 G sword in the customer's second quote", () => {
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: swordQuotes(2) }).results).toEqual([
        { premium: 115 },
        { premium: 100 },
      ]);
    });
    it("grants the follow-up discount on the customer's third quote as well -- every contract after the first", () => {
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: swordQuotes(3) }).results).toEqual([
        { premium: 115 },
        { premium: 100 },
        { premium: 100 },
      ]);
    });
  });

  describe("quote -- rounding in the MHPCO's favour", () => {
    it("rounds a premium of 197.5 G up to 198 G", () => {
      expect(quote({ yearsWithMHPCO: 1 }, runes(7))).toBe(198);
    });
    it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 2 },
          steps: [
            { op: "quote" as const, items: [{ type: "sword" }] },
            { op: "quote" as const, items: runes(7) },
          ],
        }).results[1],
      ).toEqual({ premium: 137 });
    });
  });

  describe("quote -- integration examples", () => {
    it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) -- premium 165 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
        ]),
      ).toBe(165);
    });
    it("quotes a 3-year customer's second contract for a cursed steel sword (enchantment 7) -- premium 160 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 3 },
          steps: [
            { op: "quote" as const, items: [{ type: "potion" }] },
            {
              op: "quote" as const,
              items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
            },
          ],
        }).results[1],
      ).toEqual({ premium: 160 });
    });
  });

  describe("quote -- rejection", () => {
    it("throws an Error for an item with an unknown type such as 'broomstick'", () => {
      expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(
        /broomstick/,
      );
    });
  });

  describe("claim -- insurance sum and cap per item type", () => {
    it("caps a sword policy at 2000 G -- insurance value 1000 G, cap = 2 x sum", () => {
      expect(payoutCap([{ type: "sword" }])).toBe(2000);
    });
    it("caps an amulet policy at 1200 G -- insurance value 600 G", () => {
      expect(payoutCap([{ type: "amulet" }])).toBe(1200);
    });
    it("caps a staff policy at 1600 G -- insurance value 800 G", () => {
      expect(payoutCap([{ type: "staff" }])).toBe(1600);
    });
    it("caps a potion policy at 800 G -- insurance value 400 G", () => {
      expect(payoutCap([{ type: "potion" }])).toBe(800);
    });
    it("caps a rune policy at 500 G -- component insurance value 250 G", () => {
      expect(payoutCap(runes(1))).toBe(500);
    });
    it("caps a moonstone policy at 500 G -- component insurance value 250 G", () => {
      expect(payoutCap(moonstones(1))).toBe(500);
    });
    it("caps a sword-and-amulet policy at 3200 G -- insurance sum 1600 G", () => {
      expect(payoutCap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
    });
    it("caps a sword-and-3-runes policy at 3500 G -- insurance sum 1750 G; the block discount affects the premium only", () => {
      expect(payoutCap([{ type: "sword" }, ...runes(3)])).toBe(3500);
    });
    it("caps a cursed sword policy at 2000 G -- premium modifiers do not raise the cap", () => {
      expect(payoutCap([{ type: "sword", cursed: true, enchantment: 9 }])).toBe(2000);
    });
    it("caps a two-sword policy at 4000 G -- insurance sum 2000 G", () => {
      expect(payoutCap([{ type: "sword" }, { type: "sword" }])).toBe(4000);
    });
  });

  describe("claim -- standard reimbursement and the 100 G deductible", () => {
    it("pays 400 G for 500 G damage to a regular steel sword with enchantment 3 -- full reimbursement minus the deductible", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "steel", enchantment: 3 }],
          [{ itemType: "sword", amount: 500 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("pays 100 G for 200 G damage to a rune -- components have no enchantment or material, so no special clause applies", () => {
      expect(payoutFor(runes(1), [{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });
    it("applies the 100 G deductible once per damaged item -- 500 G sword + 300 G amulet damage pays 600 G", () => {
      expect(
        payoutFor(
          [{ type: "sword" }, { type: "amulet" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim -- high enchantment (level >= 8) reimburses 50 %", () => {
    it("pays 400 G for 1000 G damage to a steel sword with enchantment 9 -- 50 % first, then the deductible", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "steel", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("pays 400 G for 1000 G damage to a steel sword with exactly enchantment 8 -- threshold is inclusive", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "steel", enchantment: 8 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("pays 900 G for 1000 G damage to a steel sword with enchantment 7 -- below the threshold, full reimbursement", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "steel", enchantment: 7 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toEqual({ payout: 900, remainingCap: 1100 });
    });
  });

  describe("claim -- dragon material reimburses fully", () => {
    it("pays 700 G for 800 G damage to a dragon sword with enchantment 5 -- full reimbursement, then the deductible", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "dragon", enchantment: 5 }],
          [{ itemType: "sword", amount: 800 }],
        ),
      ).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("pays 400 G for 1000 G damage to a dragon sword with enchantment 9 -- the 50 % rule wins over full reimbursement", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "dragon", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("pays 400 G for 1000 G damage to a dragon sword with exactly enchantment 8 -- the 50 % rule wins at the threshold", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "dragon", enchantment: 8 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim -- payout cap at twice the insurance sum", () => {
    it("pays 1400 G on a first 1500 G claim against a sword policy -- remainingCap 600 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          claimOn(0, [{ itemType: "sword", amount: 1500 }]),
          claimOn(0, [{ itemType: "sword", amount: 1500 }]),
        ],
      }).results;
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("pays only 600 G on a second 1500 G claim -- the desired 1400 G is reduced to the remaining cap, remainingCap 0 G", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          claimOn(0, [{ itemType: "sword", amount: 1500 }]),
          claimOn(0, [{ itemType: "sword", amount: 1500 }]),
        ],
      }).results;
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("reports the full cap as remaining when no claim has been made yet", () => {
      expect(payoutFor([{ type: "sword" }], [{ itemType: "sword", amount: 100 }])).toEqual({
        payout: 0,
        remainingCap: 2000,
      });
    });
  });

  describe("claim -- rounding in the MHPCO's favour", () => {
    it("rounds a payout of 350.5 G down to 350 G", () => {
      expect(
        payoutFor(
          [{ type: "sword", material: "steel", enchantment: 8 }],
          [{ itemType: "sword", amount: 901 }],
        ),
      ).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim -- multiple items of the same type", () => {
    it("treats two sword damage entries against a two-sword policy as separate damages with their own deductible", () => {
      expect(
        payoutFor(
          [{ type: "sword" }, { type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("throws an Error when the damages contain more entries of a type than the policy insures (two sword damages, one sword insured)", () => {
      expect(() =>
        payoutFor(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toThrow(/sword/);
    });
  });

  describe("claim -- rejection", () => {
    it("throws an Error when a damage names an item not in the policy -- amulet damaged, only a sword insured", () => {
      expect(() =>
        payoutFor([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }]),
      ).toThrow(/amulet/);
    });
    it("throws an Error when a damage names an unknown item type", () => {
      expect(() =>
        payoutFor([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }]),
      ).toThrow(/broomstick/);
    });
    it("throws an Error for a damage entry with a negative amount such as -200", () => {
      expect(() =>
        payoutFor([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
      ).toThrow(/-200/);
    });
  });

  describe("scenario processing", () => {
    it("returns one result per step, in step order", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote" as const, items: [{ type: "sword" }] },
            claimOn(0, [{ itemType: "sword", amount: 500 }]),
            { op: "quote" as const, items: [{ type: "amulet" }] },
          ],
        }).results,
      ).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
        { premium: 62 },
      ]);
    });
    it("resolves a claim's `policy` field as the zero-based index of the quote step that created the policy", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [{ type: "sword" }] },
          { op: "quote" as const, items: [{ type: "amulet" }] },
          claimOn(1, [{ itemType: "amulet", amount: 500 }]),
        ],
      }).results;
      expect(results[2]).toEqual({ payout: 400, remainingCap: 800 });
    });
    it("shares one customer across every step of the scenario", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 5 },
          steps: swordQuotes(2),
        }).results,
      ).toEqual([{ premium: 95 }, { premium: 80 }]);
    });
  });

  describe("CLI at src/cli.ts", () => {
    it("reads a scenario from stdin and writes {results: [...]} as JSON to stdout with exit code 0", async () => {
      const { code, stdout } = await runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
    });
    it("writes the schema example scenario's quote premium and claim payout/remainingCap to stdout", async () => {
      const { code, stdout } = await runCli({
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
      expect(code).toBe(0);
      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("exits with a non-zero status code, writes an error description to stderr, and writes no results to stdout for an unknown item type", async () => {
      const { code, stdout, stderr } = await runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(code).not.toBe(0);
      expect(stderr).toMatch(/broomstick/);
      expect(stdout).not.toMatch(/results/);
    });
    it("exits with a non-zero status code and writes an error description to stderr for a rejected claim", async () => {
      const { code, stderr } = await runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(code).not.toBe(0);
      expect(stderr).toMatch(/amulet/);
    });
  });
});
