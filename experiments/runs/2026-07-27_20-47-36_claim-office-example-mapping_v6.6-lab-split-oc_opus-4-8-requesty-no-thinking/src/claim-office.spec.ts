import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums for single main items (base + 10% first insurance + 5G fee) ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("single sword -> base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet -> base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff -> base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion -> base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Component base premiums (building blocks) ---
  it("2 runes -> 50 G base premium (+ first insurance + fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block - block requires exactly 3)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // base 175 (7*25, no block); +17.5 first insurance; +5 fee = 197.5
    // rounded up in MHPCO favor => 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- 'Alike' components ---
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    // base 75 (3*25, no block: different types) + 7.5 + 5 = 87.5,
    // rounded up in MHPCO favor => 88
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    // base 120 (two blocks of 60) + 12 + 5 = 137
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> curse adds 50% of cursed sword base only", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    });
    // policy base 160; curse +50 (50% of sword base 100); first insurance
    // +16 (10% of 160); fee +5 => 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("item-specific modifiers apply to affected item; policy-wide to policy base", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true, enchantment: 5 },
            { type: "amulet" },
          ],
        },
      ],
    });
    // policy base 160; sword: curse +50 (50% of 100) + high-ench +30 (30% of
    // 100); first insurance +16 (10% of 160); fee +5 => 261
    expect(result.results[0]).toEqual({ premium: 261 });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // base 100; first insurance +10; loyalty -20 (20% of 100); fee +5 => 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5 }] },
      ],
    });
    // base 100; high-ench +30 (30% of 100); first insurance +10; fee +5 => 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 5 and cursed -> both surcharges apply", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    // base 100; curse +50; high-ench +30; first insurance +10; fee +5 => 195
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 4 }] },
      ],
    });
    // base 100; no high-ench; first insurance +10; fee +5 => 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> 198 G (rounded up, in MHPCO favor)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // 197.5 rounded up in the MHPCO's favor => 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- Integration: newcomer with cursed sword ---
  it("newcomer cursed sword (0 years) -> premium 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // --- Integration: long-standing customer's second contract ---
  it("long-standing customer 2nd contract cursed enchanted sword -> premium 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    // 2nd contract: 100 base + 50 curse + 30 high-ench - 20 loyalty
    // + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword, damage 500 G -> payout 400 G (full minus deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // full reimbursement 500 - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G -> payout 100 G (full minus deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    // 200 - 100 deductible = 100; cap 500 - 100 = 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: high enchantment clause ---
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (50% then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // high-ench (>=8) reimburses 50%: 500, then deductible 100 => 400;
    // cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: dragon material clause ---
  it("dragon sword enchantment 5, damage 800 G -> payout 700 G (full then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    // dragon material: full reimbursement 800, then deductible 100 => 700;
    // cap 2000 - 700 = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- Claim: both clauses, 50% wins ---
  it("dragon sword enchantment 9, damage 1000 G -> payout 400 G (50% wins)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // both clauses apply; 50% rule wins: 500, then deductible 100 => 400;
    // cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 8, damage 1000 G -> payout 400 G (high-ench then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    // enchantment exactly 8: high-ench clause 50% => 500, deductible 100 => 400;
    // cap 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword 500 + amulet 300 -> payout 600 G (deductible per item)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // sword: 500-100=400; amulet: 300-100=200; total 600;
    // cap (1000+600)*2 = 3200 - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: payout rounding ---
  it("payout yielding 350.5 G -> 350 G (rounded down, in MHPCO favor)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    // 901 * 0.5 = 450.5, - 100 deductible = 350.5, rounded down => 350;
    // cap 2000 - 350 = 1650
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Multiple items of same type ---
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // insurance sum 2000, cap 4000; payout 400; remaining 4000 - 400 = 3600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("two sword damages both reimbursed with own deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 600 },
            ],
          },
        },
      ],
    });
    // each sword damage its own deductible: (500-100)+(600-100)=900;
    // cap 4000 - 900 = 3100
    expect(result.results[1]).toEqual({ payout: 900, remainingCap: 3100 });
  });
  it("more damage entries of a type than covered -> non-zero exit (rejected)", () => {
    // two sword damages but only one sword insured -> whole claim rejected
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- Cap exhaustion ---
  it("cursed sword cap 2000 G based on unmodified insurance value", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    // cap based on unmodified insurance value 1000 -> 2000 (curse does not
    // raise cap); payout 1500 - 100 = 1400; remaining 2000 - 1400 = 600
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("two successive 1500 G claims -> 1400 G then 600 G (cap exhaustion)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    // cap 2000; first claim 1400 (remaining 600); second desired 1400 but
    // capped to remaining 600 -> payout 600 (remaining 0)
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error / edge cases ---
  it("quote with unknown item type -> non-zero exit, error to stderr", () => {
    // unknown type broomstick -> whole quote rejected (CLI exits non-zero)
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy -> non-zero exit, error to stderr", () => {
    // amulet damaged when only a sword is insured -> whole claim rejected
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim damage amount -200 -> non-zero exit, error to stderr", () => {
    // negative damage amount -> whole claim rejected
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
