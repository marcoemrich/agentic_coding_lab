import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office - quote", () => {
  it("should return a premium of 5 G for a quote with an empty item list", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });
  it("should return a premium of 115 G for a single plain sword (100 base + 10 first insurance + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should use the price list base premium for amulet, staff and potion", () => {
    const quoteFor = (type: string) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type }] }],
    });

    expect(runScenario(quoteFor("amulet"))).toEqual({
      results: [{ premium: 71 }],
    });
    expect(runScenario(quoteFor("staff"))).toEqual({
      results: [{ premium: 93 }],
    });
    expect(runScenario(quoteFor("potion"))).toEqual({
      results: [{ premium: 49 }],
    });
  });
  it("should sum the base premiums of several main items in one quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }, { type: "potion" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 225 }] });
  });
  it("should charge 25 G base premium per component (2 runes -> 50 G base)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("should charge 60 G base premium for a block of exactly 3 alike components (3 runes)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should not apply the block discount for 4 runes (100 G base premium)", () => {
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

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply one block plus singles for 7 runes (175 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    };

    // The spec lists 7 runes as 175 G base premium, i.e. 7 x 25 G. The block
    // discount does NOT kick in here (2 blocks + 1 single would be
    // 60 + 60 + 25 = 145 G), so a block is only formed when the count of alike
    // components is exactly 3.
    // 175 + 17.5 first insurance + 5 fee = 197.5, rounded up to 198.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("should not form a block from different component types (2 runes + 1 moonstone -> 75 G base)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    // 3 components but not alike, so no block: 3 x 25 G = 75 G base.
    // 75 + 7.5 first insurance + 5 fee = 87.5, rounded up to 88.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("should form two separate blocks for 3 runes + 3 moonstones (120 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    };

    // Two separate blocks of exactly 3 alike components: 60 + 60 = 120 G base.
    // 120 * 1.1 + 5 = 137.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });
  it("should not apply the block discount to 3 alike main items (3 swords -> 300 G base premium)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }, { type: "sword" }],
        },
      ],
    };

    // The block discount applies only to components (rune, moonstone).
    // 3 x 100 G = 300 G base; 300 * 1.1 + 5 = 335.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 335 }] });
  });
  it("should add a 50 % curse surcharge on the base premium of the cursed item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    };

    // 100 base + 50 curse surcharge (50 % of that item's base premium)
    // + 10 first insurance (10 % of the 100 G policy base premium)
    // + 5 processing fee = 165.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should apply the curse surcharge only to the cursed item in a multi-item policy (cursed sword + plain amulet -> 210 G before policy modifiers and fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    };

    // Policy base premium 100 + 60 = 160 G. The curse surcharge is 50 % of the
    // cursed sword's own base premium only (50 G), not of the policy base, so
    // the running total before policy modifiers and fee is 210 G.
    // + 16 first insurance (10 % of the 160 G policy base premium)
    // + 5 processing fee = 231.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("should add a 30 % high-enchantment surcharge for an item with enchantment exactly 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    };

    // 100 base + 30 high-enchantment surcharge (30 % of that item's base
    // premium, enchantment >= 5)
    // + 10 first insurance (10 % of the 100 G policy base premium)
    // + 5 processing fee = 145.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("should not add the high-enchantment surcharge for an item with enchantment 4", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    };

    // Enchantment 4 is below the threshold of 5, so no high-enchantment
    // surcharge: 100 base + 10 first insurance + 5 processing fee = 115.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply both curse and high-enchantment surcharges to the same item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 5 }],
        },
      ],
    };

    // Both item surcharges stack on the same item's own base premium:
    // 100 base + 50 curse + 30 high-enchantment
    // + 10 first insurance (10 % of the 100 G policy base premium)
    // + 5 processing fee = 195.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });
  it("should apply a 20 % loyalty discount on the policy base premium for a customer with exactly 2 years with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    // 100 base - 20 loyalty discount (20 % of the 100 G policy base premium,
    // yearsWithMHPCO >= 2)
    // + 10 first insurance (10 % of the 100 G policy base premium)
    // + 5 processing fee = 95.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("should not apply the loyalty discount for a customer with 1 year with MHPCO", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    // 1 year is below the 2-year threshold, so no loyalty discount:
    // 100 base + 10 first insurance + 5 processing fee = 115.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply the 10 % first insurance surcharge on the policy base premium of every quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }],
    };

    // The surcharge is 10 % of the whole policy base premium, not a flat
    // amount: 200 base + 20 first insurance + 5 processing fee = 225.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 225 }] });
  });
  it("should apply a 15 % follow-up discount on the policy base premium for each quote after the customer's first", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };

    // The first contract is the customer's first, so no follow-up discount:
    // 100 base + 10 first insurance + 5 processing fee = 115.
    // Every contract after the first gets 15 % of the policy base premium off:
    // 100 base + 10 first insurance - 15 follow-up + 5 processing fee = 100.
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  it("should add the 5 G processing fee at the very end, after all discounts and surcharges", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };

    // The fee is a flat 5 G added after every percentage modifier, so it is
    // never itself discounted: 100 base - 20 loyalty + 10 first insurance
    // = 90, then + 5 processing fee = 95. If the fee were added before the
    // loyalty discount the premium would be 94 (20 % off 105 + 10).
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("should round the final premium up (197.5 G -> 198 G) while keeping intermediate values as fractions", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    };

    // 7 x 25 = 175 G base premium. The 10 % first insurance surcharge is 17.5 G
    // and stays fractional: 175 + 17.5 + 5 = 197.5. Only the final premium is
    // rounded, and always UP (in MHPCO's favour): 197.5 -> 198.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("should return 165 G for a newcomer with a cursed steel sword of enchantment 3", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "steel",
              cursed: true,
              enchantment: 3,
            },
          ],
        },
      ],
    };

    // Spec integration example. 100 base + 50 curse surcharge (50 % of the
    // sword's own base premium). Enchantment 3 is below the threshold of 5, so
    // no high-enchantment surcharge. Steel is the ordinary material and does
    // not affect the premium. The customer is a newcomer with no previous
    // contract, so no loyalty and no follow-up discount:
    // 100 + 50 + 10 first insurance + 5 processing fee = 165.
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should return 160 G for a 3-year customer's second quote with a cursed steel sword of enchantment 7", () => {
    const cursedSteelSword = {
      type: "sword",
      material: "steel",
      cursed: true,
      enchantment: 7,
    };
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [cursedSteelSword] },
        { op: "quote", items: [cursedSteelSword] },
      ],
    };

    // Spec integration example, second quote of the scenario:
    // 100 base + 50 curse + 30 high enchantment (7 >= 5)
    // - 20 loyalty (3 years >= 2) + 10 first insurance
    // - 15 follow-up (this is not the customer's first contract)
    // + 5 processing fee = 160.
    expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO Claim Office - claim", () => {
  it("should subtract the 100 G deductible from the damage amount (sword, 500 G damage -> 400 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
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

    // A plain steel sword is insured for 1000 G, so the cap is twice that,
    // 2000 G. The damage of 500 G is reimbursed in full minus the flat 100 G
    // deductible: 400 G payout, leaving 2000 - 400 = 1600 G of cap.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("should reimburse a component minus the deductible (rune, 200 G damage -> 100 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };

    // A rune is insured for 250 G, so the cap is twice that, 500 G. Runes have
    // neither enchantment nor material, so no special clause applies: the
    // 200 G damage is reimbursed minus the flat 100 G deductible, leaving
    // 500 - 100 = 400 G of cap.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("should apply the 100 G deductible once per damage entry (sword 500 G + amulet 300 G -> 600 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };

    // Sword 1000 G + amulet 600 G = 1600 G insurance sum, so the cap is 3200 G.
    // The flat 100 G deductible is applied once per damage entry, not once per
    // claim: (500 - 100) + (300 - 100) = 400 + 200 = 600 G payout, leaving
    // 3200 - 600 = 2600 G of cap.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });
  it("should reimburse 50 % before the deductible for an item with enchantment exactly 8 (1000 G damage -> 400 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };

    // An item with enchantment >= 8 is reimbursed at only 50 % of the damage,
    // and the flat 100 G deductible is subtracted from that reduced amount:
    // 1000 * 50 % = 500, then - 100 = 400 G payout. The sword is insured for
    // 1000 G, so the cap is 2000 G, leaving 2000 - 400 = 1600 G.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("should reimburse 50 % before the deductible for an item with enchantment 9 (steel sword, 1000 G damage -> 400 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };

    // Enchantment 9 is above the threshold of 8, so the 50 % rule applies to an
    // ordinary steel item too: 1000 * 50 % = 500, then - 100 deductible = 400 G
    // payout. The sword is insured for 1000 G, so the cap is 2000 G, leaving
    // 2000 - 400 = 1600 G.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("should fully reimburse dragon-material items before the deductible (dragon sword enchantment 5, 800 G damage -> 700 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };

    // Dragon material is reimbursed in full (100 %), and the flat 100 G
    // deductible is subtracted afterwards: 800 - 100 = 700 G payout.
    // Enchantment 5 is below the 50 % threshold of 8, so it does not reduce
    // the reimbursement. The sword is insured for 1000 G, so the cap is
    // 2000 G, leaving 2000 - 700 = 1300 G.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("should let the 50 % high-enchantment rule win over dragon material (dragon sword enchantment 9, 1000 G damage -> 400 G payout)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };

    // Dragon material alone would be reimbursed in full, but enchantment 9 is
    // at or above the 50 % threshold of 8, and that rule wins: the two clauses
    // do not stack, the reimbursement is 50 % of the damage, not 100 %.
    // 1000 * 50 % = 500, then - 100 deductible = 400 G payout. The sword is
    // insured for 1000 G, so the cap is 2000 G, leaving 2000 - 400 = 1600 G.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("should treat two damage entries of the same insured item type as separate damages with their own deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };

    // Two swords are insured for 1000 G each, so the insurance sum is 2000 G
    // and the cap is 4000 G. Two damage entries of the same insured item type
    // are two separate damages, so the flat 100 G deductible is applied to each
    // of them: (500 - 100) + (300 - 100) = 400 + 200 = 600 G payout, leaving
    // 4000 - 600 = 3400 G of cap.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 600,
      remainingCap: 3400,
    });
  });
  it("should report the remaining cap of twice the insurance sum after a claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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

    // Sword 1000 G + amulet 600 G = 1600 G insurance sum, so the cap is twice
    // that, 3200 G. The 500 G damage pays out 500 - 100 deductible = 400 G,
    // leaving 3200 - 400 = 2800 G of cap.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 2800,
    });
  });
  it("should base the cap on the unmodified insurance values, not on the premium (cursed sword -> cap 2000 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
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

    // The curse surcharge raises the premium to 165 G, but the cap is derived
    // from the unmodified insurance value of the sword (1000 G), not from the
    // premium: cap 2000 G. Payout 500 - 100 = 400 G, leaving 1600 G.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("should base the cap on the unmodified insurance values of components, not on the block discount (sword + 3 runes -> insurance sum 1750 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
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

    // The 3 alike runes form a block for the premium, but the insurance sum
    // counts every insured item at its own unmodified insurance value:
    // 1000 + 3 x 250 = 1750 G, so the cap is 3500 G. Payout 500 - 100 = 400 G,
    // leaving 3500 - 400 = 3100 G.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 3100,
    });
  });
  it("should cap the cumulative payout across successive claims (1500 G then 1500 G on a sword -> 1400 G then 600 G, remaining cap 0 G)", () => {
    const claimOf1500 = {
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
        { op: "quote", items: [{ type: "sword" }] },
        claimOf1500,
        claimOf1500,
      ],
    };

    // The sword is insured for 1000 G, so the cap is 2000 G for the whole
    // policy, not per claim. The first claim pays 1500 - 100 deductible
    // = 1400 G, leaving 600 G of cap. The second claim would also want 1400 G,
    // but only 600 G of cap is left, so the payout is reduced to 600 G and the
    // remaining cap drops to 0 G.
    const { results } = runScenario(scenario);

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("should round the final payout down (350.5 G -> 350 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };

    // Enchantment 8 reimburses 50 % of the damage: 901 * 50 % = 450.5, which
    // stays fractional through the deductible: 450.5 - 100 = 350.5. Only the
    // final payout is rounded, and always DOWN (in MHPCO's favour): 350.
    // The cap consumption uses the rounded payout, so the sword's 2000 G cap
    // is left at 2000 - 350 = 1650 G.
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });
  it("should not count claim steps when applying the follow-up contract discount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };

    // The follow-up discount counts CONTRACTS, not scenario steps. The claim in
    // between is not a contract, so the second quote is the customer's second
    // contract, not the third: 100 base + 10 first insurance - 15 follow-up
    // + 5 processing fee = 100. The discount is a flat 15 % of the policy base
    // premium regardless of how many previous contracts there are, so the
    // premium is the same whether the claim step is counted or not.
    const { results } = runScenario(scenario);

    expect(results[0]).toEqual({ premium: 115 });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    expect(results[2]).toEqual({ premium: 100 });
  });
});

