import { describe, expect, it } from "vitest";
import {
  basePremiumFor,
  processScenario,
  type ClaimResult,
  type QuoteItem,
  type Scenario,
} from "./claim-office";

function quoteScenario(yearsWithMHPCO: number, items: QuoteItem[]): Scenario {
  return { customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] };
}

function quoteThenClaim(
  yearsWithMHPCO: number,
  items: QuoteItem[],
  damages: Array<{ itemType: string; amount: number }>,
): Scenario {
  return {
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  };
}

function premiumOf(scenario: Scenario): number {
  const result = processScenario(scenario).results[0];
  expect(result).toHaveProperty("premium");
  return (result as { premium: number }).premium;
}

function claimOf(scenario: Scenario): ClaimResult {
  return processScenario(scenario).results[1] as ClaimResult;
}

describe("price list base premiums (basePremiumFor)", () => {
  it("single sword -> base premium 100 G", () => {
    expect(basePremiumFor([{ type: "sword" }])).toBe(100);
  });
  it("single amulet -> base premium 60 G", () => {
    expect(basePremiumFor([{ type: "amulet" }])).toBe(60);
  });
  it("single staff -> base premium 80 G", () => {
    expect(basePremiumFor([{ type: "staff" }])).toBe(80);
  });
  it("single potion -> base premium 40 G", () => {
    expect(basePremiumFor([{ type: "potion" }])).toBe(40);
  });
  it("single rune component -> base premium 25 G", () => {
    expect(basePremiumFor([{ type: "rune" }])).toBe(25);
  });
  it("single moonstone component -> base premium 25 G", () => {
    expect(basePremiumFor([{ type: "moonstone" }])).toBe(25);
  });
  it("2 runes -> base premium 50 G (2 x 25)", () => {
    expect(basePremiumFor([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> base premium 60 G (building block applies)", () => {
    expect(
      basePremiumFor([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("4 runes -> base premium 100 G (no block: block requires exactly 3)", () => {
    expect(
      basePremiumFor([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("7 runes -> base premium 175 G (7 x 25, no block)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremiumFor(runes)).toBe(175);
  });
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types are not alike)", () => {
    expect(
      basePremiumFor([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks of 60 G)", () => {
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    expect(basePremiumFor(items)).toBe(120);
  });
  it("cursed sword + plain amulet -> policy base premium 160 G (curse is a modifier, not part of the base premium)", () => {
    expect(
      basePremiumFor([
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]),
    ).toBe(160);
  });
});

describe("quote premium", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(premiumOf(quoteScenario(0, []))).toBe(5);
  });
  it("newcomer (0 years, first quote), cursed sword enchantment 3 -> premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    expect(processScenario(scenario).results[0]).toEqual({ premium: 165 });
  });
  it("newcomer first quote, sword with exactly enchantment 5 -> premium 145 G (high-enchantment surcharge applies at the threshold)", () => {
    expect(
      premiumOf(
        quoteScenario(0, [{ type: "sword", material: "steel", enchantment: 5 }]),
      ),
    ).toBe(145);
  });
  it("newcomer first quote, sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge)", () => {
    expect(
      premiumOf(
        quoteScenario(0, [{ type: "sword", material: "steel", enchantment: 4 }]),
      ),
    ).toBe(115);
  });
  it("newcomer first quote, cursed sword with enchantment 5 -> premium 195 G (both surcharges apply)", () => {
    expect(
      premiumOf(
        quoteScenario(0, [
          { type: "sword", material: "steel", enchantment: 5, cursed: true },
        ]),
      ),
    ).toBe(195);
  });
  it("customer with 1 year, first quote, plain sword -> premium 115 G (no loyalty discount below 2 years)", () => {
    expect(
      premiumOf(quoteScenario(1, [{ type: "sword", material: "steel" }])),
    ).toBe(115);
  });
  it("customer with exactly 2 years, first quote, plain sword -> premium 95 G (loyalty discount applies at the threshold)", () => {
    expect(
      premiumOf(quoteScenario(2, [{ type: "sword", material: "steel" }])),
    ).toBe(95);
  });
  it("newcomer first quote, cursed sword + plain amulet -> premium 231 G (curse surcharge is 50% of the cursed item's base premium, not of the policy total)", () => {
    expect(
      premiumOf(
        quoteScenario(0, [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1 },
        ]),
      ),
    ).toBe(231);
  });
  it("newcomer first quote, 7 runes -> premium 198 G (197.5 G rounded up in the MHPCO's favor)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(premiumOf(quoteScenario(0, runes))).toBe(198);
  });
  it("newcomer with two successive quotes of a plain sword -> premiums [115 G, 100 G] (15% follow-up-contract discount on the second quote)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
      ],
    };
    expect(processScenario(scenario).results).toEqual([
      { premium: 115 },
      { premium: 100 },
    ]);
  });
  it("3-year customer's second quote, cursed sword enchantment 7 -> premium 160 G (100 + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ premium: 160 });
  });
});

describe("claim payout", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G, remaining cap 1600 G (full reimbursement minus deductible)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel", enchantment: 3 }],
          [{ itemType: "sword", amount: 500 }],
        ),
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment, no material), damage 200 G -> payout 100 G, remaining cap 400 G (no special clause for components)", () => {
    expect(
      claimOf(quoteThenClaim(0, [{ type: "rune" }], [{ itemType: "rune", amount: 200 }])),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (50% clause applies at the threshold, then deductible)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "dragon", enchantment: 8 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50% rule wins, then deductible)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "dragon", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (only the dragon-material clause: full reimbursement, then deductible)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "dragon", enchantment: 5 }],
          [{ itemType: "sword", amount: 800 }],
        ),
      ),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 7, damage 1000 G -> payout 900 G (below the enchantment-8 threshold only the dragon-material clause applies)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "dragon", enchantment: 7 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ),
    ).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (only the high-enchantment clause: 50% first, then deductible)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel", enchantment: 9 }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + amulet policy, damages sword 500 G and amulet 300 G -> payout 600 G (the 100 G deductible applies once per damaged item)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
          ],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two-swords policy, two sword damage entries of 500 G -> payout 800 G (each damage entry has its own deductible)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [
            { type: "sword", material: "steel" },
            { type: "sword", material: "steel" },
          ],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        ),
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("two-swords policy -> insurance sum 2000 G, cap 4000 G (damage 150 G -> payout 50 G, remaining cap 3950 G)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword" }, { type: "sword" }],
          [{ itemType: "sword", amount: 150 }],
        ),
      ),
    ).toEqual({ payout: 50, remainingCap: 3950 });
  });
  it("sword + amulet policy -> insurance sum 1600 G, cap 3200 G (damage 150 G -> payout 50 G, remaining cap 3150 G)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword" }, { type: "amulet" }],
          [{ itemType: "sword", amount: 150 }],
        ),
      ),
    ).toEqual({ payout: 50, remainingCap: 3150 });
  });
  it("cursed sword policy -> cap 2000 G based on the unmodified insurance value, not the premium (damage 150 G -> payout 50 G, remaining cap 1950 G)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          [{ itemType: "sword", amount: 150 }],
        ),
      ),
    ).toEqual({ payout: 50, remainingCap: 1950 });
  });
  it("sword + 3 runes (block) policy -> insurance sum 1750 G, cap 3500 G; the block discount affects the premium only (damage 150 G -> payout 50 G, remaining cap 3450 G)", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
          [{ itemType: "sword", amount: 150 }],
        ),
      ),
    ).toEqual({ payout: 50, remainingCap: 3450 });
  });
  it("sword policy (cap 2000 G), two successive claims of 1500 G -> first payout 1400 G remaining cap 600 G, second payout 600 G remaining cap 0 G (cap exhaustion)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    expect(processScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("steel sword enchantment 8, damage 901 G -> payout 350 G (450.5 - 100 = 350.5 rounded down), remaining cap 1650 G", () => {
    expect(
      claimOf(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel", enchantment: 8 }],
          [{ itemType: "sword", amount: 901 }],
        ),
      ),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("staff policy -> insurance sum 800 G, cap 1600 G (damage 150 G -> payout 50 G, remaining cap 1550 G)", () => {
    expect(
      claimOf(
        quoteThenClaim(0, [{ type: "staff" }], [{ itemType: "staff", amount: 150 }]),
      ),
    ).toEqual({ payout: 50, remainingCap: 1550 });
  });
  it("potion policy -> insurance sum 400 G, cap 800 G (damage 150 G -> payout 50 G, remaining cap 750 G)", () => {
    expect(
      claimOf(
        quoteThenClaim(0, [{ type: "potion" }], [{ itemType: "potion", amount: 150 }]),
      ),
    ).toEqual({ payout: 50, remainingCap: 750 });
  });
  it("moonstone policy -> insurance sum 250 G, cap 500 G (damage 150 G -> payout 50 G, remaining cap 450 G)", () => {
    expect(
      claimOf(
        quoteThenClaim(0, [{ type: "moonstone" }], [{ itemType: "moonstone", amount: 150 }]),
      ),
    ).toEqual({ payout: 50, remainingCap: 450 });
  });
});

