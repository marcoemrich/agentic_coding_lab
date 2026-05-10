import { describe, it, expect } from "vitest";
import { generateQuote, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office - Quote", () => {
  it("should return base premium for a single sword", () => {
    const items = [{ type: "sword" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(110);
  });
  it("should return base premium for a single amulet", () => {
    const items = [{ type: "amulet" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(66);
  });
  it("should return base premium for a single staff", () => {
    const items = [{ type: "staff" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(88);
  });
  it("should return base premium for a single potion", () => {
    const items = [{ type: "potion" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(44);
  });
  it("should return base premium for a single component", () => {
    const items = [{ type: "rune" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(27.5);
  });
  it("should return sum of base premiums for two different items", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(176);
  });
  it("should apply block discount when 3 alike components are insured", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(66);
  });
  it("should apply cursed item surcharge of 50% on the item base premium", () => {
    const items = [{ type: "sword", cursed: true }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(165);
  });
  it("should apply highly enchanted surcharge of 30% when enchantment >= 5", () => {
    const items = [{ type: "sword", enchantment: 5 }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(143);
  });
  it("should apply loyalty discount of 20% for customer with >= 2 years", () => {
    const items = [{ type: "sword" }];
    const customer = { yearsWithMHPCO: 2, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(88);
  });
  it("should apply first insurance surcharge of 10% on policy base premium", () => {
    const items = [{ type: "sword" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(generateQuote(items, customer).basePremium).toBe(110);
  });
  it("should apply follow-up contract discount of 15% on policy base premium", () => {
    const items = [{ type: "sword" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 1 };
    expect(generateQuote(items, customer).basePremium).toBe(93.5);
  });
  it("should add processing fee of 5 G at the end", () => {
    const items = [{ type: "sword" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const quote = generateQuote(items, customer);
    expect(quote.basePremium).toBe(110);
    expect(quote.premium).toBe(115);
  });
  it("should apply ceiling rounding to premium", () => {
    // follow-up contract: basePremium = 100 * 1.1 * 0.85 = 93.5, premium before rounding = 93.5 + 5 = 98.5
    // ceiling rounding of 98.5 → 99
    const items = [{ type: "sword" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 1 };
    const quote = generateQuote(items, customer);
    expect(quote.basePremium).toBe(93.5);
    expect(quote.premium).toBe(99);
  });
});

describe("MHPCO Claim Office - Claim", () => {
  it("should return payout equal to damage minus deductible for a basic item", () => {
    const items = [{ type: "sword", enchantment: 3 }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const policy = generateQuote(items, customer);
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });
  it("should return zero payout when damage is less than or equal to deductible", () => {
    const items = [{ type: "sword", enchantment: 3 }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const policy = generateQuote(items, customer);
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 50 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(0);
  });
  it("should apply 50% payout rule when item enchantment >= 8", () => {
    const items = [{ type: "sword", enchantment: 9 }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const policy = generateQuote(items, customer);
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });
  it("should apply full reimbursement for dragon material item", () => {
    const policy = generateQuote(
      [{ type: "sword", enchantment: 5, material: "dragon" }],
      { yearsWithMHPCO: 0, contractCount: 0 },
    );
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(700);
  });
  it("should use 50% rule when both dragon material and enchantment >= 8 apply", () => {
    const policy = generateQuote(
      [{ type: "sword", enchantment: 9, material: "dragon" }],
      { yearsWithMHPCO: 0, contractCount: 0 },
    );
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });
  it("should reduce remaining cap with each claim payout", () => {
    // sword: insuranceSum = 1000G, cap = 2 * 1000 = 2000G
    // damage = 1500G, payout = 1500 - 100 (deductible) = 1400G
    // remainingCap after claim = 2000 - 1400 = 600G
    const policy = generateQuote([{ type: "sword" }], { yearsWithMHPCO: 0, contractCount: 0 });
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("should cap total payout at 2x total insurance sum", () => {
    // sword: insuranceSum = 1000G, cap = 2 * 1000 = 2000G
    // first claim: damage 1500G, payout = 1400G, remainingCap = 600G
    // second claim: damage 1500G, but remainingCap = 600G, so payout = 600G (capped)
    const policy = generateQuote([{ type: "sword" }], { yearsWithMHPCO: 0, contractCount: 0 });
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] };
    const firstResult = processClaim(policy, incident);
    expect(firstResult.payout).toBe(1400);
    expect(firstResult.remainingCap).toBe(600);
    const updatedPolicy = { ...policy, remainingCap: firstResult.remainingCap };
    const secondResult = processClaim(updatedPolicy, incident);
    expect(secondResult.payout).toBe(600);
    expect(secondResult.remainingCap).toBe(0);
  });
  it("should apply floor rounding to payout", () => {
    // sword with enchantment 9: 50% rule applies
    // damage = 901, effectiveDamage = 901 * 0.5 = 450.5
    // payoutBeforeCap = 450.5 - 100 (deductible) = 350.5
    // floor rounding: payout = 350
    const policy = generateQuote(
      [{ type: "sword", enchantment: 9 }],
      { yearsWithMHPCO: 0, contractCount: 0 },
    );
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO Claim Office - Error Conditions", () => {
  it("should reject quote with unknown item type", () => {
    const items = [{ type: "broomstick" }];
    const customer = { yearsWithMHPCO: 0, contractCount: 0 };
    expect(() => generateQuote(items, customer)).toThrow();
  });
  it("should reject claim for item not in policy", () => {
    const policy = generateQuote([{ type: "sword" }], { yearsWithMHPCO: 0, contractCount: 0 });
    const incident = { cause: "dragon", damages: [{ itemType: "amulet", amount: 500 }] };
    expect(() => processClaim(policy, incident)).toThrow();
  });
  it("should reject claim with negative damage amount", () => {
    const policy = generateQuote([{ type: "sword" }], { yearsWithMHPCO: 0, contractCount: 0 });
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => processClaim(policy, incident)).toThrow();
  });
  it("should reject entire claim when damage entries exceed insured count for that type", () => {
    const policy = generateQuote([{ type: "sword" }], { yearsWithMHPCO: 0, contractCount: 0 });
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] };
    expect(() => processClaim(policy, incident)).toThrow();
  });
});
