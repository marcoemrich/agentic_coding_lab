import { describe, it, expect } from "vitest";
import { processScenario, Scenario } from "./claimOffice.js";

function quote(scenario: Scenario): number {
  const out = processScenario(scenario);
  const r = out.results[out.results.length - 1] as { premium: number };
  return r.premium;
}

function premiumFor(items: any[], yearsWithMHPCO = 0, priorContracts = 0): number {
  const steps: any[] = [];
  for (let i = 0; i < priorContracts; i++) {
    steps.push({ op: "quote", items: [{ type: "sword" }] }); // dummy prior contracts
  }
  steps.push({ op: "quote", items });
  const s: Scenario = { customer: { yearsWithMHPCO }, steps };
  return quote(s);
}

// We need a way to compute premium without dummy prior contracts polluting; for these focused tests
// we test single-step quotes for most rules. Helpers for clarity below.

function singleQuote(items: any[], yearsWithMHPCO = 0): number {
  return premiumFor(items, yearsWithMHPCO, 0);
}

describe("Base premiums for main items (single-item, no modifiers, newcomer 0 years)", () => {
  // For a newcomer (0 years, first contract): premium = base + 10% first insurance + 5G fee
  it("sword: base 100 → 100 + 10 + 5 = 115", () => {
    expect(singleQuote([{ type: "sword" }])).toBe(115);
  });
  it("amulet: base 60 → 60 + 6 + 5 = 71", () => {
    expect(singleQuote([{ type: "amulet" }])).toBe(71);
  });
  it("staff: base 80 → 80 + 8 + 5 = 93", () => {
    expect(singleQuote([{ type: "staff" }])).toBe(93);
  });
  it("potion: base 40 → 40 + 4 + 5 = 49", () => {
    expect(singleQuote([{ type: "potion" }])).toBe(49);
  });
});

describe("Component building block of 3 alike components", () => {
  // base premiums - first insurance (10% per component base) + 5 G fee
  it("2 runes → base 50; premium = 50 + 5 + 5 = 60", () => {
    // 2 runes * 25 = 50 base; first insurance per item: 2 * 25 * 0.1 = 5; + 5 fee = 60
    expect(singleQuote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes → base 60 (block applies); premium = 60 + 6 + 5 = 71", () => {
    // block: 60. first insurance: 3 * 20 * 0.1 = 6. + 5 fee = 71
    expect(singleQuote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes → base 100 (no block); premium = 100 + 10 + 5 = 115", () => {
    expect(
      singleQuote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])
    ).toBe(115);
  });
  it("7 runes → base 175 (no block); premium = 175 + 17.5 = 192.5 + 5 = 197.5 → 198", () => {
    const runes = Array(7).fill({ type: "rune" });
    expect(singleQuote(runes)).toBe(198);
  });
});

describe('"Alike" components — same type, not same family (clarifies ❓)', () => {
  it("2 runes + 1 moonstone → base 75 (no block: different types)", () => {
    // base: 2*25 + 1*25 = 75. first insurance: 75*0.1 = 7.5. +5 = 87.5 → ceil 88
    // Spec only specifies base premium 75 here, not final premium. We check via direct scenario:
    // We'll test final premium computed by our impl matches: 75 base + first insurance 7.5 + 5 = 87.5 → 88
    expect(singleQuote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones → base 120 (two separate blocks)", () => {
    // base: 60 + 60 = 120. first insurance: (3*20 + 3*20) * 0.1 = 12. +5 = 137
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    expect(singleQuote(items)).toBe(137);
  });
});

describe("Modifier scope on multi-item policies (clarifies ❓)", () => {
  it("cursed sword + plain amulet: policy base 160; cursed +50 → 210 before further modifiers", () => {
    // Newcomer: 210 + first insurance (10% per item base): sword 10 + amulet 6 = 16 → 226 + 5 fee = 231
    const items = [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ];
    expect(singleQuote(items)).toBe(231);
  });
});

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years → loyalty discount applies", () => {
    // single sword for 2-year customer: 100 + 10 first ins - 20 loyalty + 5 = 95
    expect(singleQuote([{ type: "sword" }], 2)).toBe(95);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // 100 base + 30 high ench + 10 first ins + 5 = 145
    expect(singleQuote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with exactly enchantment 5 and cursed → both surcharges apply", () => {
    // 100 + 50 cursed + 30 high ench + 10 first ins + 5 = 195
    expect(singleQuote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // 100 + 10 first ins + 5 = 115
    expect(singleQuote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("sword with enchantment 4 cursed → cursed surcharge only", () => {
    // 100 + 50 + 10 + 5 = 165
    expect(singleQuote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe("Rounding in the MHPCO's favor", () => {
  it("premium yielding 197.5 G → 198 G (rounded up)", () => {
    // 7 runes scenario already gives 197.5 → 198. Already covered.
    const runes = Array(7).fill({ type: "rune" });
    expect(singleQuote(runes)).toBe(198);
  });
  it("payout yielding 350.5 G → 350 G (rounded down)", () => {
    // Construct a scenario: cursed has no effect on payout. Use dragon-material sword ench 8 with damage 901
    // Per spec: enchantment >= 8 → 50%. dragon-material sword, ench 8, damage 1000 → payout 400 G.
    // damage 901 → 50% = 450.5 → 450 G - deductible 100 = 350.5 → 350.
    // Wait: the spec says deductible applies after reimbursement. Let me re-read:
    // "dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)"
    // So 1000 * 0.5 = 500, - 100 = 400.
    // To get 350.5: 901 * 0.5 = 450.5, - 100 = 350.5 → 350
    const s: Scenario = {
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
            cause: "test",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    const out = processScenario(s);
    expect((out.results[1] as any).payout).toBe(350);
  });
});

describe("Empty item list", () => {
  it("empty items → premium 5 G (only the processing fee)", () => {
    expect(singleQuote([])).toBe(5);
  });
});

describe("Unknown item types", () => {
  it("quote with unknown item type → throws (CLI exits non-zero)", () => {
    const s: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] } as any],
    };
    expect(() => processScenario(s)).toThrow();
  });
});

describe("Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, enchantment 3), damage 500 → payout 400", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    expect((out.results[1] as any).payout).toBe(400);
  });
  it("damage to a rune (insurance value 250), damage 200 → payout 100", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    expect((out.results[1] as any).payout).toBe(100);
  });
});