describe("rejected input (chosen observable contract: processScenario throws an Error; the CLI translates this into a non-zero exit code with an error description on stderr)", () => {
  it("claim referencing a policy index that is out of range -> throws (chosen reading: a claim must reference an existing earlier quote step)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("claim damaging an amulet when only a sword is insured -> throws (item is not part of the policy)", () => {
    expect(() =>
      processScenario(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel" }],
          [{ itemType: "amulet", amount: 200 }],
        ),
      ),
    ).toThrow();
  });
  it("claim damaging an item of unknown type 'broomstick' -> throws", () => {
    expect(() =>
      processScenario(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel" }],
          [{ itemType: "broomstick", amount: 200 }],
        ),
      ),
    ).toThrow();
  });
  it("claim with a damage entry of amount -200 -> throws (negative damage amount)", () => {
    expect(() =>
      processScenario(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel" }],
          [{ itemType: "sword", amount: -200 }],
        ),
      ),
    ).toThrow();
  });
  it("two sword damage entries when only one sword is insured -> throws (whole claim rejected)", () => {
    expect(() =>
      processScenario(
        quoteThenClaim(
          0,
          [{ type: "sword", material: "steel" }],
          [
            { itemType: "sword", amount: 300 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ),
    ).toThrow();
  });
  it("quote including an item of unknown type 'broomstick' -> throws (no results produced)", () => {
    expect(() =>
      processScenario(quoteScenario(0, [{ type: "broomstick" }])),
    ).toThrow();
  });
});

describe("end-to-end scenario", () => {
  it("schema example: 5-year customer quotes an amulet (silver, enchantment 2) then claims 200 G fire damage -> [{premium: 59}, {payout: 100, remainingCap: 1100}]", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    expect(processScenario(scenario).results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
});
