import { describe, expect, it } from "vitest";
import { runScenario } from "./scenario.js";

interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

function premiumOf(items: QuoteItem[], yearsWithMHPCO = 0): number {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
}

interface Damage {
  itemType: string;
  amount: number;
}

function claimOf(items: QuoteItem[], damages: Damage[]): unknown {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1];
}

describe("quote: item base premiums", () => {
  it("empty item list -- premium 5 G (only the processing fee)", () => {
    expect(premiumOf([])).toBe(5);
  });

  it("sword -- 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(premiumOf([{ type: "sword" }])).toBe(115);
  });

  it("amulet -- 60 base + 6 first insurance + 5 fee = 71 G", () => {
    expect(premiumOf([{ type: "amulet" }])).toBe(71);
  });

  it("staff -- 80 base + 8 first insurance + 5 fee = 93 G", () => {
    expect(premiumOf([{ type: "staff" }])).toBe(93);
  });

  it("potion -- 40 base + 4 first insurance + 5 fee = 49 G", () => {
    expect(premiumOf([{ type: "potion" }])).toBe(49);
  });

});

describe("quote: components and building blocks", () => {
  it("2 runes -- 50 base + 5 + 5 = 60 G", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });

  it("2 moonstones -- 50 base + 5 + 5 = 60 G (moonstone is a component too)", () => {
    expect(premiumOf([{ type: "moonstone" }, { type: "moonstone" }])).toBe(60);
  });

  it("3 runes -- block applies: 60 base + 6 + 5 = 71 G", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });

  it("3 moonstones -- block applies: 60 base + 6 + 5 = 71 G", () => {
    expect(premiumOf([{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(71);
  });

  it("4 runes -- no block (exactly 3 required): 100 base + 10 + 5 = 115 G", () => {
    expect(premiumOf(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });

  it("7 runes -- 175 base, premium 197.5 rounded up to 198 G (rounding in MHPCO's favor)", () => {
    expect(premiumOf(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });

  it("2 runes + 1 moonstone -- 'alike' means same type: 75 base + 7.5 + 5 = 87.5 rounded up to 88 G", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });

  it("3 runes + 3 moonstones -- two separate blocks: 120 base + 12 + 5 = 137 G", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(premiumOf([...runes, ...moonstones])).toBe(137);
  });

});

describe("quote: item-specific modifiers", () => {
  it("cursed sword, enchantment 3, newcomer -- 100 + 50 curse + 10 first + 5 = 165 G", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });

  it("sword enchantment 4, not cursed -- no high-enchantment surcharge: 115 G", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
  });

  it("sword enchantment 4, cursed -- curse only: 165 G", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 4, cursed: true }])).toBe(165);
  });

  it("sword enchantment 5 -- high-enchantment surcharge applies: 100 + 30 + 10 + 5 = 145 G", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
  });

  it("cursed sword enchantment 5 -- both surcharges: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
  });

  it("cursed sword + plain amulet -- curse applies to the sword only: 160 base + 50 + 16 first + 5 = 231 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const plainAmulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(premiumOf([cursedSword, plainAmulet])).toBe(231);
  });

  it("sword enchantment 5 + plain amulet -- 30 % of sword base only: 160 + 30 + 16 + 5 = 211 G", () => {
    const enchantedSword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    const plainAmulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(premiumOf([enchantedSword, plainAmulet])).toBe(211);
  });

});

describe("quote: customer modifiers", () => {
  it("customer with exactly 2 years -- loyalty discount applies: 100 - 20 + 10 + 5 = 95 G", () => {
    expect(premiumOf([{ type: "sword" }], 2)).toBe(95);
  });

  it("customer with 1 year -- no loyalty discount: 115 G", () => {
    expect(premiumOf([{ type: "sword" }], 1)).toBe(115);
  });

  it("second quote of a newcomer -- follow-up discount: 100 + 10 - 15 + 5 = 100 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  it("long-standing customer's second quote, cursed sword enchantment 7 -- 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  it("a claim between two quotes does not hide the follow-up: quote, claim, quote -- second quote has follow-up discount", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[2]).toEqual({ premium: 100 });
  });

});

