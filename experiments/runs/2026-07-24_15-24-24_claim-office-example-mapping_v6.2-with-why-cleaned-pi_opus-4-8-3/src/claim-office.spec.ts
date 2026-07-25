import { describe, it, expect } from "vitest";
import {
  basePremium,
  quote,
  insuranceSum,
  capFor,
  roundPremium,
  roundPayout,
  claim,
  processScenario,
} from "./claim-office.js";

describe("Claim Office - base premiums (price list)", () => {
  it("sword base premium is 100 G", () => {
    expect(basePremium({ type: "sword" })).toBe(100);
  });
  it("amulet base premium is 60 G", () => {
    expect(basePremium({ type: "amulet" })).toBe(60);
  });
  it("staff base premium is 80 G", () => {
    expect(basePremium({ type: "staff" })).toBe(80);
  });
  it("potion base premium is 40 G", () => {
    expect(basePremium({ type: "potion" })).toBe(40);
  });
  it("single component (rune) base premium is 25 G", () => {
    expect(basePremium({ type: "rune" })).toBe(25);
  });
});

describe("Claim Office - building blocks of alike components", () => {
  it("2 runes -> 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block, requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes -> 175 G base premium (no block)", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    expect(
      basePremium([
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ]),
    ).toBe(120);
  });
});

describe("Claim Office - quote premium modifiers and fee", () => {
  it("empty item list -> premium 5 G (only processing fee)", () => {
    expect(quote({ items: [], yearsWithMHPCO: 0, isFollowUpContract: false })).toBe(5);
  });
  it("single sword, newcomer first quote -> 115 G (100 + 10 first + 5 fee)", () => {
    expect(
      quote({ items: [{ type: "sword" }], yearsWithMHPCO: 0, isFollowUpContract: false }),
    ).toBe(115);
  });
  it("cursed items add 50% surcharge: newcomer cursed sword ench3 -> 165 G", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        yearsWithMHPCO: 0,
        isFollowUpContract: false,
      }),
    ).toBe(165);
  });
  it("high enchantment (>=5) adds 30%: newcomer sword ench5 -> 145 G", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        yearsWithMHPCO: 0,
        isFollowUpContract: false,
      }),
    ).toBe(145);
  });
  it("enchantment 4 -> no high-enchantment surcharge: newcomer sword ench4 -> 115 G", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        yearsWithMHPCO: 0,
        isFollowUpContract: false,
      }),
    ).toBe(115);
  });
  it("loyalty discount (exactly 2 years) applies 20%: sword ench3 -> 95 G", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        yearsWithMHPCO: 2,
        isFollowUpContract: false,
      }),
    ).toBe(95);
  });
  it("long-standing second contract cursed sword ench7 -> 160 G (all modifiers stack)", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        yearsWithMHPCO: 3,
        isFollowUpContract: true,
      }),
    ).toBe(160);
  });
  it("multi-item scope: cursed surcharge is 50% of cursed item base, not policy total -> 231 G", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
        yearsWithMHPCO: 0,
        isFollowUpContract: false,
      }),
    ).toBe(231);
  });
});

describe("Claim Office - rounding in MHPCO's favor", () => {
  it("premium 197.5 G -> 198 G (rounded up)", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("payout 350.5 G -> 350 G (rounded down)", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
});

describe("Claim Office - insurance sum and cap", () => {
  it("two swords -> insurance sum 2000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
  it("sword + amulet -> insurance sum 1600 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("sword + 3 runes block -> insurance sum 1750 G (block affects premium only)", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ]),
    ).toBe(1750);
  });
  it("two swords -> cap 4000 G (twice insurance sum)", () => {
    expect(capFor([{ type: "sword" }, { type: "sword" }])).toBe(4000);
  });
  it("cursed sword -> cap 2000 G (based on unmodified insurance value)", () => {
    expect(
      capFor([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
    ).toBe(2000);
  });
});

describe("Claim Office - claim payout (single claim)", () => {
  it("regular sword steel ench3 damage 500 -> payout 400 (full minus deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("rune damage 200 -> payout 100 (full minus deductible, no special clause)", () => {
    const result = claim(
      [{ type: "rune" }],
      { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
    );
    expect(result.payout).toBe(100);
  });
  it("dragon sword ench5 damage 800 -> payout 700 (dragon full, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
    );
    expect(result.payout).toBe(700);
  });
  it("steel sword ench9 damage 1000 -> payout 400 (high-enchantment 50%, then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("dragon sword ench9 damage 1000 -> payout 400 (both clauses, 50% wins)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("dragon sword ench8 damage 1000 -> payout 400 (threshold, 50% then deductible)", () => {
    const result = claim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
    );
    expect(result.payout).toBe(400);
  });
  it("dragon attack: sword 500 + amulet 300 -> payout 600 (deductible per damaged item)", () => {
    const result = claim(
      [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "amulet", material: "silver", enchantment: 2 },
      ],
      {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      },
    );
    expect(result.payout).toBe(600);
  });
  it("two swords both damaged -> each entry its own deductible", () => {
    const result = claim(
      [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "sword", material: "steel", enchantment: 3 },
      ],
      {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      },
    );
    expect(result.payout).toBe(800);
  });
});

describe("Claim Office - cap exhaustion across successive claims", () => {
  it("sword cap 2000, two 1500-claims -> first payout 1400 (remaining 600), second 600 (remaining 0)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const first = claim(items, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(
      items,
      { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      first.remainingCap,
    );
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("Claim Office - error handling (CLI non-zero exit)", () => {
  it("quote with unknown item type throws", () => {
    expect(() =>
      quote({ items: [{ type: "broomstick" }], yearsWithMHPCO: 0, isFollowUpContract: false }),
    ).toThrow();
  });
  it("claim references item not in policy throws", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
      ),
    ).toThrow();
  });
  it("claim has more damage entries of a type than covered throws", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        },
      ),
    ).toThrow();
  });
  it("claim damage amount negative throws", () => {
    expect(() =>
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
      ),
    ).toThrow();
  });
});

describe("Claim Office - full scenario processing", () => {
  it("schema example: quote then claim returns premium, payout, remainingCap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    // amulet base 60; loyalty(5y) -20% of 60 = -12; first insurance +10% of 60 = +6;
    // 60 - 12 + 6 + 5 fee = 59 (rounded up)
    expect(output.results[0].premium).toBe(59);
    // amulet insurance value 600, cap 1200; damage 200 - 100 deductible = 100 payout
    expect(output.results[1].payout).toBe(100);
    expect(output.results[1].remainingCap).toBe(1100);
  });
});
