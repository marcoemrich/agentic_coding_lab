import { describe, expect, it } from "vitest";
import { policyBasePremium, runScenario, type ClaimResult, type Damage, type Item } from "./claimOffice.js";

// Chosen error contract: invalid scenarios make scenario evaluation throw an Error;
// the CLI translates that into a non-zero exit, a message on stderr, and no stdout results.

function quote(items: Item[], yearsWithMHPCO = 0): number {
  const [result] = runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return (result as { premium: number }).premium;
}

function items(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

describe("quote premium", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quote([])).toBe(5);
  });
  it("plain sword, newcomer's first quote -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("plain amulet, newcomer's first quote -> premium 71 G (60 + 6 + 5)", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("plain staff, newcomer's first quote -> premium 93 G (80 + 8 + 5)", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("plain potion, newcomer's first quote -> premium 49 G (40 + 4 + 5)", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
});

describe("component base premium", () => {
  it("2 runes -> 50 G base premium", () => {
    expect(policyBasePremium(items("rune", 2))).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(policyBasePremium(items("rune", 3))).toBe(60);
  });
  it("4 runes -> 100 G base premium (block requires exactly 3)", () => {
    expect(policyBasePremium(items("rune", 4))).toBe(100);
  });
  it("7 runes -> 175 G base premium", () => {
    expect(policyBasePremium(items("rune", 7))).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (alike means same type; no block)", () => {
    expect(policyBasePremium([...items("rune", 2), ...items("moonstone", 1)])).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    expect(policyBasePremium([...items("rune", 3), ...items("moonstone", 3)])).toBe(120);
  });
});

describe("premium modifiers", () => {
  it("newcomer with cursed steel sword, enchantment 3 -> premium 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword with enchantment 4, not cursed -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge -> premium 145 G", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("cursed sword with enchantment 5 -> both surcharges -> premium 195 G", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("cursed sword + plain amulet -> curse surcharge only on sword (210 G) + 16 first insurance + 5 fee -> premium 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("customer with exactly 2 years -> loyalty discount -> plain sword premium 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("customer with 1 year -> no loyalty discount -> plain sword premium 115 G", () => {
    expect(quote([{ type: "sword" }], 1)).toBe(115);
  });
  it("newcomer's second quote -> follow-up discount -> plain sword premium 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 100 });
  });
  it("3-year customer's second quote of cursed sword, enchantment 7 -> premium 160 G (first insurance still applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
  it("premium computing to 197.5 G -> rounded up to 198 G", () => {
    // 150 base + 50 curse + 15 first insurance - 22.5 follow-up + 5 fee = 197.5
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", cursed: true }, ...items("rune", 2)] },
      ],
    });
    expect(results[1]).toEqual({ premium: 198 });
  });
  it("quote with unknown item type (broomstick) -> throws Error", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow(Error);
  });
});

function claim(insured: Item[], damages: Damage[]): ClaimResult {
  const results = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: insured },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1] as ClaimResult;
}

describe("claim payout", () => {
  it("regular steel sword enchantment 3, damage 500 -> payout 400 G, remaining cap 1600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claim([sword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (250 G), damage 200 -> payout 100 G, remaining cap 400 G", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("moonstone (250 G), damage 200 -> payout 100 G, remaining cap 400 G", () => {
    expect(claim([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("amulet (600 G), damage 200 -> payout 100 G, remaining cap 1100 G", () => {
    expect(claim([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("staff (800 G), damage 200 -> payout 100 G, remaining cap 1500 G", () => {
    expect(claim([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("potion (400 G), damage 200 -> payout 100 G, remaining cap 700 G", () => {
    expect(claim([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 -> payout 400 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claim([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 G (50 % rule wins)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claim([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claim([sword], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claim([sword], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("steel sword enchantment 9, damage 901 -> 350.5 rounded down to payout 350 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claim([sword], [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });
  it("sword + amulet damaged 500 and 300 -> deductible per item -> payout 600 G, remaining cap 2600 G (cap 3200)", () => {
    const result = claim(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords both damaged 500 -> payout 800 G, remaining cap 3200 G (cap 4000)", () => {
    const result = claim(items("sword", 2), [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ]);
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("cursed sword damaged 500 -> remaining cap 1600 G (cap 2000 from unmodified insurance value)", () => {
    const result = claim([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]);
    expect(result.remainingCap).toBe(1600);
  });
  it("sword + 3 runes, sword damaged 500 -> remaining cap 3100 G (insurance sum 1750, cap 3500)", () => {
    const result = claim([{ type: "sword" }, ...items("rune", 3)], [{ itemType: "sword", amount: 500 }]);
    expect(result.remainingCap).toBe(3100);
  });
  it("two successive 1500 G claims on a sword -> payouts 1400/600 G, remaining caps 600/0 G", () => {
    const incident = { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident },
        { op: "claim", policy: 0, incident },
      ],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("two sword damages but one sword insured -> throws Error (whole claim rejected)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claim([{ type: "sword" }], damages)).toThrow(Error);
  });
  it("amulet damage when only a sword is insured -> throws Error", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(Error);
  });
  it("damage with unknown item type -> throws Error", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(Error);
  });
  it("damage amount -200 -> throws Error", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
});
