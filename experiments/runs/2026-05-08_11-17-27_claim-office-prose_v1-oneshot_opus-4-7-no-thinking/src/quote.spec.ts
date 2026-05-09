import { describe, expect, it } from "vitest";
import { buildPolicy, computePremium, roundFavor } from "./quote.js";
import type { Item } from "./types.js";

describe("roundFavor", () => {
  it("rounds up to the next whole G", () => {
    expect(roundFavor(57.8)).toBe(58);
    expect(roundFavor(100)).toBe(100);
    expect(roundFavor(99.001)).toBe(100);
  });
});

describe("computePremium", () => {
  it("schema example 1: sword, no loyalty, first insurance", () => {
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 0,
    });
    // 100 base * 1.1 (first) + 5 fee = 115
    expect(premium).toBe(115);
  });

  it("schema example 2: amulet, loyal customer, first contract", () => {
    const items: Item[] = [
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 5 },
      priorContracts: 0,
    });
    // 60 * 0.8 (loyalty) * 1.1 (first) + 5 = 52.8 + 5 = 57.8 → ceil 58
    expect(premium).toBe(58);
  });

  it("applies cursed surcharge", () => {
    const items: Item[] = [
      { type: "potion", material: "glass", enchantment: 0, cursed: true },
    ];
    // 40 * 1.5 = 60; first contract: *1.1 = 66; +5 = 71
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 0,
    });
    expect(premium).toBe(71);
  });

  it("applies high-enchantment surcharge", () => {
    const items: Item[] = [
      { type: "staff", material: "oak", enchantment: 7, cursed: false },
    ];
    // 80 * 1.3 = 104; *1.1 first = 114.4; +5 = 119.4 → ceil 120
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 0,
    });
    expect(premium).toBe(120);
  });

  it("stacks cursed and high-enchantment surcharges additively", () => {
    const items: Item[] = [
      { type: "sword", material: "iron", enchantment: 6, cursed: true },
    ];
    // 100 * (1 + 0.5 + 0.3) = 180; *1.1 = 198; +5 = 203
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 0,
    });
    expect(premium).toBe(203);
  });

  it("applies repeat-contract discount when not first", () => {
    const items: Item[] = [{ type: "sword", enchantment: 0, cursed: false }];
    // 100 * 0.85 = 85; +5 = 90
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 1,
    });
    expect(premium).toBe(90);
  });

  it("bundles three alike components", () => {
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    // bundle of 3 = base 60; *1.1 first = 66; +5 = 71
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 0,
    });
    expect(premium).toBe(71);
  });

  it("does not bundle different component types", () => {
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ];
    // 3 individual = 75; *1.1 = 82.5; +5 = 87.5 → ceil 88
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 0,
    });
    expect(premium).toBe(88);
  });

  it("bundles four alike components as one bundle plus one leftover", () => {
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    // 60 (bundle of 3) + 25 (leftover) = 85; *1.1 = 93.5; +5 = 98.5 → ceil 99
    const premium = computePremium(items, {
      customer: { yearsWithMHPCO: 0 },
      priorContracts: 0,
    });
    expect(premium).toBe(99);
  });
});

describe("buildPolicy", () => {
  it("computes insurance sum and cap", () => {
    const items: Item[] = [
      { type: "sword", enchantment: 0, cursed: false },
      { type: "rune" },
    ];
    const policy = buildPolicy(items);
    expect(policy.insuranceSum).toBe(1250);
    expect(policy.remainingCap).toBe(2500);
  });
});
