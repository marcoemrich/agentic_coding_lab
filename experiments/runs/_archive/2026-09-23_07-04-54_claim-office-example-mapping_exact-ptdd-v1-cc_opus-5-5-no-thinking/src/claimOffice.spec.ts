import { describe, expect, it } from "vitest";
import { type ClaimResult, type Damage, type InsuredItem, type QuoteResult, type Scenario, runScenario } from "./claimOffice.js";

function premiumOf(items: InsuredItem[], yearsWithMHPCO = 0): number {
  const scenario: Scenario = { customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] };
  return (runScenario(scenario).results[0] as QuoteResult).premium;
}

function claimsOn(items: InsuredItem[], ...incidents: Damage[][]): ClaimResult[] {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...incidents.map((damages) => ({ op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } })),
    ],
  };
  return runScenario(scenario).results.slice(1) as ClaimResult[];
}

function components(type: string, count: number): InsuredItem[] {
  return Array.from({ length: count }, () => ({ type }));
}

const runes = (count: number): InsuredItem[] => components("rune", count);

// Quote premiums below are final premiums for a newcomer's (0 years) first
// quote unless stated: policy base + item surcharges + 10 % first insurance
// on the policy base, + 5 G fee, rounded up.
describe("claim office quote", () => {
  it("empty item list -> premium 5 (fee only)", () => {
    expect(premiumOf([])).toBe(5);
  });
  it("plain sword (base 100) -> premium 115", () => {
    expect(premiumOf([{ type: "sword" }])).toBe(115);
  });
  it("plain amulet (base 60) -> premium 71", () => {
    expect(premiumOf([{ type: "amulet" }])).toBe(71);
  });
  it("plain staff (base 80) -> premium 93", () => {
    expect(premiumOf([{ type: "staff" }])).toBe(93);
  });
  it("plain potion (base 40) -> premium 49", () => {
    expect(premiumOf([{ type: "potion" }])).toBe(49);
  });
  it("single moonstone (base 25) -> premium 33 (32.5 rounded up)", () => {
    expect(premiumOf([{ type: "moonstone" }])).toBe(33);
  });
  it("2 runes (base 50) -> premium 60", () => {
    expect(premiumOf(runes(2))).toBe(60);
  });
  it("3 runes form a block (base 60) -> premium 71", () => {
    expect(premiumOf(runes(3))).toBe(71);
  });
  it("4 runes get no block (base 100) -> premium 115", () => {
    expect(premiumOf(runes(4))).toBe(115);
  });
  it("7 runes (base 175) -> premium 198 (197.5 rounded up in MHPCO's favor)", () => {
    expect(premiumOf(runes(7))).toBe(198);
  });
  it("2 runes + 1 moonstone are not alike (base 75) -> premium 88", () => {
    expect(premiumOf([...runes(2), { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones form two blocks (base 120) -> premium 137", () => {
    expect(premiumOf([...runes(3), ...components("moonstone", 3)])).toBe(137);
  });
  it("cursed steel sword enchantment 3, newcomer -> premium 165", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge -> premium 145", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("cursed sword with enchantment 5 -> both surcharges -> premium 195", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("cursed sword + plain amulet -> curse applies to the sword only (210 before policy modifiers) -> premium 231", () => {
    expect(premiumOf([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("customer with 1 year -> no loyalty discount on a sword -> premium 115", () => {
    expect(premiumOf([{ type: "sword" }], 1)).toBe(115);
  });
  it("customer with exactly 2 years -> loyalty discount on a sword -> premium 95", () => {
    expect(premiumOf([{ type: "sword" }], 2)).toBe(95);
  });
  it("newcomer's second quote for a sword -> 15 % follow-up discount -> premium 100", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    expect((runScenario(scenario).results[1] as QuoteResult).premium).toBe(100);
  });
  it("3-year customer's second quote for a cursed steel sword enchantment 7 -> premium 160", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect((runScenario(scenario).results[1] as QuoteResult).premium).toBe(160);
  });
});

// Claim payouts: each damage entry is matched to the next not-yet-damaged
// insured item of that type in the policy (in item order).
describe("claim office claim", () => {
  it("regular steel sword enchantment 3, damage 500 -> payout 400, remaining cap 1600", () => {
    const [result] = claimsOn([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune, damage 200 -> payout 100, remaining cap 400", () => {
    const [result] = claimsOn(runes(1), [{ itemType: "rune", amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 (50 % clause)", () => {
    const [result] = claimsOn([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 (full reimbursement)", () => {
    const [result] = claimsOn([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]);
    expect(result).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (50 % rule wins)", () => {
    const [result] = claimsOn([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 -> payout 400", () => {
    const [result] = claimsOn([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword enchantment 9, damage 901 -> payout 350 (350.5 rounded down)", () => {
    const [result] = claimsOn([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("sword 500 + amulet 300 in one incident -> payout 600 (deductible per item), remaining cap 2600", () => {
    const [result] = claimsOn(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("staff (insurance value 800), damage 500 -> payout 400, remaining cap 1200", () => {
    const [result] = claimsOn([{ type: "staff" }], [{ itemType: "staff", amount: 500 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1200 });
  });
  it("potion (insurance value 400), damage 500 -> payout 400, remaining cap 400", () => {
    const [result] = claimsOn([{ type: "potion" }], [{ itemType: "potion", amount: 500 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 400 });
  });
  it("two swords both damaged 500 -> payout 800 (own deductible each), remaining cap 3200 (cap 4000)", () => {
    const [result] = claimsOn(
      [{ type: "sword" }, { type: "sword" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    );
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("cursed sword policy -> cap 2000 from unmodified insurance value: damage 1500 -> payout 1400, remaining cap 600", () => {
    const [result] = claimsOn([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 1500 }]);
    expect(result).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword + 3 runes block -> insurance sum 1750, cap 3500: sword damage 500 -> remaining cap 3100", () => {
    const [result] = claimsOn([{ type: "sword" }, ...runes(3)], [{ itemType: "sword", amount: 500 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("sword, two successive claims of 1500 -> payouts 1400 then 600 (reduced to remaining cap), remaining cap 600 then 0", () => {
    const damage = { itemType: "sword", amount: 1500 };
    expect(claimsOn([{ type: "sword" }], [damage], [damage])).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});
