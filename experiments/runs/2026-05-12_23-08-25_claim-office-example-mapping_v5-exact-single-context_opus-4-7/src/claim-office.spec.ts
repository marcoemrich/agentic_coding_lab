import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office - Quote: base premiums and processing fee", () => {
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword (newcomer, first quote): 100 base + 10 first-insurance + 5 fee = 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet (newcomer, first quote): 60 + 6 + 5 = 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff (newcomer, first quote): 80 + 8 + 5 = 93 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion (newcomer, first quote): 40 + 4 + 5 = 49 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("sword + amulet (newcomer, first quote): (100+60) base + 16 first-insurance + 5 = 181 G", () => {
    const result = processScenario({
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
});

describe("MHPCO Claim Office - Quote: components and block discount", () => {
  it("1 rune (newcomer, first quote): 25 + 2.5 + 5 → rounded up to 33 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes: base premium 50 G, total 50 + 5 + 5 = 60 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (block applies): base premium 60 G, total 60 + 6 + 5 = 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes (no block — block requires exactly 3): base premium 100 G, total 100 + 10 + 5 = 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes: base premium 175 G, total 175 + 17.5 + 5 → rounded up to 198 G", () => {
    const items = Array(7).fill(null).map(() => ({ type: "rune" }));
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone: base premium 75 G (no block; different types)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    // base 75 + 7.5 first-insurance + 5 fee = 87.5 → 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones: base premium 120 G (two separate blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    // base 120 + 12 first-insurance + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
});

describe("MHPCO Claim Office - Quote: item-specific modifiers", () => {
  it("cursed sword (newcomer, first quote): 100 + 50 + 10 + 5 = 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5: high-enchantment surcharge applies (+30)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    // 100 + 30 + 10 + 5 = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4: no high-enchantment surcharge", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    // 100 + 10 + 5 = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5: both surcharges apply (+50 +30)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    // 100 + 50 + 30 + 10 + 5 = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
});

describe("MHPCO Claim Office - Quote: policy-wide modifiers", () => {
  it("customer with exactly 2 years: loyalty discount applies (20% off policy base)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    // base 100; loyalty -20; first-insurance 10; fee 5 = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year: no loyalty discount", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    // 100 + 10 + 5 = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote in scenario: follow-up contract discount (15% off policy base)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
      ],
    });
    // first: 100 + 10 + 5 = 115
    // second: 100 - 15 (follow-up) + 10 + 5 = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("integration: long-standing customer's second contract, cursed sword enchantment 7 = 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // first quote: 100 - 20 (loyalty) + 10 + 5 = 95
    // second quote: 100 + 50 + 30 - 20 - 15 + 10 + 5 = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO Claim Office - Quote: modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet (newcomer, first quote): curse applies only to sword's base; first-insurance applies to policy base", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
      }],
    });
    // base 160; curse 50 (only sword); first-ins 16 (10% of 160); fee 5 = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
});

describe("MHPCO Claim Office - Quote: rounding in MHPCO's favor", () => {
  it("premium yielding fractional G is rounded up to whole G", () => {
    // 1 rune: 25 base, 2.5 first-ins, 5 fee = 32.5 → 33
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0].premium).toBe(33);
  });
});

describe("MHPCO Claim Office - Claim: basic reimbursement and deductible", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // sword insurance 1000, cap 2000; payout 500-100=400, remaining cap 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // rune insurance 250, cap 500; payout 200-100=100, remaining 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("damage less than deductible → payout 0 G (not negative)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 50 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe("MHPCO Claim Office - Claim: high-enchantment 50% clause", () => {
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // 1000 * 0.5 = 500, - 100 = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword enchantment exactly 8, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword enchantment 7: no high-enchantment clause", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // full reimbursement (500) - deductible (100) = 400
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO Claim Office - Claim: dragon material clause", () => {
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full minus deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment exactly 8, damage 1000 G → payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO Claim Office - Claim: deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const result = processScenario({
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
    // (500-100) + (300-100) = 600; cap 3200 - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("MHPCO Claim Office - Claim: cap on payout", () => {
  it("sword (insurance value 1000), cap 2000 G; claim of 1500 → payout 1400, remainingCap 600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("two successive 1500 claims on a sword: first payout 1400 (cap 600 left), second payout 600 (cap 0)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("cursed sword (premium 165 with modifiers): cap is still 2000 G (based on unmodified insurance value)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword + 3 runes: insurance sum 1750 G (block does not affect insurance sum)", () => {
    // damage all up to cap (1750*2=3500); claim 3500 damage from sword (only 1000 reimbursable from sword's full)
    // Verify via a 1500 claim on sword: cap is 3500, payout 1400, remaining 2100
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 2100 });
  });
});

describe("MHPCO Claim Office - Claim: multiple items of the same type", () => {
  it("policy covers two swords: insurance sum 2000 G, cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 1500 },
          { itemType: "sword", amount: 1500 },
        ] } },
      ],
    });
    // 2 payouts of 1400 each = 2800; cap 4000; remaining 1200
    expect(result.results[1]).toEqual({ payout: 2800, remainingCap: 1200 });
  });
  it("two sword damages with only one sword insured → throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toThrow();
  });
});

describe("MHPCO Claim Office - Claim: rounding in MHPCO's favor", () => {
  it("payout yielding fractional G is rounded down to whole G", () => {
    // sword enchantment 9, damage 901: 450.5 - 100 = 350.5 → 350
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO Claim Office - Error handling", () => {
  it("quote with unknown item type → throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim with damage to item type not in policy → throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount → throws", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});

describe("MHPCO Claim Office - CLI", () => {
  it("CLI reads scenario JSON from stdin and writes results JSON to stdout", async () => {
    const { execSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] }],
    });
    const out = execSync("npx tsx src/cli.ts", { input }).toString();
    expect(JSON.parse(out)).toEqual({ results: [{ premium: 115 }] });
  });
  it("CLI processes sequential quote and claim steps, referencing policy by index", async () => {
    const { execSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    const out = execSync("npx tsx src/cli.ts", { input }).toString();
    expect(JSON.parse(out)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("CLI exits non-zero on invalid input and writes error to stderr", async () => {
    const { execSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(() => execSync("npx tsx src/cli.ts", { input, stdio: ["pipe", "pipe", "pipe"] })).toThrow();
  });
});
