import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("quote: empty item list → premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0].premium).toBe(5);
  });
  it("quote: single sword, newcomer first quote → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0].premium).toBe(115);
  });
  it("quote: single amulet, newcomer first quote → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0].premium).toBe(71);
  });
  it("quote: single staff, newcomer first quote → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0].premium).toBe(93);
  });
  it("quote: single potion, newcomer first quote → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0].premium).toBe(49);
  });
  it("quote: 2 runes, newcomer → premium 60 G (2×25 base + 5 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0].premium).toBe(60);
  });
  it("quote: 3 runes block, newcomer → premium 71 G (60 block + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0].premium).toBe(71);
  });
  it("quote: 4 runes, newcomer → premium 115 G (4×25 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0].premium).toBe(115);
  });
  it("quote: 7 runes, newcomer → premium 198 G (7×25=175 base + 17.5 first-insurance + 5 fee = 197.5 → 198 rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result.results[0].premium).toBe(198);
  });
  it("quote: 2 runes + 1 moonstone, newcomer → premium 88 G (3×25=75 base, no block different types, + 7.5 first-insurance + 5 fee = 87.5 → 88)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results[0].premium).toBe(88);
  });
  it("quote: 3 runes + 3 moonstones, newcomer → premium 137 G (60+60=120 two blocks + 12 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result.results[0].premium).toBe(137);
  });
  it("quote: cursed sword enchantment 3, newcomer → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
    });
    expect(result.results[0].premium).toBe(165);
  });
  it("quote: sword enchantment 5 not cursed, newcomer → premium 145 G (100 base + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0].premium).toBe(145);
  });
  it("quote: cursed sword enchantment 5, newcomer → premium 195 G (100 base + 50 curse + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results[0].premium).toBe(195);
  });
  it("quote: sword enchantment 4 not cursed, newcomer → premium 115 G (100 base + 10 first-insurance + 5 fee, no high-enchantment surcharge)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results[0].premium).toBe(115);
  });
  it("quote: cursed sword + plain amulet, newcomer → premium 231 G (160 base + 50 curse on sword only + 16 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ] }],
    });
    expect(result.results[0].premium).toBe(231);
  });
  it("quote: loyalty discount, sword, 2 years first quote → premium 95 G (100 base + 10 first-insurance - 20 loyalty + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0].premium).toBe(95);
  });
  it("quote: follow-up contract, second quote 0 years → premium 100 G (100 base + 10 first-insurance - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[1].premium).toBe(100);
  });
  it("quote: long-standing customer second contract integration → second quote premium 160 G (100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-insurance - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(result.results[1].premium).toBe(160);
  });
  it("claim: regular sword enchantment 3 steel, damage 500 → payout 400, remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("claim: rune, damage 200 → payout 100, remainingCap 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(400);
  });
  it("claim: dragon sword enchantment 9, damage 1000 → payout 400 (50% clause wins over dragon, then deductible), remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("claim: dragon sword enchantment 5, damage 800 → payout 700 (dragon full reimbursement, no high-ench for claims since <8), remainingCap 1300", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(700);
    expect(result.results[1].remainingCap).toBe(1300);
  });
  it("claim: steel sword enchantment 9, damage 1000 → payout 400 (50% high-enchantment clause, then deductible), remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("claim: dragon sword enchantment 8, damage 1000 → payout 400 (high-ench ≥8 applies, 50% wins over dragon, then deductible), remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("claim: sword 500 + amulet 300, deductible per item → payout 600 (400+200), remainingCap 2600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBe(2600);
  });
  it("claim: two swords each damaged 500 → payout 800 (400+400, separate deductibles), remainingCap 3200", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(result.results[1].payout).toBe(800);
    expect(result.results[1].remainingCap).toBe(3200);
  });
  it("claim: more sword damages than swords covered → error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] } },
      ],
    })).toThrow();
  });
  it("claim: cursed sword, cap 2000 based on unmodified insurance value → payout 400, remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("claim: sword + 3 runes block, damage to sword 500 → payout 400, remainingCap 3100 (insurance sum 1750, cap 3500)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(3100);
  });
  it("claim: cap exhaustion, two successive claims of 1500 each → first payout 1400 remaining 600, second payout 600 remaining 0", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });
  it("claim: payout rounding down, steel sword enchantment 8 damage 901 → payout 350 (50% of 901=450.5 - 100 deductible = 350.5 → 350), remainingCap 1650", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1].payout).toBe(350);
    expect(result.results[1].remainingCap).toBe(1650);
  });
  it("error: unknown item type in quote → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("error: damage entry for item not in policy → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("error: negative damage amount → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
