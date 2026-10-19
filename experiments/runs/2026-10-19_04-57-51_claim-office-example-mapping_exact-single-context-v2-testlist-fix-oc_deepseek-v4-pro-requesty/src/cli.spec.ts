import { describe, it, expect } from "vitest";
import { runClaimOffice } from "./cli.js";

function run(scenario: object): { results: unknown[] } {
  return runClaimOffice(JSON.stringify(scenario));
}

describe("claim-office", () => {
  it("should return 5 G premium for an empty item list (only processing fee)", () => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  it("should return 60 G premium for 2 runes (50 base + 10% first-insurance + 5 fee)", () => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] });
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("should return 71 G premium for 3 runes (60 block + 10% first-insurance + 5 fee)", () => {
    const runes = ["rune", "rune", "rune"];
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: runes.map((type) => ({ type })) }] });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("should return 115 G premium for 4 runes (100 base + 10% + 5 fee)", () => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("should return 198 G premium for 7 runes (175 base + 10% + 5 fee = 197.5 rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("should return 88 G premium for 2 runes + 1 moonstone (75 base + 10% + 5 fee = 87.5 rounded up)", () => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] });
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("should return 137 G premium for 3 runes + 3 moonstones (120 base two blocks + 10% + 5 fee)", () => {
    const result = run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }] });
    expect(result.results).toEqual([{ premium: 137 }]);
  });
  it("should apply cursed surcharge only to cursed item: cursed sword + plain amulet -> 231 G premium", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
      }],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });
  it("should apply loyalty discount for a customer with exactly 2 years with MHPCO (plain sword -> 95 G)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("should apply high-enchantment surcharge for a sword with exactly enchantment 5 (145 G)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("should apply both curse and high-enchantment surcharges for a cursed sword at enchantment 5 (195 G)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("should not apply high-enchantment surcharge for a sword with enchantment 4 (115 G, no high-enchantment)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("should process newcomer cursed sword premium as 165 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("should process long-standing customer second contract cursed sword premium as 160 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [item] }, { op: "quote", items: [item] }],
    });
    expect(result.results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });
  it("should process standard reimbursement for steel sword enchantment 3, damage 500 G -> 400 G payout", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("should process rune damage 200 G -> 100 G payout", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });
  it("should reimburse high-enchantment (>= 8) damage at 50%: dragon sword enchant 8, damage 1000 G -> 400 G payout", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("should fully reimburse dragon material: dragon sword enchant 5, damage 800 G -> 700 G payout", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });
  it("should apply 50% over dragon material when both apply: dragon sword enchant 9, damage 1000 G -> 400 G payout", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("should process multiple damaged items with separate deductibles: sword 500 + amulet 300 -> 600 G payout", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });
it("should return remainingCap = 2x insurance sum after quote", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 0 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }]);
  });
});