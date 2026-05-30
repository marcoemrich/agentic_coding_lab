import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office — quote: base premiums", () => {
  // Edge case: simplest scenario
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, []).premium).toBe(5);
  });

  // Single main item base premiums + 5 fee, but with first-insurance per item.
  // Use these via the full quote to keep them concrete from the spec where given.
  it("single sword (newcomer) → premium 115 (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]).premium).toBe(115);
  });
  it("single amulet (newcomer) → premium 71 (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }]).premium).toBe(71);
  });
  it("single staff (newcomer) → premium 93 (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }]).premium).toBe(93);
  });
  it("single potion (newcomer) → premium 49 (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }]).premium).toBe(49);
  });
});

describe("MHPCO Claim Office — quote: component building blocks", () => {
  it("2 runes (newcomer) → premium 60 (50 base + 5 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }]).premium).toBe(60);
  });
  it("3 runes (newcomer) → premium 71 (60 block base + 6 first insurance + 5 fee)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }]).premium,
    ).toBe(71);
  });
  it("4 runes (newcomer) → premium 115 (100 base, no block — requires exactly 3)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]).premium,
    ).toBe(115);
  });
  it("7 runes (newcomer) → premium 198 (175 base, no block; rounds 197.5 up)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes).premium).toBe(198);
  });
  it("2 runes + 1 moonstone (newcomer) → premium 88 (75 base, no block: different types)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]).premium,
    ).toBe(88);
  });
  it("3 runes + 3 moonstones (newcomer) → premium 137 (120 base, two separate blocks)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]).premium,
    ).toBe(137);
  });
});

describe("MHPCO Claim Office — quote: modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet (newcomer) → premium 231 (base 160 + curse 50 + first insurance 16 + fee 5)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]).premium,
    ).toBe(231);
  });
});

describe("MHPCO Claim Office — quote: modifier thresholds", () => {
  it("customer with exactly 2 years, plain sword → premium 95 (loyalty discount applies)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }]).premium).toBe(95);
  });
  it("sword with enchantment 5 (newcomer) → premium 145 (high-enchantment surcharge applies)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }]).premium).toBe(145);
  });
  it("sword with enchantment 4 (newcomer) → premium 115 (no high-enchantment surcharge)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }]).premium).toBe(115);
  });
  it("cursed sword with enchantment 5 (newcomer) → premium 195 (both surcharges apply)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }]).premium,
    ).toBe(195);
  });
});

describe("MHPCO Claim Office — quote: rounding in MHPCO's favor", () => {
  it("premium calculation yielding 197.5 G → final premium 198 G (rounded up)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    // 175 base + 17.5 first insurance + 5 fee = 197.5 → rounded up to 198
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes).premium).toBe(198);
  });
});

describe("MHPCO Claim Office — quote: integration examples", () => {
  it("newcomer (0 yrs) cursed sword (steel, ench 3) → premium 165 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]).premium,
    ).toBe(165);
  });
  it("long-standing (3 yrs) second quote, cursed sword (steel, ench 7) → premium 160 G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { followUp: true },
      ).premium,
    ).toBe(160);
  });
});

describe("MHPCO Claim Office — quote: unknown item type", () => {
  it("quote with unknown item type (e.g. broomstick) → throws", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow();
  });
});

describe("MHPCO Claim Office — claim: standard reimbursement", () => {
  it("regular sword (steel, ench 3), damage 500 → payout 400 (full minus 100 deductible)", () => {
    expect(
      claim([{ type: "sword", material: "steel", enchantment: 3 }], {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250), damage 200 → payout 100 (full minus 100 deductible)", () => {
    expect(
      claim([{ type: "rune" }], {
        cause: "theft",
        damages: [{ itemType: "rune", amount: 200 }],
      }),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe("MHPCO Claim Office — claim: special clauses", () => {
  it("dragon-material sword, ench 5, damage 800 → payout 700 (dragon full, then deductible)", () => {
    expect(
      claim([{ type: "sword", material: "dragon", enchantment: 5 }], {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 800 }],
      }),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, ench 9, damage 1000 → payout 400 (high-ench 50%, then deductible)", () => {
    expect(
      claim([{ type: "sword", material: "steel", enchantment: 9 }], {
        cause: "curse",
        damages: [{ itemType: "sword", amount: 1000 }],
      }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it.todo("dragon-material sword, ench 9, damage 1000 → payout 400 (50% rule wins over dragon, then deductible)");
  it.todo("dragon-material sword, ench 8, damage 1000 → payout 400 (high-ench clause applies, then deductible)");
});

describe("MHPCO Claim Office — claim: deductible per damage event", () => {
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 (100 deductible per item)");
});

describe("MHPCO Claim Office — claim: multiple items of same type", () => {
  it.todo("policy covers two swords → insurance sum 2000, cap 4000");
  it.todo("dragon attack damages both swords (two entries) → each its own deductible");
  it.todo("more damage entries of a type than insured → rejected (throws / error)");
});

describe("MHPCO Claim Office — claim: cap and insurance sum", () => {
  it.todo("policy covers sword + amulet → insurance sum 1600, cap 3200");
  it.todo("cursed sword (premium 165) → cap 2000 (based on unmodified insurance value)");
  it.todo("policy covers sword + 3 runes (block) → insurance sum 1750");
  it.todo("sword (sum 1000, cap 2000), two successive claims of 1500 each → first payout 1400 remaining 600, second payout 600 remaining 0");
});

describe("MHPCO Claim Office — claim: rounding in MHPCO's favor", () => {
  it.todo("payout calculation yielding 350.5 G → final payout 350 G (rounded down)");
});

describe("MHPCO Claim Office — claim: error cases", () => {
  it.todo("claim references item not in policy (amulet when only sword insured) → rejected (throws / error)");
  it.todo("claim with damage amount -200 → rejected (throws / error)");
});
