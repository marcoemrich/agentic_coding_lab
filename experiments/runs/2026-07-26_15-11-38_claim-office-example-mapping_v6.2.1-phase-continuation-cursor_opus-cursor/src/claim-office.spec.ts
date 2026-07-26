import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("Claim Office - quote base premiums", () => {
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });
  it("single sword newcomer -> base 100 +10 first ins + fee 5 = 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet newcomer -> 60 +6 first ins + fee 5 = 71 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("single staff newcomer -> 80 +8 first ins + fee 5 = 93 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("single potion newcomer -> 40 +4 first ins + fee 5 = 49 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 49 });
  });
  it("single rune newcomer -> 25 +2.5 first ins +5 = 32.5 -> round up 33 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 33 });
  });
  it("single moonstone newcomer -> 33 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 33 });
  });
});

describe("Claim Office - component blocks", () => {
  it("2 runes -> 50 G base premium (+5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium block applies (+5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium no block (+5 fee)", () => {
    const out = runScenario({
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
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium (+5 fee)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> 75 G base premium no block different types (+5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium two separate blocks (+5 fee)", () => {
    const out = runScenario({
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
    expect(out.results[0]).toEqual({ premium: 137 });
  });
});

describe("Claim Office - premium modifiers", () => {
  it("cursed sword newcomer -> 100+50 curse +10 first ins +5 fee = 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("highly enchanted sword (ench 5) newcomer -> 100+30+10 first ins +5 = 145 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("sword ench 4 newcomer -> no high-enchant surcharge, 100 +10 first ins +5 = 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("cursed + highly enchanted sword (ench 5) newcomer -> 100+50+30+10 +5 = 195 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 195 });
  });
  it("long-standing customer (2 years) first contract -> loyalty -20 + first ins +10 = 100 +5 = 95 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("customer <2 years -> no loyalty discount (100 +10 first ins +5 = 115)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("first insurance -> 10% surcharge on policy base (staff 80 -> 88 +5 = 93)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("follow-up contract (2nd quote) -> 15% discount on policy base", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
    expect(out.results[1]).toEqual({ premium: 100 });
  });
});

describe("Claim Office - modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet -> base 160 + curse 50 + first ins 16 + fee 5 = 231 G", () => {
    const out = runScenario({
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
    expect(out.results[0]).toEqual({ premium: 231 });
  });
});

describe("Claim Office - rounding in MHPCO favor", () => {
  it("premium 197.5 -> rounded up to 198 G (7 runes newcomer)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("payout 350.5 -> rounded down to 350 G (high-enchant 50%, damage 901)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("Claim Office - integration examples", () => {
  it("newcomer with cursed sword (steel, ench 3) -> 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer (3y) second contract cursed sword ench 7 -> 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });
});

describe("Claim Office - claim standard reimbursement", () => {
  it("regular sword damage 500 -> payout 400 (minus deductible)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 -> payout 100 (minus deductible)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe("Claim Office - claim special clauses", () => {
  it("high-enchant sword (ench 8) dragon material damage 1000 -> payout 400", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 9 damage 1000 -> payout 400 (50% wins then deductible)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 5 damage 800 -> payout 700 (full then deductible)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9 damage 1000 -> payout 400 (high-enchant 50% then deductible)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("Claim Office - deductible per damage event", () => {
  it("dragon damages sword 500 + amulet 300 -> payout 600 (deductible per item)", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("Claim Office - cap", () => {
  it("two swords -> insurance sum 2000, cap 4000", () => {
    const out = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 3000 }],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 2900, remainingCap: 1100 });
  });
  it("dragon damages both swords -> each entry separate deductible", () => {
    const out = runScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damages of a type than insured -> reject (throws)", () => {
    expect(() =>
      runScenario({
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
  it("sword + amulet -> insurance sum 1600, cap 3200", () => {
    const out = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 4000 }],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword premium modifiers do not raise cap -> cap 2000", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 3000 }],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3 runes block -> insurance sum 1750, block discount only premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
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
            damages: [{ itemType: "sword", amount: 5000 }],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("successive claims exhaust cap: first 1500->payout 1400 remaining 600; second->600 remaining 0", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("Claim Office - edge cases / errors", () => {
  it("quote unknown item type -> error (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> error (throws)", () => {
    expect(() =>
      runScenario({
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
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim damage amount -200 -> error (throws)", () => {
    expect(() =>
      runScenario({
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
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
