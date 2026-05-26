import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty items ---
  it("quote with empty item list -> premium 5 G (just the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Single main items, no modifiers, newcomer with no history but no first-insurance? ---
  // The first insurance surcharge applies to each item in a quote; loyalty/follow-up are policy-wide.
  // For a customer with 0 years and first-ever quote: only first-insurance surcharge applies per item.
  it("quote: newcomer with a plain sword -> 100 + 10 first-insurance + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote: newcomer with a plain amulet -> 60 + 6 first-insurance + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote: newcomer with a plain staff -> 80 + 8 first-insurance + 5 fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote: newcomer with a plain potion -> 40 + 4 first-insurance + 5 fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and the block-of-3 rule ---
  it("quote: 2 runes -> 50 G base + 5 first-insurance + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote: 3 runes -> 60 G base + 6 first-insurance + 5 fee = 71 G (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote: 4 runes -> 100 base + 10 first-insurance + 5 fee = 115 G (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote: 7 runes -> 175 base + 17.5 first-insurance + 5 fee = 197.5 -> rounded up to 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- "Alike" components: must be same type ---
  it("quote: 2 runes + 1 moonstone -> 75 base + 7.5 + 5 = 87.5 -> 88 G (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote: 3 runes + 3 moonstones -> 120 base + 12 + 5 = 137 G (two separate blocks)", () => {
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

  // --- Modifier scope on multi-item policies ---
  it("quote: cursed sword + plain amulet (newcomer) -> base 160 + curse 50 + first-ins 16 + fee 5 = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", cursed: true }, { type: "amulet" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Modifier thresholds ---
  it("quote: customer with exactly 2 years -> loyalty discount applies (sword: 100 + 10 - 20 + 5 = 95 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("quote: sword enchantment 5 -> 100 + 30 high-ench + 10 first-ins + 5 fee = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("quote: cursed sword E5 -> 100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("quote: sword E4 -> 100 + 10 first-ins + 5 fee = 115 G (no high-ench)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote: cursed sword E4 -> 100 + 50 curse + 10 first-ins + 5 fee = 165 G (no high-ench)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Rounding in MHPCO's favor ---
  it("quote: premium that yields 197.5 G -> 198 G (rounded up; covered by 7-runes test)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("payout that yields 350.5 G -> 350 G (rounded down)", () => {
    // sword E8 (50% reimb), damage 901 -> 450.5 - 100 = 350.5 -> 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(350);
  });

  // --- Integration: newcomer with a cursed sword -> 165 G ---
  it("integration: 0 years, cursed steel sword enchantment 3 -> 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Integration: long-standing customer's second contract -> 160 G ---
  it("integration: 3 years, 2nd quote, cursed steel sword E7 -> 160 G (follow-up + loyalty)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }, // first quote (some prior contract)
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: standard ---
  it("claim: regular sword E3 (cap 2000), damage 500 G -> payout 400 G, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: rune (insurance 250), damage 200 G -> payout 100 G (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(100);
  });

  // --- Claim: high-enchantment threshold ---
  it("claim: steel sword E9, damage 1000 -> payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });
  it("claim: dragon-material sword E8, damage 1000 -> 400 (high-ench clause wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Claim: dragon material full reimbursement ---
  it("claim: dragon-material sword E5, damage 800 -> 700 (full reimb, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(700);
  });

  // --- Claim: dragon + high-ench together ---
  it("claim: dragon-material sword E9, damage 1000 -> 400 (50% rule wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Claim: deductible per damage event ---
  it("claim: dragon attack damages sword (500) and amulet (300) -> payout 600 G (deductible per damage)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]}},
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(600);
  });

  // --- Multiple items of the same type ---
  it("policy with two swords (insurance sum 2000, cap 4000); damage both -> two deductibles", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]}},
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim: more damages of a type than the policy covers -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]}},
      ],
    })).toThrow();
  });

  // --- Cap exhaustion ---
  it("policy: sword + amulet -> insurance sum 1600, cap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 10000 }] } },
      ],
    });
    expect((result.results[1] as { remainingCap: number }).remainingCap).toBe(0);
    expect((result.results[1] as { payout: number }).payout).toBe(3200);
  });
  it("policy: cursed sword -> cap 2000 (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 99999 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(2000);
  });
  it("policy: sword + 3 runes -> insurance sum 1750, cap 3500 (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 999999 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(3500);
  });
  it("policy: sword cap 2000; two 1500 G claims -> 1400/600 then 600/0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases for input validation ---
  it("quote with unknown item type -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim referencing item not in policy -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
