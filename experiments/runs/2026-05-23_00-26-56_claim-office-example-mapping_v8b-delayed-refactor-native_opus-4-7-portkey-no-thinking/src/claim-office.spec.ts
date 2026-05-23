import { describe, it, expect } from "vitest";
import { runScenario } from "./runner.js";
import { Scenario } from "./types.js";

function quote(items: any[], yearsWithMHPCO = 0, previousQuotes: any[][] = []) {
  const steps: any[] = previousQuotes.map((prevItems) => ({ op: "quote", items: prevItems }));
  steps.push({ op: "quote", items });
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps,
  };
  const out = runScenario(scenario);
  return (out.results[out.results.length - 1] as { premium: number }).premium;
}

describe("Item values and base premiums", () => {
  // Spec: Sword 1000G value / 100G base, Amulet 600/60, Staff 800/80, Potion 400/40
  it("sword: base premium 100 G → final 110 G (with 10G first ins, 5G fee = 115? wait)", () => {
    // 100 base + 10 (first insurance 10%) + 5 fee = 115
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("amulet: base 60 → 60 + 6 (first ins) + 5 fee = 71", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("staff: base 80 → 80 + 8 + 5 = 93", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("potion: base 40 → 40 + 4 + 5 = 49", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
});

describe("Component pricing — building block of 3 alike components", () => {
  // Spec examples: 2 runes → 50, 3 runes → 60, 4 runes → 100, 7 runes → 175 (base premiums)
  it("2 runes → base premium 50 G", () => {
    // base 50, +5 first ins, +5 fee = 60
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes → base premium 60 G (block applies)", () => {
    // base 60, +6 first ins, +5 fee = 71
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes → base premium 100 G (no block — block requires exactly 3 per block)", () => {
    // base 100 (one block of 3 + 1 leftover = 60 + 25 = 85? wait)
    // Re-read spec: "4 runes → 100 G base premium (no block — block requires exactly 3)"
    // So 4 runes = 4 * 25 = 100. The block only applies when count is exactly 3.
    // But what about 7? "7 runes → 175 G base premium" → 7*25 = 175. So no blocks for 7 either.
    // Block applies only when count is *exactly* 3 alike components. My implementation has it wrong!
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100 + 10 + 5);
  });
  it("7 runes → base premium 175 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    // 7 * 25 = 175 base; 175 * 0.1 = 17.5 first ins → total 192.5 + 5 fee = 197.5 → round up 198
    expect(quote(items)).toBe(198);
  });
});

describe('"Alike" components (clarifying question ❓)', () => {
  // Spec: 2 runes + 1 moonstone → 75 G base (no block: different types)
  it("2 runes + 1 moonstone → base premium 75 G (different types, no block)", () => {
    // base 75 + 7.5 first ins + 5 fee = 87.5 → 88
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones → base premium 120 G (two separate blocks)", () => {
    // base 60+60 = 120; 120 * 1.1 = 132 + 5 = 137
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    expect(quote(items)).toBe(137);
  });
});

describe("Modifier scope on multi-item policies (clarifying ❓)", () => {
  // Spec: cursed sword + plain amulet
  // base 100 + 60 = 160; cursed surcharge 50 G (50% of sword base, not policy total) → 210 G before further modifiers + fee
  // newcomer first quote: + 10% first ins on policy base = 16 → 210 + 16 = 226 + 5 fee = 231
  it("cursed sword + plain amulet: cursed surcharge scoped to cursed item only", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    // 100 + 60 + 50 (curse on sword) + 16 (first ins 10% on policy base 160) + 5 = 231
    expect(quote(items)).toBe(231);
  });
});

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years with MHPCO → loyalty discount applies (sword)", () => {
    // 100 + 10 (first ins) − 20 (20% loyalty on base 100) + 5 = 95
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // 100 + 30 (high ench) + 10 (first ins) + 5 = 145
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with enchantment 5 AND cursed → both surcharges apply", () => {
    // 100 + 50 (curse) + 30 (high ench) + 10 (first ins) + 5 = 195
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("sword enchantment 4, not cursed → no high ench, no curse", () => {
    // 100 + 10 + 5 = 115
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("sword enchantment 4, cursed → curse only, no high ench", () => {
    // 100 + 50 + 10 + 5 = 165
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe("Premium rounding (MHPCO's favor — round up)", () => {
  it("premium calc 197.5 G → final 198 G", () => {
    // 7 runes: 175 + 17.5 (first ins) + 5 = 197.5 → 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(items)).toBe(198);
  });
});

describe("Empty item list", () => {
  it("empty items → premium 5 G (only the processing fee)", () => {
    expect(quote([])).toBe(5);
  });
});

describe("Newcomer with a cursed sword (integration example)", () => {
  it("0 years, no previous, cursed sword steel ench 3 → premium 165 G", () => {
    // 100 base + 50 curse + 10 first ins = 160 + 5 fee = 165
    expect(
      quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)
    ).toBe(165);
  });
});

describe("Long-standing customer's second contract (integration example with ❓)", () => {
  it("3 years, second quote, cursed sword steel ench 7 → premium 160 G", () => {
    // 100 base + 50 curse + 30 high ench − 20 loyalty + 10 first ins − 15 follow-up = 155 + 5 fee = 160
    const previousQuotes = [[{ type: "sword" }]];
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        3,
        previousQuotes
      )
    ).toBe(160);
  });
  it("first quote of a long-standing customer: no follow-up discount", () => {
    // 3 years, first quote, plain sword: 100 + 10 (first ins) − 20 (loyalty) + 5 = 95
    expect(quote([{ type: "sword" }], 3)).toBe(95);
  });
});

// ===== CLAIMS =====
function runScenarioHelper(scenario: Scenario) {
  return runScenario(scenario);
}

describe("Claim: Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G", () => {
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
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });
  it("rune damage 200 G → payout 100 G", () => {
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
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(100);
  });
});

describe("Claim: Enchantment threshold vs. dragon material", () => {
  it("dragon-material sword, ench 9, damage 1000 → payout 400 (50% wins, then deductible)", () => {
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
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });
  it("dragon-material sword, ench 5, damage 800 → payout 700 (dragon only: full, then deductible)", () => {
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
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(700);
  });
  it("steel sword, ench 9, damage 1000 → payout 400 (50%, then deductible)", () => {
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
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });
  it("dragon-material sword exactly ench 8, damage 1000 → payout 400", () => {
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
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(400);
  });
});

describe("Claim: Deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G", () => {
    const scenario: Scenario = {
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
    };
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(600);
  });
});

