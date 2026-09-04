import { describe, expect, test } from "vitest";
import { runScenario, type Item } from "./scenario.js";

describe("quote: base premiums", () => {
  test("empty item list costs only the processing fee", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });

  test("a plain sword for a newcomer costs base plus first insurance plus fee", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 G base + 10 G first insurance = 110 G + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  test.each([
    ["amulet", 71],
    ["staff", 93],
    ["potion", 49],
  ])("a %s for a newcomer costs %i G", (type, premium) => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type }] }],
    });

    expect(results).toEqual([{ premium }]);
  });
});

function premiumFor(items: Item[]): number {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
}

const rune = { type: "rune" };
const moonstone = { type: "moonstone" };

describe("quote: component block pricing", () => {
  test("two runes cost 25 G each", () => {
    // base 50 G + 5 G first insurance + 5 G fee
    expect(premiumFor([rune, rune])).toBe(60);
  });

  test("three alike runes form a block at 60 G", () => {
    // base 60 G + 6 G first insurance + 5 G fee
    expect(premiumFor([rune, rune, rune])).toBe(71);
  });

  test("four runes get no block — a block is exactly three", () => {
    // base 100 G + 10 G first insurance + 5 G fee
    expect(premiumFor([rune, rune, rune, rune])).toBe(115);
  });

  test("seven runes cost 175 G base", () => {
    // base 175 G + 17.5 G first insurance = 192.5 + 5 G fee, rounded up
    expect(premiumFor([rune, rune, rune, rune, rune, rune, rune])).toBe(198);
  });

  test("runes and moonstones are not alike, so neither forms a block", () => {
    // base 75 G + 7.5 G first insurance = 82.5 + 5 G fee, rounded up
    expect(premiumFor([rune, rune, moonstone])).toBe(88);
  });

  test("three runes and three moonstones form two separate blocks", () => {
    // base 120 G + 12 G first insurance + 5 G fee
    expect(premiumFor([rune, rune, rune, moonstone, moonstone, moonstone])).toBe(137);
  });
});

describe("quote: item-specific modifiers", () => {
  test("a cursed item adds 50 % of its own base premium", () => {
    // 100 G base + 50 G curse + 10 G first insurance = 160 + 5 G fee
    expect(premiumFor([{ type: "sword", cursed: true, enchantment: 3 }])).toBe(165);
  });

  test("enchantment 5 is high enough for the 30 % surcharge", () => {
    // 100 G base + 30 G enchantment + 10 G first insurance = 140 + 5 G fee
    expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });

  test("enchantment 4 is below the threshold", () => {
    // 100 G base + 10 G first insurance = 110 + 5 G fee
    expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
  });

  test("a cursed, highly enchanted item carries both surcharges", () => {
    // 100 G base + 50 G curse + 30 G enchantment + 10 G first = 190 + 5 G fee
    expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
});

describe("quote: policy-wide modifiers", () => {
  test("two years with MHPCO already earns the loyalty discount", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base − 20 G loyalty + 10 G first insurance = 90 + 5 G fee
    expect(results).toEqual([{ premium: 95 }]);
  });

  test("one year with MHPCO is not yet long-standing", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 G base + 10 G first insurance = 110 + 5 G fee
    expect(results).toEqual([{ premium: 115 }]);
  });

  test("every contract after the first gets a 15 % discount", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    // second: 100 G base + 10 G first insurance − 15 G follow-up = 95 + 5 G fee
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  test("a curse surcharges only the cursed item, not the whole policy", () => {
    // policy base 160 G (cursed sword 100 + plain amulet 60)
    // + 50 G curse (50 % of the sword alone, not of 160)
    // + 16 G first insurance = 226 + 5 G fee
    expect(
      premiumFor([
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]),
    ).toBe(231);
  });
});

describe("quote: integration of several rules", () => {
  test("a long-standing customer's second contract stacks every modifier", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 enchantment − 20 loyalty + 10 first
    // − 15 follow-up = 155 + 5 fee
    expect(results[1]).toEqual({ premium: 160 });
  });
});

/** Runs a claim against a single-quote policy and returns the claim result. */
function claimOn(
  items: Item[],
  damages: Array<{ itemType: string; amount: number }>,
) {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1];
}

describe("claim: standard reimbursement", () => {
  test("an ordinary item is reimbursed in full less the deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };

    // 500 G damage − 100 G deductible; cap is 2 × 1000 G
    expect(claimOn([sword], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  test("a component has neither enchantment nor material, so no clause applies", () => {
    // 200 G damage − 100 G deductible; cap is 2 × 250 G
    expect(claimOn([rune], [{ itemType: "rune", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
});

describe("claim: special reimbursement clauses", () => {
  test("enchantment 8 halves the damage before the deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8 };

    // 50 % of 1000 G = 500 G, − 100 G deductible
    expect(claimOn([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  test("dragon material is reimbursed in full below the enchantment threshold", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };

    // full 800 G, − 100 G deductible
    expect(claimOn([sword], [{ itemType: "sword", amount: 800 }])).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });

  test("when both clauses apply the 50 % rule wins", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };

    // 50 % of 1000 G = 500 G, − 100 G deductible
    expect(claimOn([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  test("enchantment exactly 8 with dragon material still halves", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };

    expect(claimOn([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
});

describe("claim: deductible per damage event", () => {
  test("each damaged item carries its own deductible", () => {
    const result = claimOn(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );

    // (500 − 100) + (300 − 100) = 600; cap is 2 × 1600 G
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  test("two items of the same type each carry their own deductible", () => {
    const result = claimOn(
      [{ type: "sword" }, { type: "sword" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    );

    // (500 − 100) + (300 − 100) = 600; cap is 2 × 2000 G
    expect(result).toEqual({ payout: 600, remainingCap: 3400 });
  });
});

describe("claim: the cap limits the total payout", () => {
  test("successive claims draw down the cap until it is exhausted", () => {
    const { results } = runScenario({
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

    // cap 2000 G: first claim takes 1400 G, second is capped at the rest
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  test("the block discount lowers the premium but not the insurance sum", () => {
    const result = claimOn(
      [{ type: "sword" }, rune, rune, rune],
      [{ itemType: "sword", amount: 200 }],
    );

    // insurance sum 1000 + 3 × 250 = 1750 G, cap 3500 G, payout 100 G
    expect(result).toEqual({ payout: 100, remainingCap: 3400 });
  });
});

describe("rounding in the MHPCO's favour", () => {
  test("a fractional payout is rounded down", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8 };

    // 50 % of 901 G = 450.5 G, − 100 G deductible = 350.5 G → 350 G
    expect(claimOn([sword], [{ itemType: "sword", amount: 901 }])).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });
});

describe("rejected scenarios", () => {
  test("a quote for an unknown item type is rejected", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  test("a damage to an item the policy does not cover is rejected", () => {
    expect(() =>
      claimOn([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]),
    ).toThrow(/amulet/);
  });

  test("more damages of a type than the policy insures is rejected", () => {
    expect(() =>
      claimOn(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 300 },
        ],
      ),
    ).toThrow(/sword/);
  });

  test("a negative damage amount is rejected", () => {
    expect(() =>
      claimOn([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
    ).toThrow(/-200|negative/);
  });
});
