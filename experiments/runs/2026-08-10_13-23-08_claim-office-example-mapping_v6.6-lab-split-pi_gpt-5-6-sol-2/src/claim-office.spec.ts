import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

void runScenario;

describe("MHPCO claim office", () => {
  it("quotes an empty item list at the 5 G processing fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, potion, rune, and moonstone premiums", () => {
    const premiums = ["sword", "amulet", "staff", "potion", "rune", "moonstone"].map(type =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }),
    );
    expect(premiums).toEqual([115, 71, 93, 49, 33, 33].map(premium => ({ results: [{ premium }] })));
  });
  it("prices component quantities: 2 runes 50 G, exactly 3 runes 60 G, 4 runes 100 G, and 7 runes 175 G before policy modifiers", () => {
    const quote = (count: number) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }] });
    expect([2, 3, 4, 7].map(quote)).toEqual([60, 71, 115, 198].map(premium => ({ results: [{ premium }] })));
  });
  it("treats component types as alike only by exact type: mixed 2+1 is 75 G and separate 3+3 blocks total 120 G", () => {
    const quote = (types: string[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: types.map(type => ({ type })) }] });
    expect(quote(["rune", "rune", "moonstone"])).toEqual({ results: [{ premium: 88 }] });
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse surcharge only to the affected item: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }] }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies high-enchantment surcharge at exactly level 5 and combines it with curse, but not at level 4", () => {
    const quote = (enchantment: number, cursed: boolean) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment, cursed }] }] });
    expect(quote(5, true)).toEqual({ results: [{ premium: 195 }] });
    expect(quote(4, true)).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies loyalty at exactly 2 years, first-insurance surcharge per item, follow-up discount after the first contract, then the fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }, { premium: 80 }] });
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const steps = [{ op: "quote", items: [] }, { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rejects an unknown quote item type without producing results", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] })).toThrow(/unknown item type/i);
  });
  it("reimburses a regular sword damaged by 500 G at 400 G and leaves 1600 G cap", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("reimburses rune damage of 200 G at 100 G with no item special clauses", () => {
    const steps = [{ op: "quote", items: [{ type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("applies the deductible once per damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays exactly-enchantment-8 dragon sword damage of 1000 G at 400 G because the half rule wins", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays enchantment-9 dragon sword damage of 1000 G at 400 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays enchantment-5 dragon sword damage of 800 G at 700 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays enchantment-9 steel sword damage of 1000 G at 400 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a fractional 350.5 G raw payout down to 350 G only at the end", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("uses unmodified values for caps: sword+amulet 3200 G, cursed sword 2000 G, and sword+3 runes 3500 G", () => {
    const policies = [[{ type: "sword" }, { type: "amulet" }], [{ type: "sword", cursed: true }], [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]];
    const remainingCaps = policies.map(items => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }] }).results[1]);
    expect(remainingCaps).toEqual([{ payout: 0, remainingCap: 3200 }, { payout: 0, remainingCap: 2000 }, { payout: 0, remainingCap: 3500 }]);
  });
  it("tracks duplicate insured items and applies a separate deductible to each damage entry", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/not covered/i);
  });
  it("rejects damage to an item type absent from the policy, including unknown item types", () => {
    const claim = (itemType: string) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } }] });
    expect(() => claim("amulet")).toThrow(/not covered/i);
    expect(() => claim("broomstick")).toThrow(/not covered/i);
  });
  it("rejects a negative damage amount", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } }];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(/negative damage/i);
  });
  it("exhausts a sword policy cap over successive 1500 G claims: 1400 G then 600 G then zero remaining", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim] }).results;
    expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
});