describe("MHPCO Claim Office - rejected scenarios", () => {
  it("should reject a quote containing an item with an unknown type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    // A broomstick is not on the price list, so it cannot be quoted. The
    // scenario is rejected instead of silently producing a NaN premium.
    expect(() => runScenario(scenario)).toThrow(/unknown item type: broomstick/i);
  });
  it("should reject a claim whose damage entry references an item type not covered by the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };

    // Only the sword is insured by the policy. An amulet is a perfectly valid
    // item type, but it is not covered by this policy, so the claim cannot be
    // settled and the scenario is rejected.
    expect(() => runScenario(scenario)).toThrow(
      /item type not covered by the policy: amulet/i,
    );
  });
  it("should reject a claim whose damage entry references an unknown item type", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 300 }],
          },
        },
      ],
    };

    // A broomstick is not on the price list at all, so the damage entry is not
    // merely uncovered by this policy, it references an item type that does not
    // exist. The scenario is rejected with the same "unknown item type"
    // complaint a quote for a broomstick would raise.
    expect(() => runScenario(scenario)).toThrow(
      /unknown item type: broomstick/i,
    );
  });
  it("should reject a claim with more damage entries of a type than the policy insures", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };

    // The policy insures a single sword, but the claim reports two damaged
    // swords. A damage entry is one damaged item, so the second entry has no
    // insured item behind it and the whole claim is rejected. With two swords
    // insured the very same claim settles normally.
    expect(() => runScenario(scenario)).toThrow(
      /more damage entries than insured items for item type: sword/i,
    );
  });
  it("should reject a claim with a negative damage amount", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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

    // A damage cannot be negative. Without this check the entry would silently
    // reduce the payout of the other damages (and here produce a negative
    // payout), so the whole scenario is rejected instead.
    expect(() => runScenario(scenario)).toThrow(
      /negative damage amount: -200/i,
    );
  });
});
