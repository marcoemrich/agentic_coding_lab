import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { type Incident, type Item, runScenario } from "./claim-office.js";

// Observable contract readings adopted where the specification leaves them open:
// - Rejections ("exits with a non-zero status code", "writes an error description
//   to stderr") are modelled as the scenario runner throwing an Error; the CLI
//   adapter translates a thrown Error into exit code 1 plus a stderr description.
//   The specification establishes no error type or message, so tests require only
//   that an Error is thrown / that the CLI exits non-zero with non-empty stderr.
// - "Alike" components means the same component type (2 runes + 1 moonstone is no
//   block), as fixed by the specification's example.

/** The deductible the MHPCO applies per damage event, per the specification. */
const DEDUCTIBLE = 100;

/**
 * The premium the claim office quotes for a first contract covering these items.
 * Customer tenure is a spec input, so it stays explicit; it defaults to the
 * newcomer (0 years) that every example below describes.
 */
function premiumQuotedFor(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
}

/**
 * The claim result the office settles when this incident is reported against a
 * freshly quoted policy covering these items -- the quote-then-claim envelope
 * every claim example in the specification describes.
 */
function claimSettledOn(
  insuredItems: Item[],
  incident: Incident,
): { payout: number; remainingCap: number } {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: insuredItems },
      { op: "claim", policy: 0, incident },
    ],
  });
  return results[1] as { payout: number; remainingCap: number };
}

/**
 * An incident that observes a policy's cap without drawing on it.
 *
 * The insurance sum and the cap it determines have no surface of their own in
 * the CLI contract, so the only way to see the opening cap is to settle a claim
 * and read `remainingCap` back. A damage at exactly the deductible is the probe:
 * the deductible takes all of it, the claim pays nothing, and the opening cap
 * comes back untouched. Each cap test below states its own expected payout of
 * 0 G alongside the cap, so the probe stays visible where it is used.
 */
