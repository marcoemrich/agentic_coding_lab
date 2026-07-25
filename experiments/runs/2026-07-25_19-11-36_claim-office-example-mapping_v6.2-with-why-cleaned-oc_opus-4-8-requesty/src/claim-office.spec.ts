import { describe, it, expect } from "vitest";
import { runScenario, basePremium } from "./claim-office.js";

describe("Claim Office - quote base premiums and fee", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("single sword -> base 100 + fee 5, with first insurance 10% surcharge = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet -> base 60 + first insurance 6 + fee 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff -> base 80 + first insurance 8 + fee 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion -> base 40 + first insurance 4 + fee 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });
});

describe("Claim Office - component building blocks", () => {
  it("2 runes -> 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block - block requires exactly 3)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(100);
  });
  it("7 runes -> 175 G base premium", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(runes)).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(basePremium(items)).toBe(120);
  });
});

describe("Claim Office - individual premium modifiers", () => {
  it("cursed sword adds 50% risk surcharge (50 G of base)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("highly enchanted sword (enchantment >= 5) adds 30% risk surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 6 }] }],
    });
    // 100 base + 30 high-ench + 10 first insurance + 5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    // 100 base + 30 high-ench + 10 first + 5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    // 100 base + 10 first + 5 fee = 115 (no high-ench)
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("long-standing customer (>= 2 years) receives 20% loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // 100 base - 20 loyalty + 10 first + 5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // 100 base - 20 loyalty + 10 first + 5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
});

describe("Claim Office - modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet -> policy base 160, curse adds 50 (of cursed item), = 210 before fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    // sword: 100 + 10 first + 50 curse = 160; amulet: 60 + 6 first = 66; sum 226 + 5 fee = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });
});

describe("Claim Office - integration examples", () => {
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract, cursed sword (steel ench 7) -> premium 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [cursedSword] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    // 2nd contract: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe("Claim Office - rounding in MHPCO's favor", () => {
  it("premium yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    // Craft a fractional premium: 2 runes on a follow-up contract.
    // 2nd quote: 50 base + 5 first insurance - 7.5 follow-up (15% of 50) + 5 fee = 52.5 -> ceil 53
    const twoRunes = [{ type: "rune" }, { type: "rune" }];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: twoRunes },
        { op: "quote", items: twoRunes },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 53 });
  });
  it("payout yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // high-ench 50% of 901 = 450.5, - 100 deductible = 350.5 -> floor 350; cap 2000 - 350 = 1650
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("Claim Office - claim processing basic", () => {
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // full reimbursement 500 - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250), damage 200 -> payout 100 (minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // rune value 250, sum 250, cap 500; payout 200 - 100 = 100; remaining 500 - 100 = 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe("Claim Office - claim special clauses", () => {
  it("dragon-material sword, ench 5, damage 800 -> payout 700 (dragon full reimbursement, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // dragon material -> full reimbursement 800 - 100 deductible = 700; cap 2000 - 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, ench 9, damage 1000 -> payout 400 (high-enchantment 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // high-ench (>=8) 50% of 1000 = 500, then deductible 100 = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 9, damage 1000 -> payout 400 (50% rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // both clauses apply; 50% wins: 500, then deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 8, damage 1000 -> payout 400 (high-enchantment applies, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // ench exactly 8 -> high-enchantment 50% = 500, then deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("Claim Office - deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible once per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
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
    // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total 600; cap (1600*2=3200) - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("Claim Office - cap", () => {
  it("cap based on unmodified insurance value: cursed sword -> cap 2000", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // cap = unmodified insurance value 1000 * 2 = 2000; payout 1000 - 100 = 900; remaining 2000 - 900 = 1100
    expect(result.results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("sword insured, two successive 1500 claims -> first payout 1400 remaining 600, second payout 600 remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // cap 2000; first: 1500-100=1400, remaining 600; second: raw 1400 capped to 600, remaining 0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("policy covers two swords -> insurance sum 2000, cap 4000; both swords damaged separately", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "sword", material: "steel", enchantment: 3 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // cap = 2*1000*2 = 4000; each sword damage 500-100=400, total 800; remaining 4000-800=3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
});

describe("Claim Office - error handling", () => {
  it("quote with unknown item type -> throws / non-zero exit", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> throws / non-zero exit", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with more damages of a type than covered -> throws / non-zero exit", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount -> throws / non-zero exit", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fraud", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
