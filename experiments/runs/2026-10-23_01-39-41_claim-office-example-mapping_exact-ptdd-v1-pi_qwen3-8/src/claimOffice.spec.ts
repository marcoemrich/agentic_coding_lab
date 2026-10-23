import { describe, expect, it } from "vitest";
import { computeBasePremium, processScenario } from "./claimOffice.js";
import type { DamageEntry, QuoteItem } from "./claimOffice.js";

// Helper: run a single-quote scenario and return its premium.
function quotePremium(items: QuoteItem[], yearsWithMHPCO = 0): number {
  const { results } = processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return results[0].premium as number;
}

// Helper: quote items then claim the given damages against that policy.
function claimResults(quoteItems: QuoteItem[], damages: DamageEntry[], yearsWithMHPCO = 0) {
  const { results } = processScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items: quoteItems },
      { op: "claim", policy: 0, incident: { cause: "incident", damages } },
    ],
  });
  return results;
}

// MHPCO Claim Office — Predictive TDD test list.
//
// Every behavior from prompt.md is captured here as an INACTIVE it.todo entry,
// ordered from simplest to most complex. Exactly one entry is activated per
// Red-Green-Refactor cycle. Expected values are written into each description
// so the list is self-documenting.
//
// Domain unit under test: processScenario(scenario) -> { results }.
// Base-premium isolation uses computeBasePremium(items) because the CLI always
// layers the first-insurance surcharge and the processing fee on top, so the
// spec's "base premium" examples can only be observed before those modifiers.

