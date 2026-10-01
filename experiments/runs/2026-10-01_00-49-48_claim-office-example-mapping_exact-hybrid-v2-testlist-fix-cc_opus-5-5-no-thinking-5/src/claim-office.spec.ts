import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const runCli = (input: unknown) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });

const quote = (items: unknown[], yearsWithMHPCO = 0): number =>
  (runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0] as { premium: number }).premium;

type Damage = { itemType: string; amount: number };

const claimSteps = (damagesPerClaim: Damage[][]) =>
  damagesPerClaim.map((damages) => ({
    op: "claim",
    policy: 0,
    incident: { cause: "dragon attack", damages },
  }));

const claims = (items: unknown[], damagesPerClaim: Damage[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items }, ...claimSteps(damagesPerClaim)],
  }).results.slice(1);

const claim = (items: unknown[], damages: Damage[]) => claims(items, [damages])[0];

describe("MHPCO Claim Office", () => {
  describe("quote — edge cases and base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote([])).toBe(5);
    });
    it("plain sword for a newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
    });
    it("plain amulet for a newcomer → 60 + 6 + 5 = 71 G", () => {
      expect(quote([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff for a newcomer → 80 + 8 + 5 = 93 G", () => {
      expect(quote([{ type: "staff" }])).toBe(93);
    });
    it("plain potion for a newcomer → 40 + 4 + 5 = 49 G", () => {
      expect(quote([{ type: "potion" }])).toBe(49);
    });
    it("unknown item type (broomstick) in a quote → throws an error", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });

  describe("quote — components and building blocks", () => {
    it("2 runes → 50 G base premium (premium 50 + 5 + 5 = 60 G)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (premium 60 + 6 + 5 = 71 G)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (premium 100 + 10 + 5 = 115 G)", () => {
      expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
    });
    it("7 runes → 175 G base premium (premium 175 + 17.5 + 5 = 197.5 → 198 G, rounded up)", () => {
      expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, no block across types (premium 75 + 7.5 + 5 = 87.5 → 88 G)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (premium 120 + 12 + 5 = 137 G)", () => {
      const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
      const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
      expect(quote([...runes, ...moonstones])).toBe(137);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("newcomer with cursed steel sword enchantment 3 → 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies (100 + 30 + 10 + 5 = 145 G)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (100 + 10 + 5 = 115 G)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("cursed sword + plain amulet → curse applies only to the sword's base: 160 + 50 = 210, + 16 first + 5 fee = 231 G", () => {
      expect(
        quote([
          { type: "sword", cursed: true },
          { type: "amulet", cursed: false },
        ]),
      ).toBe(231);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → loyalty discount applies (sword: 100 − 20 + 10 + 5 = 95 G)", () => {
      expect(quote([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount (sword: 115 G)", () => {
      expect(quote([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in a scenario gets 15 % follow-up discount (newcomer sword: 100 + 10 − 15 + 5 = 100 G)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("long-standing customer's second contract, cursed steel sword enchantment 7 → 160 G (first insurance still applies)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — reimbursement rules", () => {
    it("regular steel sword enchantment 3, damage 500 → payout 400 G, remaining cap 1600 G", () => {
      expect(
        claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damaged by 200 → payout 100 G (no special clause)", () => {
      expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });
    it("steel sword enchantment 9, damage 1000 → payout 400 G (50 % then deductible)", () => {
      expect(
        claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 9, damage 1000 → payout 400 G (50 % rule wins)", () => {
      expect(
        claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 5, damage 800 → payout 700 G", () => {
      expect(
        claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]),
      ).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 → payout 400 G", () => {
      expect(
        claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("payout yielding 350.5 G is rounded down to 350 G (enchantment 9, damage 901)", () => {
      expect(
        claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]),
      ).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
      expect(
        claim(
          [{ type: "sword" }, { type: "amulet" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two swords insured, both damaged → each damage has its own deductible", () => {
      expect(
        claim(
          [
            { type: "sword", material: "steel", enchantment: 9 },
            { type: "sword", material: "steel", enchantment: 2 },
          ],
          [
            { itemType: "sword", amount: 1000 },
            { itemType: "sword", amount: 500 },
          ],
        ),
      ).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("claim — cap", () => {
    it("policy with two swords → insurance sum 2000, cap 4000 (remaining cap after claim reflects it)", () => {
      expect(claim([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 3600,
      });
    });
    it("sword + amulet → cap 3200 G", () => {
      expect(claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "amulet", amount: 300 }])).toEqual({
        payout: 200,
        remainingCap: 3000,
      });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      expect(
        claim([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes (block) → insurance sum 1750, cap 3500 G", () => {
      expect(
        claim(
          [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          [{ itemType: "rune", amount: 200 }],
        ),
      ).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("two successive claims of 1500 on a sword → 1400 (remaining 600), then 600 (remaining 0)", () => {
      const damage = [{ itemType: "sword", amount: 1500 }];
      expect(claims([{ type: "sword" }], [damage, damage])).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("claim — invalid input", () => {
    it("damage to an item not in the policy (amulet when only sword insured) → throws", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });
    it("damage to an unknown item type → throws", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(
        /broomstick/,
      );
    });
    it("more damage entries of a type than items covered (two swords damaged, one insured) → throws", () => {
      expect(() =>
        claim(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 300 },
            { itemType: "sword", amount: 200 },
          ],
        ),
      ).toThrow(/sword/);
    });
    it("negative damage amount (-200) → throws", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });

  describe("scenario", () => {
    it("schema example: 5-year customer quotes silver amulet then claims 200 fire damage → premium 59 G, payout 100 G, remaining cap 1100 G", () => {
      const result = runScenario({
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
      expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
  });

  describe("CLI", () => {
    it("reads scenario JSON from stdin and writes results JSON to stdout", () => {
      const { status, stdout } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });
      expect(status).toBe(0);
      expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 165 }] });
    });
    it("exits non-zero and writes error to stderr for unknown item type, with no results on stdout", () => {
      const { status, stdout, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(status).not.toBe(0);
      expect(stderr).toMatch(/Unknown item type: broomstick/);
      expect(stdout).toBe("");
    });
  });
});
