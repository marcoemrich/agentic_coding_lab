import { describe, it, expect } from "vitest";
import {
  runScenario,
  Scenario,
} from "./claim-office.js";

// Helper to quote a single item-list under a customer with given years.
// Returns the premium integer.
function quote(items: object[], yearsWithMHPCO = 0): number {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items: items as never }],
  };
  const result = runScenario(scenario).results[0];
  if (!("premium" in result)) throw new Error("Expected quote result");
  return result.premium;
}

describe("base item prices and premiums", () => {
  it("sword: insurance value 1000 G, base premium 100 G -> premium 105 G (100 + 10 first + 5 fee, rounded up = 115)", () => {
    // 100 base + 10 first-insurance + 5 fee = 115
    expect(quote([{ type: "sword" }])).toBe(115);
  });

  it("amulet: base premium 60 G -> premium 71 G (60 + 6 first + 5 fee)", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });

  it("staff: base premium 80 G -> premium 93 G (80 + 8 first + 5 fee)", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });

  it("potion: base premium 40 G -> premium 49 G (40 + 4 first + 5 fee)", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
});

describe("building block of 3 alike components", () => {
  // From spec: base premiums shown before integration. We back out by
  // setting up scenarios where only the block discount drives the difference,
  // and check the final premium reflects the spec example.

  it("2 runes -> 50 G base premium (2 * 25)", () => {
    // 50 + 5 first + 5 fee = 60
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });

  it("3 runes -> 60 G base premium (block applies)", () => {
    // 60 + 7.5 first + 5 fee = 72.5 -> 73 (rounded up)
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(73);
  });

  it("4 runes -> 100 G base premium (no block; block requires exactly 3)", () => {
    // 100 + 10 first + 5 fee = 115
    expect(
      quote([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(115);
  });

  it("7 runes -> 175 G base premium (one block of 3 + 4 singles = 60 + 100)", () => {
    // 175 + 17.5 first + 5 fee = 197.5 -> 198 (rounded up)
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(items)).toBe(198);
  });
});

describe("'alike' components clarifying question", () => {
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    // 75 + 7.5 first + 5 fee = 87.5 -> 88
    expect(
      quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(88);
  });

  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    // 120 + 15 first + 5 fee = 140
    expect(
      quote([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(140);
  });
});

describe("modifier scope on multi-item policies", () => {
  it("cursed sword (100 G) + plain amulet (60 G) -> policy base 160 G; cursed surcharge 50 G (50% of cursed item only) -> 210 G before fee/other modifiers", () => {
    // 100 + 60 + 50 (curse) + 10 (sword first) + 6 (amulet first) = 226 + 5 = 231
    expect(
      quote([
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]),
    ).toBe(231);
  });
});

describe("modifier thresholds", () => {
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    // sword: 100 base + 10 first - 20 loyalty = 90 + 5 = 95
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });

  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies (premium = 100 + 30 + 10 + 5 = 145)", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });

  it("cursed sword with exactly enchantment 5 -> both surcharges apply (100 + 50 + 30 + 10 + 5 = 195)", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });

  it("sword with enchantment 4 -> no high-enchantment surcharge (100 + 10 + 5 = 115)", () => {
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });

  it("cursed sword with enchantment 4 -> only curse surcharge applies (100 + 50 + 10 + 5 = 165)", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe("processing fee", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quote([])).toBe(5);
  });
});

describe("rounding in MHPCO's favor", () => {
  it("premium calculation yielding 197.5 G -> 198 G (rounded up)", () => {
    // 7 runes scenario already yields 197.5
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(items)).toBe(198);
  });

  it("payout calculation yielding fractional amount is rounded down (350.5 -> 350)", () => {
    // Construct: dragon sword enchantment 8, damage 901 G ->
    // 50% rule: 450.5; -100 deductible = 350.5 -> 350
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8 } as never,
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("payout" in result)) throw new Error("Expected claim result");
    expect(result.payout).toBe(350);
  });
});

describe("integration examples", () => {
  it("newcomer with cursed sword: premium 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
    expect(
      quote(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        0,
      ),
    ).toBe(165);
  });

  it("long-standing customer's second contract with cursed sword enchantment 7: premium 160 G", () => {
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 followup = 155 + 5 = 160
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // first quote (some prior contract — content doesn't affect the test target)
        { op: "quote", items: [{ type: "amulet" } as never] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true } as never,
          ],
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("premium" in result)) throw new Error("Expected quote result");
    expect(result.premium).toBe(160);
  });

  it("first-insurance surcharge applies per item, regardless of customer history (each item is a 'first insurance')", () => {
    // long-standing customer (3 yrs), second contract, sword item:
    // 100 base + 10 first - 20 loyalty - 15 followup = 75 + 5 = 80
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" } as never] },
        { op: "quote", items: [{ type: "sword" } as never] },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("premium" in result)) throw new Error("Expected quote result");
    expect(result.premium).toBe(80);
  });
});

