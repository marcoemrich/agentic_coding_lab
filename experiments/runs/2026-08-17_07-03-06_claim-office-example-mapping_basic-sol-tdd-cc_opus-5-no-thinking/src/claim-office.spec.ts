import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { type Item, insuranceSum, policyBasePremium, quote, runScenario } from "./claim-office.js";

describe("MHPCO quote -- base premiums", () => {
  it("empty item list -> premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("single sword -> base premium 100 G", () => {
    expect(policyBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("single amulet -> base premium 60 G", () => {
    expect(policyBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("single staff -> base premium 80 G", () => {
    expect(policyBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("single potion -> base premium 40 G", () => {
    expect(policyBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("single rune (component) -> base premium 25 G", () => {
    expect(policyBasePremium([{ type: "rune" }])).toBe(25);
  });
  it("single moonstone (component) -> base premium 25 G", () => {
    expect(policyBasePremium([{ type: "moonstone" }])).toBe(25);
  });
});

describe("MHPCO quote -- component building blocks", () => {
  it("2 runes -> 50 G base premium (no block)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block -- block requires exactly 3)", () => {
    const fourRunes: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(policyBasePremium(fourRunes)).toBe(100);
  });
  it("7 runes -> 175 G base premium (no block -- 7 is not exactly 3)", () => {
    const sevenRunes: Item[] = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(policyBasePremium(sevenRunes)).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: 'alike' means same type)", () => {
    const items: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(policyBasePremium(items)).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    const items: Item[] = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(policyBasePremium(items)).toBe(120);
  });
});

describe("MHPCO quote -- item-specific modifiers", () => {
  it("cursed sword -> 50 % surcharge on that item's base premium", () => {
    expect(policyBasePremium([{ type: "sword", cursed: true }])).toBe(150);
  });
  it("sword with enchantment 5 -> 30 % high-enchantment surcharge (threshold inclusive)", () => {
    expect(policyBasePremium([{ type: "sword", enchantment: 5 }])).toBe(130);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    expect(policyBasePremium([{ type: "sword", enchantment: 4 }])).toBe(100);
  });
  it("cursed sword with enchantment 5 -> both surcharges apply", () => {
    expect(policyBasePremium([{ type: "sword", enchantment: 5, cursed: true }])).toBe(180);
  });
  it("cursed sword + plain amulet -> 210 G before policy modifiers and fee (curse applies to the cursed item only, not the policy total)", () => {
    const items: Item[] = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(policyBasePremium(items)).toBe(210);
  });
});

describe("MHPCO quote -- policy-wide modifiers", () => {
  it("customer with exactly 2 years -> 20 % loyalty discount applies (threshold inclusive)", () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("customer with 1 year -> no loyalty discount", () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("first insurance -> 10 % initial assessment surcharge on the policy base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("second quote in a scenario -> 15 % follow-up contract discount", () => {
    // First quote: 100 base + 10 first insurance + 5 fee = 115.
    // Second quote: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100.
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("processing fee of 5 G is added at the very end, after all modifiers", () => {
    // The fee is not subject to any discount: 100 - 20 loyalty + 10 first insurance + 5 fee = 95.
    // Folding the fee in before the modifiers would yield 94.5 instead.
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
});

describe("MHPCO quote -- rounding in the MHPCO's favor", () => {
  it("premium of 197.5 G -> 198 G (rounded up)", () => {
    // Second quote of one rune: 25 base + 2.5 first insurance - 3.75 follow-up + 5 fee = 28.75 -> 29.
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "rune" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 29 });
  });
  it("intermediate amounts stay fractional; only the final premium is rounded", () => {
    // Second quote of two runes: 50 + 5 - 7.5 + 5 = 52.5 -> 53.
    // Rounding each modifier separately would give 50 + 5 - 8 + 5 = 52.
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 53 });
  });
});

describe("MHPCO quote -- integration examples", () => {
  it("newcomer (0 years) with a cursed sword (steel, ench 3) -> premium 165 G", () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(165);
  });
  it("long-standing customer (3 years), second quote, cursed sword ench 7 -> premium 160 G (first-insurance surcharge still applies)", () => {
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance
    // - 15 follow-up = 155 + 5 fee = 160
    const sword: Item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO quote -- errors", () => {
  it("item with an unknown type (e.g. broomstick) -> throws an Error (CLI exits non-zero, message on stderr)", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(/broomstick/);
  });
});

describe("MHPCO claim -- standard reimbursement", () => {
  it("regular sword (steel, ench 3), damage 500 G -> payout 400 G (full minus 100 G deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment, no material), damage 200 G -> payout 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("damage below the deductible -> payout is not negative (clamped at 0 G)", () => {
    // Reading adopted: the spec never contemplates a negative payout, so the
    // deductible cannot turn into a charge against the customer.
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 50 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe("MHPCO claim -- special clauses", () => {
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % clause, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins over dragon material)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G -> payout 400 G (threshold inclusive)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO claim -- deductible per damage event", () => {
  it("sword (500 G) and amulet (300 G) damaged in one incident -> payout 600 G (deductible once per damaged item)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("MHPCO claim -- insurance sum and cap", () => {
  it("policy with sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("policy with a cursed sword -> cap 2000 G (based on unmodified insurance value)", () => {
    const cursedSword: Item = { type: "sword", cursed: true };
    // Premium with modifiers is 165 G, but the cap follows the 1000 G insurance value.
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [cursedSword] },
        { op: "claim", policy: 0, incident: { cause: "curse", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy with sword + 3 runes -> insurance sum 1750 G (block discount affects the premium only)", () => {
    const items: Item[] = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(insuranceSum(items)).toBe(1750);
    // The block discount applies to the premium: 100 + 60 = 160 base.
    expect(policyBasePremium(items)).toBe(160);
  });
  it("policy with two swords -> insurance sum 2000 G, cap 4000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("sword policy (cap 2000 G), first claim of 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword policy, second claim of 1500 G after the first -> payout 600 G, remainingCap 0 G (capped)", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("MHPCO claim -- multiple items of the same type", () => {
  it("two swords insured, two sword damages -> each damage gets its own deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 800 },
              { itemType: "sword", amount: 600 },
            ],
          },
        },
      ],
    });
    // (800 - 100) + (600 - 100) = 1200
    expect(results[1]).toEqual({ payout: 1200, remainingCap: 2800 });
  });
  it("two sword damages but only one sword insured -> throws an Error (CLI exits non-zero)", () => {
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
                { itemType: "sword", amount: 800 },
                { itemType: "sword", amount: 600 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
});

describe("MHPCO claim -- errors", () => {
  it("damage to an item not covered by the policy (amulet, only a sword insured) -> throws an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("damage entry with an unknown item type -> throws an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("damage entry with amount -200 -> throws an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow(/-200|negative/);
  });
});

describe("MHPCO claim -- rounding in the MHPCO's favor", () => {
  it("payout of 350.5 G -> 350 G (rounded down)", () => {
    // Enchantment 9 halves the damage: 901 / 2 = 450.5, minus the 100 G deductible = 350.5 -> 350.
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO scenario runner", () => {
  it("processes steps sequentially and returns results in the same order and length", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });
    expect(results).toHaveLength(3);
    expect(results).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
      // Second quote: 60 base + 6 first insurance - 9 follow-up + 5 fee = 62.
      { premium: 62 },
    ]);
  });
  it("a claim step references its policy by the zero-based index of the quote step", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        // Targets step 1 (the amulet policy, cap 1200), not step 0.
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] } },
      ],
    });
    expect(results[2]).toEqual({ payout: 400, remainingCap: 800 });
  });
  it("schema example: amulet quote then 200 G fire claim -> premium and payout/remainingCap results", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 - 100 = 100, cap 1200 - 100.
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
});

function runCli(input: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("node", ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} JSON to stdout", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("unknown item type -> exit code non-zero, error description on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  });
  it("negative damage amount -> exit code non-zero, error description on stderr", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/-200|negative/);
  });
});
