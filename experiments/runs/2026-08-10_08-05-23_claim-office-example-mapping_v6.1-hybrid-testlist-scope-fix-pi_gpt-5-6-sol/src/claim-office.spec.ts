import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list: sword 100 G, amulet 60 G, staff 80 G, and potion 40 G base premiums", () => {
    const premium = (type: string) => (processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }) as { results: Array<{ premium: number }> }).results[0].premium;
    expect([premium("sword"), premium("amulet"), premium("staff"), premium("potion")]).toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at a 50 G component base premium", () => {
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] }) as any).results[0].premium).toBe(60);
  });
  it("quotes exactly 3 runes at the special 60 G block base premium", () => {
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] }) as any).results[0].premium).toBe(71);
  });
  it("quotes 4 runes at 100 G because blocks require exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(115);
  });
  it("quotes 7 runes at 175 G because larger counts do not contain discounted blocks", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(198);
  });
  it("quotes 2 runes and 1 moonstone at 75 G because alike means the exact component type", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(88);
  });
  it("quotes 3 runes and 3 moonstones at 120 G as two separate blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(137);
  });
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    expect((processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }) as any).results[0].premium).toBe(95);
  });
  it("applies the 30% high-enchantment surcharge at exactly level 5 and also stacks a curse surcharge", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(195);
  });
  it("does not apply high-enchantment at level 4 while still applying a curse surcharge", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: true }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(165);
  });
  it("scopes a cursed surcharge to the cursed sword in a sword-and-amulet policy, producing 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(231);
  });
  it("rounds a fractional 197.5 G final premium up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(198);
  });
  it("quotes a newcomer's cursed sword at 165 G including first-insurance surcharge and fee", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }) as any).results[0].premium).toBe(165);
  });
  it("quotes a long-standing customer's second-contract cursed level-7 sword at 160 G, retaining first-insurance and adding follow-up discount", () => {
    const quote = { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] };
    const result = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: "quote", items: [] }, quote] } as any) as any;
    expect(result.results[1].premium).toBe(160);
  });
  it("pays 400 G for 500 G damage to a regular steel level-3 sword", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune with no special clauses", () => {
    const steps = [{ op: "quote", items: [{ type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to an exactly level-8 dragon-material sword because the 50% clause wins before deductible", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].payout).toBe(400);
  });
  it("pays 400 G for 1000 G damage to a level-9 dragon-material sword", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].payout).toBe(400);
  });
  it("pays 700 G for 800 G damage to a level-5 dragon-material sword", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].payout).toBe(700);
  });
  it("pays 400 G for 1000 G damage to a level-9 steel sword", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].payout).toBe(400);
  });
  it("applies a separate 100 G deductible to sword and amulet damages, paying 600 G total", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].payout).toBe(600);
  });
  it("gives a two-sword policy a 2000 G insurance sum and 4000 G cap", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "scratch", damages: [] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].remainingCap).toBe(4000);
  });
  it("treats two sword damage entries as separate insured items with separate deductibles", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].payout).toBe(600);
  });
  it("rejects a claim with more damage entries of a type than the policy covers", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any)).toThrow(/not insured/i);
  });
  it("caps a sword-and-amulet policy at 3200 G from its 1600 G insurance sum", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].remainingCap).toBe(3200);
  });
  it("caps a cursed sword policy at 2000 G based on unmodified insurance value, not premium", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", cursed: true }] }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].remainingCap).toBe(2000);
  });
  it("uses a 1750 G insurance sum for a sword and 3 runes despite the premium block discount", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].remainingCap).toBe(3500);
  });
  it("exhausts a sword policy cap across two 1500 G claims: payouts 1400 G then 600 G, leaving zero", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } };
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim] } as any) as any;
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional 350.5 G final payout down to 350 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect((processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any) as any).results[1].payout).toBe(350);
  });
  it("rejects a quote containing unknown type broomstick without producing results", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] })).toThrow(/unknown item type/i);
  });
  it("rejects damage to an uninsured known item such as an amulet on a sword policy", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any)).toThrow(/not insured/i);
  });
  it("rejects a claim damage entry with an unknown item type", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any)).toThrow(/not insured/i);
  });
  it("rejects a claim damage entry with a negative amount", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any)).toThrow(/negative damage amount/i);
  });
});
