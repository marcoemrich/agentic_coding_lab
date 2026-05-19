import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("Claim Office - Quote", () => {
  it("should return 5 G for an empty item list (processing fee only)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items: never[] = [];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(5);
  });
  it("should return base premium plus processing fee for a single sword", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(115);
  });
  it("should return base premium plus processing fee for a single potion", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(49);
  });
  it("should return sum of base premiums plus processing fee for multiple items", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(181);
  });
  it("should apply +50% cursed surcharge on the cursed item's base premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(165);
  });
  it("should apply +30% surcharge for highly enchanted item (enchantment >= 5)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(145);
  });
  it("should apply both cursed and high enchantment surcharges on the same item", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: true }];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(195);
  });
  it("should apply -20% loyalty discount on policy base premium for customer >= 2 years", () => {
    const customer = { yearsWithMHPCO: 2 };
    const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(95);
  });
  it("should apply +10% first insurance surcharge on policy base premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "staff", material: "wood", enchantment: 0, cursed: false }];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(93);
  });
  it("should apply -15% follow-up contract discount on policy base premium", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
    const contractIndex = 1;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(100);
  });
  it("should apply multiple policy-wide modifiers in correct order", () => {
    const customer = { yearsWithMHPCO: 3 };
    const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
    const contractIndex = 1;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(160);
  });
  it("should round up the final premium in MHPCO's favor", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [{ type: "rune", material: "stone", enchantment: 0, cursed: false }];
    const contractIndex = 1;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(29);
  });
  it("should return 25 G base premium per component (rune or moonstone)", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
    ];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(60);
  });
  it("should return 60 G for a block of exactly 3 alike components", () => {
    const customer = { yearsWithMHPCO: 0 };
    const items = [
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
      { type: "rune", material: "stone", enchantment: 0, cursed: false },
    ];
    const contractIndex = 0;
    const premium = quote(customer, items, contractIndex);
    expect(premium).toBe(71);
  });
});

describe("Claim Office - Claim", () => {
  it("should reimburse full damage minus 100 G deductible for a standard item", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: 500 }];
    const result = claim(policyItems, damages);
    expect(result.payout).toBe(400);
  });
  it("should apply 100 G deductible per each damaged item", () => {
    const policyItems = [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    const result = claim(policyItems, damages);
    expect(result.payout).toBe(600);
  });
  it("should cap total payout at 2x the insurance sum of the policy", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
    const damages = [{ itemType: "sword", amount: 2500 }];
    const result = claim(policyItems, damages);
    expect(result.payout).toBe(2000);
    expect(result.remainingCap).toBe(0);
  });
  it("should reimburse at 50% for items with enchantment >= 8", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    const result = claim(policyItems, damages);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("should fully reimburse dragon material items", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }];
    const damages = [{ itemType: "sword", amount: 800 }];
    const result = claim(policyItems, damages);
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });
  it("should apply 50% rule when item has both enchantment >= 8 and dragon material", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    const result = claim(policyItems, damages);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("should round down the payout in MHPCO's favor", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 501 }];
    const result = claim(policyItems, damages);
    expect(result.payout).toBe(150);
    expect(result.remainingCap).toBe(1850);
  });
});
