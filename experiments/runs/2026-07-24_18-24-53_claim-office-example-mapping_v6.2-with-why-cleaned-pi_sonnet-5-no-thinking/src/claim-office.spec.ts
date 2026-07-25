import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Base premiums for main items (single item, no modifiers, newcomer) ---
  it("single sword, newcomer -> base premium 100 G + 10% first insurance + 5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet, newcomer -> base premium 60 G + 10% first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff, newcomer -> base premium 80 G + 10% first insurance + 5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion, newcomer -> base premium 40 G + 10% first insurance + 5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Component building block of 3 alike ---
  it("2 runes -> 50 G base premium (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50 G, +10% first insurance = 55, +5 fee = 60
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // base 60 G (block), +10% first insurance = 66, +5 fee = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block - block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // base 100 G (4 x 25, no block), +10% first insurance = 110, +5 fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // base 175 G (7 x 25, no block), +10% first insurance = 192.5, +5 fee = 197.5 -> rounds up to 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- "Alike" components: exact type match required for block ---
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // base 75 G (3 x 25, no block: different types), +10% first insurance = 82.5, +5 fee = 87.5 -> rounds up to 88
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    // base 120 G (60 + 60, two separate blocks), +10% first insurance = 132, +5 fee = 137
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> policy base premium 160 G; cursed surcharge 50 G (50% of cursed item's base premium only) -> 210 G before further modifiers and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    // policy base 160 (100+60); cursed surcharge +50 (50% of sword's 100, not policy total) = 210
    // + first insurance 10% of policy base (160*0.1=16) = 226; +5 fee = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years with MHPCO -> loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    // base 100, +10% first insurance = +10, -20% loyalty = -20 => 90, +5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    // base 100, +30% high enchantment = 30, +10% first insurance = 10 => 140, +5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("cursed sword with exactly enchantment 5 -> both curse and high-enchantment surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    });
    // base 100, +50% curse = 50, +30% high enchantment = 30, +10% first insurance = 10 => 190, +5 fee = 195
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    // base 100, +10% first insurance = 10 => 110, +5 fee = 115 (no high-enchantment surcharge)
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 4 -> curse surcharge applies, no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }],
    });
    // base 100, +50% curse = 50, +10% first insurance = 10 => 160, +5 fee = 165 (no high-enchantment surcharge)
    expect(result.results[0]).toEqual({ premium: 165 });
  });

  // --- Rounding ---
  it("premium calculation yielding 197.5 G -> final premium 198 G (rounded up, in MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }] }],
    });
    // base 125 (100+25), +10% first insurance = 12.5 => 137.5, +5 fee = 142.5 -> rounds up to 143
    expect(result.results[0]).toEqual({ premium: 143 });
  });
  it("payout calculation yielding 350.5 G -> final payout 350 G (rounded down, in MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 50% high-enchantment reimbursement: 901 * 0.5 = 450.5, - 100 deductible = 350.5 -> rounds down to 350
    expect(result.results[1]).toMatchObject({ payout: 350 });
  });

  // --- Claim processing: standard reimbursement ---
  it(
    "regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(result.results[1]).toMatchObject({ payout: 400 });
    }
  );
  it(
    "damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G (full reimbursement minus deductible)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });
      expect(result.results[1]).toMatchObject({ payout: 100 });
    }
  );

  // --- Claim processing: enchantment threshold vs dragon material ---
  it(
    "dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; 50% rule wins, then deductible)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(result.results[1]).toMatchObject({ payout: 400 });
    }
  );
  it(
    "dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (only dragon-material clause: full reimbursement, then deductible)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });
      expect(result.results[1]).toMatchObject({ payout: 700 });
    }
  );
  it(
    "steel sword, enchantment 9, damage 1000 G -> payout 400 G (only high-enchantment clause: 50% first, then deductible)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(result.results[1]).toMatchObject({ payout: 400 });
    }
  );
  it(
    "dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies at threshold, then deductible)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(result.results[1]).toMatchObject({ payout: 400 });
    }
  );

  // --- Deductible per damage event ---
  it(
    "dragon attack damages insured sword (500 G) and insured amulet (300 G) -> payout 600 G (100 G deductible applies once per damaged item)",
    () => {
      const result = runScenario({
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
      });
      // sword: 500-100=400; amulet: 300-100=200; total = 600
      expect(result.results[1]).toMatchObject({ payout: 600 });
    }
  );

  // --- Multiple items of the same type ---
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // insurance sum 2000 (2x1000), cap 4000; payout 500-100=400, remainingCap = 4000-400=3600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it(
    "dragon attack damages both swords; damages array has two sword entries -> each treated as separate damage with its own deductible",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });
      // sword1: 500-100=400; sword2: 300-100=200; total = 600; cap 4000-600=3400
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    }
  );
  it(
    "damages array has more entries of a type than policy covers (two sword damages, one sword insured) -> CLI exits non-zero, whole claim rejected",
    () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    }
  );

  // --- Cap exhaustion ---
  it("policy covers a sword and an amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    // insurance sum 1600 (1000+600), cap 3200; payout 500-100=400, remainingCap = 3200-400=2800
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it(
    "cursed sword (insurance value 1000 G, premium with modifiers 165 G) -> cap 2000 G (based on unmodified insurance value)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
      // cap = 2 x 1000 (unmodified insurance value, not affected by curse premium modifier)
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    }
  );
  it(
    "policy covers a sword and 3 runes (a block) -> insurance sum 1750 G (block discount affects premium only, not insurance sum)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      // insurance sum 1750 (1000 + 3x250), cap 3500; payout 500-100=400, remainingCap = 3500-400=3100
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
    }
  );
  it(
    "sword insured (cap 2000 G); two successive claims of 1500 G each -> first payout 1400 G, cap remaining 600 G; second payout 600 G, cap remaining 0 G (reduced to remaining cap)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      // cap 2000; first claim: 1500-100=1400, remainingCap = 2000-1400=600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: desired 1400 (1500-100) reduced to the remaining 600 cap, remainingCap = 0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    }
  );

  // --- Edge cases ---
  it(
    "quote includes an item with unknown type (e.g. broomstick) -> CLI exits non-zero and writes error to stderr, no results written to stdout",
    () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        })
      ).toThrow();
    }
  );
  it(
    "claim references a damage entry whose item is not part of the policy (e.g. amulet damaged when only a sword is insured) -> CLI exits non-zero with error to stderr",
    () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
            },
          ],
        })
      ).toThrow();
    }
  );
  it(
    "claim contains a damage entry with an unknown item type -> CLI exits non-zero with error to stderr",
    () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
            },
          ],
        })
      ).toThrow();
    }
  );
  it("claim contains a damage entry with amount: -200 -> CLI exits non-zero with error to stderr", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })
    ).toThrow();
  });

  // --- Integration examples ---
  it(
    "newcomer with a cursed sword (steel, enchantment 3) -> premium 165 G (100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    }
  );
  it(
    "long-standing customer's second contract: 3 years with MHPCO, second quote in scenario, cursed sword (steel, enchantment 7) -> premium 160 G (each item in a quote is treated as first insurance regardless of customer history)",
    () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      // second quote: base 100 + curse 50 + high ench 30 - loyalty 20 + first insurance 10 - follow-up 15 = 155, +5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    }
  );
});
