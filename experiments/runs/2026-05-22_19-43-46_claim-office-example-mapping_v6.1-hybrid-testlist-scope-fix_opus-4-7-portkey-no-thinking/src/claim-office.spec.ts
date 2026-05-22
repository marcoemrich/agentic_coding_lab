import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge case: empty
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums per item type (with fee)
  it("single sword (plain, low enchantment) → 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (plain, low enchantment) → 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (plain, low enchantment) → 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (plain, low enchantment) → 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Component pricing and building blocks
  it("2 runes → 50 G base premium (plus first-insurance and fee) = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" },
          { type: "rune" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies) = 71 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3) = 115 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium (block requires EXACTLY 3 — 7 is no block) = 198 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: Array.from({ length: 7 }, () => ({ type: "rune" })),
      }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Alike components clarification
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) = 88 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) = 137 G total", () => {
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

  // Individual modifiers
  it("cursed sword adds 50% surcharge to that item's base premium → 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 1, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("highly enchanted item (enchantment ≥ 5) adds 30% surcharge → sword enchantment 5 = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies (boundary test) = 145 G", () => {
    // boundary: ≥ 5 is the threshold per the spec
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (below threshold) = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword with enchantment 5 and cursed → both surcharges apply = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("long-standing customer (≥ 2 years) → 20% loyalty discount on policy base → 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with exactly 2 years → loyalty discount applies (boundary test) = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance → 10% initial assessment surcharge applied to each item's base premium = sword + amulet: 100+60=160 base + 16 first-insurance + 5 fee = 181 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("follow-up contract (second quote+) → 15% discount on policy base — sword on 2nd quote: 100 base + 10 first-insurance - 15 follow-up + 5 fee = 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet → policy base 160 + 50 curse (item-scoped) + 16 first-insurance + 5 fee = 231 G", () => {
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

  // Rounding
  it("premium that yields a fraction rounds UP (MHPCO's favor) — 5 runes: 125 + 12.5 first-ins + 5 fee = 142.5 → 143 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: Array.from({ length: 5 }, () => ({ type: "rune" })),
      }],
    });
    expect(result).toEqual({ results: [{ premium: 143 }] });
  });
  it("payout that yields a fraction rounds DOWN (MHPCO's favor) — high-enchant sword e9, damage 901 → 901*0.5 - 100 = 350.5 → 350 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Integration examples
  it("newcomer with cursed sword (steel, enchantment 3) → 165 G (100 base + 50 curse + 10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract with cursed sword (enchantment 7) → 160 G (100 + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claims — standard reimbursement
  it("regular sword (steel, enchantment 3) damage 500 G → payout 400 G (full reimbursement minus 100 G deductible), remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G → payout 100 G (no special clause), remainingCap 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Claim — high enchantment
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible), remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim — dragon material
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full minus deductible), remainingCap 1300", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Claim — both clauses: 50% rule wins
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; 50% rule wins, then deductible), remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (high-enchantment wins at threshold), remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Multiple damages: deductible per event
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible once per item), remainingCap 2600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Cap rules
  it("sword + amulet policy → insurance sum 1600 G, cap 3200 G (verified via excessive claim: damage 5000 → payout 3200)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword → cap 2000 G (based on unmodified insurance value 1000, not modified premium 165)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3-rune block → insurance sum 1750 G, cap 3500 G (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  // Cap exhaustion across claims
  it("sword (cap 2000); first claim 1500 → payout 1400, remainingCap 600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000); after first 1500 claim, second 1500 → payout 600, remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Multiple items of same type
  it("policy with two swords → insurance sum 2000 G, cap 4000 G (verified via excessive claim 5000 → payout 4000)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("dragon attack damages both swords (two entries) → each gets its own deductible: 500-100 + 600-100 = 900, remainingCap 3100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 600 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 900, remainingCap: 3100 });
  });
  it("more sword damages than insured swords → runScenario throws (claim rejected)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 600 },
        ] } },
      ],
    })).toThrow();
  });

  // Edge cases / errors
  it("quote with unknown item type → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item not in policy → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // Sanity check that runScenario exists for tests to import
  it("module exports runScenario", () => {
    expect(typeof runScenario).toBe("function");
  });
});
