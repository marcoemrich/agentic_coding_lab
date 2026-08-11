import { describe, it, expect } from "vitest";
import { runScenario, type ClaimResult, type Damage, type Item } from "./claim-office.js";

/** Premium for a single quote of `items`, for a customer with `yearsWithMHPCO`. */
function premiumFor(items: Item[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
}

/** Result of claiming `damages` against a policy covering `items`. */
function claimFor(items: Item[], damages: Damage[]): ClaimResult {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1] as ClaimResult;
}

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(premiumFor([])).toBe(5);
  });
  it("single sword, new customer → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "sword" }])).toBe(115);
  });
  it("single amulet, new customer → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "amulet" }])).toBe(71);
  });
  it("single staff, new customer → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "staff" }])).toBe(93);
  });
  it("single potion, new customer → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(premiumFor([{ type: "potion" }])).toBe(49);
  });

  // --- Components and building blocks ---
  it("2 runes → 50 G base premium (→ 50×1.1 + 5 fee = 60 G)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes → 60 G base premium (block applies) (→ 60×1.1 + 5 = 71 G)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3) (→ 100×1.1 + 5 = 115 G)", () => {
    expect(premiumFor(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("7 runes → 175 G base premium (→ 175×1.1 + 5 = 197.5 → 198 G)", () => {
    expect(premiumFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) (→ 75×1.1 + 5 = 87.5 → 88 G)", () => {
    expect(premiumFor([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) (→ 120×1.1 + 5 = 137 G)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(premiumFor(items)).toBe(137);
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword adds 50 % risk surcharge → 50 G on top of 100 G base premium (100 + 50 curse + 10 first insurance + 5 fee = 165 G)", () => {
    expect(premiumFor([{ type: "sword", cursed: true }])).toBe(165);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge 30 G applies (100 + 30 + 10 + 5 = 145 G)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (100 + 10 + 5 = 115 G)", () => {
    expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword with exactly enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
    expect(premiumFor([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies (100 − 20 + 10 + 5 = 95 G)", () => {
    expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year with MHPCO → no loyalty discount (100 + 10 + 5 = 115 G)", () => {
    expect(premiumFor([{ type: "sword" }], 1)).toBe(115);
  });
  it("first insurance carries a 10 % initial assessment surcharge (sword: 100 + 10 + 5 = 115 G)", () => {
    expect(premiumFor([{ type: "sword" }])).toBe(115);
  });
  it("second contract receives a 15 % follow-up discount (100 + 10 − 15 + 5 = 100 G)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → policy base 160 G, curse adds 50 G (only on sword) → 210 G before further modifiers and fee (+16 first insurance + 5 fee = 231 G)", () => {
    const premium = premiumFor([{ type: "sword", cursed: true }, { type: "amulet" }]);
    expect(premium).toBe(231);
  });
  it("policy-wide modifiers apply to the sum of item base premiums, fee added at the very end (loyal customer: 160 + 50 curse + 16 − 32 + 5 = 199 G)", () => {
    const premium = premiumFor([{ type: "sword", cursed: true }, { type: "amulet" }], 2);
    expect(premium).toBe(199);
  });

  // --- Rounding ---
  it("premium calculation yielding 197.5 G → final premium 198 G (rounded up)", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
    expect(premiumFor(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
    // enchantment 9 → 50 % of 901 = 450.5, less the 100 G deductible = 350.5
    const result = claimFor(
      [{ type: "sword", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }],
    );
    expect(result.payout).toBe(350);
  });
  it("intermediate amounts are kept as fractions; only the final amount is rounded", () => {
    // Two damages at 50 %: 225.5 and 125.5 — summing the fractions gives 351,
    // whereas rounding each intermediate down first would give 350.
    const result = claimFor(
      [
        { type: "sword", enchantment: 9 },
        { type: "staff", enchantment: 9 },
      ],
      [
        { itemType: "sword", amount: 651 },
        { itemType: "staff", amount: 451 },
      ],
    );
    expect(result.payout).toBe(351);
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = claimFor(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(result.payout).toBe(400);
  });
  it("damage to a rune (value 250 G), damage 200 G → payout 100 G (no special clause)", () => {
    const result = claimFor([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
    expect(result.payout).toBe(100);
  });

  // --- Claim: special clauses ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    const result = claimFor(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    const result = claimFor(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    );
    expect(result.payout).toBe(700);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
    const result = claimFor(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    const result = claimFor(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    const result = claimFor(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );
    expect(result.payout).toBe(600);
  });

  // --- Multiple items of the same type ---
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = claimFor(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 99999 }],
    );
    expect(result).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("two sword damage entries against two insured swords → each entry has its own deductible (500−100 + 300−100 = 600 G)", () => {
    const result = claimFor(
      [{ type: "sword" }, { type: "sword" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    );
    expect(result.payout).toBe(600);
  });
  it("more damage entries of a type than insured items → whole claim rejected", () => {
    expect(() =>
      claimFor(
        [{ type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      ),
    ).toThrow(/sword/);
  });

  // --- Cap ---
  it("policy covers a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    // A single huge damage is clipped to the cap, revealing it.
    const result = claimFor(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 99999 }],
    );
    expect(result).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword (premium 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
    const result = claimFor(
      [{ type: "sword", cursed: true }],
      [{ itemType: "sword", amount: 99999 }],
    );
    expect(result).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy covers a sword and 3 runes → insurance sum 1750 G (block discount affects premium only)", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const result = claimFor(items, [{ itemType: "sword", amount: 99999 }]);
    expect(result).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("sword insured (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const result = claimFor([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }]);
    expect(result).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword insured (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
    const damages = [{ itemType: "sword", amount: 1500 }];
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Integration examples ---
  it("newcomer (0 years) with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
    const premium = premiumFor([
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ]);
    expect(premium).toBe(165);
  });
  it("3-year customer's second quote, cursed sword enchantment 7 → premium 160 G (first insurance still applies per item)", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    expect((results[1] as { premium: number }).premium).toBe(160);
  });

  // --- Error cases ---
  it("quote with an unknown item type → rejected", () => {
    expect(() => premiumFor([{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy → rejected (amulet damaged, only a sword insured)", () => {
    expect(() => claimFor([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(
      /amulet/,
    );
  });
  it("claim referencing an unknown item type → rejected", () => {
    expect(() => claimFor([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(
      /broomstick/,
    );
  });
  it("claim with a damage entry of amount -200 → rejected", () => {
    expect(() => claimFor([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(
      /-200|negative/,
    );
  });

});
