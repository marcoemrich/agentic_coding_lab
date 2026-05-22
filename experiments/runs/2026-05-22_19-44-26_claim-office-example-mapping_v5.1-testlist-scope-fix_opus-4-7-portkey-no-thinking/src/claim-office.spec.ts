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

  // --- Single main item base premiums (no modifiers; 0-year customer; first quote = first insurance + 10% surcharge; no follow-up discount) ---
  // For a 0-year customer with first quote: sword base 100 + 10 (first ins) = 110 + 5 fee = 115 G

  // --- Components: building block of 3 alike ---
  it("2 runes (0-year first quote) → base 50 + first-ins 5 + fee 5 = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (block applies) (0-year first quote) → base 60 + first-ins 6 + fee 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes (no block — block requires exactly 3) (0-year first quote) → base 100 + first-ins 10 + fee 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes (0-year first quote) → base 175 + first-ins 17.5 (round up) + fee 5 = 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Alike components ---
  it("2 runes + 1 moonstone — no block (different types) (0-year first quote) → base 75 + first-ins 7.5 + fee 5 = 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones — two separate blocks (0-year first quote) → base 120 + first-ins 12 + fee 5 = 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Cursed surcharge ---
  it("cursed sword (0-year first quote) → 100 base + 50 curse + 10 first-ins + 5 fee = 165 G (newcomer integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // --- High enchantment surcharge & thresholds ---
  it("sword with enchantment 5 → high-enchantment surcharge applies; (0-year first quote) 100 + 30 + 10 + 5 = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge; (0-year first quote) 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword with enchantment 5 and cursed → both surcharges; (0-year first quote) 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Loyalty threshold ---
  it("customer with exactly 2 years (first quote, plain sword) → 100 base - 20 loyalty + 10 first-ins + 5 fee = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  // --- Multi-item modifier scope ---
  it("policy covers cursed sword + plain amulet (0-year first quote) → base 160 + 50 curse + 21 first-ins + 5 fee = 236 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
      }],
    });
    // base 160 (100+60) + curse 50 (50% of 100) + first-ins 16 (10% of 160) + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding in MHPCO's favor (premium up) ---
  it("premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
    // 7 runes: 7 × 25 = 175 base; +10% first-ins = 17.5; + 5 fee = 197.5 → 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Long-standing customer integration example ---
  it("3-year customer, second quote, cursed sword enchantment 7 → 160 G (with loyalty, follow-up, first-insurance-per-item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", enchantment: 7, cursed: true }] },
      ],
    });
    // second quote: 100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first-ins − 15 follow-up + 5 fee = 160
    const results = (result as { results: Array<{ premium: number }> }).results;
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number; remainingCap?: number; premium?: number }> }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (deductible; no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results;
    expect(results[1]).toEqual({ payout: 100, remainingCap: 250 * 2 - 100 });
  });

  // --- Claim: high enchantment ≥ 8 ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number }> }).results;
    expect(results[1]).toMatchObject({ payout: 400 });
  });

  // --- Claim: dragon material ---
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number }> }).results;
    expect(results[1]).toMatchObject({ payout: 700 });
  });

  // --- Claim: enchantment ≥ 8 wins when combined with dragon material ---
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number }> }).results;
    expect(results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number }> }).results;
    expect(results[1]).toMatchObject({ payout: 400 });
  });

  // --- Claim: deductible per damage event (per damaged item) ---
  it("dragon attack: sword damage 500 + amulet damage 300 → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number }> }).results;
    expect(results[1]).toMatchObject({ payout: 600 });
  });

  // --- Claim: multiple items same type ---
  it("policy covers two swords (insurance sum 2000 G, cap 4000 G); dragon attack damages both, two sword damage entries → each gets own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results;
    expect(results[1]).toEqual({ payout: 800, remainingCap: 4000 - 800 });
  });
  it("policy covers one sword; damages array has two sword entries → throws (whole claim rejected)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ] } },
        ],
      }),
    ).toThrow();
  });

  // --- Cap ---
  it("policy covers sword + amulet → insurance sum 1600 G, cap 3200 G (cap based on unmodified insurance values)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 5000 },
          { itemType: "amulet", amount: 500 },
        ] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results;
    // sword payout: 5000 - 100 = 4900, amulet: 500 - 100 = 400; total uncapped 5300 → cap 3200; remaining 0
    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword → cap 2000 G (premium modifiers do not raise cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results;
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy covers sword + 3 runes (block) → insurance sum 1750 G; block discount affects premium only, not insurance sum", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 10000 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results;
    expect(results[1]).toEqual({ payout: 1750 * 2, remainingCap: 0 });
  });
  it("sword (cap 2000): two successive claims of 1500 each → first 1400 remaining 600; second 600 remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Rounding (payouts down, MHPCO favor) ---
  it("payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
    // steel sword enchantment 9, damage 901 G: 901 * 0.5 = 450.5; - 100 = 350.5 → 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    const results = (result as { results: Array<{ payout?: number }> }).results;
    expect(results[1]).toMatchObject({ payout: 350 });
  });

  // --- Errors ---
  it("quote with unknown item type (e.g. broomstick) → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references damage for item not in policy → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim references damage with unknown item type → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 100 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim contains a damage entry with negative amount → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });
});
