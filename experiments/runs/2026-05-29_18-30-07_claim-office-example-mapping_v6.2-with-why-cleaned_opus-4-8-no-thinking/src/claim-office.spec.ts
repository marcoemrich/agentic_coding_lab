import { describe, it, expect } from "vitest";
import { quote, claim, insuranceSum } from "./claim-office.js";

describe("MHPCO Claim Office — quote (base premiums, single item)", () => {
  // Edge case: empty item list
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });

  // Base premiums for main items (newcomer: 0 years, first insurance applies)
  // Note: with first-insurance 10% and 5 G fee, but tests below isolate base where possible.
  it("single sword (0 yrs) → 100 base +10 first +5 fee = 115 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 0 }, 0)).toBe(115);
  });
  it("single amulet (0 yrs) → 60 base +6 first +5 fee = 71 G", () => {
    expect(quote([{ type: "amulet" }], { yearsWithMHPCO: 0 }, 0)).toBe(71);
  });
  it("single staff (0 yrs) → 80 base +8 first +5 fee = 93 G", () => {
    expect(quote([{ type: "staff" }], { yearsWithMHPCO: 0 }, 0)).toBe(93);
  });
  it("single potion (0 yrs) → 40 base +4 first +5 fee = 49 G", () => {
    expect(quote([{ type: "potion" }], { yearsWithMHPCO: 0 }, 0)).toBe(49);
  });
});

describe("MHPCO Claim Office — quote (component blocks)", () => {
  it("2 runes → 50 G base premium (no block) → quote 60 G (×1.1 first +5 fee)", () => {
    expect(
      quote([{ type: "rune" }, { type: "rune" }], { yearsWithMHPCO: 0 }, 0),
    ).toBe(60);
  });
  it("3 runes → 60 G base premium (block applies) → quote 71 G", () => {
    expect(
      quote(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(71);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3) → quote 115 G", () => {
    expect(
      quote(
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(115);
  });
  it("7 runes → 175 G base premium → quote 198 G (×1.1=192.5 +5=197.5 → ceil 198)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(sevenRunes, { yearsWithMHPCO: 0 }, 0)).toBe(198);
  });
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → quote 88 G", () => {
    expect(
      quote(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(88);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → quote 137 G", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote(items, { yearsWithMHPCO: 0 }, 0)).toBe(137);
  });
});

describe("MHPCO Claim Office — quote (item-specific modifiers)", () => {
  it("cursed sword (0 yrs, steel, ench 3) → 100 +50 curse +10 first +5 fee = 165 G", () => {
    expect(
      quote(
        [{ type: "sword", cursed: true, material: "steel", enchantment: 3 }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });
  it("sword with enchantment exactly 5 → high-enchantment 30% surcharge → 100 +30 +10 first +5 fee = 145 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 5 }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(145);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge → 100 +10 first +5 fee = 115 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 4 }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(115);
  });
  it("cursed sword with enchantment 5 → both surcharges → 100 +50 +30 +10 first +5 fee = 195 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(195);
  });
  it("first insurance applies per item regardless of customer history (3 yrs, follow-up) → 110 -20 loyalty -15 follow-up +5 fee = 80 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { yearsWithMHPCO: 3 },
        1,
      ),
    ).toBe(80);
  });
});

describe("MHPCO Claim Office — quote (policy-wide modifiers)", () => {
  it("customer with exactly 2 years → 20% loyalty discount (of policy base) → 100 +10 first -20 loyalty +5 fee = 95 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { yearsWithMHPCO: 2 },
        0,
      ),
    ).toBe(95);
  });
  it("customer with <2 years (1 yr) → no loyalty discount → 100 +10 first +5 fee = 115 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { yearsWithMHPCO: 1 },
        0,
      ),
    ).toBe(115);
  });
  it("second contract (contractIndex 1) → 15% follow-up discount → 100 +10 first -15 follow-up +5 fee = 100 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { yearsWithMHPCO: 0 },
        1,
      ),
    ).toBe(100);
  });
  it("first contract (contractIndex 0) → no follow-up discount → 100 +10 first +5 fee = 115 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(115);
  });
});

describe("MHPCO Claim Office — quote (modifier scope on multi-item policies)", () => {
  it("cursed sword (100) + plain amulet (60): curse on sword only → 160 sword +66 amulet +5 fee = 231 G", () => {
    expect(
      quote(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2 },
        ],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(231);
  });
});

