import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base functionality
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote for single sword yields 105 G (100 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("quote for single amulet yields 65 G (60 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("quote for single staff yields 85 G (80 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("quote for single potion yields 45 G (40 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 45 }] });
  });
  it("quote for two runes yields 55 G (2*25 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 55 }] });
  });
  it("quote for three runes (block) yields 65 G (60 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("quote for four runes yields 105 G (100 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("quote for 2 runes + 1 moonstone yields 80 G (75 + 5 fee, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 80 }] });
  });
  it("quote for 3 runes + 3 moonstones yields 125 G (120 + 5 fee, two blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 125 }] });
  });

  // Quote: modifiers
  it.todo("cursed sword adds 50% surcharge to that item's base premium");
  it.todo("highly enchanted (>=5) sword adds 30% surcharge");
  it.todo("loyalty discount (>=2 years) applies 20% to policy total");
  it.todo("first insurance surcharge adds 10% per item");
  it.todo("follow-up contract gives 15% discount on policy total");
  it.todo("rounds premium up in MHPCO's favor");

  // Integration examples
  it.todo("newcomer with cursed sword yields 165 G");
  it.todo("long-standing customer's second contract with cursed enchanted sword yields 160 G");
  it.todo("policy with cursed sword and plain amulet computes correctly");

  // Claim: base functionality
  it.todo("claim with damage on regular sword pays out damage minus 100 G deductible");
  it.todo("claim for damage to rune (no enchantment/material) pays out full minus deductible");
  it.todo("highly enchanted item (>=8) reimbursed at 50%, then deductible");
  it.todo("dragon material item fully reimbursed, then deductible");
  it.todo("dragon material + high enchantment: 50% rule wins");
  it.todo("dragon material sword with enchantment 5: full reimbursement");
  it.todo("deductible applies once per damaged item");
  it.todo("cap is 2x insurance sum; successive claims deplete cap");
  it.todo("policy with two swords allows two separate damages with separate deductibles");
  it.todo("rounds payout down in MHPCO's favor");

  // Error handling
  it.todo("unknown item type in quote exits with non-zero status");
  it.todo("damage entry for item not in policy rejects claim");
  it.todo("negative damage amount rejects claim");
  it.todo("more damage entries of a type than insured items rejects claim");
});
