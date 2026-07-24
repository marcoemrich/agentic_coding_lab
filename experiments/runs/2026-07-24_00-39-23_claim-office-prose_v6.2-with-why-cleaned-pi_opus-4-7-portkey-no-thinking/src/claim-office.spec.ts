import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office - Quoting", () => {
  it("quotes a single sword for a new customer: base 100 + 10% first-time + 5 fee = 115", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a single amulet for a new customer: base 60 + 10% + 5 = 71", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a single staff for a new customer: base 80 + 10% + 5 = 93", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a single potion for a new customer: base 40 + 10% + 5 = 49", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes a single rune (component) for a new customer: base 25 + 10% -> ceil 28 + 5 = 33", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a block of 3 alike components at special base 60: 60 + 10% + 5 = 71", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a cursed sword: 100 * 1.5 * 1.1 + 5 = 170", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out).toEqual({ results: [{ premium: 170 }] });
  });
  it("quotes a highly enchanted sword (enchant=5): 100 * 1.3 * 1.1 + 5 = 148", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 148 }] });
  });
  it("applies loyalty discount (yearsWithMHPCO >= 2) on first contract: 100 * 0.8 * 1.1 + 5 = 93", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies -15% discount to a customer's second contract instead of +10% first-time: sword => 100 * 0.85 + 5 = 90", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 90 });
  });
  it("quotes multiple items in one contract (sword + amulet, new customer): 160 * 1.1 + 5 = 181", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 181 }] });
  });
  it("combines all modifiers: cursed highly-enchanted sword for loyal new customer: ceil(100 * 1.5 * 1.3 * 0.8 * 1.1) + 5 = 177", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 177 }] });
  });
  it("rounds premium up (in MHPCO favor) to whole G: amulet loyal customer 60*0.8*1.1=52.8 -> 53 +5 = 58", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 58 }] });
  });
});

describe("MHPCO Claim Office - Claims", () => {
  it("pays 0 on a claim against an item that is neither dragon nor enchant>=8 (silver amulet enchant 2)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
  });
  it("reimburses dragon-material items fully minus 100 G deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses enchant>=8 items at 50% minus 100 G deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "staff", amount: 600 }] } },
      ],
    });
    // 600 * 0.5 = 300, - 100 deductible = 200; cap = 1600 - 200 = 1400
    expect(out.results[1]).toEqual({ payout: 200, remainingCap: 1400 });
  });
  it("caps total payout at 2x insurance sum across multiple claims (remainingCap tracked)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    // cap = 2000. claim1: 1500-100 = 1400 payout. remainingCap = 600.
    // claim2: 1000-100 = 900 net, capped to 600. remainingCap = 0.
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("applies deductible once per damage event even if multiple damage lines", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon" }, { type: "staff", material: "dragon" }] },
        { op: "claim", policy: 0, incident: { cause: "quake", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "staff", amount: 300 },
        ] } },
      ],
    });
    // sum = 500, deductible once = 400 payout. cap = 2*(1000+800)=3600 -> 3200 remaining.
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 3200 });
  });
  it("rounds payout in MHPCO favor (floor): enchant>=8 staff, 501 damage -> 50% -> 250 (floor) - 100 = 150", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "staff", amount: 501 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 150, remainingCap: 1450 });
  });
});

describe("MHPCO Claim Office - Scenario integration", () => {
  it("processes schema example 2: loyal customer amulet quote followed by two claims -> payouts 0, 0", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        { op: "claim", policy: 0, incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] } },
      ],
    });
    // premium: 60 * 0.8 * 1.1 = 52.8 -> 53 + 5 = 58
    // claims: amulet is neither dragon nor high-enchant, so 0 payout each; cap unchanged
    expect(out.results[0]).toEqual({ premium: 58 });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
    expect(out.results[2]).toEqual({ payout: 0, remainingCap: 1200 });
  });
});
