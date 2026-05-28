import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Empty / trivial cases ===
  it("empty item list → premium 5 G (processing fee only)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out).toEqual({ results: [{ premium: 5 }] });
  });

  // === Base item premiums (single item, no modifiers, newcomer, first item) ===
  it("single plain sword for newcomer → 100 + 10 first + 5 fee = 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet for newcomer → 60 + 6 first + 5 fee = 71 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff for newcomer → 80 + 8 first + 5 fee = 93 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion for newcomer → 40 + 4 first + 5 fee = 49 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 49 }] });
  });

  // === Components (runes / moonstones) ===
  it("single rune for newcomer → 25 + 2.5 first + 5 fee = rounded 33 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → base 50 G (no block)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // 2 × 25 = 50 base + 5 first-insurance (10%) = 55 + 5 fee = 60
    expect(out).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → base 60 G (block discount applies)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // 60 base + 6 first-insurance (10%) = 66 + 5 fee = 71
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → base 100 G (no block — block requires exactly 3)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // 4 × 25 = 100 base + 10 first-insurance (10%) = 110 + 5 fee = 115
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → base 175 G (no extra block)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // 7 × 25 = 175 base + 17.5 first-insurance = 192.5 + 5 fee = 197.5 → ceil 198
    expect(out).toEqual({ results: [{ premium: 198 }] });
  });

  // === Alike components ===
  it("2 runes + 1 moonstone → base 75 G (different types, no block)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    // 2×25 + 1×25 = 75 base + 7.5 first-insurance = 82.5 + 5 fee = 87.5 → ceil 88
    expect(out).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → base 120 G (two separate blocks)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    // 60 + 60 = 120 base + 12 first-insurance = 132 + 5 fee = 137
    expect(out).toEqual({ results: [{ premium: 137 }] });
  });

  // === Cursed surcharge ===
  it("cursed sword (steel, enchantment 3) for newcomer → 165 G (integration example)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });

  // === High enchantment surcharge ===
  it("sword enchantment 5 → high-enchantment surcharge applies (newcomer first contract)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    // 100 base + 30 high-ench + 10 first ins + 5 fee = 145
    expect(out).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 → no high-enchantment surcharge", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });

  // === Loyalty discount ===
  it("customer with exactly 2 years → loyalty discount applies", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    // 100 base + 10 first ins − 20 loyalty + 5 fee = 95
    expect(out).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year → no loyalty discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });

  // === Follow-up contract discount ===
  it("second quote in scenario receives 15 % follow-up discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // 1st: 100 + 10 first ins + 5 fee = 115
    // 2nd: 100 + 10 first ins − 15 follow-up + 5 fee = 100
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // === Modifier scope on multi-item policies ===
  it("cursed sword + plain amulet → 210 G before further modifiers and fee (item-scoped curse)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ] }],
    });
    // 100 + 60 = 160 base + 50 curse (sword only) = 210; + 16 first ins (10% × 160) + 5 fee = 231
    expect(out).toEqual({ results: [{ premium: 231 }] });
  });

  // === Integration: long-standing customer's second contract ===
  it("3-yr customer's 2nd contract, cursed sword enchantment 7 → 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // 2nd: 100 base + 50 curse + 30 high ench − 20 loyalty + 10 first ins − 15 follow-up + 5 fee = 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // === Rounding ===
  it("premium that yields 197.5 G → rounded up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    // 7 × 25 = 175 base + 17.5 first ins + 5 fee = 197.5 → rounded up to 198
    expect(out).toEqual({ results: [{ premium: 198 }] });
  });
  it("payout that yields 350.5 G → rounded down to 350 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    // high ench → 50% of 901 = 450.5; − 100 deductible = 350.5 → floor 350
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // === Claim: standard reimbursement ===
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // === Claim: high-enchantment clause ===
  it("dragon sword ench 8, damage 1000 G → payout 400 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // === Claim: dragon material clause ===
  it("dragon sword ench 5, damage 800 G → payout 700 G (only dragon clause)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // === Claim: high-enchantment alone ===
  it("steel sword ench 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // === Claim: deductible per damage event ===
  it("dragon attack on sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // === Multiple items of the same type ===
  it("policy with two swords → insurance sum 2000 G, cap 4000 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("two sword damages on a two-sword policy → each damage gets own deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damage entries than insured items of that type → rejected (throws)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 200 },
        ] } },
      ],
    })).toThrow();
  });

  // === Cap exhaustion ===
  it("cursed sword cap = 2000 G (cap based on unmodified insurance value)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + 3 runes → insurance sum 1750 G (block does not affect insurance sum)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // cap = 1750 × 2 = 3500; payout = 400; remainingCap = 3100
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("two successive 1500 G claims on sword: first 1400 G remaining 600, second 600 remaining 0", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // === Edge cases ===
  it("unknown item type in quote → throws / non-zero exit", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim with damage to item not in policy → throws / non-zero exit", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount → throws / non-zero exit", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
