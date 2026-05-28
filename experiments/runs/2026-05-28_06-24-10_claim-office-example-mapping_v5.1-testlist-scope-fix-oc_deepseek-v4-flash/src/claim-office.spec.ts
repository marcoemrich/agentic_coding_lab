import { describe, it, expect } from "vitest";
import { quote, processClaim, type Policy, type Incident } from "./claim-office.js";

describe("Claim Office", () => {
  // === Quote: Base Premiums ===
  it("should return 5 G premium for empty item list (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], false)).toBe(5);
  });
  it("should calculate final premium for a single sword -- 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], false)).toBe(115);
  });
  it("should calculate final premium for a single amulet -- 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], false)).toBe(71);
  });
  it("should calculate final premium for a single staff -- 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], false)).toBe(93);
  });
  it("should calculate final premium for a single potion -- 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], false)).toBe(49);
  });

  // === Quote: Components ===
  it("should calculate final premium for 2 runes -- 60 G (50 base + 5 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], false)).toBe(60);
  });
  it("should apply building block discount for 3 runes -- 71 G (60 block + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], false)).toBe(71);
  });
  it("should NOT apply block discount for 4 runes -- 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], false)).toBe(115);
  });
  it("should calculate final premium for 7 runes -- 198 G (175 + 17.5 first insurance + 5, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), false)).toBe(198);
  });
  it("should NOT apply block discount for mixed component types (2 runes + 1 moonstone) -- 88 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], false)).toBe(88);
  });
  it("should apply two separate block discounts for 3 runes + 3 moonstones -- 137 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }], false)).toBe(137);
  });

  // === Quote: Premium Modifiers (item-specific) ===
  it("should add 50% curse surcharge for a cursed sword -- 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], false)).toBe(165);
  });
  it("should add 30% high-enchantment surcharge for enchantment level 5 -- 145 G (100 + 30 high-ench + 10 first ins + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], false)).toBe(145);
  });
  it("should add 30% high-enchantment surcharge for enchantment level 7 -- 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 7 }], false)).toBe(145);
  });
  it("should NOT add high-enchantment surcharge for enchantment level 4 -- 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], false)).toBe(115);
  });
  it("should apply both curse and high-enchantment surcharges when both apply -- 195 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 7 }], false)).toBe(195);
  });

  // === Quote: Premium Modifiers (policy-wide) ===
  it("should apply 20% loyalty discount for customer with 2+ years -- 95 G (100 + 10 first - 20 loyalty + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], false)).toBe(95);
  });
  it("should apply 15% follow-up contract discount -- 100 G (100 + 10 first - 15 follow-up + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], true)).toBe(100);
  });

  // === Quote: Modifier Scope ===
  it("should apply curse surcharge only to cursed item's base premium, not policy total -- cursed sword + plain amulet = 231 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }], false)).toBe(231);
  });

  // === Quote: Unknown item type ===
  it("should throw for unknown item type in quote", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], false)).toThrow();
  });

  // === Claim: Standard reimbursement ===
  it("should reimburse damage minus 100 G deductible for standard item -- sword steel enchantment 3, damage 500 G = payout 400 G", () => {
    const policy: Policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }], remainingCap: 2000 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("should reimburse damage minus 100 G deductible for a rune -- damage 200 G = payout 100 G", () => {
    const policy: Policy = { items: [{ type: "rune" }], remainingCap: 500 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  // === Claim: Deductible per damage event ===
  it("should apply deductible per damaged item -- dragon attack damages sword 500 G + amulet 300 G = payout 600 G", () => {
    const policy: Policy = { items: [{ type: "sword" }, { type: "amulet" }], remainingCap: 2000 };
    const result = processClaim(policy, { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(1400);
  });

  // === Claim: High enchantment (>= 8) ===
  it("should reimburse 50% of damage for items with enchantment level >= 8 -- damage 1000, enchantment 8 = payout 400", () => {
    const policy: Policy = { items: [{ type: "sword", enchantment: 8 }], remainingCap: 2000 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("should apply high-enchantment 50% rule over dragon material -- dragon sword enchantment 9, damage 1000 G = payout 400 G", () => {
    const policy: Policy = { items: [{ type: "sword", material: "dragon", enchantment: 9 }], remainingCap: 2000 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // === Claim: Dragon material ===
  it("should fully reimburse damage for dragon-material items before deductible -- dragon sword enchantment 5, damage 800 G = payout 700 G", () => {
    const policy: Policy = { items: [{ type: "sword", material: "dragon", enchantment: 5 }], remainingCap: 2000 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });

  // === Claim: Enchantment 8 threshold combined ===
  it("should apply 50% rule for enchantment 8 exactly on dragon item -- damage 1000 G = payout 400 G", () => {
    const policy: Policy = { items: [{ type: "sword", material: "dragon", enchantment: 8 }], remainingCap: 2000 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("should apply only high-enchantment clause for steel sword enchantment 9 -- damage 1000 G = payout 400 G", () => {
    const policy: Policy = { items: [{ type: "sword", material: "steel", enchantment: 9 }], remainingCap: 2000 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // === Claim: Cap ===
  it("should track remaining cap across claims -- first claim 1400 G, second claim 600 G", () => {
    const policy: Policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    const r1 = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });

  // === Claim: Multiple items of same type ===
  it("should treat two swords as separate items with separate deductibles -- each 500 damage => payout 800 total", () => {
    const policy: Policy = { items: [{ type: "sword" }, { type: "sword" }], remainingCap: 4000 };
    const result = processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(800);
  });
  it("should reject claim when damages exceed policy coverage for a given type", () => {
    const policy: Policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    expect(() => processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] })).toThrow();
  });

  // === Claim: Unknown item in damage ===
  it("should exit with error when damage references item not in policy", () => {
    const policy: Policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    expect(() => processClaim(policy, { cause: "attack", damages: [{ itemType: "amulet", amount: 200 }] })).toThrow();
  });
  it("should exit with error for unknown item type in claim", () => {
    const policy: Policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    expect(() => processClaim(policy, { cause: "attack", damages: [{ itemType: "broomstick", amount: 200 }] })).toThrow();
  });
  it("should exit with error for negative damage amount", () => {
    const policy: Policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    expect(() => processClaim(policy, { cause: "attack", damages: [{ itemType: "sword", amount: -200 }] })).toThrow();
  });

  // === Integration: Newcomer with cursed sword ===
  it("should calculate premium for newcomer with cursed sword -- 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], false)).toBe(165);
  });

  // === Integration: Long-standing customer's second contract ===
  it("should calculate premium for long-standing customer second contract with cursed high-enchantment sword -- 160 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", cursed: true, enchantment: 7 }], true)).toBe(160);
  });
});
