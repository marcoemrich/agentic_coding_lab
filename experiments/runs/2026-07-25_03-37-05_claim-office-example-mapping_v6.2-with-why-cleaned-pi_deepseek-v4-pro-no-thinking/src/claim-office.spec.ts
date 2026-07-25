import { describe, it, expect } from "vitest";
import { computeQuote, processScenario } from "./claim-office.js";

describe("Claim Office - quote operation", () => {
  // --- Edge cases ---
  it("should return premium of 5 G for empty item list (only processing fee)", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  // --- Base premiums for individual items ---
  it("should return premium for a plain sword -- 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("should return premium for a plain amulet -- 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("should return premium for a plain staff -- 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("should return premium for a plain potion -- 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // --- Components ---
  it("should return premium for a single rune -- 25 G base + 2.5 G first insurance + 5 G fee = 33 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 33 }]);
  });
  it("should return premium for 2 runes -- no block, 50 G base + 5 G first + 5 G fee = 60 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("should return premium for 3 runes -- block applies, 60 G base + 6 G first + 5 G fee = 71 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("should return premium for 4 runes -- no block (only exactly 3), 100 G base + 10 G first + 5 G fee = 115 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("should return premium for 7 runes -- no block, 175 G base + 17.5 G first + 5 G fee = 198 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  // --- Mixed components ---
  it("should return premium for 2 runes + 1 moonstone -- no block, 75 G base + 7.5 G first + 5 G fee = 88 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("should return premium for 3 runes + 3 moonstones -- two separate blocks, 2x60 = 120 G base + 12 G first + 5 G fee = 137 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }],
    });
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // --- Premium modifiers: cursed ---
  it("should add 50% risk surcharge for a cursed sword -- 100 G base + 50 G curse + 10 G first + 5 G fee = 165 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("should add 50% risk surcharge for a cursed amulet -- 60 G base + 30 G curse + 6 G first + 5 G fee = 101 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 101 }]);
  });

  // --- Premium modifiers: high enchantment ---
  it("should add 30% surcharge for a sword with enchantment 5 -- 100 G base + 30 G ench + 10 G first + 5 G fee = 145 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("should add 30% surcharge for a sword with enchantment 7 -- 100 G base + 30 G ench + 10 G first + 5 G fee = 145 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 7 }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("should NOT add high-enchantment surcharge for a sword with enchantment 4 -- 100 G base + 10 G first + 5 G fee = 115 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  // --- Premium modifiers: both cursed and high enchantment ---
  it("should apply both cursed and high-enchantment surcharges to a cursed sword with enchantment 5 -- 100 G + 50 G + 30 G + 10 G first + 5 G = 195 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });

  // --- Premium modifiers: loyalty discount (>= 2 years) ---
  it("should apply 20% loyalty discount for customer with 2 years -- sword: 100 G base + 10 G first - 20 G loyalty + 5 G fee = 95 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("should apply 20% loyalty discount for customer with 5 years — sword: 100 G base + 10 G first - 20 G loyalty + 5 G fee = 95 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });

  // --- Premium modifiers: first-insurance surcharge ---
  it("should add 10% first-insurance surcharge -- sword: 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("should apply first-insurance surcharge even to long-standing customers -- per item, not per customer", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // loyalty discount: 100 * 0.2 = 20 off, first insurance: 100 * 0.1 = 10 on
    // 100 base + 10 first - 20 loyalty + 5 fee = 95
    expect(result.results).toEqual([{ premium: 95 }]);
  });

  // --- Premium modifiers: follow-up contract discount ---
  it("should apply 15% follow-up discount on contract after the first -- second quote for same customer with sword: 100 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // First: 100 base + 10 first + 5 fee = 115
    // Second: 100 base + 10 first - 15 follow-up + 5 fee = 100
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // --- Modifier scope: item-specific vs policy-wide ---
  it("should apply curse surcharge only to the cursed item's base premium -- cursed sword (100 G) + plain amulet (60 G): 160 G base + 50 G curse (on sword only) + 16 G first + 5 G fee = 231 G", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    // base: 100+60=160, curse: 100*0.5=50, first: 160*0.1=16, fee=5 => 231
    expect(result.results).toEqual([{ premium: 231 }]);
  });
  it("should apply high-enchantment surcharge only to the affected item, not to the whole policy", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }, { type: "amulet" }] }],
    });
    // base: 100+60=160, ench: 100*0.3=30, first: 160*0.1=16, fee=5 => 211
    expect(result.results).toEqual([{ premium: 211 }]);
  });

  // --- Integration examples from spec ---
  it("should compute newcomer with cursed sword -- 0 years, first contract: 165 G", () => {
    // 100 base + 50 curse + 10 first = 160 + 5 fee = 165
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("should compute long-standing customer's second contract -- 3 years, second quote, cursed sword ench 7: 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    // Second: 100 base + 50 curse + 30 ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Policy modifier precedence and rounding ---
  it("should round premium up in MHPCO's favor -- 197.5 G rounds to 198 G", () => {
    // 7 runes with no loyalty: base=175, first=17.5, fee=5 => 197.5 -> round up = 198
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    // base=175, first=17.5, no loyalty => 175+17.5+5=197.5 => ceil=198
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  // --- Unknown item type error ---
  it("should throw error for unknown item type in quote", () => {
    expect(() => computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });

  // --- Multiple items of same type ---
  it("should correctly compute premium for two swords", () => {
    const result = computeQuote({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }],
    });
    // base: 200, first: 20, fee: 5 => 225
    expect(result.results).toEqual([{ premium: 225 }]);
  });

  // --- Cap ---
  it("should set cap to 2x insurance sum: plain sword (ins sum 1000) -> cap 2000", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    // payout: 100 - 100 deductible = 0, remainingCap should be 2000 (cap is 2x 1000)
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("should use unmodified insurance value for cap (curse/modifiers do not raise cap)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    // cap is still 2000 (based on unmodified insurance value)
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("should account for multiple items in insurance sum: sword + 3 runes -> 1000+750=1750 sum, cap 3500", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
});

describe("claim-office - claim operation", () => {
  // --- Basic reimbursement ---
  it("should reimburse full damage minus deductible for regular sword -- damage 500 G -> payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("should reimburse rune damage minus deductible -- damage 200 G -> payout 100 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // rune insurance value 250, cap 500; payout 200-100=100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  it("should not apply special clause for rune (no enchantment level or material)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(100);
  });

  // --- Deductible per damage event ---
  it("should apply 100 G deductible per damaged item -- dragon damages sword(500 G) and amulet(300 G): payout 600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }, { type: "amulet", material: "steel" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    });
    // sword: 500-100=400, amulet: 300-100=200, total=600
    // cap: 2*(1000+600)=3200
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Dragon material clause ---
  it("should fully reimburse (minus deductible) for dragon-material sword -- ench 5, damage 800 G -> payout 700 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- High enchantment clause (>= 8) for damage ---
  it("should reimburse at 50% then deductible for high enchantment >= 8 -- steel sword ench 9, damage 1000 G -> payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // 1000 * 0.5 = 500 (floor), 500 - 100 = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Dragon material vs high enchantment ---
  it("should apply high-enchantment clause (50%) when both apply for dragon sword ench 9, damage 1000 G -> payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Multiple items of same type in damage ---
  it("should treat each damaged item entry separately with own deductible -- two swords both damaged", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 400 }] } },
      ],
    });
    // sword1: 500-100=400, sword2: 400-100=300, total=700
    // cap: 2*(1000+1000)=4000
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 3300 });
  });

  it("should reject claim with mismatched damage count vs policy -- 2 sword damages but 1 insured", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 400 }] } },
      ],
    })).toThrow();
  });

  // --- Cap exhaustion ---
  it("should return correct cap for single-sword policy: 2000 G cap", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    // 100-100=0, cap 2000
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it("should return correct cap for sword+amulet policy: 2x(1000+600)=3200 G cap", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });

  it("should exhaust cap correctly across successive claims: first claim 1400 G, second claim reduced to 600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    // First: 1500-100=1400, cap=2000, remaining=600
    // Second: 1500-100=1400, but cap remaining=600 -> payout=600, remaining=0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("claim-office - multi-step scenarios", () => {
  it("should process a quote then a claim in sequence and return correct results", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    // Premium: 60base + 6first - 12loyalty = 54 + 5fee = 59... actually 60*0.1=6, 60*0.2=12, 60+6-12=54+5=59 -> Math.ceil(59)=59
    // Claim: 200-100=100, cap=1200, remaining=1100
    expect(result.results[0]).toHaveProperty("premium");
    expect(result.results[1]).toHaveProperty("payout");
    expect(result.results[1]).toHaveProperty("remainingCap");
  });

  it("should handle two back-to-back claims against the same policy with upward cap", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    // First claim:500-100=400, cap 2000, remaining 1600
    // Second claim: 300-100=200, remaining 1400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    expect(result.results[2]).toEqual({ payout: 200, remainingCap: 1400 });
  });

  it("should process a full scenario with multiple quotes and claims interleaved", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.results.length).toBe(2);
    expect(result.results[0]).toHaveProperty("premium");
    expect(result.results[1]).toHaveProperty("payout");
    expect(result.results[1]).toHaveProperty("remainingCap");
  });
});