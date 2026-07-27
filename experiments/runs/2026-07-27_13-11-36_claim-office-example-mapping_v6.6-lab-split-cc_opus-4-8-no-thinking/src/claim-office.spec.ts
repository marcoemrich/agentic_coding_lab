import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office — quote", () => {
  // Edge case: empty list
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // Base premiums for single main items (base + 10% first insurance + 5 fee)
  it("single sword → base premium 100 G (total 100 + 10 first + 5 fee = 115)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("single amulet → base premium 60 G (total 60 + 6 first + 5 fee = 71)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("single staff → base premium 80 G (total 80 + 8 first + 5 fee = 93)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single potion → base premium 40 G (total 40 + 4 first + 5 fee = 49)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // Components
  it("single rune → base premium 25 G (total 25 + 2.5 first + 5 fee = 32.5 → 33 rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("single moonstone → base premium 25 G (total 32.5 → 33 rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });

  // Building block of 3 alike components
  it("2 runes → 50 G base premium (no block) (total 50 + 5 first + 5 fee = 60)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes → 60 G base premium (block applies) (total 60 + 6 first + 5 fee = 71)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0),
    ).toBe(71);
  });
  it("4 runes → 100 G base premium (no block — requires exactly 3) (total 100 + 10 first + 5 fee = 115)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ], 0),
    ).toBe(115);
  });
  it("7 runes → 175 G base premium (total 175 + 17.5 first + 5 fee = 197.5 → 198)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });

  // "Alike" components — same type only
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) (total 75 + 7.5 first + 5 fee = 87.5 → 88)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ], 0),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) (total 120 + 12 first + 5 fee = 137)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ], 0),
    ).toBe(137);
  });

  // Premium modifiers — item-specific
  it("cursed sword adds 50% risk surcharge (100 + 50 curse + 10 first + 5 fee = 165)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0),
    ).toBe(165);
  });
  it("highly enchanted sword (enchantment 6) adds 30% surcharge (100 + 30 + 10 first + 5 fee = 145)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 6 }], 0),
    ).toBe(145);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies (145)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0),
    ).toBe(145);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (115)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 0),
    ).toBe(115);
  });
  it("sword with enchantment 5 and cursed → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }], 0),
    ).toBe(195);
  });

  // Policy-wide modifiers
  it("long-standing customer (3 years) receives 20% loyalty discount (100 − 20 + 10 first + 5 fee = 95)", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("customer with exactly 2 years → loyalty discount applies (95)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("first insurance carries 10% initial assessment surcharge (staff 80 + 8 first + 5 fee = 93)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("15% discount on each contract after the first (sword, contract index 1: 100 + 10 first − 15 follow-up + 5 fee = 100)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });

  // Processing fee
  it("a 5 G processing fee is added to every premium (potion: 40 + 4 first + 5 fee = 49)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // Modifier scope on multi-item policies
  it("cursed sword (100 G) + plain amulet (60 G) → curse scoped to cursed item (base 160 + curse 50 + first 16 + fee 5 = 231)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ], 0),
    ).toBe(231);
  });

  // Rounding in MHPCO's favor
  it("premium calculation yielding 197.5 G → final premium 198 G (rounded up)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });

  // Integration examples
  it("newcomer with cursed sword (steel, ench 3), 0 years → premium 165 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ], 0),
    ).toBe(165);
  });
  it("long-standing customer 2nd contract: cursed sword (steel, ench 7), 3 years, contract 1 → premium 160 G", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [
        { type: "sword", material: "steel", enchantment: 7, cursed: true },
      ], 1),
    ).toBe(160);
  });
  it("first insurance surcharge applies regardless of customer history (sword, 3 years, contract 1: 100 + 10 first − 20 loyalty − 15 follow-up + 5 fee = 80)", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 1)).toBe(80);
  });

  // Insurance sum / cap (exposed via quote result or claim)
  it("two swords → insurance sum 2000 G, cap 4000 G (damage 500 → payout 400, remainingCap 3600)", () => {
    const policy = [{ type: "sword" }, { type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("sword + amulet → insurance sum 1600 G, cap 3200 G (damage 500 → payout 400, remainingCap 2800)", () => {
    const policy = [{ type: "sword" }, { type: "amulet" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G (block affects premium only), cap 3500 (sword damage 500 → payout 400, remainingCap 3100)", () => {
    const policy = [
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 3100 });
  });

  // Error handling
  it("unknown item type (e.g. broomstick) → throws / error", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow();
  });
});

describe("MHPCO Claim Office — claim", () => {
  // Standard reimbursement
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G (deductible 100), remainingCap 1600", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (value 250 G), damage 200 G → payout 100 G (deductible 100, no special clause), remainingCap 400", () => {
    const policy = [{ type: "rune" }];
    const incident = { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 100, remainingCap: 400 });
  });

  // High enchantment clause
  it("dragon-material sword, ench 8, damage 1000 G → payout 400 G (50% then deductible), remainingCap 1600", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 9, damage 1000 G → payout 400 G (both clauses; 50% wins, then deductible), remainingCap 1600", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, ench 5, damage 800 G → payout 700 G (dragon full, then deductible), remainingCap 1300", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, ench 9, damage 1000 G → payout 400 G (only high-ench 50%, then deductible), remainingCap 1600", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 9 }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per item), remainingCap 2600", () => {
    const policy = [{ type: "sword" }, { type: "amulet" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident, 0)).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Multiple items of same type
  it("two swords insured, damages both (500, 300) → each a separate damage with own deductible (payout 600), remainingCap 3400", () => {
    const policy = [{ type: "sword" }, { type: "sword" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(claim(policy, incident, 0)).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damage entries of a type than insured → whole claim rejected (error)", () => {
    const policy = [{ type: "sword" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(() => claim(policy, incident, 0)).toThrow();
  });

  // Cap
  it("cursed sword → cap 2000 G (based on unmodified insurance value); damage 500 → payout 400, remainingCap 1600", () => {
    const policy = [{ type: "sword", cursed: true }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword cap 2000 G; first claim 1500 → payout 1400, remaining 600", () => {
    const policy = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword cap 2000 G; second claim 1500 (priorPayouts 1400) → payout 600, remaining 0 (reduced to remaining cap)", () => {
    const policy = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(claim(policy, incident, 1400)).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Rounding
  it("payout calculation yielding 350.5 G → final payout 350 G (rounded down) (ench 8 sword, damage 901: 50% = 450.5 − 100 = 350.5)", () => {
    const policy = [{ type: "sword", enchantment: 8 }];
    const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 901 }] };
    expect(claim(policy, incident, 0)).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Error handling
  it("claim references item not in policy (amulet damaged, only sword insured) → error", () => {
    const policy = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => claim(policy, incident, 0)).toThrow();
  });
  it("claim damage amount -200 → error", () => {
    const policy = [{ type: "sword" }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(policy, incident, 0)).toThrow();
  });
});
