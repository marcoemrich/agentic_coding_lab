import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases / processing fee ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for single main items ---
  it("single plain sword (newcomer first item) → base 100 + first-insurance 10 + fee 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet (newcomer first item) → base 60 + first 6 + fee 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff (newcomer first item) → base 80 + first 8 + fee 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion (newcomer first item) → base 40 + first 4 + fee 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and "building blocks of 3 alike" ---
  it("2 runes → base 50 G (no block); final premium with first-insurance+fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → base 60 G (block applies); premium 60 + first 6 + fee 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → base 100 G (no block); premium = 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → base 175 G (no block; block requires exactly 3); premium = 175 + 17.5 + 5 = 197.5 → rounds up to 198", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone → base 75 G (no block: different types); premium = 75 + 7.5 + 5 = 87.5 → 88", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → base 120 G (two separate blocks); premium = 120 + 12 + 5 = 137", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers (cursed, high enchantment) ---
  it("cursed sword (newcomer, steel, ench 3) → premium 165 G (100 base + 50 curse + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with ench exactly 5 → 30% high-enchantment surcharge; premium = 100+30+10+5 = 145", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge; premium = 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword ench=5 → both surcharges apply; premium = 100+50+30+10+5 = 195", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("loyalty discount (2yrs) applies; plain sword premium = 100-20+10+5 = 95", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("loyalty discount does NOT apply for customer with 1 year; premium = 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("first insurance surcharge applies to policy base; sword+amulet → 160 + 16 + 5 = 181", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("follow-up contract discount (15%) applies to second quote in scenario; second plain sword = 100-15+10+5 = 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → cursed surcharge only on cursed item; 160+50+16+5 = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---
  // Already covered by "7 runes → 198" and "2 runes + 1 moonstone → 88" (both yield .5 fractions that round up).

  // --- Integration examples ---
  // "newcomer with cursed sword (steel, ench 3) → 165 G" already covered above.
  it("long-standing customer (3yrs), 2nd quote, cursed sword (steel, ench 7) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Quote error cases ---
  it("quote with unknown item type → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G (full minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune, damage 200 G → payout 100 G (200 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "spell", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: enchantment threshold ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: dragon material ---
  it("dragon sword, enchantment 5, damage 800 G → payout 700 G (full minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("dragon sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword, enchantment exactly 8, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: multiple items of same type ---
  it("two swords insured; both damaged 500 each → each entry own deductible; payout 800", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim has more entries of a type than policy covers → runScenario throws (claim rejected)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ] } },
      ],
    })).toThrow();
  });

  // --- Claim: cap exhaustion ---
  // sword + amulet cap (3200) already covered by the dragon-attack test (remainingCap = 3200 - 600 = 2600).
  it("cursed sword → cap 2000 G (modifiers don't raise cap); claim 500 → payout 400, remaining 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + 3 runes (block) → insurance sum 1750, cap 3500; claim sword 200 → payout 100, remaining 3400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword (cap 2000); two claims of 1500 → first {1400, 600}, second {600, 0}", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding ---
  it("payout 350.5 G rounds DOWN to 350 G (sword ench 8, damage 901 → 450.5 - 100 = 350.5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim error cases ---
  it("claim references item not in policy → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim references item with unknown type → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim has damage with amount: -200 → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
