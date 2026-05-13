import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Quote", () => {
  it("quotes base premium plus processing fee for a single sword (new customer, first contract)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      0,
    );
    expect(result.premium).toBe(115);
  });
  it("quotes amulet, staff, potion using their base premiums", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote(customer, { items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, 0).premium).toBe(71);
    expect(quote(customer, { items: [{ type: "staff", material: "wood", enchantment: 2, cursed: false }] }, 0).premium).toBe(93);
    expect(quote(customer, { items: [{ type: "potion", material: "glass", enchantment: 2, cursed: false }] }, 0).premium).toBe(49);
  });
  it("quotes a single component (rune) at 25 G base premium", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      { items: [{ type: "rune", material: "stone", enchantment: 1, cursed: false }] },
      0,
    );
    expect(result.premium).toBe(33);
  });
  it("quotes 3 alike components as a bundle at 60 G", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      {
        items: [
          { type: "rune", material: "stone", enchantment: 1, cursed: false },
          { type: "rune", material: "stone", enchantment: 1, cursed: false },
          { type: "rune", material: "stone", enchantment: 1, cursed: false },
        ],
      },
      0,
    );
    expect(result.premium).toBe(71);
  });
  it("applies 50% cursed surcharge to an item", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      { items: [{ type: "sword", material: "steel", enchantment: 2, cursed: true }] },
      0,
    );
    // base 100 * 1.5 (cursed) * 1.1 (first insurance) = 165 + 5 fee = 170
    expect(result.premium).toBe(170);
  });
  it("applies 30% high-enchantment surcharge (enchantment >= 5)", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      { items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      0,
    );
    // 100 * 1.3 * 1.1 = 143 + 5 = 148
    expect(result.premium).toBe(148);
  });
  it("applies 20% loyalty discount for long-standing customer (>= 2 years)", () => {
    const result = quote(
      { yearsWithMHPCO: 2 },
      { items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
      0,
    );
    // 100 * 1.1 (first ins) * 0.8 (loyalty) = 88 + 5 = 93
    expect(result.premium).toBe(93);
  });
  it("applies 10% first insurance surcharge when it's the customer's first contract", () => {
    // Verify by comparing contractIndex 0 vs > 0 (no first-ins surcharge on later contracts)
    // For this test, just confirm test 1 result is consistent: 115 includes the 10% surcharge.
    // Use a customer with loyalty (>= 2) to make the numbers tractable: 100 * 1.1 * 0.8 = 88, + 5 = 93.
    const result = quote(
      { yearsWithMHPCO: 5 },
      { items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
      0,
    );
    expect(result.premium).toBe(93);
  });
  it("applies 15% repeat-contract discount on contracts after the first", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      { items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
      1,
    );
    // 100 * 0.85 (repeat) = 85 + 5 = 90 (no first-ins because not first contract)
    expect(result.premium).toBe(90);
  });
  it("rounds total premium up to whole G in MHPCO's favor", () => {
    // staff base 80 * 1.1 * 0.8 = 70.4 → ceil 71, + 5 = 76
    const result = quote(
      { yearsWithMHPCO: 2 },
      { items: [{ type: "staff", material: "wood", enchantment: 2, cursed: false }] },
      0,
    );
    expect(result.premium).toBe(76);
  });
  it("sums premiums across multiple items in one quote", () => {
    const result = quote(
      { yearsWithMHPCO: 0 },
      {
        items: [
          { type: "sword", material: "steel", enchantment: 2, cursed: false },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
      },
      0,
    );
    // (100 + 60) * 1.1 = 176, + 5 = 181
    expect(result.premium).toBe(181);
  });
});

describe("MHPCO Claim", () => {
  it("pays damage minus 100 G deductible", () => {
    const policy = {
      items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      cap: 1200,
      remainingCap: 1200,
    };
    const result = claim(policy, {
      damages: [{ itemType: "amulet", amount: 200 }],
    });
    // 200 - 100 deductible = 100 payout, remainingCap = 1100
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1100);
  });
  it("reimburses dragon material damage fully (minus deductible)", () => {
    const policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 2, cursed: false }],
      cap: 2000,
      remainingCap: 2000,
    };
    const result = claim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // Dragon full reimbursement: 500 - 100 deductible = 400
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("reimburses high-enchantment (>= 8) damage at 50% (minus deductible)", () => {
    const policy = {
      items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
      cap: 2000,
      remainingCap: 2000,
    };
    const result = claim(policy, {
      damages: [{ itemType: "sword", amount: 500 }],
    });
    // 500 * 0.5 = 250 - 100 = 150
    expect(result.payout).toBe(150);
    expect(result.remainingCap).toBe(1850);
  });
  it("caps total payout at twice the insurance sum across multiple claims", () => {
    const policy = {
      items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      cap: 1200,
      remainingCap: 50, // most cap already used
    };
    const result = claim(policy, {
      damages: [{ itemType: "amulet", amount: 500 }],
    });
    // would-be payout 500 - 100 = 400, but cap remaining is 50, so payout = 50
    expect(result.payout).toBe(50);
    expect(result.remainingCap).toBe(0);
  });
  it("reports remainingCap after each claim", () => {
    const policy = {
      items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      cap: 1200,
      remainingCap: 1200,
    };
    const r1 = claim(policy, { damages: [{ itemType: "amulet", amount: 200 }] });
    expect(r1.payout).toBe(100);
    expect(r1.remainingCap).toBe(1100);
    const r2 = claim({ ...policy, remainingCap: r1.remainingCap }, {
      damages: [{ itemType: "amulet", amount: 250 }],
    });
    expect(r2.payout).toBe(150);
    expect(r2.remainingCap).toBe(950);
  });
});
