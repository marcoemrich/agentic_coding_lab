import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list for the 5 G processing fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes each main item at its base premium and insurance value", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("prices component counts: 2 runes 50 G, exactly 3 60 G, 4 100 G, and 7 175 G", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    for (const [count, premium] of [[2, 60], [3, 71], [4, 115], [7, 198]]) expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: runes(count) }] } as never)).toEqual({ results: [{ premium }] });
  });
  it("treats alike components as exact types: 2 runes plus a moonstone 75 G and 3 of each 120 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] } as never)).toEqual({ results: [{ premium: 88 }] });
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })] }] } as never)).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies cursed and enchantment-5-or-higher surcharges only to affected item premiums", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }, { type: "amulet" }] }] } as never)).toEqual({ results: [{ premium: 261 }] });
  });
  it("applies loyalty at exactly 2 years, initial assessment, follow-up discount, and rounds premium fractions upward", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }, { op: "quote", items: [{ type: "amulet" }] }] } as never)).toEqual({ results: [{ premium: 59 }, { premium: 50 }] });
  });
  it("quotes the newcomer cursed sword integration example for 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] } as never)).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes the long-standing second-contract cursed enchanted sword integration example for 160 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: "quote", items: [] }, { op: "quote", items: [{ type: "sword", enchantment: 7, cursed: true }] }] } as never)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("reimburses ordinary and component damage after one 100 G deductible per damage entry", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 3 }, { type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "rune", amount: 200 }] } }] } as never)).toEqual({ results: [{ premium: 143 }, { payout: 500, remainingCap: 4500 }] });
  });
  it("uses 50 percent reimbursement at enchantment 8 or higher even for dragon material, before the deductible", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }] } as never)).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("fully reimburses dragon material below enchantment 8 before the deductible", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }] } as never)).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("handles two same-type insured items and separate damage entries with their own deductibles", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }] } as never)).toEqual({ results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }] });
  });
  it("tracks the cap from unmodified insurance sums across successive claims and rounds payouts downward", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }] } as never)).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });
  it("rejects unknown quote types without producing results", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] } as never)).toThrow("Unknown item type");
  });
  it("rejects negative, unknown, unowned, and over-count damage entries", () => {
    const scenario = (damages: unknown[]) => ({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages } }] });
    expect(() => runScenario(scenario([{ itemType: "sword", amount: -200 }]) as never)).toThrow();
    expect(() => runScenario(scenario([{ itemType: "amulet", amount: 1 }]) as never)).toThrow();
    expect(() => runScenario(scenario([{ itemType: "sword", amount: 1 }, { itemType: "sword", amount: 1 }]) as never)).toThrow();
  });
});
