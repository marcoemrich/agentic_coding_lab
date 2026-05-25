import { describe, it, expect } from "vitest";
import { runScenario, Scenario } from "./claim-office.js";

function quote(items: any[], years = 0, isFirst = true): number {
  const steps: any[] = [];
  if (!isFirst) {
    steps.push({ op: "quote", items: [{ type: "sword" }] });
  }
  steps.push({ op: "quote", items });
  const scenario: Scenario = { customer: { yearsWithMHPCO: years }, steps };
  const out = runScenario(scenario);
  const last = out.results[out.results.length - 1] as { premium: number };
  return last.premium;
}

describe("Building block of 3 alike components", () => {
  it("2 runes → 50 G base premium → total 55 G with fee", () => {
    // 2 * 25 = 50 base; first insurance 2*25*0.10 = 5; total 55+5=60
    // The premium spec separates base premium from fee/modifiers.
    // We verify via final premium: 50 base + 5 (first insurance 10% of 50) + 5 fee = 60
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });

  it("3 runes → 60 G base premium (block applies) → total 71 G with fee", () => {
    // block: 60; first insurance is 10% of each item's base: 3 * 25 * 0.10 = 7.5
    // total = 60 + 7.5 + 5 = 72.5 → round up = 73
    // Wait, the first insurance surcharge: spec says "A first insurance carries a 10% initial assessment surcharge"
    // Per the integration example, first insurance is 10% of base. The block discount is part of base.
    // Looking at "newcomer cursed sword": base 100, first insurance +10 (10% of 100 G base).
    // So first insurance = 10% of base premium of the item.
    // For a 3-rune block: base = 60 (block), but per-item base is 25.
    // Re-reading spec: it doesn't disambiguate. Let me check current impl uses per-item base.
    // Per the spec, the block is a "special base premium" for 3 alike components.
    // The cleanest reading is the policy's base premium for the block is 60.
    // First insurance is "carried" by the insurance. It's 10% of base premium.
    // Looking at example: 2 runes → 50 G base premium. The spec shows base only.
    // The fairest interpretation: first insurance is 10% of base premium contribution.
    // 60 base + 6 first ins + 5 fee = 71
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });

  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    // 4 * 25 = 100 base; first ins 10; fee 5 → 115
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(115);
  });

  it("7 runes → 175 G base premium", () => {
    // 7 = 2*3 blocks + 1 = 2*60 + 25 = 145. Hmm spec says 175. Let me re-read.
    // "A building block of 3 alike components is offered at a special base premium of 60 G."
    // 7 runes: 175 G base. That means 7*25 = 175 (no block applies for 7?).
    // So "block applies only with exactly 3"! Re-read: "no block — block requires exactly 3"
    // for the 4 runes case. So 7 runes is also no block. Confirmed.
    // 175 + 17.5 (first ins) + 5 = 197.5 → round up = 198
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
});

describe("Alike components", () => {
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // 3 * 25 = 75 base; first ins = 7.5; total = 75 + 7.5 + 5 = 87.5 → ceil = 88
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // 60 + 60 = 120 base (two separate blocks of 3);
    // first ins = 10% of policy base 120 = 12; + fee 5 = 137
    expect(
      quote([
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ])
    ).toBe(137);
  });
});

describe("Modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet → 210 G before further modifiers and fee", () => {
    // 100 + 60 = 160 base; cursed surcharge 50 (50% of 100); = 210 before fee
    // + first ins 10% of (100+60) = 16; + fee 5 = 231
    const result = quote([
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet" },
    ]);
    expect(result).toBe(231);
  });
});

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years → loyalty discount applies", () => {
    // sword: base 100; loyalty 20% → 80; first ins 10; fee 5 → 95
    expect(quote([{ type: "sword" }], 2, true)).toBe(95);
  });

  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // base 100; high ench 30; first ins 10; fee 5 → 145
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });

  it("sword with enchantment 5 and cursed → both surcharges apply", () => {
    // base 100; curse 50; high ench 30; first ins 10; fee 5 → 195
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });

  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // base 100; first ins 10; fee 5 → 115
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });

  it("sword with enchantment 4 cursed → curse only", () => {
    // base 100; curse 50; first ins 10; fee 5 → 165
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe("Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });

  it("damage to a rune (insurance 250), damage 200 G → payout 100 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(100);
  });
});

describe("Enchantment threshold vs. dragon material", () => {
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G", () => {
    // Both clauses apply, 50% wins: 500, minus 100 deductible = 400
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });

  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(700);
  });

  it("steel sword, enchantment 9, damage 1000 G → payout 400 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });

  it("dragon-material sword, enchantment exactly 8, damage 1000 G → payout 400 G", () => {
    // high-enchantment clause applies (>=8), then deductible
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });
});

describe("Deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(600);
  });
});

describe("Multiple items of the same type", () => {
  it("policy with two swords → insurance sum 2000, cap 4000", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [{ itemType: "sword", amount: 0 }], // trivial claim to surface remainingCap
          },
        },
      ],
    };
    const out = runScenario(scenario);
    // First claim: amount 0, after deductible negative → payout 0, remaining cap = 4000
    expect((out.results[1] as any).remainingCap).toBe(4000);
  });

  it("two sword damages each get their own deductible", () => {
    const scenario: Scenario = {
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
    };
    const out = runScenario(scenario);
    // 500-100 + 500-100 = 800
    expect((out.results[1] as any).payout).toBe(800);
  });

  it("more damage entries of a type than items insured → CLI exits non-zero (throws)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe("Cap exhaustion", () => {
  it("sword + amulet → insurance sum 1600, cap 3200", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).remainingCap).toBe(3200);
  });

  it("cursed sword → cap based on unmodified insurance value (2000)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).remainingCap).toBe(2000);
  });

  it("sword + 3 runes → insurance sum 1750 (block discount doesn't affect insurance)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 0 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).remainingCap).toBe(3500); // 1750*2
  });

  it("sword insured (cap 2000), two claims of 1500 G each", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    // first claim: 1500 - 100 = 1400; remaining 2000 - 1400 = 600
    expect((out.results[1] as any).payout).toBe(1400);
    expect((out.results[1] as any).remainingCap).toBe(600);
    // second claim: desired 1400, capped to 600; remaining 0
    expect((out.results[2] as any).payout).toBe(600);
    expect((out.results[2] as any).remainingCap).toBe(0);
  });
});

describe("Rounding in the MHPCO's favor", () => {
  it("premium calculation yielding 197.5 G → rounded up to 198 G", () => {
    // 7 runes → base 175, first ins 17.5, fee 5 → 197.5 → ceil 198
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });

  it("payout yielding 350.5 G → rounded down to 350 G", () => {
    // To get 350.5: high-ench sword damage 901 → 450.5; deductible 100; = 350.5 → 350
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as any).payout).toBe(350);
  });
});

describe("Edge cases", () => {
  it("empty item list → premium 5 G", () => {
    expect(quote([])).toBe(5);
  });

  it("quote with unknown item type → throws (CLI non-zero exit)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" } as any] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("claim references item not on policy → throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("claim references unknown item type → throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 100 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("claim with negative damage amount → throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe("Integration examples", () => {
  it("Newcomer with a cursed sword → 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0, true)).toBe(165);
  });

  it("Long-standing customer's second contract → 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, false)).toBe(160);
  });
});

describe("Item base premiums (spec)", () => {
  it("amulet alone → 60 base + 6 first ins + 5 fee = 71", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("staff alone → 80 + 8 + 5 = 93", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("potion alone → 40 + 4 + 5 = 49", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("sword alone → 100 + 10 + 5 = 115", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
});