function damageAtTheDeductible(itemType: string): Incident {
  return { cause: "fire", damages: [{ itemType, amount: DEDUCTIBLE }] };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case ---
  it("empty item list -> premium 5 G (processing fee only)", () => {
    expect(premiumQuotedFor([])).toBe(5);
  });

  // --- Quote: main item base premiums (price-list catalogue, one test per entry) ---
  it("single sword, no modifiers, 0 years, 1st contract -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 1, cursed: false }])).toBe(115);
  });
  it("single amulet, no modifiers, 0 years, 1st contract -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumQuotedFor([{ type: "amulet", material: "silver", enchantment: 1, cursed: false }])).toBe(71);
  });
  it("single staff, no modifiers, 0 years, 1st contract -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(premiumQuotedFor([{ type: "staff", material: "oak", enchantment: 1, cursed: false }])).toBe(93);
  });
  it("single potion, no modifiers, 0 years, 1st contract -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(premiumQuotedFor([{ type: "potion", material: "glass", enchantment: 1, cursed: false }])).toBe(49);
  });

  // --- Quote: component base premiums and the building block ---
  it("1 rune -> base premium 25 G; premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(premiumQuotedFor([{ type: "rune" }])).toBe(33);
  });
  it("moonstones are components too: 2 moonstones -> base premium 50 G; premium 60 G", () => {
    expect(premiumQuotedFor([{ type: "moonstone" }, { type: "moonstone" }])).toBe(60);
  });
  it("2 runes -> base premium 50 G (no block); premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
    expect(premiumQuotedFor([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes -> base premium 60 G (block applies); premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumQuotedFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes -> base premium 100 G (no block -- block requires exactly 3); premium 115 G", () => {
    expect(premiumQuotedFor(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("7 runes -> base premium 175 G (no block -- block requires exactly 3); premium 198 G", () => {
    expect(premiumQuotedFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types); premium 88 G", () => {
    expect(premiumQuotedFor([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks); premium 137 G", () => {
    expect(
      premiumQuotedFor([
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ]),
    ).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("cursed sword adds a 50 % surcharge on that item's base premium -> 50 G added; premium 165 G", () => {
    expect(premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword with enchantment 5 adds a 30 % high-enchantment surcharge -> 30 G added (threshold is inclusive); premium 145 G", () => {
    expect(premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
  });
  it("sword with enchantment 4 adds no high-enchantment surcharge; premium 115 G", () => {
    expect(premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("cursed sword with enchantment 5 adds both surcharges -> 50 G + 30 G added; premium 195 G", () => {
    expect(premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO receives the 20 % loyalty discount; sword premium 95 G", () => {
    expect(
      premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 1, cursed: false }], 2),
    ).toBe(95);
  });
  it("customer with 1 year with MHPCO receives no loyalty discount; sword premium 115 G", () => {
    expect(
      premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 1, cursed: false }], 1),
    ).toBe(115);
  });
  it("every quote carries the 10 % first-insurance surcharge on the policy base premium; staff premium 93 G", () => {
    // Shares the single-staff witness with the price-list test above: the staff
    // scenario is the specification's plainest quote, so it is the clearest
    // evidence both for the 80 G price-list entry and for the surcharge applying
    // to a newcomer's quote with no other modifier in play. Two spec statements,
    // one witness -- neither test can go without losing a statement.
    expect(premiumQuotedFor([{ type: "staff", material: "oak", enchantment: 1, cursed: false }])).toBe(93);
  });
  it("the second quote in a scenario receives the 15 % follow-up-contract discount; sword premiums 115 G then 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("the first quote in a scenario receives no follow-up-contract discount; sword premium 115 G", () => {
    expect(premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 1, cursed: false }])).toBe(115);
  });
  // --- Quote: the processing fee's place in the calculation order ---
  it("the 5 G processing fee is added at the very end, after all modifiers -- it is not discounted by loyalty", () => {
    // 2-year customer, sword: 100 base - 20 loyalty + 10 first insurance = 90, then + 5 fee = 95.
    // Had the fee been added before the policy-wide modifiers, the result would be 94.5 -> 95 too,
    // so a cursed staff discriminates: 80 base + 40 curse - 16 loyalty + 8 first insurance = 112, + 5 = 117.
    expect(
      premiumQuotedFor([{ type: "staff", material: "oak", enchantment: 1, cursed: true }], 2),
    ).toBe(117);
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("cursed sword (100 G) + plain amulet (60 G) -> policy base 160 G, curse adds 50 G (of the sword only) -> 210 G before policy-wide modifiers and fee; premium 231 G", () => {
    expect(
      premiumQuotedFor([
        { type: "sword", material: "steel", enchantment: 1, cursed: true },
        { type: "amulet", material: "silver", enchantment: 1, cursed: false },
      ]),
    ).toBe(231);
  });

  // --- Quote: rounding in MHPCO's favour ---
  it("a premium calculation yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    // The 7-rune policy above is the specification's witness for a fractional
    // premium: 175 base + 17.5 first insurance + 5 fee = 197.5.
    expect(premiumQuotedFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("intermediate premium amounts are kept as fractions; only the final premium is rounded", () => {
    // 1 moonstone, 2-year customer: 25 base - 5 loyalty + 2.5 first insurance + 5 fee = 27.5 -> 28.
    // Discriminating because rounding the fractional surcharge down before the sum would yield 27;
    // only keeping it fractional to the end yields 28.
    expect(premiumQuotedFor([{ type: "moonstone" }], 2)).toBe(28);
  });

  // --- Quote: integration examples ---
  it("newcomer (0 years) with a cursed steel sword enchantment 3 -> premium 165 G", () => {
    expect(premiumQuotedFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -> premium 160 G", () => {
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance
    // - 15 follow-up contract = 155, + 5 fee = 160.
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [cursedSword] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rejection ---
  it("quote with an unknown item type (broomstick) -> throws an Error", () => {
    expect(() => premiumQuotedFor([{ type: "broomstick" }])).toThrow(Error);
  });

  // --- Claim: insurance sum and cap ---
  // Each test states the full claim result: the payout of 0 G is what makes the
  // remainingCap the *opening* cap rather than a figure some payout has moved.
  it("policy covering a sword -> insurance sum 1000 G, cap 2000 G (observed through a claim that pays nothing)", () => {
    expect(
      claimSettledOn(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        damageAtTheDeductible("sword"),
      ),
    ).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy covering a sword and an amulet -> insurance sum 1600 G, cap 3200 G (observed through a claim that pays nothing)", () => {
    expect(
      claimSettledOn(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
        damageAtTheDeductible("sword"),
      ),
    ).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("policy covering two swords -> insurance sum 2000 G, cap 4000 G (observed through a claim that pays nothing)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(claimSettledOn([sword, sword], damageAtTheDeductible("sword"))).toEqual({
      payout: 0,
      remainingCap: 4000,
    });
  });
  it("policy covering a sword and 3 runes (a block) -> insurance sum 1750 G; the block discount does not change the insurance sum", () => {
    expect(
      claimSettledOn(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ],
        damageAtTheDeductible("sword"),
      ),
    ).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("cursed sword (premium with modifiers 165 G) -> cap 2000 G, based on the unmodified insurance value", () => {
    expect(
      claimSettledOn(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        damageAtTheDeductible("sword"),
      ),
    ).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: standard reimbursement and deductible ---
  it("steel sword enchantment 3, damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment, no material), damage 200 G -> payout 100 G (full reimbursement minus 100 G deductible)", () => {
    expect(
      claimSettledOn([{ type: "rune" }], {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      }),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("damage below the deductible -> payout 0 G (payout is never negative)", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        cause: "scratch",
        damages: [{ itemType: "sword", amount: 50 }],
      }),
    ).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: the high-enchantment clause (50 % from level 8) ---
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (50 % clause first, then deductible)", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 9, cursed: false }], {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword enchantment 8, damage 1000 G -> 50 % clause applies at the inclusive threshold; payout 400 G", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 8, cursed: false }], {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword enchantment 7, damage 1000 G -> payout 900 G (no 50 % clause)", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 7, cursed: false }], {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 900, remainingCap: 1100 });
  });
  // --- Claim: the dragon-material clause (full reimbursement) ---
  it("dragon-material sword enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "dragon", enchantment: 5, cursed: false }], {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 800 }],
      }),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  // --- Claim: precedence where both special clauses cover one item ---
  // The dragon clause would pay the damage in full; the high-enchantment clause
  // pays half. The specification settles the conflict in the MHPCO's favour --
  // "the 50 % rule wins" -- so above the enchantment line the payout is the same
  // 400 G whether the sword is dragon or steel, and the dragon material buys the
  // claimant nothing. Read against the enchantment-5 case above, which is the
  // same dragon sword below the line and does pay in full.
  it("dragon-material sword enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins over dragon material)", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "dragon", enchantment: 9, cursed: false }], {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "dragon", enchantment: 8, cursed: false }], {
        cause: "dragon attack",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damaging a sword (500 G) and an amulet (300 G) -> payout 600 G (deductible applies once per damaged item)", () => {
    expect(
      claimSettledOn(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two sword damages against a policy covering two swords -> each entry is a separate damage with its own deductible; payout 600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    expect(
      claimSettledOn([sword, sword], {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      }),
    ).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("sword policy (cap 2000 G), first claim of 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    expect(
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      }),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword policy, second successive claim of 1500 G -> payout 600 G, remainingCap 0 G (reduced to the remaining cap)", () => {
    const claimOf1500 = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        claimOf1500,
        claimOf1500,
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding in MHPCO's favour ---
  it("a payout calculation yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    // Sword at enchantment 9, damage 901: half reimbursement 450.5, minus the 100 G
    // deductible = 350.5. Rounding in the MHPCO's favour means rounding a payout down.
    expect(
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 9, cursed: false }], {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 901 }],
      }),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejections ---
  it("claim naming an item type not covered by the policy (amulet when only a sword is insured) -> throws an Error", () => {
    expect(() =>
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      }),
    ).toThrow(Error);
  });
  it("claim naming an unknown item type (broomstick) -> throws an Error", () => {
    expect(() =>
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        cause: "fire",
        damages: [{ itemType: "broomstick", amount: 200 }],
      }),
    ).toThrow(Error);
  });
  it("claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -> throws an Error", () => {
    expect(() =>
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      }),
    ).toThrow(Error);
  });
  it("claim with a damage entry of amount -200 -> throws an Error", () => {
    expect(() =>
      claimSettledOn([{ type: "sword", material: "steel", enchantment: 3, cursed: false }], {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      }),
    ).toThrow(Error);
  });

  // --- CLI adapter ---
  it("CLI reads the schema example scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    // amulet: 60 base - 12 loyalty + 6 first insurance = 54, + 5 fee = 59.
    // claim: 200 damage - 100 deductible = 100; cap 1200 - 100 = 1100.
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI emits one result per step: {premium} for quote steps, {payout, remainingCap} for claim steps", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        { op: "quote", items: [{ type: "rune" }] },
      ],
    };
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    const { results } = JSON.parse(stdout) as { results: Record<string, number>[] };
    expect(results).toHaveLength(3);
    expect(Object.keys(results[0])).toEqual(["premium"]);
    expect(Object.keys(results[1]).sort()).toEqual(["payout", "remainingCap"]);
    expect(Object.keys(results[2])).toEqual(["premium"]);
  });
  it("CLI exits with status 0 and writes valid JSON for a successful scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
