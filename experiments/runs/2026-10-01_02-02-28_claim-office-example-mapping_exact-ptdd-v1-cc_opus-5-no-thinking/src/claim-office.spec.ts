import { describe, expect, it } from "vitest";
import { runScenario, type Item, type StepResult } from "./claim-office.js";

function premiumOf(result: StepResult): number {
  if (!("premium" in result)) {
    throw new Error("expected a quote result");
  }

  return result.premium;
}

function premiumFor(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });

  return premiumOf(results[0]);
}

function premiumsFor(itemsPerQuote: Item[][], yearsWithMHPCO = 0): number[] {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: itemsPerQuote.map((items) => ({ op: "quote" as const, items })),
  });

  return results.map(premiumOf);
}

function claimResultsFor(
  items: Item[],
  incidents: { cause: string; damages: { itemType: string; amount: number }[] }[],
): StepResult[] {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...incidents.map((incident) => ({ op: "claim" as const, policy: 0, incident })),
    ],
  });

  return results.slice(1);
}

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("empty item list -- premium 5 G (processing fee only)", () => {
    expect(premiumFor([])).toBe(5);
  });

  // --- Base premiums per main item type (parallel catalogue: one test per entry) ---
  it("quote for a plain sword -- base premium 100 G, premium 115 G (+10 % first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "sword" }])).toBe(115);
  });
  it("quote for a plain amulet -- base premium 60 G, premium 71 G (+10 % first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "amulet" }])).toBe(71);
  });
  it("quote for a plain staff -- base premium 80 G, premium 93 G (+10 % first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "staff" }])).toBe(93);
  });
  it("quote for a plain potion -- base premium 40 G, premium 49 G (+10 % first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "potion" }])).toBe(49);
  });

  // --- Component base premiums (parallel catalogue: one test per entry) ---
  it("quote for a single rune -- base premium 25 G, premium 33 G (32.5 rounded up)", () => {
    expect(premiumFor([{ type: "rune" }])).toBe(33);
  });
  it("quote for a single moonstone -- base premium 25 G, premium 33 G (32.5 rounded up)", () => {
    expect(premiumFor([{ type: "moonstone" }])).toBe(33);
  });

  // --- Building block of 3 alike components ---
  it("2 runes -- base premium 50 G (no block)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes -- base premium 60 G (block applies)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes -- base premium 100 G (no block; block requires exactly 3)", () => {
    expect(premiumFor(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("7 runes -- base premium 175 G (no block at 7)", () => {
    expect(premiumFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });

  // --- 'Alike' means exactly the same type (resolves clarifying question) ---
  it("2 runes + 1 moonstone -- base premium 75 G (no block: different types)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];

    expect(premiumFor(items)).toBe(137);
  });

  // --- Item-specific modifiers in isolation ---
  it("cursed sword -- curse adds 50 % of the item base premium (100 -> 150)", () => {
    expect(premiumFor([{ type: "sword", cursed: true }])).toBe(165);
  });
  it("sword with enchantment 5 -- high-enchantment surcharge applies (100 -> 130)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge (100 -> 100)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword with enchantment 5 -- both surcharges apply (100 -> 180)", () => {
    expect(premiumFor([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });

  // --- Policy-wide modifiers in isolation ---
  it("customer with exactly 2 years -- 20 % loyalty discount applies", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year -- no loyalty discount", () => {
    expect(premiumFor([{ type: "sword" }], 1)).toBe(115);
  });
  it("first insurance adds 10 % initial assessment surcharge to each quoted item", () => {
    expect(premiumFor([{ type: "sword" }])).toBe(115);
  });
  it("second quote in a scenario -- 15 % follow-up contract discount applies", () => {
    expect(premiumsFor([[{ type: "sword" }], [{ type: "sword" }]])).toEqual([115, 100]);
  });
  it("third quote in a scenario -- 15 % follow-up contract discount applies", () => {
    expect(premiumsFor([[{ type: "sword" }], [{ type: "sword" }], [{ type: "sword" }]])).toEqual([
      115, 100, 100,
    ]);
  });

  // --- Modifier scope on multi-item policies (resolves clarifying question) ---
  it("cursed sword + plain amulet -- curse adds 50 G (50 % of the cursed sword only), not 80 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];

    // policy base 160 + curse 50 + first insurance 16 (10 % of 160) + 5 fee
    expect(premiumFor(items)).toBe(231);
  });

  // --- Rounding in the MHPCO's favor ---
  it("premium yielding 197.5 G -- final premium 198 G (rounded up)", () => {
    expect(premiumFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("payout yielding 350.5 G -- final payout 350 G (rounded down)", () => {
    // enchantment 9 halves the damage: 901 / 2 = 450.5, minus the 100 deductible
    const claims = claimResultsFor([{ type: "sword", enchantment: 9 }], [
      { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("intermediate amounts are kept as fractions; only the final amount is rounded", () => {
    // two damages of 301, one per insured enchantment-9 sword: each 150.5 - 100 = 50.5.
    // Summing the fractions gives 101; rounding each intermediate first would give 100.
    const swords = Array.from({ length: 2 }, () => ({ type: "sword", enchantment: 9 }));
    const claims = claimResultsFor(swords, [
      {
        cause: "fire",
        damages: [
          { itemType: "sword", amount: 301 },
          { itemType: "sword", amount: 301 },
        ],
      },
    ]);

    expect(claims[0]).toEqual({ payout: 101, remainingCap: 3899 });
  });

  // --- Integration examples ---
  it("newcomer (0 years) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };

    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee
    expect(premiumFor([sword], 0)).toBe(165);
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };

    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance
    // - 15 follow-up contract = 155 + 5 fee
    expect(premiumsFor([[{ type: "sword" }], [sword]], 3)[1]).toBe(160);
  });

  // --- Insurance sum and cap ---
  it("policy covering a sword and an amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const claims = claimResultsFor(
      [{ type: "sword" }, { type: "amulet" }],
      [{ cause: "fire", damages: [{ itemType: "sword", amount: 200 }] }],
    );

    expect(claims[0]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("policy covering two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const claims = claimResultsFor(
      [{ type: "sword" }, { type: "sword" }],
      [{ cause: "fire", damages: [{ itemType: "sword", amount: 200 }] }],
    );

    expect(claims[0]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("policy covering a sword and 3 runes -- insurance sum 1750 G (block affects premium only), cap 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const claims = claimResultsFor(items, [
      { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("cursed sword (premium 165 G) -- cap 2000 G, based on the unmodified insurance value", () => {
    const claims = claimResultsFor([{ type: "sword", cursed: true }], [
      { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 100, remainingCap: 1900 });
  });

  // --- Standard claim reimbursement ---
  it("steel sword enchantment 3, damage 500 G -- payout 400 G (full minus 100 deductible)", () => {
    const claims = claimResultsFor([{ type: "sword", material: "steel", enchantment: 3 }], [
      { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment, no material), damage 200 G -- payout 100 G (full minus 100 deductible)", () => {
    const claims = claimResultsFor([{ type: "rune" }], [
      { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim special clauses ---
  it("steel sword enchantment 9, damage 1000 G -- payout 400 G (50 % clause, then deductible)", () => {
    const claims = claimResultsFor([{ type: "sword", material: "steel", enchantment: 9 }], [
      { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword enchantment 8 exactly, dragon material, damage 1000 G -- payout 400 G (50 % clause wins)", () => {
    const claims = claimResultsFor([{ type: "sword", material: "dragon", enchantment: 8 }], [
      { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    const claims = claimResultsFor([{ type: "sword", material: "dragon", enchantment: 5 }], [
      { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon sword enchantment 9, damage 1000 G -- payout 400 G (50 % rule wins over dragon material)", () => {
    const claims = claimResultsFor([{ type: "sword", material: "dragon", enchantment: 9 }], [
      { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("one incident damaging a sword (500 G) and an amulet (300 G) -- payout 600 G (deductible once per damaged item)", () => {
    const claims = claimResultsFor([{ type: "sword" }, { type: "amulet" }], [
      {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      },
    ]);

    expect(claims[0]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords insured, both damaged -- each damages entry gets its own deductible", () => {
    const claims = claimResultsFor([{ type: "sword" }, { type: "sword" }], [
      {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      },
    ]);

    expect(claims[0]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000 G), first claim of 1500 G -- payout 1400 G, remainingCap 600 G", () => {
    const claims = claimResultsFor([{ type: "sword" }], [
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    ]);

    expect(claims[0]).toEqual({ payout: 1400, remainingCap: 600 });
  });

  it("sword (cap 2000 G), second claim of 1500 G -- payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    const damages = [{ itemType: "sword", amount: 1500 }];
    const claims = claimResultsFor([{ type: "sword" }], [
      { cause: "fire", damages },
      { cause: "flood", damages },
    ]);

    expect(claims[1]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error cases: domain layer rejects by throwing an Error ---
  // The spec defines only the CLI contract (non-zero exit + stderr); the adopted
  // reading is that the domain throws an Error and the CLI translates it.
  it("quote with an unknown item type ('broomstick') -- throws an Error", () => {
    expect(() => premiumFor([{ type: "broomstick" }])).toThrowError(/broomstick/);
  });
  it("claim naming an item not covered by the policy (amulet when only a sword is insured) -- throws an Error", () => {
    expect(() =>
      claimResultsFor([{ type: "sword" }], [
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
      ]),
    ).toThrowError(/amulet/);
  });
  it("claim naming a damage item with an unknown type -- throws an Error", () => {
    expect(() =>
      claimResultsFor([{ type: "sword" }], [
        { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
      ]),
    ).toThrowError(/broomstick/);
  });
  it("claim with more damage entries of a type than the policy covers -- throws an Error", () => {
    expect(() =>
      claimResultsFor([{ type: "sword" }], [
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        },
      ]),
    ).toThrowError(/sword/);
  });
  it("claim with a negative damage amount (-200) -- throws an Error", () => {
    expect(() =>
      claimResultsFor([{ type: "sword" }], [
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
      ]),
    ).toThrowError(/-200/);
  });

  // --- CLI adapter behavior ---
});