describe("MHPCO Claim Office — quote (rounding)", () => {
  it("premium calc yielding 197.5 G → 198 G (rounded up): 7 runes, 0 yrs", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(sevenRunes, { yearsWithMHPCO: 0 }, 0)).toBe(198);
  });
});

describe("MHPCO Claim Office — quote (integration examples)", () => {
  it("newcomer cursed sword (0 yrs, steel, ench 3) → 100 +50 curse +10 first +5 fee = 165 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });
  it("long-standing 2nd contract cursed sword (3 yrs, ench 7) → 100 +50 curse +30 high-ench -20 loyalty +10 first -15 follow-up +5 fee = 160 G", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        1,
      ),
    ).toBe(160);
  });
});

describe("MHPCO Claim Office — claim (standard reimbursement)", () => {
  it("regular sword (steel, ench 3), damage 500 → payout 400 (500 - 100 deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
  it("rune (value 250), damage 200 → payout 100 (200 - 100 deductible; no special clause)", () => {
    const result = claim(
      { items: [{ type: "rune" }] },
      { cause: "acid", damages: [{ itemType: "rune", amount: 200 }] },
      500,
    );
    expect(result.payout).toBe(100);
  });
});

describe("MHPCO Claim Office — claim (special clauses)", () => {
  it("steel sword ench 9, damage 1000 → payout 400 (50% = 500, then -100 deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword ench 5, damage 800 → payout 700 (full reimbursement, then -100 deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
      2000,
    );
    expect(result.payout).toBe(700);
  });
  it("dragon-material sword ench 9, damage 1000 → payout 400 (50% wins, then -100 deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword ench exactly 8, damage 1000 → payout 400 (high-ench clause then deductible)", () => {
    const result = claim(
      { items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
});

describe("MHPCO Claim Office — claim (deductible per damage event)", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible once per item)", () => {
    const result = claim(
      {
        items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 2 },
        ],
      },
      {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      },
      3200,
    );
    expect(result.payout).toBe(600);
  });
});

describe("MHPCO Claim Office — claim (multiple items of the same type)", () => {
  it("policy covers two swords → insurance sum 2000 (cap = 2× = 4000)", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it("dragon attack damages both swords (two sword entries) → each treated as separate damage with own deductible → 600", () => {
    const policy = {
      items: [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "sword", material: "steel", enchantment: 3 },
      ],
    };
    const result = claim(
      policy,
      {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      },
      4000,
    );
    expect(result.payout).toBe(600);
  });
  it("more damage entries of a type than insured (two sword damages, one sword) → claim rejected (throws)", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        },
        4000,
      ),
    ).toThrow();
  });
});

describe("MHPCO Claim Office — claim (cap)", () => {
  it("sword + amulet → insurance sum 1600 (cap = 2× = 3200)", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("cursed sword → insurance sum 1000 (cap 2000; premium modifiers do not raise cap)", () => {
    expect(
      insuranceSum([
        { type: "sword", cursed: true, enchantment: 9, material: "dragon" },
      ]),
    ).toBe(1000);
  });
  it("sword + 3 runes block → insurance sum 1750 (block discount affects premium only, not insurance sum)", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(1750);
  });
  it("sword (cap 2000), two successive 1500 claims → first payout 1400 (remaining 600), second payout 600 (remaining 0)", () => {
    const policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3 }],
    };
    const cap0 = 2 * insuranceSum(policy.items);
    const r1 = claim(
      policy,
      { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
      cap0,
    );
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = claim(
      policy,
      { cause: "y", damages: [{ itemType: "sword", amount: 1500 }] },
      r1.remainingCap,
    );
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });
});

describe("MHPCO Claim Office — claim (rounding)", () => {
  it("payout calc yielding 350.5 G → 350 G (rounded down): ench 9 sword, damage 901 → 0.5×901=450.5 -100=350.5", () => {
    const result = claim(
      { items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
      2000,
    );
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO Claim Office — claim (errors)", () => {
  it("claim references item not in policy (amulet damaged, only sword insured) → throws", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] },
        2000,
      ),
    ).toThrow();
  });
  it("damage entry with amount -200 → throws", () => {
    expect(() =>
      claim(
        { items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
        2000,
      ),
    ).toThrow();
  });
});

describe("MHPCO Claim Office — quote (errors)", () => {
  it("quote includes unknown item type (broomstick) → throws", () => {
    expect(() =>
      quote([{ type: "broomstick" }], { yearsWithMHPCO: 0 }, 0),
    ).toThrow();
  });
});
