import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("Claim Office - quote premiums", () => {
  // Edge case: empty item list
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // Base item premiums (single item, newcomer 0 years, first insurance surcharge applies)
  // For isolating base premiums we use a long-standing... actually base premium is item base.
  // We test base premium + fee only via a plain item where no first-insurance? First insurance always applies to each item.
  // Simplest: single plain sword. base 100 + first insurance 10 = 110 + 5 fee = 115
  it("single plain sword (newcomer) -> premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single plain amulet (newcomer) -> premium 71 G (60 base + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single plain staff (newcomer) -> premium 93 G (80 base + 8 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single plain potion (newcomer) -> premium 49 G (40 base + 4 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Components (base premium shown; runScenario returns total = base + 10% first + 5 fee)
  it("2 runes -> base premium 50 G (total 60: 50 + 5 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> base premium 60 G block (total 71: 60 + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> base premium 100 G no block (total 115: 100 + 10 first + 5 fee)", () => {
    const result = runScenario({
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
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> base premium 175 G (total 197.5 rounds up to 198)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // "Alike" components
  it("2 runes + 1 moonstone -> base premium 75 G no block (total 87.5 rounds up to 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> base premium 120 G two blocks (raw total 137)", () => {
    const result = runScenario({
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
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Modifier scope on multi-item policies
  // policy base 160; curse +50 (item); first insurance +16 (10% of 160); +5 fee = 231
  it("cursed sword + plain amulet (newcomer) -> 231 G (base 160 + 50 curse + 16 first + 5 fee)", () => {
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
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // Modifier thresholds
  // 2y customer, plain sword: base 100 + 10 first - 20 loyalty (20% of 100) + 5 fee = 95
  it("customer with exactly 2 years -> loyalty discount applies (premium 95)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  // sword ench 5, newcomer: base 100 + 30 high-ench (30% of 100) + 10 first + 5 fee = 145
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies (premium 145)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  // cursed sword ench 5, newcomer: base 100 + 50 curse + 30 high-ench + 10 first + 5 fee = 195
  it("sword with enchantment 5 and cursed -> both surcharges apply (premium 195)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  // sword ench 4, newcomer: base 100 + 10 first + 5 fee = 115 (no high-ench surcharge)
  it("sword with enchantment 4 -> no high-enchantment surcharge (premium 115)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // Rounding for premium (up, in MHPCO's favor). 7 runes: raw 197.5 -> 198
  it("premium calculation yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // Integration: newcomer with cursed sword -> 165 G
  it("newcomer with cursed sword (steel, ench 3) -> premium 165 G", () => {
    const result = runScenario({
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
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // Integration: long-standing customer's second contract -> 160 G
  // 3y customer, 2nd quote, cursed sword ench 7:
  // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
  it("long-standing (3y) second contract, cursed sword ench 7 -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe("Claim Office - claim payouts", () => {
  // Standard reimbursement
  // sword insured (cap 2000); damage 500 -> payout 400 (500 - 100 deductible); remaining 1600
  it("regular sword (steel, ench 3), damage 500 G -> payout 400 G", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  // rune value 250, cap 500; damage 200 -> payout 100 (200 - 100); remaining 400
  it("damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spill",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Enchantment threshold vs dragon material
  // dragon sword ench 8, damage 1000: high-ench 50% (500) then deductible -> 400; cap 2000, remaining 1600
  it("dragon sword ench 8, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    const result = runScenario({
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  // dragon sword ench 9, damage 1000: both apply, 50% wins -> 500 - 100 = 400; cap 2000, remaining 1600
  it("dragon sword ench 9, damage 1000 G -> payout 400 G (50% wins then deductible)", () => {
    const result = runScenario({
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  // dragon sword ench 5, damage 800: only dragon full reimbursement -> 800 - 100 = 700; cap 2000, remaining 1300
  it("dragon sword ench 5, damage 800 G -> payout 700 G (full then deductible)", () => {
    const result = runScenario({
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  // steel sword ench 9, damage 1000: only high-ench 50% -> 500 - 100 = 400; cap 2000, remaining 1600
  it("steel sword ench 9, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  // sword 500 -> 400, amulet 300 -> 200; total 600; cap 2*(1000+600)=3200; remaining 2600
  it("dragon attack: sword 500 + amulet 300 -> payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
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
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Rounding for payout (down). sword ench 8, damage 901: 450.5 - 100 = 350.5 -> floor 350
  it("payout calculation yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    const result = runScenario({
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
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Cap exhaustion
  // cursed sword: cap based on unmodified value 1000 -> 2000; damage 200 -> payout 100, remaining 1900
  it("cursed sword cap based on unmodified value -> cap 2000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  // sword + amulet: insurance sum 1600, cap 3200; damage sword 200 -> payout 100, remaining 3100
  it("policy sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  // sword + 3 runes block: insurance sum 1000 + 3*250 = 1750, cap 3500; damage sword 200 -> payout 100, remaining 3400
  it("policy sword + 3 runes block -> insurance sum 1750 G", () => {
    const result = runScenario({
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
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  // sword cap 2000; two successive claims of 1500 each
  // first: 1500-100=1400, remaining 600; second: desired 1400 clamped to 600, remaining 0
  it("two successive claims 1500 each: first payout 1400 remaining 600, second payout 600 remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multiple items of same type
  // two swords: insurance sum 2000, cap 4000; damage sword 200 -> payout 100, remaining 3900
  it("two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  // two swords, two sword damages 500 each: each own deductible -> 400+400=800; cap 4000, remaining 3200
  it("two sword damages each get own deductible", () => {
    const result = runScenario({
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  // one sword insured, two sword damages -> reject (runScenario throws)
  it("more sword damages than swords insured -> rejected (throws)", () => {
    expect(() =>
      runScenario({
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
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});

describe("Claim Office - error handling", () => {
  it("quote with unknown item type -> runScenario throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing item not in policy -> runScenario throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
    ).toThrow();
  });
  it("claim with negative damage amount -> runScenario throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow();
  });
});
