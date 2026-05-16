import { describe, it, expect } from "vitest";
import { computePremium, totalInsuranceSum } from "./pricing.js";

describe("computePremium", () => {
  it("plain sword for new customer (first contract)", () => {
    // base = 100; first contract +10% = 110; +5 fee = 115
    const premium = computePremium(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractIndex: 0 },
    );
    expect(premium).toBe(115);
  });

  it("amulet for loyal customer (5 years, first contract)", () => {
    // base = 60; loyalty -20% + first +10% => mult 0.9; 54; +5 = 59
    const premium = computePremium(
      [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
      { customer: { yearsWithMHPCO: 5 }, contractIndex: 0 },
    );
    expect(premium).toBe(59);
  });

  it("cursed item adds 50%", () => {
    // sword base 100, cursed *1.5 = 150; first contract +10% mult 1.1 => 165; +5 = 170
    const premium = computePremium(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      { customer: { yearsWithMHPCO: 0 }, contractIndex: 0 },
    );
    expect(premium).toBe(170);
  });

  it("highly enchanted item adds 30%", () => {
    // staff base 80, enchant>=5 *1.3 = 104; first contract 1.1 => 114.4; +5 = 119.4 -> 120
    const premium = computePremium(
      [{ type: "staff", material: "oak", enchantment: 5, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractIndex: 0 },
    );
    expect(premium).toBe(120);
  });

  it("second contract gets 15% discount instead of 10% surcharge", () => {
    // sword base 100; mult 0.85; 85; +5 = 90
    const premium = computePremium(
      [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractIndex: 1 },
    );
    expect(premium).toBe(90);
  });

  it("3 alike components form a bundle at 60 G", () => {
    // 3 runes: bundle base 60; first contract 1.1 => 66; +5 = 71
    const premium = computePremium(
      [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
      { customer: { yearsWithMHPCO: 0 }, contractIndex: 0 },
    );
    expect(premium).toBe(71);
  });

  it("4 alike components: 3 bundle + 1 single", () => {
    // bundle 60 + single 25 = 85; *1.1 = 93.5; +5 = 98.5 -> 99
    const premium = computePremium(
      [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ],
      { customer: { yearsWithMHPCO: 0 }, contractIndex: 0 },
    );
    expect(premium).toBe(99);
  });

  it("rounds up in favor of MHPCO", () => {
    // amulet 60 *1.1 = 66 +5 = 71 — already int, test fractional case
    // potion base 40, *1.1 = 44; +5 = 49 (still int)
    // amulet 60 *0.85 = 51; +5 = 56 (int) — try loyalty + first => 0.9: 54+5=59
    // try amulet with first contract loyal: 60*0.9 = 54 +5 = 59 (int)
    // forces ceil: amulet *1.1 *? Let's verify via a known fractional.
    // amulet base 60; enchant>=5: 60*1.3 = 78; first 1.1: 85.8; +5 = 90.8 -> 91
    const premium = computePremium(
      [{ type: "amulet", material: "silver", enchantment: 5, cursed: false }],
      { customer: { yearsWithMHPCO: 0 }, contractIndex: 0 },
    );
    expect(premium).toBe(91);
  });

  it("totalInsuranceSum computes correctly", () => {
    const sum = totalInsuranceSum([
      { type: "sword" }, // 1000
      { type: "amulet" }, // 600
      { type: "rune" }, // 250
    ]);
    expect(sum).toBe(1850);
  });
});
