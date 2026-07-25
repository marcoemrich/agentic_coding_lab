import { describe, it, expect } from "vitest";
import { quote, claim, basePremium, premiumWithItemModifiers, insuranceSum, cap, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office - Quote", () => {
  // Edge cases
  it("empty item list -> premium 5 G (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0, contractCount: 0 }, [])).toBe(5);
  });

  // Base premiums for main items (with 5 G fee, single item first insurance surcharge)
  // Base premium examples in isolation are exposed via a rawBasePremium helper.
  it("single sword base premium is 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("single amulet base premium is 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("single staff base premium is 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("single potion base premium is 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  // Components and building blocks
  it("2 runes -> 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block - block requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes -> 175 G base premium", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(runes)).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(basePremium(items)).toBe(120);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet -> 210 G before fee (curse 50% of sword base only)", () => {
    const items = [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ];
    expect(premiumWithItemModifiers(items)).toBe(210);
  });
  // Modifier thresholds
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    // base 100 + first insurance 10 - loyalty 20 = 90 + 5 fee = 95
    const customer = { yearsWithMHPCO: 2, contractCount: 0 };
    expect(quote(customer, [{ type: "sword" }])).toBe(95);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    // base 100 + 30% high-enchantment = 130
    expect(premiumWithItemModifiers([{ type: "sword", enchantment: 5 }])).toBe(130);
  });
  it("cursed sword with enchantment 5 -> both surcharges apply", () => {
    // base 100 + curse 50 + high-enchantment 30 = 180
    expect(premiumWithItemModifiers([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(180);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    // base 100, enchantment 4 < 5 -> no surcharge
    expect(premiumWithItemModifiers([{ type: "sword", enchantment: 4 }])).toBe(100);
  });

  // Rounding
  it("premium with fractional total is rounded up (MHPCO's favor)", () => {
    // returning customer, 2 runes: base 50 + first ins 5 - follow-up 7.5 + fee 5 = 52.5 -> 53
    const customer = { yearsWithMHPCO: 0, contractCount: 1 };
    expect(quote(customer, [{ type: "rune" }, { type: "rune" }])).toBe(53);
  });

  // Integration examples
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(quote(customer, items)).toBe(165);
  });
  it("long-standing customer's second contract cursed sword (ench 7) -> premium 160 G", () => {
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    const customer = { yearsWithMHPCO: 3, contractCount: 1 };
    const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    expect(quote(customer, items)).toBe(160);
  });
  it("first insurance surcharge applies per item regardless of customer history", () => {
    // returning customer (0 yrs, contract #2), plain sword:
    // 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
    const customer = { yearsWithMHPCO: 0, contractCount: 1 };
    expect(quote(customer, [{ type: "sword" }])).toBe(100);
  });
});

describe("MHPCO Claim Office - Claim", () => {
  // Standard reimbursement
  it("regular sword (steel, ench 3), damage 500 G -> payout 400 G", () => {
    // full reimbursement minus 100 G deductible
    const policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3 }],
      remainingCap: 2000,
    };
    const incident = { damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("rune (value 250 G), damage 200 G -> payout 100 G (no special clause)", () => {
    const policy = { items: [{ type: "rune" }], remainingCap: 500 };
    const incident = { damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim(policy, incident).payout).toBe(100);
  });

  // Enchantment threshold reimbursement
  it("dragon-material sword, ench 8, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    // high-enchantment clause: 50% of 1000 = 500, then -100 deductible = 400
    const policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 8 }],
      remainingCap: 2000,
    };
    const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon-material sword, ench 9, damage 1000 G -> payout 400 G (50% wins)", () => {
    // both clauses apply; 50% rule wins: 500 - 100 = 400
    const policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
      remainingCap: 2000,
    };
    const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("dragon-material sword, ench 5, damage 800 G -> payout 700 G (dragon full, then deductible)", () => {
    // only dragon-material clause applies: full reimbursement, then deductible: 800 - 100
    const policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 5 }],
      remainingCap: 2000,
    };
    const incident = { damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident).payout).toBe(700);
  });
  it("steel sword, ench 9, damage 1000 G -> payout 400 G (high-enchantment 50% then deductible)", () => {
    const policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9 }],
      remainingCap: 2000,
    };
    const incident = { damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 G (deductible per item)", () => {
    // (500-100) + (300-100) = 400 + 200 = 600
    const policy = {
      items: [{ type: "sword" }, { type: "amulet" }],
      remainingCap: 3200,
    };
    const incident = {
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });

  // Multiple items of same type
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(insuranceSum(items)).toBe(2000);
    expect(cap(items)).toBe(4000);
  });
  it("dragon attack damages both swords -> each entry separate deductible", () => {
    // two sword damages of 500 each: (500-100) + (500-100) = 800
    const policy = {
      items: [{ type: "sword" }, { type: "sword" }],
      remainingCap: 4000,
    };
    const incident = {
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(800);
  });
  it("more damage entries of a type than covered -> claim rejected (throws)", () => {
    // two sword damages but only one sword insured
    const policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    const incident = {
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow();
  });

  // Cap exhaustion
  it("policy covers sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(insuranceSum(items)).toBe(1600);
    expect(cap(items)).toBe(3200);
  });
  it("cursed sword -> cap 2000 G (based on unmodified insurance value)", () => {
    // premium modifiers do not raise the cap; cap = 2 * 1000
    expect(cap([{ type: "sword", cursed: true }])).toBe(2000);
  });
  it("policy covers sword + 3 runes -> insurance sum 1750 G", () => {
    // 1000 + 3*250 = 1750; block discount affects premium only, not insurance sum
    const items = [
      { type: "sword" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ];
    expect(insuranceSum(items)).toBe(1750);
  });
  it("first claim 1500 G -> payout 1400 G, remaining cap 600 G", () => {
    // sword cap 2000; raw payout 1500-100=1400 <= 2000; remaining 2000-1400=600
    const policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    const incident = { damages: [{ itemType: "sword", amount: 1500 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("second claim 1500 G -> payout 600 G, remaining cap 0 G", () => {
    // remaining cap 600; desired 1400 reduced to remaining 600; remaining 0
    const policy = { items: [{ type: "sword" }], remainingCap: 600 };
    const incident = { damages: [{ itemType: "sword", amount: 1500 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // Rounding for payout
  it("payout calculation yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    // high-enchantment 50% of 901 = 450.5, - 100 deductible = 350.5 -> rounded down 350
    const policy = {
      items: [{ type: "sword", enchantment: 8 }],
      remainingCap: 2000,
    };
    const incident = { damages: [{ itemType: "sword", amount: 901 }] };
    expect(claim(policy, incident).payout).toBe(350);
  });

  // Error edge cases
  it("claim references item not in policy -> throws", () => {
    // an amulet damaged when only a sword is insured
    const policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    const incident = { damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim(policy, incident)).toThrow();
  });
  it("claim with negative amount -> throws", () => {
    const policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    const incident = { damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(policy, incident)).toThrow();
  });
});

describe("MHPCO Claim Office - CLI scenario processing", () => {
  it("processes quote then claim sequentially with results array", () => {
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
    // amulet premium: 60 base + 6 first insurance - 12 loyalty + 5 fee = 59
    // claim: 200 - 100 = 100 payout; cap = 2*600 = 1200; remaining 1100
    const { results } = runScenario(scenario);
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("quote with unknown item type -> throws", () => {
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(() => quote(customer, [{ type: "broomstick" }])).toThrow();
  });
});
