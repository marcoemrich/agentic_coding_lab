import { describe, it, expect } from "vitest";
import { runScenario, Scenario } from "./claim-office.js";

function quote(items: any[], years = 0, prior: any[] = []): number {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO: years },
    steps: [...prior.map((it) => ({ op: "quote" as const, items: it })), { op: "quote", items }],
  };
  const result = runScenario(scenario);
  const last = result.results[result.results.length - 1] as { premium: number };
  return last.premium;
}

function claim(items: any[], damages: any[], years = 0): { payout: number; remainingCap: number } {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO: years },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "test", damages } },
    ],
  };
  const result = runScenario(scenario);
  return result.results[1] as { payout: number; remainingCap: number };
}

describe("Item values and base premiums", () => {
  it("sword: 100 G base premium (newcomer, single item: 100 + 10 first ins + 5 fee = 115)", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });

  it("amulet: 60 G base premium (60 + 6 + 5 = 71)", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });

  it("staff: 80 G base premium (80 + 8 + 5 = 93)", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });

  it("potion: 40 G base premium (40 + 4 + 5 = 49)", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
});

describe("Building block of 3 alike components (base premiums shown)", () => {
  it("2 runes → 50 G base premium (newcomer: 50 + 5 first + 5 fee = 60)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });

  it("3 runes → 60 G base premium (block applies) (60 + 6 + 5 = 71)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });

  it("4 runes → 100 G base premium (no block — block requires exactly 3) (100 + 10 + 5 = 115)", () => {
    expect(quote(Array(4).fill({ type: "rune" }))).toBe(115);
  });

  it("7 runes → 175 G base premium (no block; exactly-3 rule) (175 + 17.5 + 5 = 197.5 → 198)", () => {
    expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
  });
});

describe("'Alike' components (clarification: same type, not family)", () => {
  it("2 runes + 1 moonstone → 75 G base premium (no block) (75 + 8 + 5 = 88 — rounded up)", () => {
    // 75 base + 7.5 first ins = 82.5 + 5 = 87.5 → 88
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) (120 + 12 + 5 = 137)", () => {
    expect(
      quote([
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ]),
    ).toBe(137);
  });
});

describe("Modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet → 210 G before policy modifiers; with first ins (newcomer): 210 + 16 + 5 = 231", () => {
    // 100*1.5 + 60 = 210; +16 (10% of 160 plain base) = 226; +5 fee = 231
    expect(quote([
      { type: "sword", cursed: true },
      { type: "amulet" },
    ])).toBe(231);
  });
});

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years gets loyalty discount: amulet 60 + 6 first - 12 loyalty = 54 + 5 = 59", () => {
    expect(quote([{ type: "amulet" }], 2)).toBe(59);
  });

  it("sword with exactly enchantment 5 → high-enchantment surcharge applies: 100*1.3 + 10 + 5 = 145", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });

  it("sword with enchantment 5 AND cursed → both surcharges apply: 100*(1+0.5+0.3) + 10 + 5 = 195", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });

  it("sword with enchantment 4 → no high-enchant surcharge: 100 + 10 + 5 = 115", () => {
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });

  it("dragon-material sword, exactly enchantment 8, damage 1000 → payout 400", () => {
    const r = claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]);
    expect(r.payout).toBe(400);
  });
});

describe("Deductible per damage event", () => {
  it("damages to sword (500) and amulet (300) → payout 600 (deductible per item)", () => {
    const r = claim(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );
    expect(r.payout).toBe(600);
  });
});

describe("Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, enchant 3), damage 500 → payout 400", () => {
    const r = claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]);
    expect(r.payout).toBe(400);
  });

  it("rune damage 200 → payout 100", () => {
    const r = claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
    expect(r.payout).toBe(100);
  });
});

