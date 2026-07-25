import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at the 5 G processing fee", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("uses the price list for sword 100 G, amulet 60 G, staff 80 G, and potion 40 G before first-insurance surcharge and fee", () => {
    expect(quote([item("sword")])).toEqual({ premium: 115 });
    expect(quote([item("amulet")])).toEqual({ premium: 71 });
    expect(quote([item("staff")])).toEqual({ premium: 93 });
    expect(quote([item("potion")])).toEqual({ premium: 49 });
  });
  it("prices components at 25 G each and exactly three alike components at 60 G: 2→50, 3→60, 4→100, 7→175", () => {
    expect(quote([item("rune"), item("rune")])).toEqual({ premium: 60 });
    expect(quote(Array.from({ length: 3 }, () => item("rune")))).toEqual({ premium: 71 });
    expect(quote(Array.from({ length: 4 }, () => item("rune")))).toEqual({ premium: 115 });
    expect(quote(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("treats component types separately: 2 runes + moonstone→75 and 3 runes + 3 moonstones→120", () => {
    expect(quote([item("rune"), item("rune"), item("moonstone")])).toEqual({ premium: 88 });
    expect(quote([...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))])).toEqual({ premium: 137 });
  });
  it("applies curse only to the affected item: cursed sword + plain amulet has 210 G before policy modifiers and fee", () => {
    expect(quote([item("sword", { cursed: true }), item("amulet")])).toEqual({ premium: 231 });
  });
  it("applies enchantment at level 5, curse cumulatively, and no enchantment surcharge at level 4", () => {
    expect(quote([item("sword", { enchantment: 5 })])).toEqual({ premium: 145 });
    expect(quote([item("sword", { enchantment: 5, cursed: true })])).toEqual({ premium: 195 });
    expect(quote([item("sword", { enchantment: 4 })])).toEqual({ premium: 115 });
  });
  it("applies loyalty at exactly 2 years, first insurance per item, and 15% follow-up contract discount", () => {
    expect(quote([item("sword")], 2)).toEqual({ premium: 95 });
    const result = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [item("sword"), item("amulet")] },
      { op: "quote", items: [item("sword")] },
    ]});
    expect(result.results).toEqual([{ premium: 149 }, { premium: 80 }]);
  });
  it("integrates newcomer cursed sword at 165 G and long-standing second-contract cursed enchanted sword at 160 G", () => {
    expect(quote([item("sword", { cursed: true, material: "steel", enchantment: 3 })])).toEqual({ premium: 165 });
    const result = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [item("sword", { cursed: true, material: "steel", enchantment: 7 })] },
    ]});
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rounds only the final premium upward, including 197.5 G to 198 G", () => {
    expect(quote(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("pays standard sword damage 500→400 and rune damage 200→100 with a deductible per damage entry", () => {
    const sword = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword", { material: "steel", enchantment: 3 })] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ]});
    expect(sword.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    const rune = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("rune")] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ]});
    expect(rune.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("handles dragon and high-enchantment precedence: level 8/9 dragon 1000→400, level 5 dragon 800→700, level 9 steel 1000→400", () => {
    const payout = (insured: Record<string, unknown>, amount: number) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword", insured)] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
    ]}).results[1].payout!;
    expect(payout({ material: "dragon", enchantment: 8 }, 1000)).toBe(400);
    expect(payout({ material: "dragon", enchantment: 9 }, 1000)).toBe(400);
    expect(payout({ material: "dragon", enchantment: 5 }, 800)).toBe(700);
    expect(payout({ material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });
  it("applies separate deductibles when one incident damages sword 500 and amulet 300, paying 600 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword"), item("amulet")] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ]});
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("supports duplicate insured types and rejects damage multiplicity exceeding the policy", () => {
    const valid = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword"), item("sword")] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ]});
    expect(valid.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword")] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ]})).toThrow("not covered");
  });
  it("computes cap from unmodified insurance values including components and exhausts it across successive claims 1400 then 600", () => {
    const blockPolicy = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword"), item("rune"), item("rune"), item("rune")] },
      { op: "claim", policy: 0, incident: { cause: "small", damages: [] } },
    ]});
    expect(blockPolicy.results[1].remainingCap!).toBe(3500);
    const exhausted = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword", { cursed: true })] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ]});
    expect(exhausted.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds final payout downward, including a fractional 350.5 G payout to 350 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword", { enchantment: 8 })] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ]});
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects unknown quote types, uninsured or unknown claim items, negative damage, and writes no result", () => {
    expect(() => quote([item("broomstick")])).toThrow("Unknown item type");
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword")] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ]})).toThrow("not covered");
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword")] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ]})).toThrow("non-negative");
  });
});
