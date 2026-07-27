import { describe, it, expect } from "vitest";
import { quote, claim, basePremium, insuranceSum, policyCap, type Item } from "./claim-office.js";

describe("basePremium - item base premiums", () => {
  it("empty item list -> 0 G base", () => {
    expect(basePremium([])).toBe(0);
  });
  it("single sword -> 100 G base", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("single amulet -> 60 G base", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("single staff -> 80 G base", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("single potion -> 40 G base", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("single rune (component) -> 25 G base", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });
  it("single moonstone (component) -> 25 G base", () => {
    expect(basePremium([{ type: "moonstone" }])).toBe(25);
  });
});

describe("basePremium - component blocks", () => {
  const runes = (n: number) => Array(n).fill({ type: "rune" });
  it("2 runes -> 50 G base", () => {
    expect(basePremium(runes(2))).toBe(50);
  });
  it("3 runes -> 60 G base block", () => {
    expect(basePremium(runes(3))).toBe(60);
  });
  it("4 runes -> 100 G base, no block", () => {
    expect(basePremium(runes(4))).toBe(100);
  });
  it("7 runes -> 175 G base", () => {
    expect(basePremium(runes(7))).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base, no block", () => {
    expect(basePremium([...runes(2), { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base, two blocks", () => {
    expect(basePremium([...runes(3), { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(120);
  });
});

describe("basePremium - item-specific modifiers", () => {
  it("cursed sword -> 150 G", () => {
    expect(basePremium([{ type: "sword", cursed: true }])).toBe(150);
  });
  it("high-enchantment sword (ench 5) -> 130 G", () => {
    expect(basePremium([{ type: "sword", enchantment: 5 }])).toBe(130);
  });
  it("sword ench 4 -> 100 G (no surcharge)", () => {
    expect(basePremium([{ type: "sword", enchantment: 4 }])).toBe(100);
  });
  it("cursed sword ench 5 -> 180 G (both)", () => {
    expect(basePremium([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(180);
  });
  it("cursed sword + plain amulet -> 210 G (curse on sword only)", () => {
    expect(basePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
  });
});

describe("quote - policy-wide modifiers and fee", () => {
  it("empty item list -> 5 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("plain sword first contract -> 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("loyalty 2y follow-up sword -> 80 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 1)).toBe(80);
  });
  it("< 2y follow-up sword -> 100 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 1)).toBe(100);
  });
});

describe("quote - rounding in favor (up)", () => {
  it("fractional premium -> rounded up (rune follow-up -> 29 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 1)).toBe(29);
  });
});

describe("quote - integration examples", () => {
  it("newcomer cursed sword -> 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
  });
  it("long-standing 2nd contract cursed sword ench7 -> 160 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 1)).toBe(160);
  });
});

describe("quote - errors", () => {
  it("unknown item type -> throws", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow();
  });
});

describe("claim - deductible and basic reimbursement", () => {
  it("sword ench3 damage 500 -> 400", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }, Infinity))
      .toMatchObject({ payout: 400 });
  });
  it("rune damage 200 -> 100", () => {
    const policy = { items: [{ type: "rune" }] };
    expect(claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] }, Infinity))
      .toMatchObject({ payout: 100 });
  });
});

describe("claim - special clauses", () => {
  const claimOne = (item: Item, amount: number) =>
    claim({ items: [item] }, { cause: "x", damages: [{ itemType: item.type, amount }] }, Infinity);
  it("ench 8 damage 1000 -> 400 (50% then deductible)", () => {
    expect(claimOne({ type: "sword", material: "steel", enchantment: 8 }, 1000)).toMatchObject({ payout: 400 });
  });
  it("dragon ench 8 damage 1000 -> 400 (full then deductible)", () => {
    expect(claimOne({ type: "sword", material: "dragon", enchantment: 8 }, 1000)).toMatchObject({ payout: 400 });
  });
  it("dragon ench 9 damage 1000 -> 400 (50% wins)", () => {
    expect(claimOne({ type: "sword", material: "dragon", enchantment: 9 }, 1000)).toMatchObject({ payout: 400 });
  });
  it("dragon ench 5 damage 800 -> 700 (dragon only)", () => {
    expect(claimOne({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toMatchObject({ payout: 700 });
  });
  it("steel ench 9 damage 1000 -> 400 (high-ench only)", () => {
    expect(claimOne({ type: "sword", material: "steel", enchantment: 9 }, 1000)).toMatchObject({ payout: 400 });
  });
});

describe("claim - multiple damages, deductible per event", () => {
  it("sword 500 + amulet 300 -> 600", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet" }] };
    expect(
      claim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] }, Infinity),
    ).toMatchObject({ payout: 600 });
  });
});

describe("claim - cap", () => {
  it("sword+amulet cap 3200, claim 500 -> payout 400 remaining 2800", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet" }] };
    expect(
      claim(policy, { cause: "x", damages: [{ itemType: "sword", amount: 500 }] }, 3200),
    ).toMatchObject({ payout: 400, remainingCap: 2800 });
  });
  it("two 1500 claims on sword cap 2000 -> 1400/600 then 600/0", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
    const first = claim(policy, { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] }, 2000);
    expect(first).toMatchObject({ payout: 1400, remainingCap: 600 });
    const second = claim(policy, { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] }, first.remainingCap);
    expect(second).toMatchObject({ payout: 600, remainingCap: 0 });
  });
});

describe("claim - policy coverage validation", () => {
  it("two swords both damaged -> 800", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "sword", material: "steel", enchantment: 3 }] };
    expect(
      claim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] }, Infinity),
    ).toMatchObject({ payout: 800 });
  });
  it("more damages than covered -> throws", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
    expect(() =>
      claim(policy, { cause: "x", damages: [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }] }, Infinity),
    ).toThrow();
  });
  it("damage item not in policy -> throws", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
    expect(() =>
      claim(policy, { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] }, Infinity),
    ).toThrow();
  });
  it("negative damage amount -> throws", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
    expect(() =>
      claim(policy, { cause: "x", damages: [{ itemType: "sword", amount: -200 }] }, Infinity),
    ).toThrow();
  });
});

describe("insuranceSum and cap derivation", () => {
  it("sword+amulet -> insurance sum 1600, cap 3200", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(insuranceSum(items)).toBe(1600);
    expect(policyCap(items)).toBe(3200);
  });
  it("cursed sword -> cap 2000 (unmodified insurance value)", () => {
    expect(policyCap([{ type: "sword", cursed: true }])).toBe(2000);
  });
  it("sword + 3 runes block -> insurance sum 1750, cap 3500", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(insuranceSum(items)).toBe(1750);
    expect(policyCap(items)).toBe(3500);
  });
});

describe("claim - rounding in favor (down)", () => {
  it("payout 350.5 -> 350 (rounded down)", () => {
    const policy = { items: [{ type: "sword", material: "steel", enchantment: 8 }] };
    expect(claim(policy, { cause: "x", damages: [{ itemType: "sword", amount: 901 }] }, Infinity))
      .toMatchObject({ payout: 350 });
  });
});
