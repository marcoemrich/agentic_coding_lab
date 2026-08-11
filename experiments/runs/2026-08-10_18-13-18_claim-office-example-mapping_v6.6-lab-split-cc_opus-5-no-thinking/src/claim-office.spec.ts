import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

/**
 * Spawns the real CLI so the tests exercise the actual stdin/stdout/exit-status
 * contract rather than an internal function. Invokes the resolved tsx binary
 * directly — going through `npx` costs ~200 ms per call in package resolution.
 */
const runCli = (stdin: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: stdin,
    encoding: "utf8",
  });

/**
 * The spec's ordinary sword, used wherever a test needs an insured item whose
 * OWN attributes change nothing — claims, caps, the deductible, the error
 * cases. Deliberately NOT a general scenario builder: each test below spells
 * out its own `{customer, steps}` literal so the example stays readable end to
 * end, and so the shape the CLI parses is visible in the tests that assert it.
 * The duplication that is worth removing is this one — a fixture whose fields
 * are all inert, repeated until a reader can no longer tell which test is
 * varying something and which is not.
 *
 * Every field here is chosen to be BELOW or OFF every threshold, so the item
 * contributes no modifier and no clause: enchantment 3 is under both the
 * premium bar (5) and the payout bar (8), and it is uncursed. Tests that
 * exercise a threshold state their own item inline rather than spreading this
 * one, which keeps the varied attribute at the point of use.
 *
 * `material` is inert in a second, stronger sense: `Item` has no such field
 * and the engine never reads it. It is retained because the spec's examples
 * carry it and the dragon tests below turn on it in prose — see the
 * `reimbursementFor` comment for why dragon material is unimplementable while
 * no example can observe it.
 */
const PLAIN_SWORD = {
  type: "sword",
  material: "steel",
  enchantment: 3,
  cursed: false,
};

