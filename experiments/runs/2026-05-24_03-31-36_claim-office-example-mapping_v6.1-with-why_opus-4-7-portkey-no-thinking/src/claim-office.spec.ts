import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per item type ---
  it("single sword → premium 115 G (100 base + 10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet → premium 71 G (60 base + 6 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff → premium 93 G (80 base + 8 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion → premium 49 G (40 base + 4 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and building blocks ---
  it("2 runes → 50 G base, +5 first-ins +5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base (block), +6 first-ins +5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base (no block), +10 first-ins +5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base (no block: count != 3), +17.5 first-ins +5 fee → 198 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: Array.from({ length: 7 }, () => ({ type: "rune" })),
      }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → 75 G base (no block: different types), +7.5 first-ins +5 fee = 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base (two blocks), +12 first-ins +5 fee = 137 G", () => {
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

  // --- Modifiers ---
  it("cursed sword adds 50% risk surcharge (100 base + 50 curse = 150 + 5 fee = 155 G, no first-insurance test variant)", () => {
    // Test isolation: customer has prior contract so no first-insurance applies, but follow-up discount kicks in.
    // To isolate cursed only, we need a scenario where first-insurance and follow-up cancel/don't apply.
    // Simplest: use a customer where no other modifiers apply. Per spec "first insurance" is per-item-always.
    // Therefore: cursed sword in isolation = 100 base + 50 curse = 150, +10% first insurance = 165, no other discount, +5 fee = 170.
    // But the cleanest cursed-isolation expected by spec: a cursed sword alone for a new customer yields 165 G (per integration example).
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword ench 5 → high-ench surcharge (100+30+10+5=145 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword ench 4 → no high-ench (100+10+5=115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword ench 5 → both surcharges (100+50+30+10+5=195 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("long-standing customer (≥2 years) gets 20% loyalty discount on sword: 100-20+10+5=95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with exactly 2 years → loyalty discount applies (amulet: 60-12+6+5=59 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 59 }] });
  });
  it("first insurance carries 10% surcharge on policy base (years=5, sword: 100-20+10+5=95)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("follow-up contract (after first) gets 15% discount: 2nd sword = 100-15+10+5 = 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("processing fee of 5 G is added to every premium (years=10, potion: 40-8+4+5=41 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 10 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 41 }] });
  });

  // --- Rounding ---
  it("premium rounded up in MHPCO favor (197.5 → 198 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: Array.from({ length: 7 }, () => ({ type: "rune" })),
      }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("payout rounded down in MHPCO favor (350.5 → 350 G)", () => {
    // sword with enchantment 8 → 50% reimbursement; damage 901 → 450.5 - 100 deductible = 350.5
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(350);
  });

  // --- Multi-item policies and modifier scope ---
  it("policy with cursed sword + plain amulet → 231 G (cursed surcharge applies to sword's base only; base=160, +50 curse, +16 first-ins, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", cursed: true }, { type: "amulet" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3): 0 years, no prior → 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract (cursed sword, ench 7, 3 years) → 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword damage 500 G → payout 400 G (full minus 100 deductible); remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "physical", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to rune (250 G insurance), damage 200 G → payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: high enchantment clause ---
  it("steel sword, ench 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: dragon material ---
  it("dragon-material sword, ench 5, damage 800 G → payout 700 G (full, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- Claim: enchantment + dragon combined ---
  it("dragon-material sword, ench 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench exactly 8, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple same-type items ---
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G (claim sword 200 → remainingCap 3900)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("two-sword policy: dragon attack damages both → each treated as separate damage with own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim with more damages of a type than policy covers → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 200 },
            { itemType: "sword", amount: 300 },
          ] } },
        ],
      })
    ).toThrow(/more damages|exceed|not enough|too many|policy/i);
  });

  // --- Cap exhaustion ---
  it("sword + amulet policy → insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword policy → cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("sword + 3 runes block → insurance sum 1750 G (block discount affects premium only); cap 3500", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword cap 2000 G, two claims of 1500 G each → first 1400/cap 600, second 600/cap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error cases ---
  it("quote with unknown item type → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });
  it("claim references item not in policy → runScenario throws meaningful error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      })
    ).toThrow(/not (in|covered by) policy|not part of policy|policy/i);
  });
  it("claim with negative damage amount → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      })
    ).toThrow(/negative|invalid.*amount|amount.*invalid/i);
  });
});
