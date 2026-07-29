import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums ---
  it("should charge only the 5 G processing fee for an empty item list -- premium 5", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(results).toEqual([{ premium: 5 }]);
  });
  it("should quote a single sword for a new customer -- 100 base + 10 first insurance + 5 fee = 115", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("should quote a single amulet for a new customer -- 60 + 6 + 5 = 71", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("should quote a single staff for a new customer -- 80 + 8 + 5 = 93", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("should quote a single potion for a new customer -- 40 + 4 + 5 = 49", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: components and building blocks ---
  it("should quote 2 runes at 25 G each -- 50 + 5 + 5 = 60", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("should apply the building block to exactly 3 alike components -- 3 runes: 60 + 6 + 5 = 71", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("should not apply the block to 4 runes (block requires exactly 3) -- 100 + 10 + 5 = 115", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("should quote 7 runes at 25 G each and round up in MHPCO's favor -- 175 + 17.5 + 5 = 197.5 -> 198", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes }],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("should not mix component types for a block -- 2 runes + 1 moonstone: 75 + 7.5 + 5 = 87.5 -> 88", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("should form two separate blocks for 3 runes + 3 moonstones -- 120 + 12 + 5 = 137", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Quote: item-specific modifiers ---
  it("should add a 50% curse surcharge to the cursed item only -- cursed sword: 100 + 50 + 10 + 5 = 165", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("should add a 30% high-enchantment surcharge at exactly enchantment 5 -- sword: 100 + 30 + 10 + 5 = 145", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("should not add the high-enchantment surcharge at enchantment 4 -- sword: 115", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("should stack curse and high-enchantment surcharges -- cursed sword ench 5: 100 + 50 + 30 + 10 + 5 = 195", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Quote: policy-wide modifiers ---
  it("should grant the 20% loyalty discount at exactly 2 years -- sword: 100 + 10 - 20 + 5 = 95", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("should scope the curse surcharge to the cursed item's base premium, not the policy total -- cursed sword + plain amulet: 160 + 50 + 16 + 5 = 231", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    });
    expect(results).toEqual([{ premium: 231 }]);
  });
  it("should grant a 15% follow-up discount on the second quote in a scenario -- second sword quote: 100 + 10 - 15 + 5 = 100", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("should stack all modifiers for a long-standing customer's second contract -- 3y, second quote, cursed sword ench 7: 155 + 5 = 160", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });

  // --- Claim: standard reimbursement ---
  it("should reimburse a regular sword fully minus the 100 G deductible -- damage 500: payout 400, remainingCap 1600", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("should reimburse a damaged rune fully minus deductible (no enchantment/material clauses) -- damage 200: payout 100, remainingCap 400", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });
  it("should apply the 100 G deductible once per damaged item -- sword 500 + amulet 300: payout 600, remainingCap 2600", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 1 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });

  // --- Claim: special clauses ---
  it("should reimburse dragon-material sword at 50% when enchantment is exactly 8 -- damage 1000: payout 400", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it.todo("should let the 50% high-enchantment clause win over dragon material -- dragon sword ench 9, damage 1000: payout 400");
  it.todo("should fully reimburse dragon material when only the dragon clause applies -- dragon sword ench 5, damage 800: payout 700, remainingCap 1300");
  it.todo("should halve reimbursement for steel sword with enchantment 9 -- damage 1000: payout 400");
  it.todo("should round payouts down in MHPCO's favor -- steel sword ench 9, damage 501: 150.5 -> payout 150, remainingCap 1850");

  // --- Claim: multiple items of same type, caps ---
  it.todo("should treat two sword damages as separate damages with own deductibles -- two swords, 500 each: payout 800, remainingCap 3200 (sum 2000, cap 4000)");
  it.todo("should exhaust the payout cap over successive claims -- sword, claims of 1500: first 1400/600, second 600/0");
  it.todo("should base the insurance sum on values, not block pricing -- sword + 3 runes: sum 1750, cap 3500; sword damage 500: payout 400, remainingCap 3100");
  it.todo("should base the cap on the unmodified insurance value of a cursed sword -- cap 2000; damage 1500: payout 1400, remainingCap 600");

  // --- CLI integration ---
  it.todo("should process the schema example end-to-end via CLI stdin/stdout -- 5y amulet quote premium 59; claim 200: payout 100, remainingCap 1100");

  // --- CLI error cases ---
  it.todo("should exit non-zero with stderr and no stdout results when a quote contains an unknown item type (broomstick)");
  it.todo("should exit non-zero with stderr when a claim damages an item not part of the policy (amulet damaged, only sword insured)");
  it.todo("should exit non-zero with stderr when a claim damage entry has an unknown item type");
  it.todo("should exit non-zero when damages contain more entries of a type than the policy covers (two sword damages, one sword insured)");
  it.todo("should exit non-zero with stderr when a damage amount is negative (-200)");
});
