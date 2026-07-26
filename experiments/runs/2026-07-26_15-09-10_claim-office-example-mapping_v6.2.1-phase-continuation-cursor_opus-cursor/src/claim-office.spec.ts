import { describe, it, expect } from "vitest";
import { quote, claim, runScenario } from "./claim-office.js";

describe("MHPCO quote — base premiums", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("single sword → premium 115 G (100 base + 10 first-ins + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("single amulet → premium 71 G (60 base + 6 first-ins + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("single staff → premium 93 G (80 base + 8 first-ins + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single potion → premium 49 G (40 base + 4 first-ins + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });
  it("single rune (component) → premium 33 G (25 base + 2.5 first-ins + 5 fee = 32.5 → 33)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("single moonstone (component) → premium 33 G (25 base + 2.5 first-ins + 5 fee = 32.5 → 33)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });
});

describe("MHPCO quote — building block of 3 alike components", () => {
  it("2 runes → 50 base + 5 first-ins + 5 fee = 60 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes → 60 base (block) + 6 first-ins + 5 fee = 71 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0),
    ).toBe(71);
  });
  it("4 runes → 100 base (no block) + 10 first-ins + 5 fee = 115 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, Array(4).fill({ type: "rune" }), 0),
    ).toBe(115);
  });
  it("7 runes → 175 base + 17.5 first-ins + 5 fee = 197.5 → 198 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), 0),
    ).toBe(198);
  });
  it("2 runes + 1 moonstone → 75 base (no block) + 7.5 first-ins + 5 fee = 87.5 → 88 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones → 120 base (two blocks) + 12 first-ins + 5 fee = 137 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })],
        0,
      ),
    ).toBe(137);
  });
});

describe("MHPCO quote — item-specific modifiers", () => {
  it("cursed sword → 100 base + 50 curse + 10 first-ins + 5 fee = 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0)).toBe(165);
  });
  it("sword enchantment 5 → 100 base + 30 high-ench + 10 first-ins + 5 fee = 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("sword enchantment 4 → 100 base + 10 first-ins + 5 fee = 115 G (no high-ench)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 0)).toBe(115);
  });
  it("cursed sword enchantment 5 → 100 + 50 + 30 + 10 first-ins + 5 fee = 195 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }], 0),
    ).toBe(195);
  });
});

describe("MHPCO quote — policy-wide modifiers", () => {
  it("cursed sword + plain amulet → 160 base + 50 curse + 16 first-ins (10% of 160) + 5 fee = 231 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }], 0),
    ).toBe(231);
  });
  it("customer with exactly 2 years → 20% loyalty discount applies (100 base -20 loyalty +10 first-ins +5 fee = 95 G)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("first insurance carries 10% initial assessment surcharge, newcomer plain sword (100 +10 +5 = 115 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("follow-up contract (second quote, index 1) gets 15% discount (100 +10 first-ins -15 follow-up +5 fee = 100 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
});

describe("MHPCO quote — rounding in MHPCO's favor", () => {
  it("premium yielding 197.5 G → 198 G (rounded up): 7 runes newcomer = 175 + 17.5 + 5 = 197.5", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), 0)).toBe(198);
  });
});

describe("MHPCO quote — integration examples", () => {
  it("newcomer with cursed sword (0 yrs, steel, ench 3) → 165 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
  it("long-standing customer's second contract (3 yrs, cursed sword ench 7, index 1) → 160 G", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 1),
    ).toBe(160);
  });
});

describe("MHPCO quote — edge cases", () => {
  it("unknown item type → throws", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow();
  });
});

describe("MHPCO claim — standard reimbursement", () => {
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G (500 - 100 deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("rune (value 250 G), damage 200 G → payout 100 G (200 - 100 deductible)", () => {
    const result = claim(
      [{ type: "rune" }],
      { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] },
    );
    expect(result.payout).toBe(100);
  });
});

