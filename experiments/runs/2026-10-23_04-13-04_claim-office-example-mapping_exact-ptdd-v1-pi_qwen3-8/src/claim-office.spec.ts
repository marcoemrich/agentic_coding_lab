import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./scenario.js";
import type { QuoteItem, ScenarioInput } from "./scenario.js";

/**
 * MHPCO Claim Office — complete inactive test list.
 *
 * Readings adopted where the specification leaves the observable
 * contract open (stated per the test-list skill):
 *
 * - "First insurance" surcharge: the integration examples clarify that
 *   every item in a quote is treated as a first insurance regardless of
 *   customer history, so the +10 % surcharge applies to every quote.
 * - "Follow-up contract" discount: applies from the second quote step
 *   within the scenario (the scenario has no other contract history).
 * - Building block: applies only when the quote contains exactly 3
 *   components of one type (spec: 4 runes -> no block, 7 runes -> 175 G,
 *   3 runes + 3 moonstones -> two separate blocks).
 * - Errors: the spec defines the observable contract only at CLI level
 *   (non-zero exit, description on stderr, no results on stdout). Error
 *   tests therefore spawn the CLI.
 * - Rounding: premiums round up, payouts round down ("in the MHPCO's
 *   favor"); intermediate amounts stay fractional (integer 1/100 G math).
 */

type Step = ScenarioInput["steps"][number];

function scenario(steps: Step[], yearsWithMHPCO = 0): ScenarioInput {
  return { customer: { yearsWithMHPCO }, steps };
}

function quote(items: QuoteItem[], yearsWithMHPCO = 0): ScenarioInput {
  return scenario([{ op: "quote", items }], yearsWithMHPCO);
}

