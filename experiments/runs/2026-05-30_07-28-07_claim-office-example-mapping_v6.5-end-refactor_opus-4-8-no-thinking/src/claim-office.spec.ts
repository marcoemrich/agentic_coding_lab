import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office — quote (base premiums)", () => {
  // Simplest case
  it("empty item list → premium 5 (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, { items: [] }, 0).premium).toBe(5);
  });

  // Single main item base premiums (+ fee, no other modifiers; newcomer 0 years would add first-insurance — so use these as base-premium building blocks via the integration examples instead)
  it("single plain sword (base 100) for newcomer → premium 115 (100 + 10% first + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        0,
      ).premium,
    ).toBe(115);
  });
  it("single plain amulet (base 60) for newcomer → premium 71 (60 + 10% first + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        0,
      ).premium,
    ).toBe(71);
  });
  it("single plain staff (base 80) for newcomer → premium 93", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "staff", material: "wood", enchantment: 2, cursed: false }] },
        0,
      ).premium,
    ).toBe(93);
  });
  it("single plain potion (base 40) for newcomer → premium 49", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "potion", material: "liquid", enchantment: 1, cursed: false }] },
        0,
      ).premium,
    ).toBe(49);
  });

  // Components
  it("single rune (base 25) for newcomer → premium 33 (25 + 10% first + 5 fee, rounded up)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, { items: [{ type: "rune" }] }, 0).premium,
    ).toBe(33);
  });
  it("single moonstone (base 25) for newcomer → premium 33", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, { items: [{ type: "moonstone" }] }, 0).premium,
    ).toBe(33);
  });

  // Building block of 3 alike components
  it("2 runes (base 50, no block) for newcomer → premium 60", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "rune" }, { type: "rune" }] },
        0,
      ).premium,
    ).toBe(60);
  });
  it("3 runes (block base 60) for newcomer → premium 71", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        0,
      ).premium,
    ).toBe(71);
  });
  it("4 runes (no block, base 100) for newcomer → premium 115", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        {
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        0,
      ).premium,
    ).toBe(115);
  });
  it("7 runes (no block, base 175) for newcomer → premium 198 (197.5 rounded up)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        0,
      ).premium,
    ).toBe(198);
  });

  // "Alike" components
  it("2 runes + 1 moonstone (no block, base 75) for newcomer → premium 88", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        0,
      ).premium,
    ).toBe(88);
  });
  it("3 runes + 3 moonstones (two blocks, base 120) for newcomer → premium 137", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        {
          items: [
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
          ],
        },
        0,
      ).premium,
    ).toBe(137);
  });
});

describe("MHPCO Claim Office — quote (premium modifiers)", () => {
  // Item-specific modifiers and policy scope
  it("cursed sword + plain amulet for newcomer → premium 231 (base 160 + curse 50 + 10% first 16 + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        {
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        0,
      ).premium,
    ).toBe(231);
  });

  // Modifier thresholds
  it("sword for 2-year customer → premium 95 (100 + 10% first - 20% loyalty + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 2 },
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        0,
      ).premium,
    ).toBe(95);
  });
  it("sword with enchantment 5 for newcomer → premium 145 (100 + 30% high-ench + 10% first + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
        0,
      ).premium,
    ).toBe(145);
  });
  it("cursed sword with enchantment 5 for newcomer → premium 195 (100 + 50 curse + 30 high-ench + 10 first + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
        0,
      ).premium,
    ).toBe(195);
  });
  it("sword with enchantment 4 for newcomer → premium 115 (no high-ench surcharge below level 5)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
        0,
      ).premium,
    ).toBe(115);
  });

  // Rounding
  it("premium with fractional .5 (3 moonstones + 1 rune, 98.5) for newcomer → 99 (rounded up)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        {
          items: [
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "rune" },
          ],
        },
        0,
      ).premium,
    ).toBe(99);
  });
});

describe("MHPCO Claim Office — quote (integration examples)", () => {
  it("INTEGRATION: newcomer cursed sword (steel, ench 3) → premium 165", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0 },
        { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        0,
      ).premium,
    ).toBe(165);
  });
  it("INTEGRATION: long-standing 3yr 2nd contract, cursed sword ench7 → premium 160", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        { items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        1,
      ).premium,
    ).toBe(160);
  });
});

describe("MHPCO Claim Office — claim (standard reimbursement)", () => {
  it("claim: regular sword, damage 500, cap 2000 → payout 400", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
  it("claim: rune, damage 200, cap 500 → payout 100", () => {
    const result = claim(
      [{ type: "rune" }],
      { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
      500,
    );
    expect(result.payout).toBe(100);
  });
});

describe("MHPCO Claim Office — claim (special clauses)", () => {
  it("claim: dragon sword ench5, damage 800, cap 2000 → payout 700 (dragon full reimbursement, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
      2000,
    );
    expect(result.payout).toBe(700);
  });
  it("claim: steel sword ench9, damage 1000, cap 2000 → payout 400 (high-ench 50%, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
  it("claim: dragon sword ench9, damage 1000, cap 2000 → payout 400 (50% high-ench wins over dragon)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
  it("claim: dragon sword ench8 (boundary), damage 1000 → payout 400 (high-ench applies at exactly 8)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      2000,
    );
    expect(result.payout).toBe(400);
  });
});

describe("MHPCO Claim Office — claim (deductible per damage event)", () => {
  it("claim: dragon attack on sword(500)+amulet(300), cap 3200 → payout 600 (deductible per item)", () => {
    const result = claim(
      [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ],
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
  it("claim: two swords, two sword-damage entries (500+400) → payout 700 (own deductible each)", () => {
    const result = claim(
      [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ],
      {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 400 },
        ],
      },
      4000,
    );
    expect(result.payout).toBe(700);
  });
  it("claim: two sword damages but only one sword insured → throws (claim rejected)", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 400 },
          ],
        },
        2000,
      ),
    ).toThrow();
  });
});

describe("MHPCO Claim Office — claim (cap)", () => {
  it("claim: sword cap 2000, damage 1500 → payout 1400, remainingCap 600", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      2000,
    );
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("claim: sword cap 2000, two claims of 1500 → 1400/rem600 then 600/rem0 (cap exhaustion)", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const first = claim(items, { cause: "fire", damages }, 2000);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(items, { cause: "fire", damages }, first.remainingCap);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("MHPCO Claim Office — claim (rounding)", () => {
  it("claim: high-ench staff, damage 901 (350.5) → payout 350 (rounded down)", () => {
    const result = claim(
      [{ type: "staff", material: "steel", enchantment: 8, cursed: false }],
      { cause: "fire", damages: [{ itemType: "staff", amount: 901 }] },
      1600,
    );
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO Claim Office — errors", () => {
  it("quote: unknown item type (broomstick) → throws", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, { items: [{ type: "broomstick" }] }, 0),
    ).toThrow();
  });
  it("claim: damage references item not in policy (amulet when only sword insured) → throws", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        2000,
      ),
    ).toThrow();
  });
  it("claim: negative damage amount (-200) → throws", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        2000,
      ),
    ).toThrow();
  });
});