describe("quote: rejection", () => {
  it("unknown item type 'broomstick' -- quote is rejected with an error", () => {
    expect(() => premiumOf([{ type: "broomstick" }])).toThrow(Error);
  });

});

describe("claim: standard reimbursement and caps", () => {
  it("regular sword (steel, enchantment 3), damage 500 -- payout 400, remaining cap 1600", () => {
    const steelSword = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimOf([steelSword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("rune, damage 200 -- payout 100 (no special clause), remaining cap 400", () => {
    expect(claimOf([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });

  it("damage below the deductible -- payout 0 (payout never negative), cap untouched", () => {
    expect(claimOf([{ type: "sword" }], [{ itemType: "sword", amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it("amulet, damage 200 -- payout 100, remaining cap 1100 (insured 600, cap 1200)", () => {
    expect(claimOf([{ type: "amulet" }], [{ itemType: "amulet", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it("staff, damage 200 -- payout 100, remaining cap 1500 (insured 800, cap 1600)", () => {
    expect(claimOf([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
  });

  it("potion, damage 200 -- payout 100, remaining cap 700 (insured 400, cap 800)", () => {
    expect(claimOf([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
  });

  it("moonstone, damage 200 -- payout 100, remaining cap 400 (insured 250, cap 500)", () => {
    expect(claimOf([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

});

describe("claim: enchantment and dragon material", () => {
  it("dragon sword enchantment 8, damage 1000 -- payout 400", () => {
    const dragonSword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimOf([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("dragon sword enchantment 9, damage 1000 -- payout 400 (50 % rule wins)", () => {
    const dragonSword = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimOf([dragonSword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("dragon sword enchantment 5, damage 800 -- payout 700 (full reimbursement)", () => {
    const dragonSword = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimOf([dragonSword], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });

  it("steel sword enchantment 9, damage 1000 -- payout 400", () => {
    const steelSword = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimOf([steelSword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("steel sword enchantment 7, damage 1000 -- payout 900 (below the 8 threshold)", () => {
    const steelSword = { type: "sword", material: "steel", enchantment: 7 };
    expect(claimOf([steelSword], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 900, remainingCap: 1100 });
  });

  it("payout calculation yielding 350.5 -- payout 350 (rounded down)", () => {
    const dragonSword = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimOf([dragonSword], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });

});

describe("claim: deductible per damaged item and multiple items", () => {
  it("sword 500 + amulet 300 damaged -- payout 600 (deductible once per item), remaining cap 2600", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimOf([{ type: "sword" }, { type: "amulet" }], damages)).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it("two swords insured and both damaged by 500 -- payout 800, remaining cap 3200 (cap 4000)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimOf([{ type: "sword" }, { type: "sword" }], damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it("two swords, damages taken in policy order: steel 1000 + dragon enchantment 9 1000 -- payout 1300", () => {
    const steelSword = { type: "sword", material: "steel", enchantment: 3 };
    const dragonSword = { type: "sword", material: "dragon", enchantment: 9 };
    const damages = [
      { itemType: "sword", amount: 1000 },
      { itemType: "sword", amount: 1000 },
    ];
    expect(claimOf([steelSword, dragonSword], damages)).toEqual({ payout: 1300, remainingCap: 2700 });
  });

  it("cursed sword -- cap stays 2000, premium modifiers do not raise it: damage 500 -> remaining cap 1600", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(claimOf([cursedSword], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("sword + 3 runes -- insurance sum 1750, cap 3500: damage 500 -> remaining cap 3100", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(claimOf(items, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 3100 });
  });

});

describe("claim: cap exhaustion", () => {
  it("two successive claims of 1500 on a sword -- payouts 1400 then 600, remaining cap 600 then 0", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

});

describe("claim: rejection", () => {
  it("two sword damages but only one sword insured -- claim is rejected with an error", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claimOf([{ type: "sword" }], damages)).toThrow(Error);
  });

  it("amulet damaged while only a sword is insured -- claim is rejected with an error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }])).toThrow(Error);
  });

  it("damage entry with unknown item type -- claim is rejected with an error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }])).toThrow(Error);
  });

  it("damage amount -200 -- claim is rejected with an error", () => {
    expect(() => claimOf([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });

});