describe("MHPCO Claim Office", () => {
  // --- Base premiums: single main items (each + 10% first insurance + 5 G fee) ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword (base 100 G) as 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet (base 60 G) as 71 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff (base 80 G) as 93 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion (base 40 G) as 49 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and the building block of 3 alike ---
  it("quotes 2 runes as base premium 50 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };

    // base 50 + 10 % first insurance (5) + 5 fee = 60
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes 3 runes as base premium 60 G (block applies)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    // base 60 (block) + 10 % first insurance (6) + 5 fee = 71
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes as base premium 100 G (no block — block requires exactly 3)", () => {
    const scenario = {
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

    // base 100 (no block) + 10 % first insurance (10) + 5 fee = 115
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes as base premium 175 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    };

    // base 175 (7 x 25, no block) + 10 % first insurance (17.5) + 5 fee
    // = 197.5, rounded up in the MHPCO's favour = 198
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: different types)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    // "alike" means the same type: 2 runes (50) + 1 moonstone (25) = 75 base,
    // no block. + 10 % first insurance (7.5) + 5 fee = 87.5, rounded up = 88
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks)", () => {
    const scenario = {
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
    };

    // each type forms its own block: 60 + 60 = 120 base
    // + 10 % first insurance (12) + 5 fee = 137
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific premium modifiers ---
  // The spec's "Newcomer with a cursed sword" integration example is exactly
  // this case — 0 years, cursed steel sword, enchantment 3, premium 165 G — so
  // it is asserted here rather than duplicated below.
  it("adds a 50 % curse surcharge to a cursed sword (100 G base -> 150 G), quoting a newcomer's cursed sword at 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };

    // 100 base + 50 curse (50 % of the cursed item's base)
    // + 10 first insurance (10 % of the 100 policy base) = 160, + 5 fee = 165
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds a 30 % surcharge for a sword with exactly enchantment 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    };

    // 100 base + 30 high enchantment (30 % of the item's base, threshold >= 5)
    // + 10 first insurance (10 % of the 100 policy base) = 140, + 5 fee = 145
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("adds no high-enchantment surcharge for a sword with enchantment 4", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    };

    // below the >= 5 threshold: 100 base + 10 first insurance + 5 fee = 115
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    };

    // both item surcharges stack: 100 base + 50 curse + 30 high enchantment
    // + 10 first insurance (10 % of the 100 policy base) = 190, + 5 fee = 195
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });
  it("applies the curse surcharge only to the cursed item on a multi-item policy (cursed sword + plain amulet -> 210 G before further modifiers and fee)", () => {
    const scenario = {
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
    };

    // policy base 160 (100 + 60); the curse adds 50 — 50 % of the SWORD's
    // base, not of the 160 policy total -> 210. + 16 first insurance
    // (10 % of the 160 policy base) + 5 fee = 231
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Policy-wide premium modifiers ---
  it("applies a 20 % loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
        },
      ],
    };

    // 100 base - 20 loyalty (20 % of the policy base, threshold >= 2 years)
    // + 10 first insurance = 90, + 5 fee = 95
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
        },
      ],
    };

    // below the >= 2 years threshold: 100 base + 10 first insurance + 5 fee = 115
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  // The 10 % first-insurance surcharge is asserted by every quote test above
  // (each ends in "+ 10 % + 5 fee"); it needs no separate case.
  it("applies a 15 % follow-up discount on the customer's second quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [PLAIN_SWORD] },
        { op: "quote", items: [PLAIN_SWORD] },
      ],
    };

    // first quote:  100 base + 10 first insurance + 5 fee = 115
    // second quote: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
    // (first insurance still applies on a follow-up contract)
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  // The 5 G processing fee is likewise asserted by every quote test above,
  // including the empty item list (premium 5 G = the fee alone).

  // --- Rounding ---
  // Premium round-up is asserted by "7 runes" (197.5 -> 198) and
  // "2 runes + 1 moonstone" (87.5 -> 88).
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favor)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "curse",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };

    // the 50 % clause halves an odd amount: 901 / 2 = 450.5, - 100 deductible
    // = 350.5, rounded DOWN in the MHPCO's favour = 350 (premiums round up)
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Claims: standard reimbursement ---
  it("pays out 400 G for a steel sword with enchantment 3 damaged by 500 G (deductible 100 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    // no special clause applies: full 500 reimbursement - 100 deductible = 400
    // cap = 2 x 1000 insurance sum = 2000; 2000 - 400 = 1600 remaining
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("pays out 100 G for a rune damaged by 200 G (no enchantment or material)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "wear",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };

    // premium: 25 base + 2.5 first insurance + 5 fee = 32.5, rounded up = 33
    // payout: no clause applies (a rune has neither enchantment nor material)
    //         -> full 200 - 100 deductible = 100; cap 2 x 250 = 500
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claims: special clauses ---
  it("pays out 400 G for a steel sword with enchantment 9 damaged by 1000 G (50 % clause, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "curse",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };

    // premium: 100 base + 30 high-enchantment (>= 5) + 10 first ins + 5 = 145
    // payout: enchantment 9 >= 8 -> 50 % of 1000 = 500, THEN the deductible
    //         500 - 100 = 400; cap 2 x 1000 = 2000
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("pays out 400 G for a dragon-material sword with exactly enchantment 8 damaged by 1000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };

    // enchantment exactly 8 meets the payout threshold: 50 % of 1000 = 500,
    // then the deductible = 400. Pins >= 8 rather than > 8.
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("pays out 700 G for a dragon-material sword with enchantment 5 damaged by 800 G (full reimbursement, then deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };

    // premium: 100 base + 30 high-enchantment (>= 5) + 10 first ins + 5 = 145
    // payout: enchantment 5 is below the payout threshold of 8, so only the
    //         dragon clause applies -> full 800, then deductible = 700
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("pays out 400 G for a dragon-material sword with enchantment 9 damaged by 1000 G (the 50 % rule wins)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };

    // both clauses apply; the 50 % rule wins over full dragon reimbursement
    // -> 500, then the deductible = 400
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claims: deductible per damage event ---
  it("pays out 600 G when a dragon attack damages an insured sword (500 G) and an insured amulet (300 G) — one deductible per damaged item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            PLAIN_SWORD,
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
    };

    // premium: 160 base + 16 first insurance + 5 fee = 181
    // payout: a deductible per damaged item, not per incident:
    //         (500 - 100) + (300 - 100) = 600; cap 2 x 1600 = 3200
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claims: cap ---
  // Single-sword cap (2000) is asserted by the steel-sword claim above, and the
  // sword + amulet cap (3200) by the two-damage claim. Both remaining below are
  // cases no passing test covers: a premium modifier that must NOT raise the
  // cap, and a block discount that must NOT lower the insurance sum.
  it("caps a cursed sword policy at 2000 G — premium modifiers do not raise the cap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    // the curse raises the premium to 165, but the cap follows the UNMODIFIED
    // insurance value: 2 x 1000 = 2000, so 2000 - 400 = 1600 remains
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("caps a policy covering a sword and 3 runes at 3500 G (insurance sum 1750 G) — the block discount affects the premium only", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            PLAIN_SWORD,
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };

    // premium: 100 sword + 60 rune block = 160 base, + 16 + 5 = 181
    // the block cuts the PREMIUM only: insurance sum stays 1000 + 3 x 250
    // = 1750, so the cap is 3500 and 3500 - 400 = 3100 remains
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
    });
  });
  it("exhausts the cap across two successive 1500 G claims: payout 1400 G / remaining 600 G, then payout 600 G / remaining 0 G", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
        },
        claim,
        claim,
      ],
    };

    // cap = 2 x 1000 = 2000, consumed cumulatively across claims
    // first:  1500 - 100 = 1400 paid, 600 left
    // second: the desired 1400 is reduced to the remaining 600, leaving 0
    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("treats two damage entries of the same item type as separate damages, each with its own deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        // two swords insured — the fixture is reused, but each entry is a
        // separately insured item as far as the policy is concerned
        { op: "quote", items: [PLAIN_SWORD, PLAIN_SWORD] },
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

    // premium: 200 base + 20 first insurance + 5 fee = 225
    // two swords insured, so two sword damages are valid — each takes its own
    // deductible: (500 - 100) + (300 - 100) = 600; cap 2 x 2000 = 4000
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });

  // --- Integration examples ---
  it("quotes 160 G for a 3-year customer's second contract covering a cursed steel sword of enchantment 7", () => {
    const cursedSword = {
      type: "sword",
      material: "steel",
      enchantment: 7,
      cursed: true,
    };
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [cursedSword] },
        { op: "quote", items: [cursedSword] },
      ],
    };

    // first  quote: 100 + 50 curse + 30 high ench - 20 loyalty + 10 first ins
    //               = 170, + 5 fee = 175
    // second quote: the same, less the 15 follow-up discount = 155, + 5 = 160
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 175 }, { premium: 160 }],
    });
  });

  // --- Errors ---
  it("rejects a quote containing an item with an unknown type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    // the engine throws; the CLI turns this into a non-zero exit and a
    // stderr message, writing no results to stdout
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("rejects a claim whose damage references an item not covered by the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };

    // only a sword is insured; the amulet damage cannot be settled
    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("rejects a claim whose damage references an unknown item type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
        },
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

    // an unknown type is, by definition, not among the policy's items
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
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

    // two sword damages but only one sword insured: the whole claim is rejected
    expect(() => runScenario(scenario)).toThrow(/sword/);
  });
  it("rejects a claim containing a damage entry with a negative amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [PLAIN_SWORD],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };

    // a negative loss is not a loss; left unchecked it would grow the cap
    expect(() => runScenario(scenario)).toThrow(/-200|negative/);
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes the results as JSON to stdout", () => {
    // the spec's own schema example
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };

    const cli = runCli(JSON.stringify(scenario));

    // 60 base - 6 net policy modifiers (+10 first ins, -20 loyalty) + 5 fee
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status and writes to stderr when the scenario is invalid", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const cli = runCli(JSON.stringify(scenario));

    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
    // a description of the problem, not a crash dump at the operator
    expect(cli.stderr.trim()).toBe("unknown item type: broomstick");
  });
});
