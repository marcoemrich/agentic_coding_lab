import { describe, it, expect } from "vitest";
import { quotePolicy, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office - Quote Policy", () => {
  it("should calculate premium for single sword without modifiers", () => {
    const items = [{ type: "sword", baseCost: 100 }];
    expect(quotePolicy(items)).toBe(100);
  });
  it("should calculate premium for single amulet without modifiers", () => {
    const items = [{ type: "amulet", baseCost: 150 }];
    expect(quotePolicy(items)).toBe(150);
  });
  it("should calculate premium for single staff without modifiers", () => {
    const items = [{ type: "staff", baseCost: 200 }];
    expect(quotePolicy(items)).toBe(200);
  });
  it("should calculate premium for multiple different items", () => {
    const items = [
      { type: "sword", baseCost: 100 },
      { type: "amulet", baseCost: 150 },
      { type: "staff", baseCost: 200 }
    ];
    expect(quotePolicy(items)).toBe(450);
  });
  it("should apply cursed item surcharge", () => {
    const items = [{ type: "sword", baseCost: 100, cursed: true }];
    expect(quotePolicy(items)).toBe(110);
  });
  it("should apply high enchantment surcharge for enchantment level >= 5", () => {
    const items = [{ type: "sword", baseCost: 100, enchantment: 5 }];
    expect(quotePolicy(items)).toBe(120);
  });
  it("should apply loyalty discount for loyalty >= 2 years", () => {
    const items = [{ type: "sword", baseCost: 100 }];
    expect(quotePolicy(items, { years: 2 })).toBe(90);
  });
  it("should apply first insurance surcharge", () => {
    const items = [{ type: "sword", baseCost: 100 }];
    expect(quotePolicy(items)).toBe(111);
  });
  it("should apply follow-up contract discount", () => {
    const items = [{ type: "sword", baseCost: 100 }];
    expect(quotePolicy(items, { followUp: true })).toBe(95);
  });
  it("should add processing fee of 5G", () => {
    const items = [{ type: "sword", baseCost: 100 }];
    expect(quotePolicy(items)).toBe(116);
  });
  it("should round premiums up in MHPCO's favor", () => {
    const items = [{ type: "sword", baseCost: 100.5 }];
    expect(quotePolicy(items)).toBe(117);
  });
  it("should bundle 3 components into block at discounted rate", () => {
    const items = [
      { type: "sword", baseCost: 100 },
      { type: "amulet", baseCost: 150 },
      { type: "staff", baseCost: 200 }
    ];
    expect(quotePolicy(items)).toBe(385.05);
  });
  it("should apply multiple modifiers together", () => {
    const items = [{ type: "sword", baseCost: 100, cursed: true, enchantment: 5 }];
    expect(quotePolicy(items)).toBe(180);
  });
  it("should enforce policy cap at 2x total item value", () => {
    const items = [{ type: "sword", baseCost: 100 }];
    expect(quotePolicy(items)).toBe(200);
  });
  it("should throw error for unknown item type", () => {
    const items = [{ type: "unknown", baseCost: 100 }];
    expect(() => quotePolicy(items)).toThrow();
  });
});

describe("MHPCO Claim Office - Process Claim", () => {
  it("should deduct 100G per damage event", () => {
    const policy = [{ type: "sword", baseCost: 100 }];
    const claims = [{ itemIndex: 0, damageAmount: 50 }];
    expect(processClaim(policy, claims)).toBe(50);
  });
  it("should process reimbursement for standard item damage", () => {
    const policy = [{ type: "sword", baseCost: 100 }];
    const claims = [{ itemIndex: 0, damageAmount: 50 }];
    expect(processClaim(policy, claims)).toBe(0);
  });
  it("should apply 50% reimbursement for high enchantment >= 8", () => {
    const policy = [{ type: "sword", baseCost: 100, enchantment: 8 }];
    const claims = [{ itemIndex: 0, damageAmount: 50 }];
    expect(processClaim(policy, claims)).toBe(25);
  });
  it("should apply 100% reimbursement for dragon material items", () => {
    const policy = [{ type: "sword", baseCost: 100, dragonMaterial: true }];
    const claims = [{ itemIndex: 0, damageAmount: 50 }];
    expect(processClaim(policy, claims)).toBe(50);
  });
  it("should cap reimbursement at policy maximum", () => {
    const policy = [{ type: "sword", baseCost: 100, dragonMaterial: true }];
    const claims = [{ itemIndex: 0, damageAmount: 300 }];
    expect(processClaim(policy, claims)).toBe(200);
  });
  it("should process multiple damage events in single claim", () => {
    const policy = [
      { type: "sword", baseCost: 100, dragonMaterial: true },
      { type: "amulet", baseCost: 150, dragonMaterial: true }
    ];
    const claims = [
      { itemIndex: 0, damageAmount: 30 },
      { itemIndex: 1, damageAmount: 40 }
    ];
    expect(processClaim(policy, claims)).toBe(50);
  });
  it("should throw error for negative damage amount", () => {
    const policy = [{ type: "sword", baseCost: 100 }];
    const claims = [{ itemIndex: 0, damageAmount: -50 }];
    expect(() => processClaim(policy, claims)).toThrow();
  });
  it("should throw error for damage entry without matching policy item", () => {
    const policy = [{ type: "sword", baseCost: 100 }];
    const claims = [{ itemIndex: 5, damageAmount: 50 }];
    expect(() => processClaim(policy, claims)).toThrow();
  });
});
