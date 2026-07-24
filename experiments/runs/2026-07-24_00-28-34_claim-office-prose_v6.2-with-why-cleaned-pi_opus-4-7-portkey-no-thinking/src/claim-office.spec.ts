import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office - quoting", () => {
  it("quotes an empty item list at just the 5 G processing fee -- premium 5", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(out.results[0]).toEqual({ premium: 5 });
  });
  it("quotes a single sword, first insurance, 0 years -- premium 115 (100*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("quotes a single amulet -- premium 71 (60*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("quotes a single staff -- premium 93 (80*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] });
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("quotes a single potion -- premium 49 (40*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] });
    expect(out.results[0]).toEqual({ premium: 49 });
  });
  it("quotes a single rune component -- premium 33 (ceil(25*1.10+5))", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }] }] });
    expect(out.results[0]).toEqual({ premium: 33 });
  });
  it("quotes three runes as a building block -- premium 71 (60*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("quotes a cursed sword with +50% surcharge -- premium 170 (100*1.5*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }] });
    expect(out.results[0]).toEqual({ premium: 170 });
  });
  it("quotes a highly enchanted sword (enchantment 5) with +30% -- premium 148 (100*1.3*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }] });
    expect(out.results[0]).toEqual({ premium: 148 });
  });
  it("quotes a cursed and highly enchanted sword (both surcharges) -- premium 203 (100*1.8*1.10+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }] });
    expect(out.results[0]).toEqual({ premium: 203 });
  });
  it("applies 20% loyalty discount when yearsWithMHPCO >= 2 -- sword premium 93 (100*1.10*0.80+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] });
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("applies 15% discount on the second contract of the same customer -- second sword premium 90 (100*0.85+5)", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items: [{ type: "sword" }] },
    ] });
    expect(out.results[1]).toEqual({ premium: 90 });
  });
});

describe("MHPCO Claim Office - claims", () => {
  it("pays out a normal-item claim minus 100 G deductible -- amulet damage 200 => payout 100", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("reimburses only 50% for items with enchantment >= 8", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // damage 500 * 50% = 250, then -100 deductible => 150
    expect(out.results[1].payout).toBe(150);
  });
  it("fully reimburses damage to dragon-material items", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    // dragon material => full reimbursement; still -100 deductible => 400
    expect(out.results[1].payout).toBe(400);
  });
  it("caps total policy payouts at twice the insurance sum -- remainingCap tracked", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "catastrophe", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("tracks remainingCap across successive claims on the same policy", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        { op: "claim", policy: 0, incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] } },
      ],
    });
    // amulet insured 600, cap 1200
    // claim1: 200 - 100 = 100 payout, remaining 1100
    // claim2: 250 - 100 = 150 payout, remaining 950
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    expect(out.results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });
});
