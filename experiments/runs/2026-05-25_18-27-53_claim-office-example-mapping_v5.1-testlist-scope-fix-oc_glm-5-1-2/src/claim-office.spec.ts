import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("quote: empty item list → premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  it("quote: single sword → premium 115 G (100 base + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote: single amulet → premium 71 G (60 base + 6 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote: single staff → premium 93 G (80 base + 8 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("quote: single potion → premium 49 G (40 base + 4 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });
  it("quote: single rune → premium 33 G (25 base + 2.5 first-ins + 5 fee, rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("quote: single moonstone → premium 33 G (25 base + 2.5 first-ins + 5 fee, rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });

  it("quote: 2 runes → premium 60 G (50 base + 5 first-ins + 5 fee, no block)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("quote: 3 runes → premium 71 G (60 base + 6 first-ins + 5 fee, block applies)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote: 4 runes → premium 115 G (100 base + 10 first-ins + 5 fee, no block — block requires exactly 3)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote: 7 runes → premium 198 G (175 base + 17.5 first-ins + 5 fee, rounded up)", () => {
    const runes = Array(7).fill(null).map(() => ({ type: "rune" }));
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("quote: 2 runes + 1 moonstone → premium 88 G (75 base + 7.5 first-ins + 5 fee, no block, rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("quote: 3 runes + 3 moonstones → premium 137 G (120 base + 12 first-ins + 5 fee, two separate blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ]}],
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  it("quote: cursed sword → premium 165 G (100 base + 50 curse + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("quote: sword enchantment 5 → premium 145 G (100 base + 30 high-ench + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("quote: cursed sword enchantment 5 → premium 195 G (100 base + 50 curse + 30 high-ench + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  it("quote: sword enchantment 4 → premium 115 G (no high-enchantment surcharge, 100 base + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  it("quote: loyalty discount at exactly 2 years on sword → premium 95 G (100 base - 20 loyalty + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("quote: first insurance surcharge on sword → premium 115 G (100 base + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote: follow-up contract (2nd quote) on sword → premium 100 G (100 base + 10 first-ins - 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  it("quote: cursed sword + plain amulet → premium 231 G (160 base + 50 curse on sword + 16 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  it("quote: newcomer with cursed sword (0 years, 1st contract) → premium 165 G (100 + 50 curse + 10 first-ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("quote: long-standing 2nd contract: 3 years, cursed sword enchantment 7 → premium 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it("quote: premium rounding 197.5 → 198 G (rounded up in MHPCO favor) — verified by 7 runes test", () => {
    const runes = Array(7).fill(null).map(() => ({ type: "rune" }));
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes }],
    });
    expect(result.results[0].premium).toBe(198);
  });

  it("claim: regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: damage to rune, damage 200 G → payout 100 G (full reimbursement - 100 deductible; runes have no enchantment or material)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  it("claim: dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (100 deductible per item)", () => {
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
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it("claim: dragon-material sword enchantment 8, damage 1000 G → payout 400 G (high-enchantment 50% = 500, then -100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword enchantment 5, damage 800 G → payout 700 G (dragon material: full, then -100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim: dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins: 500 - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: steel sword enchantment 9, damage 1000 G → payout 400 G (only high-enchantment: 50% = 500 - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("claim: two swords insured → insurance sum 2000 G, cap 4000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(100);
    expect(claim.remainingCap).toBe(3900);
  });
  it("claim: dragon attack damages both swords → each is separate damage with own deductible", () => {
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
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(800);
    expect(claim.remainingCap).toBe(3200);
  });

  it("claim: sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.remainingCap).toBe(3100);
  });
  it("claim: cursed sword → cap 2000 G (based on unmodified insurance value, not premium)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.remainingCap).toBe(1900);
  });
  it("claim: sword + 3 runes (block) → insurance sum 1750 G (block doesn't affect insurance sum)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.remainingCap).toBe(3400);
  });

  it("claim: sword insured (cap 2000 G); two successive claims of 1500 G each → first payout 1400 G cap 600 G; second payout 600 G cap 0 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    const claim1 = result.results[1] as { payout: number; remainingCap: number };
    const claim2 = result.results[2] as { payout: number; remainingCap: number };
    expect(claim1.payout).toBe(1400);
    expect(claim1.remainingCap).toBe(600);
    expect(claim2.payout).toBe(600);
    expect(claim2.remainingCap).toBe(0);
  });

  it("claim: payout rounding 350.5 → 350 G (rounded down in MHPCO favor)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(350);
  });

  it("error: unknown item type → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("error: damage to item not in policy → throws error", () => {
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
  it("error: more damages of a type than policy covers → throws error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toThrow();
  });
});
