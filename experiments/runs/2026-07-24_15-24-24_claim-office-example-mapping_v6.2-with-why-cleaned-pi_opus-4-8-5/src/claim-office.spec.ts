import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("Claim Office - quote base premiums", () => {
  // Edge case: empty item list
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(out.results[0]).toEqual({ premium: 5 });
  });

  // Base premiums per item type (base + 5 G fee, newcomer 0 years => +10% first insurance)
  it("single sword newcomer -> 100 base +10 first +5 fee = 115 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet newcomer -> 60 base +6 first +5 fee = 71 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("single staff newcomer -> 80 base +8 first +5 fee = 93 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] });
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("single potion newcomer -> 40 base +4 first +5 fee = 49 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] });
    expect(out.results[0]).toEqual({ premium: 49 });
  });
});

describe("Claim Office - component building blocks", () => {
  it("2 runes -> 50 G base premium", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] });
    // base 50 + 10% first (5) + 5 fee = 60
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    // block base 60 + 10% first (6) + 5 fee = 71
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block, requires exactly 3)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    // base 100 + 10 first + 5 fee = 115
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    // base 175 + 17.5 first + 5 fee = 197.5 -> 198
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] });
    // base 75 + 7.5 first + 5 fee = 87.5 -> 88
    expect(out.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ] }] });
    // base 120 + 12 first + 5 fee = 137
    expect(out.results[0]).toEqual({ premium: 137 });
  });
});

describe("Claim Office - premium modifiers", () => {
  it("cursed sword newcomer -> 165 G (100 +50 curse +10 first +5 fee)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("high-enchantment sword ench 5 newcomer -> 100 +30 +10 +5 = 145 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }] });
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("sword ench 4 not cursed newcomer -> no high-ench surcharge = 115 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }] });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("cursed high-enchantment sword ench 5 -> both surcharges apply", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }] });
    // 100 + 50 curse + 30 high-ench + 10 first + 5 fee = 195
    expect(out.results[0]).toEqual({ premium: 195 });
  });
  it("long-standing customer (2 years) -> loyalty discount applies", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }] });
    // 100 base - 20 loyalty + 10 first + 5 fee = 95
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("first insurance surcharge 10% applies per item in a quote", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }] });
    // 100 base - 20 loyalty + 10 first + 5 fee = 95 (first insurance still applies for long-standing)
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("follow-up contract 15% discount on each contract after first", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
    ] });
    // first: 100 + 10 first + 5 fee = 115
    // second: 100 + 10 first - 15 follow-up + 5 fee = 100
    expect(out.results[0]).toEqual({ premium: 115 });
    expect(out.results[1]).toEqual({ premium: 100 });
  });
});

describe("Claim Office - modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet -> curse surcharge on cursed item only -> 210 G before fee", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ] }] });
    // base 160 + 50 curse (on sword only) = 210 before modifiers; + 16 first + 5 fee = 231
    expect(out.results[0]).toEqual({ premium: 231 });
  });
});

describe("Claim Office - rounding", () => {
  it("premium yielding 197.5 G -> 198 G (rounded up, MHPCO favor)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    // base 175 + 17.5 first + 5 fee = 197.5 -> rounded up 198
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G -> 350 G (rounded down, MHPCO favor)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    // 901 * 50% = 450.5, - 100 = 350.5 -> floor 350
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("Claim Office - claim processing basics", () => {
  it("regular sword steel ench 3 damage 500 -> payout 400 (500 - 100 deductible)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250) damage 200 -> payout 100 (200 - 100)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    // insurance sum 250, cap 500; payout 200-100=100; remaining 400
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("high-enchantment ench 8 sword damage 1000 -> payout 400 (50% then deductible)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    // 1000 * 50% = 500, - 100 deductible = 400; cap 2000, remaining 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 8 damage 1000 -> payout 400 (high-ench wins, then deductible)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    // 50% rule wins over dragon full: 500 - 100 = 400; cap 2000, remaining 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("Claim Office - enchantment threshold vs dragon material", () => {
  it("dragon sword ench 9 damage 1000 -> payout 400 (50% wins then deductible)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    // both clauses apply, 50% wins: 500 - 100 = 400
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 5 damage 800 -> payout 700 (full then deductible)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    // dragon full reimbursement: 800 - 100 = 700
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9 damage 1000 -> payout 400 (50% then deductible)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    // high-enchantment 50%: 500 - 100 = 400
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("Claim Office - deductible per damage event", () => {
  it("dragon attack damages sword 500 + amulet 300 -> payout 600 (deductible per item)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    // (500-100) + (300-100) = 600; insurance sum 1600, cap 3200, remaining 2600
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("Claim Office - multiple items of same type", () => {
  it("policy covers two swords -> insurance sum 2000, cap 4000", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    // insurance sum 2000, cap 4000; payout 400, remaining 3600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("dragon attack damages both swords -> each entry separate deductible", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ] } },
    ] });
    // (500-100) * 2 = 800; cap 4000, remaining 3200
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damage entries of a type than covered -> claim rejected (non-zero exit)", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ] } },
    ] })).toThrow();
  });
});

describe("Claim Office - cap and insurance sum", () => {
  it("sword + amulet -> insurance sum 1600, cap 3200", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    // insurance sum 1600, cap 3200; payout 400, remaining 2800
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("cursed sword premium 165 -> cap 2000 (based on unmodified insurance value)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(out.results[0]).toEqual({ premium: 165 });
    // cap 2000 (insurance value 1000, unaffected by premium modifiers); payout 1400, remaining 600
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword + 3 runes block -> insurance sum 1750 (block affects premium only)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    // insurance sum 1000 + 3*250 = 1750, cap 3500; payout 400, remaining 3100
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("sword cap 2000; two 1500 claims -> first 1400 remaining 600, second 600 remaining 0", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("Claim Office - error handling", () => {
  it("quote with unknown item type -> non-zero exit, error to stderr", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] })).toThrow();
  });
  it("claim references item not in policy -> non-zero exit", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] })).toThrow();
  });
  it("claim damage entry with negative amount -> non-zero exit", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] })).toThrow();
  });
});

describe("Claim Office - integration examples", () => {
  it("newcomer with cursed sword -> 165 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
    ] });
    // 100 base + 50 curse + 10 first + 5 fee = 165
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer 3yr second quote, cursed sword ench 7 -> 160 G", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up + 5 fee = 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });
});