// === Claim processing ===

function singleSwordPolicyClaim(
  item: object,
  damageAmount: number,
): { payout: number; remainingCap: number } {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [item as never] },
      {
        op: "claim",
        policy: 0,
        incident: {
          cause: "test",
          damages: [{ itemType: "sword", amount: damageAmount }],
        },
      },
    ],
  };
  const result = runScenario(scenario).results[1];
  if (!("payout" in result)) throw new Error("Expected claim result");
  return result;
}

describe("claim: standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (500 - 100 deductible)", () => {
    const r = singleSwordPolicyClaim(
      { type: "sword", material: "steel", enchantment: 3 },
      500,
    );
    expect(r.payout).toBe(400);
  });

  it("rune (insurance value 250 G), damage 200 G -> payout 100 G (200 - 100 deductible; no special clause)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("payout" in result)) throw new Error("Expected claim result");
    expect(result.payout).toBe(100);
  });
});

describe("claim: enchantment threshold vs dragon material", () => {
  it("dragon-material sword, exactly enchantment 8, damage 1000 G -> payout 400 G (50% rule, then deductible)", () => {
    const r = singleSwordPolicyClaim(
      { type: "sword", material: "dragon", enchantment: 8 },
      1000,
    );
    expect(r.payout).toBe(400);
  });

  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% rule wins, then deductible)", () => {
    const r = singleSwordPolicyClaim(
      { type: "sword", material: "dragon", enchantment: 9 },
      1000,
    );
    expect(r.payout).toBe(400);
  });

  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (only dragon-material applies)", () => {
    const r = singleSwordPolicyClaim(
      { type: "sword", material: "dragon", enchantment: 5 },
      800,
    );
    expect(r.payout).toBe(700);
  });

  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50% rule, then deductible)", () => {
    const r = singleSwordPolicyClaim(
      { type: "sword", material: "steel", enchantment: 9 },
      1000,
    );
    expect(r.payout).toBe(400);
  });
});

describe("claim: deductible per damage event", () => {
  it("dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (100 G deductible per item)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("payout" in result)) throw new Error("Expected claim result");
    expect(result.payout).toBe(600);
  });
});

describe("claim: multiple items of the same type", () => {
  it("policy of two swords -> insurance sum 2000 G, cap 4000 G; dragon damages both -> two damages each with own deductible", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("payout" in result)) throw new Error("Expected claim result");
    // each 500 - 100 = 400; total 800; remainingCap 4000-800=3200
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });

  it("damages array has more entries of a type than the policy covers -> claim rejected (throws)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe("claim: cap exhaustion", () => {
  it("sword and amulet: insurance sum 1600 G, cap 3200 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("payout" in result)) throw new Error("Expected claim result");
    // payout 200-100 = 100; remainingCap = 3200 - 100 = 3100
    expect(result.remainingCap).toBe(3100);
  });

  it("cursed sword: cap 2000 G (based on unmodified insurance value; premium modifiers don't raise cap)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("payout" in result)) throw new Error("Expected claim result");
    // payout 100-100 = 0; remainingCap = 2000 - 0 = 2000
    expect(result.remainingCap).toBe(2000);
  });

  it("sword and 3 runes (block) -> insurance sum 1750 G (block discount affects premium only)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };
    const result = runScenario(scenario).results[1];
    if (!("payout" in result)) throw new Error("Expected claim result");
    // cap = 1750 * 2 = 3500; payout 200-100 = 100; remainingCap = 3400
    expect(result.remainingCap).toBe(3400);
  });

  it("sword (cap 2000 G) two successive claims of 1500 G: first payout 1400, cap remaining 600; second payout 600, cap remaining 0", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const results = runScenario(scenario).results;
    const claim1 = results[1];
    const claim2 = results[2];
    if (!("payout" in claim1) || !("payout" in claim2)) throw new Error("expected claim results");
    expect(claim1.payout).toBe(1400);
    expect(claim1.remainingCap).toBe(600);
    expect(claim2.payout).toBe(600);
    expect(claim2.remainingCap).toBe(0);
  });
});

describe("edge cases", () => {
  it("quote with unknown item type -> runScenario throws (CLI exits non-zero)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" } as never] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("claim references damage entry whose item is not part of the policy -> throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("claim contains a damage entry with amount: -200 -> throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
