import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword 100 G, amulet 60 G, staff 80 G, potion 40 G, and components 25 G each", () => {
    const quote = (type: string) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] });
    expect(quote("sword")).toEqual({ results: [{ premium: 115 }] });
    expect(quote("amulet")).toEqual({ results: [{ premium: 71 }] });
    expect(quote("staff")).toEqual({ results: [{ premium: 93 }] });
    expect(quote("potion")).toEqual({ results: [{ premium: 49 }] });
    expect(quote("rune")).toEqual({ results: [{ premium: 33 }] });
  });
  it("prices rune quantities 2, 3, 4, and 7 at base premiums 50, 60, 100, and 175 G", () => {
    const premium = (count: number) => (processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }] }) as any).results[0].premium;
    expect([2, 3, 4, 7].map(premium)).toEqual([60, 71, 115, 198]);
  });
  it("requires components in a block to have exactly the same type: mixed three cost 75 G and two separate triples cost 120 G", () => {
    const quote = (types: string[]) => (processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: types.map((type) => ({ type })) }] }) as any).results[0].premium;
    expect(quote(["rune", "rune", "moonstone"])).toBe(88);
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toBe(137);
  });
  it("applies curse only to the affected item base: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }] }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies modifier thresholds: loyalty at 2 years, enchantment at 5, no enchantment surcharge at 4, and stacks curse with enchantment", () => {
    const premium = (years: number, enchantment: number, cursed = false) => (processScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: "quote", items: [{ type: "sword", enchantment, cursed }] }] }) as any).results[0].premium;
    expect(premium(2, 5, true)).toBe(175);
    expect(premium(0, 4, true)).toBe(165);
  });
  it("rounds a fractional premium of 197.5 G up to 198 G only after all modifiers", () => {
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] }) as any).results[0].premium).toBe(198);
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] }) as any).results[0].premium).toBe(165);
  });
  it("quotes a long-standing customer's second contract cursed enchanted sword at 160 G, with per-item initial assessment and follow-up discount", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("pays standard steel-sword damage 500 G as 400 G and rune damage 200 G as 100 G, each after deductible", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "rune", amount: 200 }] } },
    ] } as any)).toEqual({ results: [{ premium: 143 }, { payout: 500, remainingCap: 2000 }] });
  });
  it("applies special clauses with enchantment winning at 8+: dragon sword level 8 or 9 damage 1000 pays 400 G, dragon level 5 damage 800 pays 700 G, steel level 9 damage 1000 pays 400 G", () => {
    const payout = (material: string, enchantment: number, amount: number) => (processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material, enchantment }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
    ] }) as any).results[1].payout;
    expect(payout("dragon", 8, 1000)).toBe(400);
    expect(payout("dragon", 9, 1000)).toBe(400);
    expect(payout("dragon", 5, 800)).toBe(700);
    expect(payout("steel", 9, 1000)).toBe(400);
  });
  it("applies the 100 G deductible once per damage entry so sword 500 plus amulet 300 pays 600 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }] }) as any;
    expect(output.results[1].payout).toBe(600);
  });
  it("supports duplicate insured types: two swords have a 4000 G cap and two damage entries each receive a deductible", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }] }) as any;
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim containing more damage entries of a type than the policy covers", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } }] })).toThrow();
  });
  it("bases caps on unmodified insurance values and component counts: sword+amulet 3200 G, cursed sword 2000 G, sword+3 runes 3500 G", () => {
    const remaining = (items: any[]) => (processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }] }) as any).results[1].remainingCap;
    expect(remaining([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
    expect(remaining([{ type: "sword", cursed: true }])).toBe(2000);
    expect(remaining([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(3500);
  });
  it("tracks cap exhaustion across claims: successive sword claims of 1500 G pay 1400 then 600 G, leaving zero", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "one", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "two", damages: [{ itemType: "sword", amount: 1500 }] } }] }) as any;
    expect(output.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G only at the end", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } }] }) as any;
    expect(output.results[1].payout).toBe(350);
  });
  it("rejects a quote with unknown item type broomstick without producing results", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] })).toThrow(/unknown/i);
  });
  it("rejects damage for an uninsured or unknown item type", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } }] })).toThrow();
  });
  it("rejects a negative damage amount", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } }] })).toThrow(/negative/i);
  });
  it("processes sequential quote and claim steps using the quote step's zero-based policy index and returns binding output fields", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 5 }, steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] })).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