describe("Deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total = 600
    expect((out.results[1] as any).payout).toBe(600);
  });
});

describe("Enchantment threshold vs. dragon material", () => {
  it("dragon-material sword ench 8, damage 1000 → payout 400 (high-enchantment then deductible)", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    expect((out.results[1] as any).payout).toBe(400);
  });
  it("dragon-material sword ench 9, damage 1000 → payout 400 (50% rule wins, then deductible)", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    expect((out.results[1] as any).payout).toBe(400);
  });
  it("dragon-material sword ench 5, damage 800 → payout 700 (only dragon: full - deductible)", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    expect((out.results[1] as any).payout).toBe(700);
  });
  it("steel sword ench 9, damage 1000 → payout 400 (50% first, then deductible)", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    expect((out.results[1] as any).payout).toBe(400);
  });
});

describe("Multiple items of the same type (clarifies ❓)", () => {
  it("two swords → insurance sum 2000, cap 4000", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    // Each sword: 500 - 100 = 400. Total payout 800. cap 4000 - 800 = 3200
    expect((out.results[1] as any).payout).toBe(800);
    expect((out.results[1] as any).remainingCap).toBe(3200);
  });
  it("damages array has more entries of a type than insured → claim rejected (throws)", () => {
    const s: Scenario = {
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
    expect(() => processScenario(s)).toThrow();
  });
});

describe("Cap exhaustion", () => {
  it("sword + amulet: insurance sum 1600, cap 3200", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    // sword: 200 - 100 = 100; remaining cap 3200 - 100 = 3100
    expect((out.results[1] as any).remainingCap).toBe(3100);
  });
  it("cursed sword: cap 2000 (based on unmodified insurance value)", () => {
    const s: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const out = processScenario(s);
    // sword: 500 - 100 = 400; cap remaining 2000 - 400 = 1600
    expect((out.results[1] as any).remainingCap).toBe(1600);
  });
  it("sword + 3 runes: insurance sum 1750, cap 3500 (block discount affects premium only)", () => {
    const s: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    const out = processScenario(s);
    // cap = 3500; payout = 100; remaining = 3400
    expect((out.results[1] as any).remainingCap).toBe(3400);
  });
  it("sword (cap 2000); two successive 1500 claims → 1400, then 600", () => {
    const s: Scenario = {
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
    const out = processScenario(s);
    // first: 1500 - 100 = 1400; cap remaining 2000-1400 = 600
    expect((out.results[1] as any).payout).toBe(1400);
    expect((out.results[1] as any).remainingCap).toBe(600);
    // second: desired 1400, but cap remaining is 600 → 600
    expect((out.results[2] as any).payout).toBe(600);
    expect((out.results[2] as any).remainingCap).toBe(0);
  });
});

describe("Claim error cases", () => {
  it("claim references item not in policy → throws", () => {
    const s: Scenario = {
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
    expect(() => processScenario(s)).toThrow();
  });
  it("claim with unknown item type → throws", () => {
    const s: Scenario = {
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
    expect(() => processScenario(s)).toThrow();
  });
  it("claim with negative amount → throws", () => {
    const s: Scenario = {
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
    expect(() => processScenario(s)).toThrow();
  });
});

describe("Integration: Newcomer with a cursed sword", () => {
  it("newcomer 0 years, cursed steel sword ench 3 → premium 165", () => {
    const s: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    const out = processScenario(s);
    expect((out.results[0] as any).premium).toBe(165);
  });
});

describe("Integration: Long-standing customer's second contract (clarifies ❓)", () => {
  it("3 years, second contract, cursed steel sword ench 7 → premium 160", () => {
    const s: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // First contract: any item (we don't care about premium)
        { op: "quote", items: [{ type: "amulet" }] },
        // Second contract: the one we measure
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const out = processScenario(s);
    expect((out.results[1] as any).premium).toBe(160);
  });
});
