import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";
import type { Scenario } from "./scenario.js";

const q = (items: any[]): Scenario => ({
  customer: { yearsWithMHPCO: 0 },
  steps: [{ op: "quote", items }],
});

describe("Quote - empty and single main items", () => {
  it("empty item list returns premium 5 (processing fee only)", () => {
    const result = runScenario(q([]));
    expect(result[0]).toEqual({ premium: 5 });
  });

  it("single sword (steel, no enchant, not cursed) -> 115 G (100 base + 10 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "sword", material: "steel" }]));
    expect(result[0]).toEqual({ premium: 115 });
  });

  it("single amulet (silver, no enchant, not cursed) -> 71 G (60 base + 6 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "amulet", material: "silver" }]));
    expect(result[0]).toEqual({ premium: 71 });
  });

  it("single staff (oak, no enchant, not cursed) -> 93 G (80 base + 8 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "staff", material: "oak" }]));
    expect(result[0]).toEqual({ premium: 93 });
  });

  it("single potion (no enchant, not cursed) -> 49 G (40 base + 4 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "potion" }]));
    expect(result[0]).toEqual({ premium: 49 });
  });
});

describe("Quote - multiple main items", () => {
  it("two swords -> 225 G (200 base + 20 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "sword", material: "steel" }, { type: "sword", material: "steel" }]));
    expect(result[0]).toEqual({ premium: 225 });
  });

  it("sword + amulet -> 181 G (160 base + 16 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "sword" }, { type: "amulet" }]));
    expect(result[0]).toEqual({ premium: 181 });
  });
});

describe("Quote - components and blocks", () => {
  it("2 runes -> 60 G (50 base + 5 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "rune" }, { type: "rune" }]));
    expect(result[0]).toEqual({ premium: 60 });
  });

  it("3 runes (block applies) -> 71 G (60 base + 6 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "rune" }, { type: "rune" }, { type: "rune" }]));
    expect(result[0]).toEqual({ premium: 71 });
  });

  it("4 runes (no block) -> 115 G (100 base + 10 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]));
    expect(result[0]).toEqual({ premium: 115 });
  });

  it("7 runes -> 198 G (175 base + 17.5 first ins + 5 fee, rounded UP)", () => {
    const result = runScenario(q(Array(7).fill({ type: "rune" })));
    expect(result[0]).toEqual({ premium: 198 });
  });

  it("2 runes + 1 moonstone (different types, no block) -> 88 G (75 base + 7.5 first ins + 5 fee, rounded UP)", () => {
    const result = runScenario(q([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]));
    expect(result[0]).toEqual({ premium: 88 });
  });

  it("3 runes + 3 moonstones (two separate blocks) -> 137 G (120 base + 12 first ins + 5 fee)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    const result = runScenario(q(items));
    expect(result[0]).toEqual({ premium: 137 });
  });
});

describe("Quote - cursed item modifier", () => {
  it("cursed sword -> 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "sword", material: "steel", cursed: true }]));
    expect(result[0]).toEqual({ premium: 165 });
  });

  it("cursed sword + plain amulet -> 231 G (160 base + 50 curse + 16 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "sword", material: "steel", cursed: true }, { type: "amulet" }]));
    expect(result[0]).toEqual({ premium: 231 });
  });
});

describe("Quote - high enchantment modifier (>=5)", () => {
  it("sword enchantment 5 -> 145 G (100 base + 30 high enchant + 10 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "sword", material: "steel", enchantment: 5 }]));
    expect(result[0]).toEqual({ premium: 145 });
  });

  it("sword enchantment 4 (no high enchant) -> 115 G", () => {
    const result = runScenario(q([{ type: "sword", material: "steel", enchantment: 4 }]));
    expect(result[0]).toEqual({ premium: 115 });
  });

  it("cursed sword enchantment 5 -> 195 G (100 base + 50 curse + 30 high enchant + 10 first ins + 5 fee)", () => {
    const result = runScenario(q([{ type: "sword", material: "steel", enchantment: 5, cursed: true }]));
    expect(result[0]).toEqual({ premium: 195 });
  });
});

describe("Quote - loyalty discount (>=2 years)", () => {
  it("customer with exactly 2 years receives 20% loyalty discount on policy base premium", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = runScenario(scenario);
    // base 100, no item mods, first ins +10, loyalty -20 = 90, fee 5 = 95
    expect(result[0]).toEqual({ premium: 95 });
  });

  it("customer with 1 year receives no loyalty discount", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = runScenario(scenario);
    // base 100, no item mods, first ins +10 = 110, fee 5 = 115
    expect(result[0]).toEqual({ premium: 115 });
  });
});

describe("Quote - first insurance and follow-up contract", () => {
  it("newcomer (0y, first quote) applies 10% first-insurance surcharge to policy base", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = runScenario(scenario);
    // base 100, no loyalty, first ins +10, fee 5 = 115
    expect(result[0]).toEqual({ premium: 115 });
  });

  it("second quote applies 15% follow-up discount (and 10% first insurance still applies per item)", () => {
    // customer 3y, second quote, cursed sword enchantment 7 (integration example)
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] }, // first quote (counts as 1st contract)
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        }, // second quote (follow-up discount applies)
      ],
    };
    const result = runScenario(scenario);
    // Second quote:
    // base 100, curse +50, high enchant +30 = 180
    // first ins +10, loyalty -20, follow-up -15 = -25
    // 180 - 25 + 5 = 160
    expect(result[1]).toEqual({ premium: 160 });
  });
});

