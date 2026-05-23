import { describe, it, expect } from "vitest";
import { quote, claim, createPolicy, type Policy } from "./claim-office.js";

describe("MHPCO Claim Office — quote", () => {
  // Simplest case
  it("empty item list → premium 5 G (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // Base premiums per item type (newcomer, no modifiers beyond first insurance & fee)
  it("single plain sword for newcomer (no prior contracts) → base 100 + 10 first + 5 fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("single plain amulet for newcomer → base 60 + 6 first + 5 fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("single plain staff for newcomer → base 80 + 8 first + 5 fee = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single plain potion for newcomer → base 40 + 4 first + 5 fee = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // Components — base premiums (newcomer; verifying base before block rule)
  it("2 runes → base 50 G (no block; +5 first +5 fee = 60 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes → base 60 G via block (+6 first +5 fee = 71 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(71);
  });
  it("4 runes → base 100 G (no block; block requires exactly 3) → +10 first +5 fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(115);
  });
  it("7 runes → base 175 G (+17.5 first → 192.5 + 5 fee = 198 rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(198);
  });

  // "Alike" components clarification
  it("2 runes + 1 moonstone → base 75 G (no block — different types) → 88 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones → base 120 G (two separate blocks) → 137 G", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(137);
  });

  // Item-specific modifiers
  it("cursed sword for newcomer → 100 + 50 curse + 10 first + 5 fee = 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0)).toBe(165);
  });
  it("sword with enchantment exactly 5 (newcomer) → 100 + 30 high-ench + 10 first + 5 fee = 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("sword with enchantment 4 (newcomer) → no high-ench surcharge → 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 0)).toBe(115);
  });
  it("cursed sword with enchantment 5 (newcomer) → both surcharges apply → 195 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }], 0)).toBe(195);
  });

  // Modifier scope on multi-item policies (clarifying question ❓)
  it("policy: cursed sword + plain amulet → 231 G (210 + 16 first + 5 fee)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }], 0),
    ).toBe(231);
  });

  // Loyalty discount threshold
  it("customer with exactly 2 years + sword → loyalty 20% off policy base → 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("customer with 1 year + sword → no loyalty discount → 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(115);
  });

  // Follow-up contract discount (each contract after the first → 15% off policy base)
  it("second contract (priorContracts=1) for newcomer + sword → 15% follow-up off policy base → 100 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });

  // First insurance per item, regardless of customer history (❓ clarification)
  it("long-standing customer's second contract: cursed sword ench 7 → premium 160 G (spec integration example)", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [{ type: "sword", cursed: true, enchantment: 7 }], 1),
    ).toBe(160);
  });

  // Rounding in MHPCO's favor
  it("premium calculation yielding 197.5 → final premium 198 (rounded up) — covered by 7 runes test", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(198);
  });

  // Errors
  it("unknown item type in quote → throws error", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow();
  });
});

describe("MHPCO Claim Office — claim", () => {
  // Standard reimbursement (no special clauses)
  it("regular steel sword ench 3, damage 500 → payout 400 (500 − 100 deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3 }],
      insuranceSum: 1000,
      cap: 2000,
      remainingCap: 2000,
    };
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment / material), damage 200 → payout 100 (200 − 100 deductible)", () => {
    const policy: Policy = {
      items: [{ type: "rune" }],
      insuranceSum: 250,
      cap: 500,
      remainingCap: 500,
    };
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Enchantment ≥8 clause
  it("steel sword ench 9, damage 1000 → payout 400 (50% then deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9 }],
      insuranceSum: 1000,
      cap: 2000,
      remainingCap: 2000,
    };
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Dragon material clause
  it("dragon-material sword ench 5, damage 800 → payout 700 (full, then deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 5 }],
      insuranceSum: 1000,
      cap: 2000,
      remainingCap: 2000,
    };
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Both clauses — 50% wins, then deductible
  it("dragon-material sword ench 9, damage 1000 → payout 400", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
      insuranceSum: 1000,
      cap: 2000,
      remainingCap: 2000,
    };
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench exactly 8, damage 1000 → payout 400 (high-ench applies, then deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 8 }],
      insuranceSum: 1000,
      cap: 2000,
      remainingCap: 2000,
    };
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  it("dragon attack damaging sword 500 + amulet 300 → payout 600 (deductible per item)", () => {
    const policy: Policy = {
      items: [{ type: "sword" }, { type: "amulet" }],
      insuranceSum: 1600,
      cap: 3200,
      remainingCap: 3200,
    };
    const result = claim(policy, {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Multiple items of same type
  it("policy with two swords; damage to both → each treated as separate damage with own deductible", () => {
    const policy: Policy = {
      items: [{ type: "sword" }, { type: "sword" }],
      insuranceSum: 2000,
      cap: 4000,
      remainingCap: 4000,
    };
    const result = claim(policy, {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    });
    expect(result).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("damages array has more entries of a type than the policy covers → throws error", () => {
    const policy: Policy = {
      items: [{ type: "sword" }],
      insuranceSum: 1000,
      cap: 2000,
      remainingCap: 2000,
    };
    expect(() =>
      claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      }),
    ).toThrow();
  });

  // Cap exhaustion
  it("policy: sword + amulet → insurance sum 1600, cap 3200", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
  });
  it("policy: cursed sword → cap 2000 (based on unmodified insurance value)", () => {
    const policy = createPolicy([{ type: "sword", cursed: true }]);
    expect(policy.cap).toBe(2000);
  });
  it("policy: sword + 3 runes (block) → insurance sum 1750 (block doesn't affect sum)", () => {
    const policy = createPolicy([
      { type: "sword" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ]);
    expect(policy.insuranceSum).toBe(1750);
  });
  it("sword (cap 2000), first claim 1500 → payout 1400, remaining 600; second claim 1500 → payout 600, remaining 0", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const first = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const policyAfter = { ...policy, remainingCap: first.remainingCap };
    const second = claim(policyAfter, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Rounding for payouts
  it("payout calculation yielding 350.5 → final payout 350 (rounded down)", () => {
    const policy = createPolicy([{ type: "sword", enchantment: 9 }]);
    const result = claim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });

  // Errors
  it("claim references damage for an item not in the policy → throws error", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      }),
    ).toThrow();
  });
  it("claim contains damage with negative amount → throws error", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      }),
    ).toThrow();
  });
});
