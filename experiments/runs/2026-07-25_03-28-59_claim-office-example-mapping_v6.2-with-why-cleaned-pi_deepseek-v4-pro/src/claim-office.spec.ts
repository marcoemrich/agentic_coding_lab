import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  // === Quote: Base premiums (single items, no modifiers) ===
  it("should compute base premium for a single sword -- 100 G base + 5 G fee = 105 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should compute base premium for a single amulet -- 60 G base + 5 G fee = 65 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should compute base premium for a single staff -- 80 G base + 5 G fee = 85 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("should compute base premium for a single potion -- 40 G base + 5 G fee = 45 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // === Component premiums ===
  it("should compute premium for a single rune -- 25 G base + 5 G fee = 30 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("should compute premium for a single moonstone -- 25 G base + 5 G fee = 30 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("should compute premium for 2 runes -- 50 G base + 5 G fee = 55 G (no block)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("should compute premium for 3 runes -- 60 G base (block) + 5 G fee = 65 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should compute premium for 4 runes -- 100 G base (no block) + 5 G fee = 105 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should compute premium for 7 runes -- 175 G base (no block) + 5 G fee = 180 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array(7).fill({ type: "rune" }) }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("should compute premium for 2 runes + 1 moonstone -- 75 G base + 5 G fee = 80 G (no block: different types)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("should compute premium for 3 runes + 3 moonstones -- 120 G base + 5 G fee = 125 G (two separate blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // === Modifier: Cursed items ===
  it("should apply 50% cursed surcharge to a cursed sword -- 100 G base + 50 G curse + 5 G fee = 155 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("should apply cursed surcharge only to the cursed item in a multi-item policy -- cursed sword + plain amulet: 160 G base + 50 G curse + 5 G fee = 215 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // === Modifier: High enchantment ===
  it("should apply 30% high-enchantment surcharge for sword with enchantment 5 -- 100 G + 30 G + 5 G fee = 135 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5 }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("should NOT apply high-enchantment surcharge for sword with enchantment 4 -- 100 G + 5 G fee = 105 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 4 }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should apply both cursed and high-enchantment surcharges for cursed sword with enchantment 5 -- 100 G + 50 G + 30 G + 5 G fee = 185 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // === Modifier: Loyalty discount ===
  it("should apply 20% loyalty discount for customer with exactly 2 years -- sword: 100 G - 20 G + 5 G fee = 85 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("should apply 20% loyalty discount for customer with 3 years -- sword: 100 G - 20 G + 5 G fee = 85 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("should NOT apply loyalty discount for customer with 1 year -- sword: 100 G + 5 G fee = 105 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // === Modifier: First insurance surcharge ===
  it("should apply 10% first insurance surcharge on first quote -- sword: 100 G + 10 G + 5 G fee = 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should apply 15% follow-up contract discount on second quote (and subsequent) -- second quote, sword: 100 G - 15 G + 10 G first insurance + 5 G fee = 100 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // === Integration: Newcomer with a cursed sword ===
  it("should compute newcomer with cursed sword -- 0 years, no prior: 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // === Integration: Long-standing customer's second contract ===
  it("should compute long-standing customer second contract -- 3 years, second contract, cursed sword enchantment 7: 100 G + 50 G curse + 30 G high enchantment - 20 G + 10 G first insurance - 15 G follow-up + 5 G fee = 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
      ]
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // === Rounding ===
  it("should round premium up in MHPCO's favor -- 197.5 G becomes 198 G", () => {
    // 7 runes (no block, 175 G base), 10% first insurance = 17.5, total 192.5 + 5 fee = 197.5, rounded up = 198
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array(7).fill({ type: "rune" }) }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("should round payout down in MHPCO's favor -- 350.5 G becomes 350 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 450 }] } }
      ]
    });
    // 450-100=350, floor=350
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // === Empty item list ===
  it("should compute premium for empty item list -- only 5 G processing fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // === Error: Unknown item type ===
  it("should exit with error for unknown item type in quote", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "broomstick" }] }
      ]
    })).toThrow();
  });

  // === Multiple items of same type (quote) ===
  it("should compute premium for two swords -- 200 G base + 20 G first insurance + 5 G fee = 225 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] }
      ]
    });
    expect(result.results[0]).toEqual({ premium: 225 });
  });
  it("should compute insurance sum and cap during quote -- two swords: 2000 G, cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    });
    // payout = 100-100=0, remainingCap = 4000-0=4000
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("should not include block discount in insurance sum -- sword + 3 runes: 1750 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    });
    // cap = 2*(1000+3*250) = 2*1750=3500, payout 0, remaining 3500
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });

  // === Claim: Standard reimbursement ===
  it("should reimburse regular sword (steel, enchantment 3) damage 500 G -- payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "goblin", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // === Claim: Rune damage ===
  it("should reimburse rune damage 200 G -- payout 100 G (200 - 100 deductible, no special clause)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // === Claim: Dragon material ===
  it("should fully reimburse dragon-material sword, enchantment 5, damage 800 G -- payout 700 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should reimburse steel sword enchantment 9 damage 1000 G at 50% -- payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "magic", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should reimburse dragon-material sword enchantment 9 damage 1000 G -- 50% clause wins, payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { causes: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should reimburse dragon-material sword enchantment exactly 8 damage 1000 G -- 400 G payout", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { causes: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // === Claim: Deductible per damage event ===
  it("should apply deductible per damaged item -- dragon attack on sword (500) and amulet (300): payout 600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }
      ]
    });
    // 500-100=400, 300-100=200, total 600. Cap = 2*(1000+600)=3200, remaining=2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // === Claim: Cap ===
  it("should compute cap for sword-only policy -- insurance sum 1000 G, cap 2000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should compute cap based on insurance sum (not premium) -- cursed sword", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    });
    // curse doesn't affect insurance value (1000), cap = 2000
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should compute insurance sum for sword + amulet: 1600 G, cap 3200 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    });
    // payout 100, remaining = 3200-100=3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("should exhaust cap over two successive claims", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    });
    // insurance sum 1000, cap 2000
    // First: 1500-100=1400, payout=1400, remaining 600
    // Second: minus remaining 600, payout=600, remaining 0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // === Multi-step scenarios ===
  it("should handle multi-step scenario -- quote then claim", () => {
    // Schema example from the spec
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    });
    expect(result.results[0]).toHaveProperty("premium");
    expect(result.results[1]).toHaveProperty("payout");
    expect(result.results[1]).toHaveProperty("remainingCap");
  });

  // === CLI ===
  it("should produce correct JSON from stdin for schema example", async () => {
    const { handleIO } = await import("./cli.js");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    });
    const output = handleIO(input);
    const parsed = JSON.parse(output);
    expect(parsed).toHaveProperty("results");
    expect(Array.isArray(parsed.results)).toBe(true);
    expect(parsed.results.length).toBe(2);
    expect(parsed.results[0]).toHaveProperty("premium");
    expect(parsed.results[1]).toHaveProperty("payout");
    expect(parsed.results[1]).toHaveProperty("remainingCap");
  });
});