import { describe, expect, test } from "vitest";
import { runScenario } from "./scenario.js";

describe("quote", () => {
  test("an empty item list is charged only the processing fee", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });

  test("a plain sword costs its base premium plus first insurance and fee", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  test("a cursed item carries a 50% risk surcharge on its own base premium", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 165 }]);
  });

  test("enchantment level 5 is already highly enchanted", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 145 }]);
  });

  test("enchantment level 4 is not highly enchanted", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  test("a cursed, highly enchanted item carries both surcharges", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 195 }]);
  });

  test("exactly 2 years with MHPCO earns the loyalty discount", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 95 }]);
  });

  test("1 year with MHPCO does not earn the loyalty discount", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // 100 G base + 10 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  test("each contract after the customer's first is discounted by 15%", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // second quote: 100 G base + 50 G curse + 30 G high enchantment
    //   - 20 G loyalty + 10 G first insurance - 15 G follow-up + 5 G fee
    expect(results[1]).toEqual({ premium: 160 });
  });

  test("a curse surcharges only the cursed item, not the whole policy", () => {
    const { results } = runScenario({
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
    });

    // 160 G policy base + 50 G curse (50% of the sword alone)
    //   + 16 G first insurance + 5 G fee
    expect(results).toEqual([{ premium: 231 }]);
  });
});

describe("component blocks", () => {
  /**
   * Quotes components for a brand-new customer, where the only policy-wide
   * modifier is the 10% first-insurance surcharge. So the premium is
   * base * 1.1 + 5 G fee, and each expected value below states the base
   * premium the prompt gives for that combination.
   */
  const quoteComponents = (types: string[]): number => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    });
    const [result] = results;
    if (!("premium" in result)) {
      throw new Error("expected a quote result");
    }
    return result.premium;
  };

  test("two alike components are charged individually", () => {
    // 50 G base * 1.1 + 5 G fee
    expect(quoteComponents(["rune", "rune"])).toBe(60);
  });

  test("exactly three alike components form a discounted block", () => {
    // 60 G base (block) * 1.1 + 5 G fee
    expect(quoteComponents(["rune", "rune", "rune"])).toBe(71);
  });

  test("four alike components do not form a block", () => {
    // 100 G base * 1.1 + 5 G fee
    expect(quoteComponents(["rune", "rune", "rune", "rune"])).toBe(115);
  });

  test("seven alike components form two blocks and one single", () => {
    // 175 G base * 1.1 + 5 G fee = 197.5 -> 198 G (rounded up)
    const runes = Array<string>(7).fill("rune");
    expect(quoteComponents(runes)).toBe(198);
  });

  test("components of different types do not form a block together", () => {
    // 75 G base * 1.1 + 5 G fee = 87.5 -> 88 G (rounded up)
    expect(quoteComponents(["rune", "rune", "moonstone"])).toBe(88);
  });

  test("each component type forms its own block", () => {
    // 120 G base (two blocks) * 1.1 + 5 G fee
    const components = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"];
    expect(quoteComponents(components)).toBe(137);
  });
});

describe("claim", () => {
  test("an ordinary item is reimbursed in full less the deductible", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
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
    });

    // 500 G damage - 100 G deductible; cap 2000 G, of which 1600 G remains
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  /** Claims a single damaged sword of the given make, returning the payout. */
  const claimSword = (
    sword: { material: string; enchantment: number },
    amount: number,
  ): number => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: false, ...sword }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount }],
          },
        },
      ],
    });
    const result = results[1];
    if (!("payout" in result)) {
      throw new Error("expected a claim result");
    }
    return result.payout;
  };

  test("damage to a highly enchanted item is halved before the deductible", () => {
    // enchantment 9: 50% of 1000 G = 500 G, less 100 G deductible
    expect(claimSword({ material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });

  test("enchantment level 8 already halves the reimbursement", () => {
    expect(claimSword({ material: "steel", enchantment: 8 }, 1000)).toBe(400);
  });

  test("dragon material is reimbursed in full, less the deductible", () => {
    // enchantment 5 is below the claim threshold, so only the material counts
    expect(claimSword({ material: "dragon", enchantment: 5 }, 800)).toBe(700);
  });

  test("high enchantment beats dragon material when both apply", () => {
    // 50% of 1000 G = 500 G, less 100 G deductible
    expect(claimSword({ material: "dragon", enchantment: 9 }, 1000)).toBe(400);
  });

  test("a dragon item at exactly enchantment 8 is halved", () => {
    expect(claimSword({ material: "dragon", enchantment: 8 }, 1000)).toBe(400);
  });

  test("a component has neither enchantment nor material, so is paid in full", () => {
    const { results } = runScenario({
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
    });

    // 200 G damage - 100 G deductible; cap 500 G, of which 400 G remains
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  test("the deductible is taken once per damaged item", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
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
      ],
    });

    // (500 - 100) + (300 - 100) = 600 G; cap 3200 G, of which 2600 G remains
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  test("two items of the same type are insured and damaged separately", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
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
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });

    // insurance sum 2000 G, cap 4000 G
    // (500 - 100) + (400 - 100) = 700 G, leaving 3300 G
    expect(results[1]).toEqual({ payout: 700, remainingCap: 3300 });
  });

  test("payouts stop once the policy cap is exhausted", () => {
    const claimOf = (amount: number) => ({
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount }],
      },
    });

    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        claimOf(1500),
        claimOf(1500),
      ],
    });

    // cap 2000 G; first claim pays 1400 G, leaving 600 G, which caps the second
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  test("premium modifiers do not raise the cap", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 2200 }],
          },
        },
      ],
    });

    // premium 165 G, but the cap rests on the 1000 G insurance value: 2000 G
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  test("the block discount lowers the premium but not the insurance sum", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 600 }],
          },
        },
      ],
    });

    // insurance sum 1000 + 3x250 = 1750 G, so cap 3500 G, less a 500 G payout
    expect(results[1]).toEqual({ payout: 500, remainingCap: 3000 });
  });

  test("a fractional payout is rounded down, in the MHPCO's favour", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
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
    });

    // 50% of 901 G = 450.5 G, less the 100 G deductible = 350.5 -> 350 G
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("rejected scenarios", () => {
  const sword = {
    type: "sword",
    material: "steel",
    enchantment: 3,
    cursed: false,
  };

  test("an item of unknown type cannot be quoted", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  test("an item that is not part of the policy cannot be claimed", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });

  test("more damaged items of a type than are insured cannot be claimed", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });

  test("a claim against a step that created no policy is rejected", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          {
            op: "claim",
            policy: 7,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/policy/);
  });

  test("a negative damage amount cannot be claimed", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(/-200/);
  });
});
