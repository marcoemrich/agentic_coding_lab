import { describe, it, expect } from "vitest";
import { quote, claim, insuranceCap } from "./claim-office.js";

describe("Claim Office - Quote", () => {
  // Edge case: empty item list
  it("empty item list -> premium 5 G (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // Base premiums for main items (base + 10% first insurance + 5 fee)
  it("single sword (steel, ench 3) -> base 100 + 10 first + 5 fee = 115 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3 }], 0),
    ).toBe(115);
  });
  it("single amulet -> base 60 + 6 first + 5 fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("single staff -> base 80 + 8 first + 5 fee = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single potion -> base 40 + 4 first + 5 fee = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // Component base premiums (block rule). Full premium = base + 10% first + 5 fee
  it("2 runes -> base 50 (full: 50 + 5 first + 5 fee = 60)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes -> base 60 block (full: 60 + 6 first + 5 fee = 71)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0),
    ).toBe(71);
  });
  it("4 runes -> base 100 no block (full: 100 + 10 first + 5 fee = 115)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ], 0),
    ).toBe(115);
  });
  it("7 runes -> base 175 (full: 175 + 17.5 first + 5 fee = 197.5 -> rounded up 198)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });

  // "Alike" components
  it("2 runes + 1 moonstone -> base 75 no block (full: 75 + 7.5 + 5 = 87.5 -> 88)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones -> base 120 two blocks (full: 120 + 12 + 5 = 137)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(137);
  });

  // Item-specific modifiers
  it("cursed sword adds 50% surcharge on item base (newcomer -> 165)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
  it("high-enchantment sword (ench 5) adds 30% (100+30+10 first+5 = 145)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5 }], 0),
    ).toBe(145);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies (145)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5 }], 0),
    ).toBe(145);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge (115)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 4 }], 0),
    ).toBe(115);
  });
  it("cursed sword with exactly enchantment 5 -> both surcharges (100+50+30+10+5 = 195)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5, cursed: true }], 0),
    ).toBe(195);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet -> curse adds 50% of sword only (160+50+16 first+5 = 231)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ], 0),
    ).toBe(231);
  });

  // Policy-wide modifiers
  it("customer with exactly 2 years -> 20% loyalty discount (100+10 first-20 loyalty+5 = 95)", () => {
    expect(
      quote({ yearsWithMHPCO: 2 }, [{ type: "sword", material: "steel", enchantment: 3 }], 0),
    ).toBe(95);
  });
  it("follow-up contract (2nd quote) -> 15% discount (100+10 first-15 followup+5 = 100)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3 }], 1),
    ).toBe(100);
  });

  // Rounding
  it("premium yielding 197.5 G -> 198 G (rounded up, MHPCO favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });

  // Integration examples
  it("newcomer with cursed sword (steel, ench 3) -> 165 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
  it("long-standing customer 2nd contract, cursed sword ench 7 -> 160 G", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 1),
    ).toBe(160);
  });

  // Errors
  it("unknown item type -> throws error", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow();
  });
});

describe("Claim Office - Claim", () => {
  // Standard reimbursement
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (deductible)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    const result = claim(items, incident, 2000);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("rune damage 200 -> payout 100 (deductible, no special clause)", () => {
    const items = [{ type: "rune" }];
    const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
    const result = claim(items, incident, 500);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  // High enchantment clause
  it("steel sword ench 9, damage 1000 -> payout 400 (50% then deductible)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = claim(items, incident, 2000);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  // Dragon material clause
  it("dragon-material sword ench 5, damage 800 -> payout 700 (full then deductible)", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] };
    const result = claim(items, incident, 2000);
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });

  // Both clauses -> 50% wins
  it("dragon sword ench 9, damage 1000 -> payout 400 (50% wins)", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = claim(items, incident, 2000);
    expect(result.payout).toBe(400);
  });
  it("dragon sword ench 8, damage 1000 -> payout 400 (high-ench applies)", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    const result = claim(items, incident, 2000);
    expect(result.payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack: sword 500 + amulet 300 -> payout 600 (deductible each)", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "amulet", material: "silver", enchantment: 2 },
    ];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    const result = claim(items, incident, 3200);
    expect(result.payout).toBe(600);
  });

  // Cap
  it("sword cap 2000; two claims 1500 each -> 1400 then 600, remaining 0", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const first = claim(items, incident, 2000);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(items, incident, first.remainingCap);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // Multiple items of same type
  it("two swords -> insurance cap 4000; both damaged separately", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3 },
      { type: "sword", material: "steel", enchantment: 3 },
    ];
    expect(insuranceCap(items)).toBe(4000);
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    const result = claim(items, incident, insuranceCap(items));
    expect(result.payout).toBe(800);
  });
  it("more damages of a type than insured -> rejected (throws)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => claim(items, incident, 2000)).toThrow();
  });

  // Cap based on unmodified insurance value
  it("cursed sword premium modified -> cap still 2000 (unmodified value)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(insuranceCap(items)).toBe(2000);
  });

  // Rounding payout
  it("payout yielding 350.5 G -> 350 G (rounded down, MHPCO favor)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 8 }];
    const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 901 }] };
    const result = claim(items, incident, 2000);
    expect(result.payout).toBe(350);
  });

  // Errors
  it("claim references item not in policy -> throws", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim(items, incident, 2000)).toThrow();
  });
  it("claim with negative amount -> throws", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(items, incident, 2000)).toThrow();
  });
});