/** Spawn the claim-office CLI with a JSON scenario on stdin. */
function runCli(input: ScenarioInput): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums", () => {
    it("empty item list -> premium 5 G (only the 5 G processing fee)", () => {
      const out = runScenario(quote([]));
      expect(out.results).toEqual([{ premium: 5 }]);
    });
    it("sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const out = runScenario(quote([{ type: "sword" }]));
      expect(out.results).toEqual([{ premium: 115 }]);
    });
    it("amulet -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      const out = runScenario(quote([{ type: "amulet" }]));
      expect(out.results).toEqual([{ premium: 71 }]);
    });
    it("staff -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      const out = runScenario(quote([{ type: "staff" }]));
      expect(out.results).toEqual([{ premium: 93 }]);
    });
    it("potion -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      const out = runScenario(quote([{ type: "potion" }]));
      expect(out.results).toEqual([{ premium: 49 }]);
    });
    it("rune component -> premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
      const out = runScenario(quote([{ type: "rune" }]));
      expect(out.results).toEqual([{ premium: 33 }]);
    });
    it("moonstone component -> premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
      const out = runScenario(quote([{ type: "moonstone" }]));
      expect(out.results).toEqual([{ premium: 33 }]);
    });
  });

  describe("quote: building block of 3 alike components", () => {
    it("2 runes -> premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
      const out = runScenario(quote([{ type: "rune" }, { type: "rune" }]));
      expect(out.results).toEqual([{ premium: 60 }]);
    });
    it("3 runes -> premium 71 G (block base 60 + 6 first insurance + 5 fee)", () => {
      const out = runScenario(
        quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
      );
      expect(out.results).toEqual([{ premium: 71 }]);
    });
    it("3 moonstones -> premium 71 G (block applies to moonstones too)", () => {
      const out = runScenario(
        quote([
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ]),
      );
      expect(out.results).toEqual([{ premium: 71 }]);
    });
    it("4 runes -> premium 115 G (no block, block requires exactly 3: 100 + 10 + 5)", () => {
      const out = runScenario(
        quote([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      );
      expect(out.results).toEqual([{ premium: 115 }]);
    });
    it("7 runes -> premium 198 G (175 base + 17.5 first insurance + 5 fee = 197.5, rounded up to 198)", () => {
      const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const out = runScenario(quote(runes));
      expect(out.results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone -> premium 88 G (75 base, no block across types; 82.5 + 5 rounded up)", () => {
      const out = runScenario(
        quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
      );
      expect(out.results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones -> premium 137 G (two separate blocks: 120 + 12 + 5)", () => {
      const out = runScenario(
        quote([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ]),
      );
      expect(out.results).toEqual([{ premium: 137 }]);
    });
  });

  describe("quote: item-specific modifiers", () => {
    it("newcomer's cursed sword -> premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      const out = runScenario(
        quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
      );
      expect(out.results).toEqual([{ premium: 165 }]);
    });
    it("sword with enchantment 5 -> premium 145 G (100 + 30 high enchantment + 10 + 5; threshold exactly 5)", () => {
      const out = runScenario(
        quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }]),
      );
      expect(out.results).toEqual([{ premium: 145 }]);
    });
    it("sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge below 5)", () => {
      const out = runScenario(
        quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }]),
      );
      expect(out.results).toEqual([{ premium: 115 }]);
    });
    it("cursed sword with enchantment 5 -> premium 195 G (both surcharges: 100 + 50 + 30 + 10 + 5)", () => {
      const out = runScenario(
        quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }]),
      );
      expect(out.results).toEqual([{ premium: 195 }]);
    });
    it("cursed sword with enchantment 4 -> premium 165 G (curse only, no high enchantment)", () => {
      const out = runScenario(
        quote([{ type: "sword", material: "steel", enchantment: 4, cursed: true }]),
      );
      expect(out.results).toEqual([{ premium: 165 }]);
    });
    it("cursed sword + plain amulet -> premium 231 G (curse adds 50 G on the sword's base only: 210 + 16 first insurance on policy base 160 + 5 fee)", () => {
      const out = runScenario(
        quote([
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ]),
      );
      expect(out.results).toEqual([{ premium: 231 }]);
    });
  });

  describe("quote: policy-wide modifiers", () => {
    it("sword, exactly 2 years with MHPCO -> premium 95 G (loyalty discount applies at the threshold: 100 - 20 + 10 + 5)", () => {
      const out = runScenario(quote([{ type: "sword" }], 2));
      expect(out.results).toEqual([{ premium: 95 }]);
    });
    it("sword, 1 year with MHPCO -> premium 115 G (no loyalty discount below 2 years)", () => {
      const out = runScenario(quote([{ type: "sword" }], 1));
      expect(out.results).toEqual([{ premium: 115 }]);
    });
    it("second quote of the scenario gets the follow-up discount -> premiums [115, 100] G (100 - 15 + 10 + 5)", () => {
      const out = runScenario(
        scenario([{ op: "quote", items: [{ type: "sword" }] }, { op: "quote", items: [{ type: "sword" }] }]),
      );
      expect(out.results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
  });

  describe("quote: integration examples", () => {
    it("long-standing customer's second contract: cursed sword enchantment 7, 3 years -> premiums [95, 160] G (first quote plain sword 100 - 20 + 10 + 5; second 180 - 20 + 10 - 15 + 5; first insurance still applies)", () => {
      const out = runScenario(
        scenario(
          [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 7, cursed: true },
              ],
            },
          ],
          3,
        ),
      );
      expect(out.results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
  });

  describe("claim: reimbursement", () => {
    it("regular steel sword enchantment 3, damage 500 -> payout 400 G, remainingCap 1600 G (full reimbursement minus 100 deductible; cap 2x1000)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune, damage 200 -> payout 100 G, remainingCap 400 G (no enchantment/material clauses for components; cap 2x250)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("dragon-material sword enchantment 9, damage 1000 -> payout 400 G (both clauses, 50% rule wins: 500 - 100)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 8, damage 1000 -> payout 400 G (threshold exactly 8: 500 - 100)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword enchantment 5, damage 800 -> payout 700 G (only dragon clause: full reimbursement, 800 - 100)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword enchantment 9, damage 1000 -> payout 400 G (only high-enchantment clause: 500 - 100)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim: deductible and same-type items", () => {
    it("dragon attack damages sword 500 and amulet 300 -> payout 600 G (deductible once per damaged item)", () => {
      const out = runScenario(
        scenario([
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
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("policy with two swords, damages entries sword 500 + sword 300 -> payout 600 G, remainingCap 3400 G (insurance sum 2000, cap 4000; each entry separate)", () => {
      const out = runScenario(
        scenario([
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
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
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("claim: payout cap", () => {
    it("cursed sword, damage 300 -> payout 200 G, remainingCap 1800 G (cap based on unmodified insurance value 1000, cap 2000)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("sword + 3-rune block, sword damage 100 -> payout 0 G, remainingCap 3500 G (insurance sum 1750; block discount affects premium only)", () => {
      const out = runScenario(
        scenario([
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
    });
    it("cap exhaustion: sword, two successive claims of 1500 -> payouts [1400, 600], remainingCaps [600, 0] (cap 2000)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("steel sword enchantment 9, damage 901 -> payout 350 G (450.5 - 100 = 350.5 rounded down)", () => {
      const out = runScenario(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ]),
      );
      expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("scenario integration (schema example)", () => {
    it("schema example: amulet silver enchantment 2, 5 years, then fire claim 200 -> premium 59 G (60 - 12 + 6 + 5), payout 100 G, remainingCap 1100 G", () => {
      const out = runScenario(
        scenario(
          [
            { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
          5,
        ),
      );
      expect(out.results).toEqual([
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ]);
    });
  });

  describe("error contract (CLI exits non-zero with stderr description)", () => {
    it("quote with unknown item type broomstick -> non-zero exit, error on stderr, no results on stdout", () => {
      const result = runCli(
        quote([{ type: "broomstick" }]),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("claim damaging an amulet when only a sword is insured -> non-zero exit, error on stderr", () => {
      const result = runCli(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ]),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("claim with more damage entries of a type than insured (two sword damages, one sword insured) -> non-zero exit, whole claim rejected", () => {
      const result = runCli(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
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
        ]),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("claim damage entry with unknown item type -> non-zero exit, error on stderr", () => {
      const result = runCli(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ]),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
    it("claim damage entry with amount -200 -> non-zero exit, error on stderr", () => {
      const result = runCli(
        scenario([
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ]),
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).not.toContain("results");
    });
  });
});