describe("Quote - integration examples", () => {
  it("newcomer (0y, first quote) with cursed sword -> 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    const result = runScenario(scenario);
    expect(result[0]).toEqual({ premium: 165 });
  });

  it("long-standing customer (3y, second quote) with cursed sword enchantment 7 -> 160 G (100 base + 50 curse + 30 high enchant + 10 first ins - 20 loyalty - 15 follow-up + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result[1]).toEqual({ premium: 160 });
  });
});

describe("Claim - standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (500 - 100 deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("rune damage 200 G -> payout 100 G (full - 100 deductible; runes have no enchantment/material)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dropped", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // 200 - 100 = 100
    // rune insurance value 250, cap 500, remaining cap 400
    expect(result[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe("Claim - high enchantment reimbursement (>=8)", () => {
  it("dragon-material sword enchantment 8 damage 1000 G -> payout 400 G (50% wins, then -100)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // 1000 * 0.5 = 500; 500 - 100 = 400
    // insurance sum 1000, cap 2000, remaining 1600
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("dragon-material sword enchantment 9 damage 1000 G -> payout 400 G (both clauses, 50% wins, then -100)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("steel sword enchantment 9 damage 1000 G -> payout 400 G (only high-enchant applies)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("dragon-material sword enchantment 5 damage 800 G -> payout 700 G (only dragon applies: full, then -100)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // 800 - 100 = 700 (dragon material: full reimbursement)
    expect(result[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
});

describe("Claim - deductible per damage event", () => {
  it("dragon attack damages sword 500 G + amulet 300 G -> payout 600 G (each damage has its own 100 deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = runScenario(scenario);
    // sword: 500 - 100 = 400
    // amulet: 300 - 100 = 200
    // total: 600
    // insurance sum 1600, cap 3200, remaining 2600
    expect(result[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("Claim - cap and insurance sum", () => {
  it("two swords -> cap 4000 G (insurance sum 2000)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // sword: 500 - 100 = 400
    // insurance sum 2000, cap 4000, remaining 3600
    expect(result[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });

  it("sword + amulet -> cap 3200 G (insurance sum 1600)", () => {
    // damage 3000 (full reimbursement minus 100 deductible = 2900 each, total 5800) - cap to 3200
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [
              { itemType: "sword", amount: 3000 },
              { itemType: "amulet", amount: 3000 },
            ],
          },
        },
      ],
    };
    const result = runScenario(scenario);
    // desired: sword 2900 + amulet 2900 = 5800; capped at 3200
    expect(result[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });

  it("cursed sword -> cap 2000 G (based on unmodified insurance value)", () => {
    // 1 cursed sword: insurance value 1000 (unmodified), cap 2000
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 3000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // 3000 - 100 = 2900; cap 2000
    expect(result[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  it("sword + 3 runes (block) -> insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
    // insurance sum: 1000 (sword) + 3*250 (runes) = 1750, cap 3500
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // 5000 - 100 = 4900; cap 3500
    expect(result[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  it("sword cap exhaustion: first claim of 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // 1500 - 100 = 1400; cap 2000, remaining 600
    expect(result[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });

  it("sword cap exhaustion: second claim of 1500 G -> payout 600 G (capped), remainingCap 0 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // first: 1400, remaining 600
    // second: desired 1400, but only 600 left
    expect(result[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("Claim - more damages than items", () => {
  it("two sword damages but policy only covers one sword -> claim rejected (throw)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("damage entry for an amulet when only a sword is insured -> claim rejected (throw)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "amulet", amount: 500 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it("damage entry with unknown item type -> claim rejected (throw)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "broomstick", amount: 500 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe("Quote errors", () => {
  it("quote with unknown item type -> rejected (throw)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe("Claim errors", () => {
  it("claim with negative damage amount -> rejected (throw)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe("Rounding", () => {
  it("premium calculation yielding 197.5 G rounds UP to 198 G", () => {
    // 7 runes: base 175, first ins 17.5, fee 5 = 197.5 -> rounds up to 198
    const result = runScenario(q(Array(7).fill({ type: "rune" })));
    expect(result[0]).toEqual({ premium: 198 });
  });

  it("payout calculation yielding 350.5 G rounds DOWN to 350 G", () => {
    // need a claim where (rate * amount - deductible) = 350.5
    // Let's say amount = 901 (full reimbursement), 901 - 100 = 801 (no)
    // Need 350.5 + 100 = 450.5 raw, so amount * rate = 450.5
    // If rate = 0.5, amount = 901; 901 * 0.5 = 450.5, 450.5 - 100 = 350.5
    // Need enchantment >= 8 for 50% rule. Damage is on a rune? Runes can't have enchantment.
    // Use a staff with enchantment 9.
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "staff", amount: 901 }] },
        },
      ],
    };
    const result = runScenario(scenario);
    // 901 * 0.5 = 450.5; 450.5 - 100 = 350.5; round down to 350
    expect(result[1]).toEqual({ payout: 350, remainingCap: expect.any(Number) });
  });
});

describe("Scenario processing", () => {
  it("processes a scenario with quote then claim referencing the quote's policy index", () => {
    // basic check that a quote creates a policy
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).not.toThrow();
  });

  it("multiple claims same policy tracking remainingCap", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // insurance 1000, cap 2000
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 500 }] },
        }, // payout 400, remaining 1600
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 200 }] },
        }, // payout 100, remaining 1500
      ],
    };
    const result = runScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
    expect(result[2]).toEqual({ payout: 100, remainingCap: 1500 });
  });
});
