import { describe, it, expect } from "vitest";
import { run } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge cases: empty / processing fee only ---
  it("empty item list yields premium 5 G (processing fee only)", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(out).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per main item type ---
  it("quote for a single plain sword (new customer, 1st contract) → 100 base + 10 first-ins + 5 fee = 115 G", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for a single plain amulet (new customer, 1st contract) → 60 base + 6 first-ins + 5 fee = 71 G", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for a single plain staff (new customer, 1st contract) → 80 base + 8 first-ins + 5 fee = 93 G", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for a single plain potion (new customer, 1st contract) → 40 base + 4 first-ins + 5 fee = 49 G", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] });
    expect(out).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components base premium (per-component default) ---
  it("quote for 2 runes (new customer, 1st contract) → 50 base + 5 first-ins + 5 fee = 60 G", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] });
    expect(out).toEqual({ results: [{ premium: 60 }] });
  });

  // --- Building block of 3 alike components ---
  it("quote for 3 runes (block) (new customer, 1st contract) → 60 base + 6 first-ins + 5 fee = 71 G", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes (no block) → 100 base + 10 first-ins + 5 fee = 115 G", () => {
    const out = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for 7 runes (no block — block requires exactly 3) → 175 base + 18 first-ins + 5 fee = 198 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(out).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarified by type ---
  it("quote for 2 runes + 1 moonstone (no block: different types) → 75 base + 8 first-ins + 5 fee = 88 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote for 3 runes + 3 moonstones (two separate blocks) → 120 base + 12 first-ins + 5 fee = 137 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(out).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Single-modifier surcharges/discounts on a single item ---
  it("cursed sword alone (new customer, 1st contract) → 100 base + 50 curse + 10 first-ins + 5 fee = 165 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("high-enchantment sword (enchantment 5) alone (new customer, 1st contract) → 100 + 30 ench + 10 first-ins + 5 fee = 145 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 alone (new customer, 1st contract) → no high-ench surcharge → 115 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years gets loyalty discount (plain sword, 1st contract) → 100 - 20 loy + 10 first-ins + 5 fee = 95 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 95 }] });
  });
  it("cursed sword with exactly enchantment 5 gets both surcharges → 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Multi-item policy & modifier scope ---
  it("cursed sword + plain amulet (new customer, 1st contract) → 100+60 base, cursed adds 50 (of sword only), first-ins 10% of policy total → 160 + 50 + 16 + 5 = 231 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Follow-up contract discount (15% on each contract after first) ---
  it("second quote in scenario: cursed sword + plain amulet, 0 years → 160 base + 50 curse + 16 first-ins - 24 follow-up + 5 fee = 207 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 207 }] });
  });

  // --- Integration examples ---
  it("newcomer cursed sword (0 years, no prior): 100 + 50 + 10 + 5 = 165 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's 2nd contract, cursed enchantment-7 sword (3 years): 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(out).toEqual({
      results: [
        { premium: 59 },
        { premium: 160 },
      ],
    });
  });

  // --- Rounding in MHPCO's favor ---
  it("premium calculation yielding 142.5 G → final premium 143 G (rounded up in MHPCO's favor)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(5).fill({ type: "rune" }) }],
    });
    expect(out).toEqual({ results: [{ premium: 143 }] });
  });

  // --- Claim: basic deductible & standard reimbursement ---
  it("steel sword enchantment 3, damage 500 → payout 400 (500 - 100 deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fight", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("damage to a rune (250 G), damage 200 → payout 100 (200 - 100 deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(out).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  // --- Claim: high-enchantment 50% clause ---
  it("steel sword enchantment 9, damage 1000 → payout 400 (50% then deductible: 500 - 100)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: dragon material full reimbursement ---
  it("dragon-material sword enchantment 5, damage 800 → payout 700 (full minus deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- Claim: dragon + high enchantment combined (50% wins) ---
  it("dragon-material sword enchantment 8, damage 1000 → payout 400 (high-ench applies first then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 9, damage 1000 → payout 400 (50% rule wins, then deductible)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages insured sword 500 and amulet 300 → payout 600 (deductible applies once per damaged item)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("policy with two swords: insurance sum 2000 G, cap 4000 G; two sword damage entries each get own deductible", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim with more sword damages than swords insured → run() throws (claim rejected)", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toThrow();
  });

  // --- Cap exhaustion ---
  it("sword + amulet policy → insurance sum 1600 G, cap 3200 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword cap is 2000 G (based on unmodified insurance value, premium modifiers do not raise cap)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 2500 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3 runes block: insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 4000 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("sword (cap 2000): claim 1500 → payout 1400, remainingCap 600; second claim 1500 → payout 600, remainingCap 0", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    const results = (out as { results: unknown[] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Rounding payout ---
  it("payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect((out as { results: unknown[] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Error cases ---
  it("quote with unknown item type (e.g. broomstick) → run() throws", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references damage entry whose item is not in policy → run() throws", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim contains damage entry with negative amount → run() throws", () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