describe("MHPCO claim — special clauses", () => {
  it("item enchantment ≥ 8 reimbursed at 50% then deductible (steel sword ench 8, dmg 1000 → 400)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 8 }],
      { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("dragon-material item fully reimbursed then deductible (dragon sword ench 5, dmg 800 → 700)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
    );
    expect(result.payout).toBe(700);
  });
  it("dragon sword ench 8, damage 1000 → payout 400 (50% clause wins, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("dragon sword ench 9, damage 1000 → payout 400 (both apply, 50% wins, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("dragon sword ench 5, damage 800 → payout 700 (only dragon clause, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
    );
    expect(result.payout).toBe(700);
  });
  it("steel sword ench 9, damage 1000 → payout 400 (only high-ench clause: 50% then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
  });
});

describe("MHPCO claim — deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible once per item)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet", enchantment: 1 }],
      { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ] },
    );
    expect(result.payout).toBe(600);
  });
});

describe("MHPCO claim — cap", () => {
  it("policy of two swords → insurance sum 2000, cap 4000 (payout 400 of 4000 → remaining 3600)", () => {
    const result = claim(
      [{ type: "sword", enchantment: 1 }, { type: "sword", enchantment: 1 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    );
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(3600);
  });
  it("cursed sword → cap 2000 based on unmodified insurance value (dmg 500 → payout 400, remaining 1600)", () => {
    const result = claim(
      [{ type: "sword", cursed: true, enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    );
    expect(result.remainingCap).toBe(1600);
  });
  it("sword + 3 runes block → insurance sum 1750, cap 3500 (dmg 500 → payout 400, remaining 3100)", () => {
    const result = claim(
      [{ type: "sword", enchantment: 1 }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    );
    expect(result.remainingCap).toBe(3100);
  });
  it("sword cap 2000: first claim 1500 → payout 1400, remaining 600", () => {
    const result = claim(
      [{ type: "sword", enchantment: 1 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    );
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword cap 2000: second claim 1500 with 600 remaining → payout 600, remaining 0", () => {
    const result = claim(
      [{ type: "sword", enchantment: 1 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      600,
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
});

describe("MHPCO claim — multiple items of same type", () => {
  it("two sword damages both insured → each its own deductible (500,300 → 400+200 = 600)", () => {
    const result = claim(
      [{ type: "sword", enchantment: 1 }, { type: "sword", enchantment: 1 }],
      { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ] },
    );
    expect(result.payout).toBe(600);
  });
  it("more damages of a type than insured → throws (claim rejected)", () => {
    expect(() =>
      claim(
        [{ type: "sword", enchantment: 1 }],
        { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] },
      ),
    ).toThrow();
  });
});

describe("MHPCO claim — rounding in MHPCO's favor", () => {
  it("payout yielding 350.5 G → 350 G (rounded down): steel sword ench 8 dmg 901 → 450.5 - 100 = 350.5", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 8 }],
      { cause: "curse", damages: [{ itemType: "sword", amount: 901 }] },
    );
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO claim — edge cases", () => {
  it("damage entry for item not in policy → throws (amulet damaged, only sword insured)", () => {
    expect(() =>
      claim(
        [{ type: "sword", enchantment: 1 }],
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
      ),
    ).toThrow();
  });
  it("damage entry with negative amount → throws", () => {
    expect(() =>
      claim(
        [{ type: "sword", enchantment: 1 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
      ),
    ).toThrow();
  });
});

describe("MHPCO runScenario — sequential steps", () => {
  it("quote then claim referencing the policy → premium + payout + remainingCap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const output = runScenario(scenario);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it("two successive claims on the same policy carry the cap forward", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 1 }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const output = runScenario(scenario);
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it("counts each quote step for follow-up discount (second quote is a follow-up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", enchantment: 3 }] },
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    const output = runScenario(scenario);
    expect(output.results[1]).toEqual({ premium: 160 });
  });
});
