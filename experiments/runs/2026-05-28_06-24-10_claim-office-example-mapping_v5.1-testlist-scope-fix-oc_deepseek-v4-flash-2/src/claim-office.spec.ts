import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office - Quote", () => {
  it("should return 5 G for an empty item list -- only processing fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it("should return 115 G for a single sword -- 100 base + 10 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return 71 G for a single amulet -- 60 base + 6 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("should return 93 G for a single staff -- 80 base + 8 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  it("should return 49 G for a single potion -- 40 base + 4 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  it("should return 33 G for a single rune -- 25 base + 2.5->3 ceil + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  it("should return 60 G for 2 runes -- 50 base + 5 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  it("should return 71 G for 3 runes (block applies) -- 60 block + 6 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("should return 115 G for 4 runes (no block) -- 100 base + 10 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return 198 G for 7 runes -- 175 base + 17.5->18 ceil first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  it("should return 88 G for 2 runes + 1 moonstone (no block) -- 75 base + 7.5->8 ceil first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  it("should return 137 G for 3 runes + 3 moonstones (two blocks) -- 120 base + 12 first-insurance + 5 fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  it("should apply cursed surcharge to item, first-insurance to total -- cursed sword 100+50 + amulet 60 = 210 + 16 first-insurance + 5 = 231", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  it("should apply high-enchantment surcharge (30%) for enchantment >= 5 -- sword ench 5: 100+30+10 first-insurance+5 = 145", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  it("should apply loyalty discount for >= 2 years, first insurance still applies -- sword 2yr: 100-20 loyalty+10 first-insurance+5 = 95", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("should apply 15% follow-up contract discount for second+ quote -- sword, 2nd: 100+10 first-15 follow-up+5 = 100", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  it("should apply loyalty discount at exactly 2 years -- sword, 2yr: 95", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("should NOT apply high-enchantment surcharge at enchantment 4 -- sword: 100+10 first+5 = 115", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should apply both curse and high-enchantment surcharges -- cursed sword ench 5: 100+50+30+10 first+5 = 195", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  it("should calculate newcomer with cursed sword -- 0yr: 100+50+10+5 = 165", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it("should calculate long-standing customer 2nd contract -- 3yr, 2nd: 100+50+30-20+10-15+5 = 160", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 77 }, { premium: 160 }] });
  });
});

describe("Claim Office - Claim", () => {
  it("should pay damage minus 100 G deductible for standard item -- steel sword ench 3, damage 500: payout 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });

  it("should apply deductible per damaged item -- dragon attack on sword (500) + amulet (300): payout 600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });

  it("should reimburse at 50% for enchantment >= 8 -- sword ench 9, damage 1000: payout 400 (500-100)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  it("should fully reimburse dragon material items -- dragon sword ench 5, damage 800: payout 700 (800-100)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });

  it("should use 50% rule over dragon material when both apply -- dragon sword ench 9, damage 1000: payout 400 (500-100)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });

  it("should apply cap -- sword, first claim 1500 -> payout 1400, cap 600; second claim: payout 600, cap 0", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });

  it("should handle multiple same-type items -- 2 swords, cap 4000; damages each treated separately", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }] });
  });

  it("should reject claim with more damages than insured items of a type -- 2 damages for 1 sword: reject", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
        ],
      })
    ).toThrow();
  });

  it("should handle rune claims -- rune (no enchantment/material), damage 200: payout 100", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
});

describe("Claim Office - Errors", () => {
  it("should exit with error for unknown item type in quote -- {type: 'broomstick'}", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });

  it("should exit with error for claim referencing item not in policy", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "amulet", amount: 100 }] } },
        ],
      })
    ).toThrow();
  });

  it("should exit with error for negative damage amount", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      })
    ).toThrow();
  });
});