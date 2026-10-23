import { describe, it, expect } from "vitest";
import { run, type Scenario } from "./cli.js";

const firstCustomer = { yearsWithMHPCO: 0 };

describe("Claim Office", () => {
  it("should quote an empty item list as 5 G (only the processing fee)", () => {
    const result = run({ customer: firstCustomer, steps: [{ op: "quote", items: [] }] });
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  it("should quote 2 runes as 60 G final premium (50 base + 10% first-insurance + 5 fee)", () => {
    const result = run({ customer: firstCustomer, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] });
    expect(result.results).toEqual([{ premium: 60 }]);
  });

  it("should quote 3 runes as 71 G final premium (60 block base + 10% first-insurance + 5 fee)", () => {
    const result = run({ customer: firstCustomer, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    expect(result.results).toEqual([{ premium: 71 }]);
  });

  it("should quote 4 runes as 115 G final premium (100 base no block + 10% first-insurance + 5 fee)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("should quote 7 runes as 198 G final premium (175 base + 10% first-insurance + 5 fee rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = run({ customer: firstCustomer, steps: [{ op: "quote", items }] });
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  it("should quote 2 runes + 1 moonstone as 88 G final premium (75 base no block + 10% first-insurance + 5 fee)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results).toEqual([{ premium: 88 }]);
  });

  it("should quote 3 runes + 3 moonstones as 137 G final premium (120 two blocks + 10% first-insurance + 5 fee)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  it("should apply cursed surcharge only to the cursed item's base premium (cursed sword + plain amulet -> 231)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  it("should apply high-enchantment (enchantment 5) +30% surcharge -> 145 G final premium", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });

  it("should apply both cursed and high-enchantment surcharges (cursed sword enchantment 5 -> 195)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });

  it("should not apply high-enchantment surcharge at enchantment 4 (sword enchantment 4 -> 115)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("should apply loyalty discount at exactly 2 years with MHPCO (plain sword -> 95)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });

  it("should apply 10% first-insurance surcharge (single staff -> 93)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results).toEqual([{ premium: 93 }]);
  });

  it("should apply 15% follow-up contract discount on second contract (sword -> 100)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  it("should add 5 G processing fee to every premium (single potion -> 49)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  it("should round premium 197.5 G up to 198 G (7 runes)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = run({ customer: firstCustomer, steps: [{ op: "quote", items }] });
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  it("should quote sword 100 / amulet 60 / staff 80 / potion 40 base premiums (total first-insurance+5 fee -> 313)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "amulet" },
            { type: "staff" },
            { type: "potion" },
          ],
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 313 }]);
  });

  it("should quote components (runes/moonstones) at 250 G value / 25 G per component (single rune -> 33)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 33 }]);
  });

  it("should reimburse regular steel sword enchantment 3 damage 500 -> payout 400", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("should reimburse rune damage 200 -> payout 100 (no enchantment/material)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });

  it("should apply 100 G deductible once per damaged item (sword 500 + amulet 300 -> 600)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });

  it("should reimburse dragon sword enchantment 9 damage 1000 -> payout 400 (50% rule wins)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("should reimburse dragon sword enchantment 5 damage 800 -> payout 700 (only dragon clause)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });

  it("should reimburse steel sword enchantment 9 damage 1000 -> payout 400 (only high-enchantment)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("should reimburse dragon sword enchantment 8 damage 1000 -> payout 400 (high-enchantment then deductible)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("should cover two swords -> insurance sum 2000, cap 4000 (claim -> remainingCap 3600)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 225 }, { payout: 400, remainingCap: 3600 }]);
  });

  it("should treat each damage entry as separate damage with its own deductible (two swords)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.results).toEqual([{ premium: 225 }, { payout: 800, remainingCap: 3200 }]);
  });

  it("should throw when damages contain more entries of a type than insured", () => {
    const scenario: Scenario = {
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }],
          },
        },
      ],
    };
    expect(() => run(scenario)).toThrow();
  });

  it("should reduce payout to remaining cap on successive claims (1500 + 1500 -> 1400 then 600)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it("should round payout 350.5 G down to 350 G (steel sword enchantment 8 damage 901)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });

  it("should throw for unknown item type in quote (broomstick)", () => {
    const scenario: Scenario = {
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => run(scenario)).toThrow();
  });

  it("should throw for claim damage entry whose item is not part of policy (amulet when only sword insured)", () => {
    const scenario: Scenario = {
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(() => run(scenario)).toThrow();
  });

  it("should throw for claim damage entry with negative amount (-200)", () => {
    const scenario: Scenario = {
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => run(scenario)).toThrow();
  });

  it("should process newcomer with cursed sword -> premium 165 G", () => {
    const result = run({
      customer: firstCustomer,
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });

  it("should process long-standing customer's second contract cursed sword enchantment 7 -> premium 160 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  it("should cap payout at twice the insurance sum (cursed sword cap 2000, not raised by premium)", () => {
    const result = run({
      customer: firstCustomer,
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
});