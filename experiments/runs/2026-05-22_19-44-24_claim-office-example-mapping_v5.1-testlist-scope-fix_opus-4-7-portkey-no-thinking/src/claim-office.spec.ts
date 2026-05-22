import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / trivial ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for main items (with 5 G processing fee added) ---
  it("plain sword, 0 yrs first contract → premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("plain amulet, 0 yrs first → premium 71 G (60 + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("plain staff, 0 yrs first → premium 93 G (80 + 8 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("plain potion, 0 yrs first → premium 49 G (40 + 4 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component pricing & blocks of 3 ---
  it("2 runes, 0 yrs first → premium 60 G (50 + 5 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (block), 0 yrs first → premium 71 G (60 block + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes, 0 yrs first → premium 115 G (100 + 10 first + 5 fee, no block — exactly 3 required)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes, 0 yrs first → premium 198 G (175 + 17.5 first = 192.5 → 193 ceil + 5 fee = 198)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarifying question ---
  it("2 runes + 1 moonstone, 0 yrs first → premium 88 G (75 + 7.5 first = 82.5 → 83 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones, 0 yrs first → premium 137 G (120 + 12 first + 5 fee)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers on a single item (also integration: newcomer) ---
  it("newcomer (0 yrs, first contract), cursed sword (steel, ench 3) → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("0-yr first-contract customer, sword ench 5, not cursed → premium 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("0-yr first-contract customer, sword ench 4, not cursed → premium 115 G (no high-ench)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("0-yr first-contract customer, cursed sword ench 5 → premium 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Modifier scope on multi-item policies (spec ❓) ---
  it("cursed sword + plain amulet, 0 yrs first → premium 231 G (160 base + 50 curse on sword only + 16 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Modifier thresholds ---
  it("2 yrs MHPCO, first contract, plain sword → premium 95 G (100 - 20 loyalty + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("3-yr customer, second quote, cursed sword ench 7 → premium 160 G (integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding (in MHPCO's favor) ---
  it("premium that yields 197.5 G → 198 G (rounded up in MHPCO favor) — verified via 7 runes scenario", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result.results[0].premium).toBe(198);
  });
  it("payout that yields 350.5 G → 350 G (rounded down in MHPCO favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    // 901 * 0.5 = 450.5 - 100 = 350.5 → floor 350
    expect(result.results[1].payout).toBe(350);
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G (500 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim", policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250 G), damage 200 G → payout 100 G (200 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "drop", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 100 });
  });

  // --- Claim: high-enchantment clause ---
  it("steel sword ench 9, damage 1000 G → payout 400 G (50% then -100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });

  // --- Claim: dragon material clause ---
  it("dragon sword ench 5, damage 800 G → payout 700 G (full minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 700 });
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("dragon sword ench 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon sword ench exactly 8, damage 1000 G → payout 400 G (high-ench applies, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });

  // --- Claim: deductible per damaged item ---
  it("dragon attack: sword 500 G + amulet 300 G damage → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 600 });
  });

  // --- Claim: multiple items of same type ---
  it("policy with two swords: cap 4000 G; dragon attack damages both swords → each treated separately with own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ] } },
      ],
    });
    // payout = (500-100) + (400-100) = 700, cap was 4000 → remaining 3300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 3300 });
  });
  it("policy with one sword but damages contains two sword entries → runScenario throws (claim rejected)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ] } },
      ],
    })).toThrow();
  });

  // --- Cap exhaustion ---
  it("policy: sword + amulet → cap 3200 G (verified: claim 200 G on amulet → remainingCap 3100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "scratch", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    // payout 200-100 = 100, cap 3200 → remaining 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword → cap is 2000 G (verified: claim 300 → remCap 1800)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("policy: sword + 3 runes → insurance sum 1750 G, cap 3500 G (block discount does not affect insurance sum)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "scratch", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // payout 100, cap 3500 → remCap 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword (cap 2000): two successive 1500 G claims → first payout 1400 remCap 600; second payout 600 remCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases ---
  it("quote includes unknown item type (broomstick) → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references damage for an item type not in the policy → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim contains damage entry with negative amount → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
