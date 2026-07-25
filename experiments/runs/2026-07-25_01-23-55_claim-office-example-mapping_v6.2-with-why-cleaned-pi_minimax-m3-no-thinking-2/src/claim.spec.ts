import { describe, it, expect } from "vitest";
import { claim } from "./claim.js";
import type { Policy } from "./claim.js";
import type { QuoteItem } from "./quote.js";

function policy(items: QuoteItem[], insuranceSum: number, remainingCap?: number): Policy {
  const cap = 2 * insuranceSum;
  return { items, insuranceSum, cap, remainingCap: remainingCap ?? cap, premium: 0 };
}

describe("claim", () => {
  it("standard reimbursement: regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const p = policy([{ type: "sword", material: "steel", enchantment: 3 }], 1000);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 500 }] })).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G → payout 100 G (full reimbursement minus 100 deductible)", () => {
    const p = policy([{ type: "rune" }], 250);
    expect(claim({ policy: p, damages: [{ itemType: "rune", amount: 200 }] })).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword enchantment 9, damage 1000 G → payout 400 G (high-enchantment 50 % rule wins)", () => {
    const p = policy([{ type: "sword", material: "dragon", enchantment: 9 }], 1000);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5, damage 800 G → payout 700 G (full reimbursement, no high-enchantment rule)", () => {
    const p = policy([{ type: "sword", material: "dragon", enchantment: 5 }], 1000);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 800 }] })).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 G → payout 400 G", () => {
    const p = policy([{ type: "sword", material: "steel", enchantment: 9 }], 1000);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 8, damage 1000 G → payout 400 G (high-enchantment rule applies at threshold)", () => {
    const p = policy([{ type: "sword", material: "dragon", enchantment: 8 }], 1000);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("deductible per damage event: sword (500) + amulet (300) → payout 600 G", () => {
    const p = policy(
      [{ type: "sword" }, { type: "amulet" }],
      1600,
    );
    expect(claim({
      policy: p,
      damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    })).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("cap exhaustion: sword insured (cap 2000), first claim 1500 → payout 1400 G, remaining cap 600 G", () => {
    const p = policy([{ type: "sword" }], 1000);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 1500 }] })).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("cap exhaustion: same policy with remaining cap 600, claim 1500 → payout 600 G (reduced to remaining cap), remaining cap 0 G", () => {
    const p = policy([{ type: "sword" }], 1000, 600);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 1500 }] })).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("rounding: payout 350.5 → final payout 350 G (rounded down in MHPCO's favor)", () => {
    // steel sword enchantment 8: 50% rule applies, damage 901 -> 901 * 0.5 = 450.5, minus 100 deductible = 350.5, floor to 350
    const p = policy([{ type: "sword", material: "steel", enchantment: 8 }], 1000);
    expect(claim({ policy: p, damages: [{ itemType: "sword", amount: 901 }] })).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("throws when damage references an item not in the policy", () => {
    const p = policy([{ type: "sword" }], 1000);
    expect(() => claim({ policy: p, damages: [{ itemType: "amulet", amount: 200 }] })).toThrow();
  });
  it("throws when damage references an item with an unknown type", () => {
    const p = policy([{ type: "sword" }], 1000);
    expect(() => claim({ policy: p, damages: [{ itemType: "broomstick", amount: 200 }] })).toThrow();
  });
  it("throws when a damage amount is negative", () => {
    const p = policy([{ type: "sword" }], 1000);
    expect(() => claim({ policy: p, damages: [{ itemType: "sword", amount: -200 }] })).toThrow();
  });
  it("throws when the damages array has more entries of a given type than the policy covers", () => {
    const p = policy([{ type: "sword" }], 1000);
    expect(() => claim({
      policy: p,
      damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }],
    })).toThrow();
  });
});