describe("Claim: Multiple items of the same type (clarifying ❓)", () => {
  it("two swords: insurance sum 2000, cap 4000", () => {
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
    const out = runScenarioHelper(scenario);
    // each damage: 500-100 = 400; total 800; cap 4000 → remaining 3200
    expect((out.results[1] as any).payout).toBe(800);
    expect((out.results[1] as any).remainingCap).toBe(3200);
  });
  it("too many damages of a type → CLI rejects (throws)", () => {
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
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    expect(() => runScenarioHelper(scenario)).toThrow();
  });
});

describe("Claim: Cap exhaustion", () => {
  it("sword + amulet: insurance sum 1600, cap 3200", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    const out = runScenarioHelper(scenario);
    // sword damage 200, deductible 100 = 100 payout; cap remaining 3200-100 = 3100
    expect((out.results[1] as any).payout).toBe(100);
    expect((out.results[1] as any).remainingCap).toBe(3100);
  });
  it("cursed sword: cap based on unmodified insurance value (2000 G)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    };
    const out = runScenarioHelper(scenario);
    // 2500 - 100 = 2400; cap is 2000, so payout 2000, remaining 0
    expect((out.results[1] as any).payout).toBe(2000);
    expect((out.results[1] as any).remainingCap).toBe(0);
  });
  it("sword + 3 runes (block): insurance sum 1750", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    const out = runScenarioHelper(scenario);
    // cap = 1750 * 2 = 3500; payout 100; remaining 3400
    expect((out.results[1] as any).remainingCap).toBe(3400);
  });
  it("sword (cap 2000); two successive 1500 G claims → 1400, 600", () => {
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
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(1400);
    expect((out.results[1] as any).remainingCap).toBe(600);
    expect((out.results[2] as any).payout).toBe(600);
    expect((out.results[2] as any).remainingCap).toBe(0);
  });
});

describe("Claim: Rounding (MHPCO's favor — round down for payout)", () => {
  it("payout calc 350.5 G → final payout 350 G", () => {
    // Need to engineer a case yielding 350.5. high-ench sword, damage 901 → 901*0.5 = 450.5; - 100 = 350.5
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };
    const out = runScenarioHelper(scenario);
    expect((out.results[1] as any).payout).toBe(350);
  });
});

describe("Edge cases", () => {
  it("quote with unknown item type → throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenarioHelper(scenario)).toThrow();
  });
  it("claim references item type not in policy → throws", () => {
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
    expect(() => runScenarioHelper(scenario)).toThrow();
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
    expect(() => runScenarioHelper(scenario)).toThrow();
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
    expect(() => runScenarioHelper(scenario)).toThrow();
  });
});

describe("Schema example end-to-end", () => {
  it("the worked stdin example produces well-formed results", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const out = runScenarioHelper(scenario);
    // amulet: 60 base; loyalty: -12; first ins: +6 = 54 + 5 = 59
    expect((out.results[0] as any).premium).toBe(59);
    // damage 200 - 100 deductible = 100; cap = 1200; remaining 1100
    expect((out.results[1] as any).payout).toBe(100);
    expect((out.results[1] as any).remainingCap).toBe(1100);
  });
});