describe("Enchantment threshold vs. dragon material", () => {
  it("dragon sword, enchant 9, damage 1000 → payout 400 (50% wins, then deductible)", () => {
    const r = claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]);
    expect(r.payout).toBe(400);
  });

  it("dragon sword, enchant 5, damage 800 → payout 700 (full reimbursement, then deductible)", () => {
    const r = claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]);
    expect(r.payout).toBe(700);
  });

  it("steel sword, enchant 9, damage 1000 → payout 400 (50% then deductible)", () => {
    const r = claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]);
    expect(r.payout).toBe(400);
  });
});

describe("Multiple items of the same type", () => {
  it("two swords → insurance sum 2000, cap 4000", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    };
    const r = runScenario(scenario);
    const claim1 = r.results[1] as { payout: number; remainingCap: number };
    expect(claim1.payout).toBe(800); // (500-100) * 2 = 800
    expect(claim1.remainingCap).toBe(4000 - 800);
  });

  it("damages array has more entries of a type than insured → CLI exits non-zero (throws)", () => {
    expect(() => claim(
      [{ type: "sword" }],
      [{ itemType: "sword", amount: 100 }, { itemType: "sword", amount: 100 }],
    )).toThrow();
  });
});

describe("Cap exhaustion", () => {
  it("sword + amulet → insurance sum 1600, cap 3200", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 100000 },
          { itemType: "amulet", amount: 100000 },
        ] } },
      ],
    };
    const r = runScenario(scenario);
    const c = r.results[1] as { payout: number; remainingCap: number };
    expect(c.payout).toBe(3200);
    expect(c.remainingCap).toBe(0);
  });

  it("cursed sword (cap based on unmodified insurance value): cap = 2000", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 100000 },
        ] } },
      ],
    };
    const r = runScenario(scenario);
    const c = r.results[1] as { payout: number; remainingCap: number };
    expect(c.payout).toBe(2000);
    expect(c.remainingCap).toBe(0);
  });

  it("sword + 3 runes block → insurance sum 1750 (block doesn't affect insurance sum)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 1000000 },
          { itemType: "rune", amount: 1000000 },
          { itemType: "rune", amount: 1000000 },
          { itemType: "rune", amount: 1000000 },
        ] } },
      ],
    };
    const r = runScenario(scenario);
    const c = r.results[1] as { payout: number; remainingCap: number };
    expect(c.payout).toBe(3500); // cap = 2 * 1750
  });

  it("successive claims exhaust cap: first 1400, then 600, remaining 0", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const r = runScenario(scenario);
    const c1 = r.results[1] as { payout: number; remainingCap: number };
    const c2 = r.results[2] as { payout: number; remainingCap: number };
    expect(c1.payout).toBe(1400);
    expect(c1.remainingCap).toBe(600);
    expect(c2.payout).toBe(600);
    expect(c2.remainingCap).toBe(0);
  });
});

describe("Rounding in the MHPCO's favor", () => {
  it("premium calc that yields fractional → rounded UP", () => {
    // 2 runes + 1 moonstone: 75 base + 7.5 first = 82.5 + 5 = 87.5 → 88
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });

  it("payout calc rounded DOWN (in MHPCO's favor)", () => {
    // Construct fractional payout via 50% rule: damage 901, high enchant → 450.5 - 100 = 350.5 → 350
    const r = claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]);
    expect(r.payout).toBe(350);
  });
});

describe("Edge cases", () => {
  it("empty item list → premium 5 (only processing fee)", () => {
    expect(quote([])).toBe(5);
  });

  it("unknown item type in quote → throws (CLI exits non-zero)", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow();
  });

  it("claim references item not in policy → throws", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 100 }])).toThrow();
  });

  it("claim with negative damage amount → throws", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow();
  });
});

describe("Integration examples", () => {
  it("Newcomer with cursed sword → 165", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });

  it("Long-standing customer (3 years), second contract, cursed enchant-7 sword → 160", () => {
    expect(quote(
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      3,
      [[{ type: "amulet" }]], // prior contract
    )).toBe(160);
  });
});
