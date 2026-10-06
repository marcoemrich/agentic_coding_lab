import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { quote, runScenario } from "./claim-office.js";

// Observable failure contract adopted for this run: the specification says only
// that "the CLI exits with a non-zero status code and writes an error
// description to stderr". The most defensible reading is that the domain layer
// signals rejection by throwing an `Error` (no type or message is established
// by the specification) and the CLI adapter translates that into exit code 1
// plus a stderr message. Domain tests therefore assert "throws an Error"; the
// CLI tests assert the non-zero exit status and non-empty stderr.

function runCli(input: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case and the price list ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote([])).toBe(5);
  });
  it("quotes a single plain sword as 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }])).toBe(115);
  });
  it("quotes a single plain amulet as 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }])).toBe(71);
  });
  it("quotes a single plain staff as 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote([{ type: "staff", material: "oak", enchantment: 1, cursed: false }])).toBe(93);
  });
  it("quotes a single plain potion as 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote([{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
  });
  it("quotes a single rune at base premium 25 G (premium 25 + 2.5 + 5 = 32.5 -> 33 G)", () => {
    expect(quote([{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone at base premium 25 G (premium 32.5 -> 33 G)", () => {
    expect(quote([{ type: "moonstone" }])).toBe(33);
  });
  it("rejects a quote item with an unknown type (e.g. broomstick) by throwing an Error", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow(Error);
  });

  // --- Component building blocks ---
  it("quotes 3 runes at base premium 60 G (block applies; premium 60 + 6 + 5 = 71 G)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });

  // --- Item-specific modifiers ---
  it("adds a 50% curse surcharge to the cursed item's base premium only (cursed sword + plain amulet: 160 base + 50 = 210; first insurance 16 = 10 % of the 160 policy base; premium 210 + 16 + 5 = 231 G)", () => {
    expect(
      quote([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]),
    ).toBe(231);
  });
  it("adds a 30% high-enchantment surcharge for enchantment exactly 5 (sword: 100 base + 30 = 130; first insurance 10 = 10 % of the 100 policy base; premium 130 + 10 + 5 = 145 G)", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20% loyalty discount for a customer with exactly 2 years with MHPCO (sword: 100 base - 20 + 10 first insurance + 5 fee = 95 G)", () => {
    expect(
      quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        customer: { yearsWithMHPCO: 2 },
        previousContracts: 0,
      }),
    ).toBe(95);
  });
  it("applies a 15% follow-up discount to every quote after the first in a scenario (second plain sword quote: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // --- Premium rounding ---

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for a regular steel sword with enchantment 3 damaged by 500 G (500 - 100 deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(results[1]).toMatchObject({ payout: 400 });
  });
  it("reports the remaining cap after a claim (sword policy, cap 2000 G, payout 400 G -> remainingCap 1600 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: special clauses ---
  it("reimburses 50% of the damage for enchantment >= 8 (steel sword, enchantment 9, damage 1000 G -> payout 400 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toMatchObject({ payout: 400 });
  });

  // --- Claim: insurance sum and cap ---
  it("caps the payout at twice the insurance sum across successive claims (sword policy, cap 2000 G; 1500 G claim -> payout 1400 G, remainingCap 600 G; second 1500 G claim -> payout 600 G, remainingCap 0 G)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        claim,
        claim,
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type ---
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) by throwing an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(Error);
  });

  // --- Claim: rejections and rounding ---
  it("rejects a claim damage entry with a negative amount (-200) by throwing an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(Error);
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout (schema example)", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  describe("verification", () => {
    it("CLI exits with a non-zero status and writes to stderr for an unknown quote item type, writing no results to stdout -- relies on the CLI error translation (test 41) and the unknown-type rejection (test 8)", () => {
      const { status, stdout, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(status).not.toBe(0);
      expect(stderr).not.toBe("");
      expect(stdout).toBe("");
    });
    it("CLI exits with a non-zero status and writes to stderr for a claim against an item not in the policy -- relies on the CLI error translation (test 41) and the insured-item matching rejection (test 36)", () => {
      const { status, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      });
      expect(status).not.toBe(0);
      expect(stderr).not.toBe("");
    });
    it("CLI exits with a non-zero status and writes to stderr for a claim damage amount of -200 -- relies on the CLI error translation (test 41) and the negative-amount rejection (test 39)", () => {
      const { status, stderr } = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      });
      expect(status).not.toBe(0);
      expect(stderr).not.toBe("");
    });
    it("rounds a payout of 350.5 G down to 350 G (in MHPCO's favor; enchantment 9, damage 901 -> 450.5 - 100 = 350.5) -- relies on payout rounding (test 23) and the 50 % clause (test 27)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 350 });
    });
    it("rejects a claim for an item that is not part of the policy (amulet damaged, only a sword insured) by throwing an Error -- relies on the insured-item matching rejection (test 36)", () => {
      expect(() => runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      })).toThrow(Error);
    });
    it("rejects a claim damage entry with an unknown item type by throwing an Error -- relies on the insured-item matching rejection (test 36): an unknown type is never insured", () => {
      expect(() => runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      })).toThrow(Error);
    });
    it("computes the insurance sum of a sword plus an amulet as 1600 G (cap 3200 G) -- relies on the per-item insurance sum and cap (test 25)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }, { type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("bases the cap on unmodified insurance values (cursed sword, premium 165 G -> cap 2000 G) -- relies on the cap reading insurance values rather than premiums (test 25)", () => {
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
      expect(results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("excludes the block discount from the insurance sum (sword + 3 runes -> insurance sum 1750 G, cap 3500 G) -- relies on the per-item insurance sum (test 25) and the block offer applying to premiums only (test 10)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("insures two swords with an insurance sum of 2000 G (cap 4000 G) -- relies on the per-item insurance sum (test 25)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }, { type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 100, remainingCap: 3900 });
    });
    it("treats two sword damage entries as separate damages with their own deductible (two swords insured, 500 G each -> payout 800 G) -- relies on the per-damage-event deductible (test 23)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }, { type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 800 });
    });
    it("reimburses a dragon-material sword in full (dragon sword, enchantment 5, damage 800 G -> payout 700 G) -- relies on full reimbursement being the default (test 23); the specification offers no example where the dragon clause changes the outcome below enchantment 8", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 700 });
    });
    it("lets the 50% high-enchantment rule win over dragon material (dragon sword, enchantment 9, damage 1000 G -> payout 400 G) -- relies on the >= 8 clause (test 27) taking precedence; full reimbursement is the default, so no dragon-specific branch is needed", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 400 });
    });
    it("applies the 100 G deductible once per damaged item (sword 500 G + amulet 300 G -> payout 600 G) -- relies on the per-damage-event deductible (test 23)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }, { type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 600 });
    });
    it("pays out 100 G for a damaged rune (damage 200 G, no enchantment or material, 200 - 100) -- relies on the uniform deductible reimbursement (test 23)", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 100 });
    });
    it("applies no loyalty discount for a customer with 1 year with MHPCO (sword: premium 115 G) -- relies on the >= 2 years threshold (test 19)", () => {
      expect(
        quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
          customer: { yearsWithMHPCO: 1 },
          previousContracts: 0,
        }),
      ).toBe(115);
    });
    it("rounds a premium of 197.5 G up to 198 G (in MHPCO's favor; 7 runes: 175 base + 17.5 + 5 = 197.5) -- relies on the premium rounding forced by the single-rune premium 32.5 -> 33 (test 6)", () => {
      const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quote(runes)).toBe(198);
    });
    it("adds no high-enchantment surcharge for enchantment 4 (sword: premium 115 G) -- relies on the >= 5 threshold (test 16)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("adds both surcharges to a cursed sword with enchantment 5 (100 base + 50 curse + 30 enchantment = 180; first insurance 10 = 10 % of the 100 policy base; premium 180 + 10 + 5 = 195 G) -- relies on the curse surcharge (test 15) and the high-enchantment surcharge (test 16) accumulating", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("quotes 4 runes at base premium 100 G (no block -- block requires exactly 3; premium 100 + 10 + 5 = 115 G) -- relies on the exact-count block condition (test 10)", () => {
      const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
      expect(quote(runes)).toBe(115);
    });
    it("quotes 7 runes at base premium 175 G (no block -- block requires exactly 3; premium 197.5 -> 198 G) -- relies on the exact-count block condition (test 10)", () => {
      const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quote(runes)).toBe(198);
    });
    it("quotes 2 runes + 1 moonstone at base premium 75 G (no block: different types; premium 87.5 -> 88 G) -- relies on per-type grouping (test 10)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("quotes 3 runes + 3 moonstones at base premium 120 G (two separate blocks; premium 120 + 12 + 5 = 137 G) -- relies on per-type grouping and the block offer (test 10)", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ];
      expect(quote(items)).toBe(137);
    });
    it("quotes 2 runes at base premium 50 G (no block; premium 50 + 5 + 5 = 60 G) -- relies on the single-rune price (test 6) and the policy-base sum (test 3)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    // Combinations expected to pass once their parts exist.
    it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as 165 G -- combines curse surcharge, first insurance and fee", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("quotes a 3-year customer's second contract for a cursed sword with enchantment 7 as 160 G -- combines curse, high enchantment, loyalty, first insurance and follow-up discount", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("pays out 400 G for a dragon sword with exactly enchantment 8 and damage 1000 G -- combines the enchantment-8 threshold with the dragon clause precedence", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 400 });
    });
    it("keeps intermediate amounts as fractions and rounds only the final premium (3 runes + 1 rune-priced moonstone: base 85, +8.5 first insurance, -17 loyalty, +5 fee = 81.5 -> 82 G) -- combines percentage modifiers with premium rounding", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        { type: "moonstone" },
      ];
      expect(
        quote(items, { customer: { yearsWithMHPCO: 2 }, previousContracts: 0 }),
      ).toBe(82);
    });
    it("quotes a staff and a potion together as 137 G -- combines the price-list entries with the policy-wide first-insurance modifier and fee", () => {
      expect(
        quote([
          { type: "staff", material: "oak", enchantment: 1, cursed: false },
          { type: "potion", material: "glass", enchantment: 0, cursed: false },
        ]),
      ).toBe(137);
    });
    it("applies the loyalty discount to a policy base that already includes a block discount (3 runes, 2 years: 60 base + 6 - 12 + 5 = 59 G) -- combines blocks with policy-wide modifiers", () => {
      const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
      expect(quote(runes, { customer: { yearsWithMHPCO: 2 }, previousContracts: 0 })).toBe(59);
    });
    it("pays out for a moonstone damage entry the same way as for a rune (damage 200 G -> 100 G) -- combines the component price list with standard reimbursement", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "moonstone" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "moonstone", amount: 200 }] },
          },
        ],
      });
      expect(results[1]).toMatchObject({ payout: 100 });
    });
    it("yields a payout of 0 G when the damage equals the deductible (damage 100 G) -- combines deductible subtraction with non-negative payouts", () => {
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });
      expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("applies the cap per policy across two different quote steps independently -- combines per-policy cap tracking with multi-step scenarios", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
      const results = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 600 }] },
          },
          {
            op: "claim",
            policy: 1,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });
      expect(results[2]).toEqual({ payout: 500, remainingCap: 1500 });
      expect(results[3]).toEqual({ payout: 200, remainingCap: 1800 });
    });
  });
});
