import { describe, expect, it } from "vitest";

import { quote } from "./quote.js";
import { type Item, insuranceSumOf } from "./policy.js";
import { payoutFor, settleClaim } from "./claim.js";
import { runScenario } from "./scenario.js";

const NEW_CUSTOMER = { yearsWithMHPCO: 0 };

function alike(count: number, type: string) {
  return Array.from({ length: count }, () => ({ type }));
}

/**
 * Asserts the premium a new customer is quoted for these items. The expected
 * premium is always stated literally so the test pins the value independently
 * of how production computes it.
 */
function expectPremium(items: Item[], premium: number): void {
  expect(quote(NEW_CUSTOMER, items)).toBe(premium);
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expectPremium([], 5);
  });

  // --- Quote: base premiums per main item type ---
  it("quotes a single plain sword -- base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    expectPremium(alike(1, "sword"), 115);
  });
  it("quotes a single plain amulet -- base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    expectPremium(alike(1, "amulet"), 71);
  });
  it("quotes a single plain staff -- base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    expectPremium(alike(1, "staff"), 93);
  });
  it("quotes a single plain potion -- base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    expectPremium(alike(1, "potion"), 49);
  });

  // --- Quote: component base premiums and the building block of 3 alike ---
  it("quotes a single rune -- base 25 G component premium -> 33 G", () => {
    expectPremium(alike(1, "rune"), 33);
  });
  it("quotes a single moonstone -- base 25 G component premium -> 33 G", () => {
    expectPremium(alike(1, "moonstone"), 33);
  });
  it("quotes 2 runes -- base premium 50 G (no block) -> 60 G", () => {
    expectPremium(alike(2, "rune"), 60);
  });
  it("quotes 3 runes -- base premium 60 G (block applies) -> 71 G", () => {
    expectPremium(alike(3, "rune"), 71);
  });
  it("quotes 4 runes -- base premium 100 G (no block; block requires exactly 3) -> 115 G", () => {
    expectPremium(alike(4, "rune"), 115);
  });
  it("quotes 7 runes -- base premium 175 G (no block at 7) -> 198 G", () => {
    expectPremium(alike(7, "rune"), 198);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: different types) -> 88 G", () => {
    expectPremium([...alike(2, "rune"), ...alike(1, "moonstone")], 88);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks) -> 137 G", () => {
    expectPremium([...alike(3, "rune"), ...alike(3, "moonstone")], 137);
  });

  // --- Quote: item-specific modifiers ---
  it("applies the 50% curse surcharge to the cursed item's base premium -- cursed sword base 100 G -> 150 G", () => {
    expect(quote(NEW_CUSTOMER, [{ type: "sword", cursed: true }])).toBe(100 + 50 + 10 + 5);
  });
  it("applies the 30% high-enchantment surcharge at enchantment exactly 5 -- sword base 100 G -> 130 G", () => {
    expect(quote(NEW_CUSTOMER, [{ type: "sword", enchantment: 5 }])).toBe(100 + 30 + 10 + 5);
  });
  it("applies no high-enchantment surcharge at enchantment 4 -- sword base premium stays 100 G -> 115 G", () => {
    expectPremium([{ type: "sword", enchantment: 4 }], 115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment exactly 5 -- 100 + 50 + 30 = 180 G", () => {
    expect(quote(NEW_CUSTOMER, [{ type: "sword", cursed: true, enchantment: 5 }])).toBe(
      100 + 50 + 30 + 10 + 5,
    );
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("applies the curse surcharge only to the cursed item on a multi-item policy -- cursed sword + plain amulet: base 160 G + 50 G curse = 210 G before further modifiers and fee", () => {
    expect(quote(NEW_CUSTOMER, [{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(
      160 + 50 + 16 + 5,
    );
  });

  // --- Quote: policy-wide modifiers ---
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO -- policy base 100 G -> -20 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(100 - 20 + 10 + 5);
  });
  it("applies no loyalty discount at 1 year with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(100 + 10 + 5);
  });
  it("applies the 10% first-insurance surcharge to the policy base premium", () => {
    const cursedSword = [{ type: "sword", cursed: true }];
    expect(quote(NEW_CUSTOMER, cursedSword)).toBe(100 + 50 + 10 + 5);
  });
  it("applies the 15% follow-up discount on each contract after the customer's first quote", () => {
    expect(quote(NEW_CUSTOMER, [{ type: "sword" }], 1)).toBe(100 + 10 - 15 + 5);
  });
  it("applies no follow-up discount on the customer's first quote", () => {
    expect(quote(NEW_CUSTOMER, [{ type: "sword" }], 0)).toBe(100 + 10 + 5);
  });
  it("applies the first-insurance surcharge on a follow-up contract too -- each quoted item is a first insurance regardless of customer history", () => {
    const sword = [{ type: "sword" }];
    const followUp = quote(NEW_CUSTOMER, sword, 1);
    const firstContract = quote(NEW_CUSTOMER, sword, 0);
    // Both carry the 10 G first-insurance surcharge; they differ only by the
    // 15 G follow-up discount. Were the surcharge dropped on follow-ups, the
    // gap would be 25 G rather than 15 G.
    expect(firstContract - followUp).toBe(15);
  });

  // --- Quote: rounding in the MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favour)", () => {
    expect(quote(NEW_CUSTOMER, alike(7, "rune"))).toBe(198);
  });
  it("keeps intermediate premium amounts as fractions and rounds only the final premium", () => {
    // rune base 25; first insurance 2.5; loyalty -5; follow-up -3.75 => 23.75 -> 24.
    // Rounding each modifier separately would instead yield 25.
    expect(quote({ yearsWithMHPCO: 2 }, alike(1, "rune"), 1)).toBe(24);
  });

  // --- Quote: integration examples ---
  it("quotes newcomer with a cursed steel sword (enchantment 3), 0 years -- premium 165 G", () => {
    const sword = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, sword, 0)).toBe(165);
  });
  it("quotes long-standing customer's second contract, cursed steel sword (enchantment 7), 3 years -- premium 160 G", () => {
    const sword = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(quote({ yearsWithMHPCO: 3 }, sword, 1)).toBe(160);
  });

  // --- Quote: error cases ---
  it("rejects a quote containing an unknown item type (e.g. broomstick) -- domain layer throws; the CLI turns that into a non-zero exit with stderr output", () => {
    expect(() => quote(NEW_CUSTOMER, [{ type: "broomstick" }])).toThrow(/broomstick/);
  });

  // --- Claim: insurance sum and cap ---
  it("caps a single-sword policy at 2000 G -- insurance sum 1000 G, cap = 2 x sum", () => {
    expect(insuranceSumOf([{ type: "sword" }])).toBe(1000);
  });
  it("computes the insurance sum of a staff + potion policy as 1200 G -- staff 800 + potion 400", () => {
    expect(insuranceSumOf([{ type: "staff" }, { type: "potion" }])).toBe(1200);
  });
  it("computes the insurance sum of a sword + amulet policy as 1600 G -- cap 3200 G", () => {
    expect(insuranceSumOf([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("computes the insurance sum of two swords as 2000 G -- cap 4000 G", () => {
    expect(insuranceSumOf(alike(2, "sword"))).toBe(2000);
  });
  it("computes the insurance sum of a sword + 3 runes as 1750 G -- the block discount affects the premium only, cap 3500 G", () => {
    expect(insuranceSumOf([{ type: "sword" }, ...alike(3, "rune")])).toBe(1750);
  });
  it("bases the cap on the unmodified insurance value -- cursed sword (premium 165 G) still has cap 2000 G", () => {
    const cursedSword = [{ type: "sword", cursed: true }];
    expect(quote(NEW_CUSTOMER, cursedSword)).toBe(165);
    expect(insuranceSumOf(cursedSword)).toBe(1000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays 400 G for a regular steel sword (enchantment 3) with damage 500 G -- full reimbursement minus 100 G deductible", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const damages = [{ itemType: "sword", amount: 500 }];
    expect(payoutFor(items, damages)).toBe(400);
  });
  it("pays 100 G for a damaged rune (no enchantment, no material) with damage 200 G -- 200 - 100 deductible", () => {
    expect(payoutFor([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G in one incident = payout 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(payoutFor(items, damages)).toBe(600);
  });

  // --- Claim: special clauses ---
  it("reimburses 50% for damage to an item with enchantment exactly 8 -- dragon sword, damage 1000 G -> payout 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
    expect(payoutFor(items, [{ itemType: "sword", amount: 1000 }])).toBe(400);
  });
  it("fully reimburses damage to a dragon-material item -- dragon sword enchantment 5, damage 800 G -> payout 700 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    expect(payoutFor(items, [{ itemType: "sword", amount: 800 }])).toBe(700);
  });
  it("prefers the 50% high-enchantment rule over full dragon reimbursement -- dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    expect(payoutFor(items, [{ itemType: "sword", amount: 1000 }])).toBe(400);
  });
  it("applies only the high-enchantment clause to a steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    expect(payoutFor(items, [{ itemType: "sword", amount: 1000 }])).toBe(400);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays 1400 G and leaves cap remaining 600 G for the first 1500 G claim on a sword policy (cap 2000 G)", () => {
    const items = [{ type: "sword" }];
    const settlement = settleClaim(items, [{ itemType: "sword", amount: 1500 }], 2000);
    expect(settlement).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces the second 1500 G claim to the remaining cap -- payout 600 G, cap remaining 0 G", () => {
    const items = [{ type: "sword" }];
    const settlement = settleClaim(items, [{ itemType: "sword", amount: 1500 }], 600);
    expect(settlement).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type ---
  it("treats each damage entry of a repeated item type as a separate damage with its own deductible -- two swords, two sword damages", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(payoutFor(alike(2, "sword"), damages)).toBe(800);
  });
  it("rejects a claim with more damage entries of a type than the policy covers -- domain layer throws; the CLI turns that into a non-zero exit with stderr output", () => {
    const onlyOneSword = [{ type: "sword" }];
    const twoSwordDamages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => payoutFor(onlyOneSword, twoSwordDamages)).toThrow(/sword/);
  });

  // --- Claim: rounding in the MHPCO's favour ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour)", () => {
    // enchantment 8 halves 901 to 450.5; less the 100 G deductible => 350.5 -> 350.
    const items = [{ type: "sword", enchantment: 8 }];
    expect(payoutFor(items, [{ itemType: "sword", amount: 901 }])).toBe(350);
  });

  // --- Claim: error cases ---
  it("rejects a claim referencing an item not covered by the policy (amulet damaged, only a sword insured) -- domain layer throws; the CLI turns that into a non-zero exit with stderr output", () => {
    const items = [{ type: "sword" }];
    expect(() => payoutFor(items, [{ itemType: "amulet", amount: 200 }])).toThrow(/amulet/);
  });
  it("rejects a claim referencing an unknown item type -- domain layer throws; the CLI turns that into a non-zero exit with stderr output", () => {
    const items = [{ type: "sword" }];
    expect(() => payoutFor(items, [{ itemType: "broomstick", amount: 200 }])).toThrow(/broomstick/);
  });
  it("rejects a claim with a negative damage amount (-200) -- domain layer throws; the CLI turns that into a non-zero exit with stderr output", () => {
    const items = [{ type: "sword" }];
    expect(() => payoutFor(items, [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
  });

  // --- CLI: end-to-end scenario wiring ---
  it("reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type: "sword" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("resolves a claim step's policy field as the zero-based index of the quote step that created the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("runs the schema example end to end -- amulet quote then 200 G amulet claim -> premium and payout/remainingCap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    // amulet base 60; first insurance 6; loyalty -12; fee 5 => 59.
    // claim 200 - 100 deductible => 100; cap 1200 - 100 => 1100.
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