describe("computeBasePremium — MHPCO price list (base premium, no modifiers)", () => {
  it("prices a single sword at 100 G base premium", () => {
    expect(computeBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("prices a single amulet at 60 G base premium", () => {
    expect(computeBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("prices a single staff at 80 G base premium", () => {
    expect(computeBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("prices a single potion at 40 G base premium", () => {
    expect(computeBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("prices a single rune component at 25 G base premium", () => {
    expect(computeBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("prices a single moonstone component at 25 G base premium", () => {
    expect(computeBasePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("prices 2 runes at 50 G base premium (2x25, no block yet)", () => {
    expect(computeBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices 3 alike runes as a building block at 60 G base premium", () => {
    expect(computeBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("prices 4 runes at 100 G base premium (no block — block requires exactly 3)", () => {
    expect(computeBasePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G base premium (7x25, no block)", () => {
    expect(computeBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes + 1 moonstone at 75 G base premium (no block: different types are not alike)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(computeBasePremium(items)).toBe(75);
  });
  it("prices 3 runes + 3 moonstones at 120 G base premium (two separate blocks)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(computeBasePremium(items)).toBe(120);
  });
});

describe("quote premium — single modifiers (first contract)", () => {
  it("plain sword, 0 years, first contract -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], 0)).toBe(115);
  });
  it("cursed amulet, 0 years, first contract -> 101 G (cursed adds 50% of the amulet's 60 G base)", () => {
    expect(quotePremium([{ type: "amulet", cursed: true }], 0)).toBe(101);
  });
  it("sword with exactly enchantment 5, 0 years -> 145 G (high-enchantment adds 30%)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("sword with enchantment 4, 0 years -> 115 G (no high-enchantment surcharge below 5)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 4 }], 0)).toBe(115);
  });
  it("cursed sword with enchantment 5, 0 years -> 195 G (cursed and high-enchantment both apply)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 5, cursed: true }], 0)).toBe(195);
  });
  it("cursed sword with enchantment 4, 0 years -> 165 G (cursed applies, no high-enchantment)", () => {
    expect(quotePremium([{ type: "sword", enchantment: 4, cursed: true }], 0)).toBe(165);
  });
  it("sword with exactly 2 years customer, first contract -> 95 G (loyalty 20% applies at threshold)", () => {
    expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
  });
  it("sword with 1 year customer, first contract -> 115 G (no loyalty below 2 years)", () => {
    expect(quotePremium([{ type: "sword" }], 1)).toBe(115);
  });
});

describe("quote premium — follow-up contract discount", () => {
  it("second quote of a scenario gets the 15% follow-up discount -> first sword 115 G, second sword 100 G", () => {
    const { results } = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[0].premium).toBe(115);
    expect(results[1].premium).toBe(100);
  });
});

describe("quote premium — modifier scope on multi-item policies", () => {
  it("policy base premium for a cursed sword + a plain amulet is 160 G (catalog bases summed; curse is not part of the base)", () => {
    const items: QuoteItem[] = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(computeBasePremium(items)).toBe(160);
  });
  it("cursed surcharge applies to the cursed sword's base (100), not the policy total -> full premium 231 G (160 base + 50 curse + 16 first insurance + 5 fee)", () => {
    const items: QuoteItem[] = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quotePremium(items, 0)).toBe(231);
  });
});

describe("quote premium — integration examples", () => {
  it("newcomer with a cursed sword (0 years, first contract, steel ench 3) -> 165 G", () => {
    const items: QuoteItem[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(quotePremium(items, 0)).toBe(165);
  });
  it("long-standing customer's second contract (3 years, cursed sword steel ench 7) -> second quote 160 G", () => {
    const { results } = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[0].premium).toBe(95);
    expect(results[1].premium).toBe(160);
  });
});

describe("quote premium — rounding in the MHPCO's favor", () => {
  it("single rune (0 years, first contract) yields unrounded 32.5 G -> rounds up to 33 G", () => {
    expect(quotePremium([{ type: "rune" }], 0)).toBe(33);
  });
});

describe("quote — edge cases", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([], 0)).toBe(5);
  });
});

describe("claim — standard reimbursement (no special clause)", () => {
  it("regular sword (steel, ench 3), damage 500 -> payout 400, remainingCap 1600", () => {
    const results = claimResults(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(results[1].payout).toBe(400);
    expect(results[1].remainingCap).toBe(1600);
  });
  it("rune, damage 200 -> payout 100, remainingCap 400 (runes have no enchantment or material)", () => {
    const results = claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
    expect(results[1].payout).toBe(100);
    expect(results[1].remainingCap).toBe(400);
  });
});

describe("claim — deductible per damaged item", () => {
  it("sword (500) + amulet (300) damaged in one incident -> payout 600 (100 G deductible once per damaged item)", () => {
    const results = claimResults(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    );
    expect(results[1].payout).toBe(600);
    expect(results[1].remainingCap).toBe(2600);
  });
});

describe("claim — insurance sum and cap from catalog values", () => {
  it("staff insurance value 800 -> cap 1600 (claim damage 100 -> payout 0, remainingCap 1600)", () => {
    const results = claimResults([{ type: "staff" }], [{ itemType: "staff", amount: 100 }]);
    expect(results[1].payout).toBe(0);
    expect(results[1].remainingCap).toBe(1600);
  });
  it("potion insurance value 400 -> cap 800 (claim damage 100 -> payout 0, remainingCap 800)", () => {
    const results = claimResults([{ type: "potion" }], [{ itemType: "potion", amount: 100 }]);
    expect(results[1].payout).toBe(0);
    expect(results[1].remainingCap).toBe(800);
  });
  it("moonstone insurance value 250 -> cap 500 (claim damage 100 -> payout 0, remainingCap 500)", () => {
    const results = claimResults([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 100 }]);
    expect(results[1].payout).toBe(0);
    expect(results[1].remainingCap).toBe(500);
  });
});

describe("claim — enchantment threshold vs dragon material", () => {
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400 (the 50% rule wins over dragon)", () => {
    const results = claimResults(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(results[1].payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700 (dragon material fully reimbursed)", () => {
    const results = claimResults(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    );
    expect(results[1].payout).toBe(700);
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400 (high-enchantment reimbursed at 50%)", () => {
    const results = claimResults(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(results[1].payout).toBe(400);
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 -> payout 400 (enchantment >= 8 threshold applies)", () => {
    const results = claimResults(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(results[1].payout).toBe(400);
  });
});

describe("claim — multiple items of the same type", () => {
  it("two insured swords -> insurance sum 2000, cap 4000 (one sword damage 500 -> payout 400, remainingCap 3600)", () => {
    const results = claimResults(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(results[1].payout).toBe(400);
    expect(results[1].remainingCap).toBe(3600);
  });
  it("two sword damage entries -> separate deductibles (both 500 -> payout 800, remainingCap 3200)", () => {
    const results = claimResults(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    );
    expect(results[1].payout).toBe(800);
    expect(results[1].remainingCap).toBe(3200);
  });
});

describe("claim — cap basis and exhaustion", () => {
  it("cursed sword cap is based on insurance value not premium (damage 1500 -> payout 1400, remainingCap 600)", () => {
    const results = claimResults(
      [{ type: "sword", cursed: true }],
      [{ itemType: "sword", amount: 1500 }],
    );
    expect(results[1].payout).toBe(1400);
    expect(results[1].remainingCap).toBe(600);
  });
  it("sword + 3-rune block -> insurance sum 1750, cap 3500 (block affects premium only; sword damage 500 -> payout 400, remainingCap 3100)", () => {
    const results = claimResults(
      [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(results[1].payout).toBe(400);
    expect(results[1].remainingCap).toBe(3100);
  });
  it("cap exhaustion: two successive claims of 1500 on a sword -> first payout 1400 (remainingCap 600), second payout 600 (remainingCap 0)", () => {
    const { results } = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(results[1].payout).toBe(1400);
    expect(results[1].remainingCap).toBe(600);
    expect(results[2].payout).toBe(600);
    expect(results[2].remainingCap).toBe(0);
  });
});

describe("claim — payout rounding in the MHPCO's favor", () => {
  it("enchanted sword (ench 8), damage 901 -> payout 350 (350.5 rounds down), remainingCap 1650", () => {
    const results = claimResults(
      [{ type: "sword", enchantment: 8 }],
      [{ itemType: "sword", amount: 901 }],
    );
    expect(results[1].payout).toBe(350);
    expect(results[1].remainingCap).toBe(1650);
  });
});

describe("scenario — normative schema example", () => {
  it("5-year customer, amulet quote then amulet claim -> premium 59, payout 100, remainingCap 1100", () => {
    const { results } = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(results[0].premium).toBe(59);
    expect(results[1].payout).toBe(100);
    expect(results[1].remainingCap).toBe(1100);
  });
});
