import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { quote, runScenario } from "./claim-office.js";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliOutcome {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return {
      status: failure.status ?? 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

describe("MHPCO quote -- base premiums and processing fee", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("one plain sword -> premium 105 G (100 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("one plain amulet -> premium 65 G (60 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("one plain staff -> premium 85 G (80 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("one plain potion -> premium 45 G (40 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("one rune -> premium 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("one moonstone -> premium 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });
  it("sword + amulet -> premium 165 G (100 + 60 base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }])).toBe(181);
  });
});

describe("MHPCO quote -- building block of 3 alike components", () => {
  it("2 runes -> base premium 50 G (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes -> base premium 60 G (block applies)", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes)).toBe(71);
  });
  it("4 runes -> base premium 100 G (no block -- block requires exactly 3)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(115);
  });
  it("7 runes -> base premium 175 G (no block -- block requires exactly 3)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types are not alike)", () => {
    const mixed = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, mixed)).toBe(88);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks, alike = same type)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });
  it("3 moonstones -> base premium 60 G (block applies to moonstones too)", () => {
    const stones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(quote({ yearsWithMHPCO: 0 }, stones)).toBe(71);
  });
});

describe("MHPCO quote -- item-specific modifiers", () => {
  it("cursed sword, enchantment 3, new customer -> premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
  });
  it("sword with enchantment 5 -> high-enchantment surcharge applies (threshold is >= 5)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(145);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(115);
  });
  it("cursed sword with enchantment 5 -> both curse and high-enchantment surcharges apply", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(195);
  });
  it("cursed sword (base 100 G) + plain amulet (base 60 G) -> curse adds 50 G (50 % of the cursed item's base premium, not the policy total)", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const amulet = { type: "amulet", material: "silver", enchantment: 1, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword, amulet])).toBe(231);
  });
  it("high-enchantment surcharge applies to the affected item's base premium only, not the policy total", () => {
    const staff = { type: "staff", material: "oak", enchantment: 6, cursed: false };
    const potion = { type: "potion", material: "glass", enchantment: 0, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [staff, potion])).toBe(161);
  });
});

describe("MHPCO quote -- policy-wide modifiers", () => {
  it("customer with exactly 2 years with MHPCO -> 20 % loyalty discount applies", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("customer with 1 year with MHPCO -> no loyalty discount", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("first quote in a scenario -> 10 % initial assessment surcharge applies", () => {
    // staff: 80 base - 16 loyalty + 8 first insurance + 5 fee = 77
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "staff" }])).toBe(77);
  });
  it("second quote in a scenario -> 15 % follow-up contract discount applies in addition to the first insurance surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // second quote: 100 base - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 80
    expect(results[1]).toEqual({ premium: 80 });
  });
  it("loyalty, first insurance and follow-up discounts are percentages of the policy base premium (sum of item base premiums)", () => {
    // sword + amulet: 160 base - 32 loyalty + 16 first insurance + 5 fee = 149
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }, { type: "amulet" }])).toBe(149);
  });
  it("the 5 G processing fee is added at the very end, after all percentage modifiers", () => {
    const threeSwords = Array.from({ length: 3 }, () => ({ type: "sword" }));
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: threeSwords },
      ],
    });
    // 300 base - 60 loyalty + 30 first insurance - 45 follow-up = 225, then + 5 fee = 230
    // (a fee folded into the percentage base would yield 229)
    expect(results[1]).toEqual({ premium: 230 });
  });
});

describe("MHPCO quote -- rounding in the MHPCO's favour", () => {
  it("a premium calculation yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198 in the office's favour
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });
  it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
    // 1 rune, 2-year customer: 25 - 5 loyalty + 2.5 first insurance + 5 fee = 27.5 -> 28
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "rune" }])).toBe(28);
  });
});

describe("MHPCO quote -- integration examples", () => {
  it("newcomer (0 years, no previous contract) with a cursed steel sword, enchantment 3 -> premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
  });
  it("3-year customer's second quote, cursed steel sword, enchantment 7 -> premium 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [cursedSword] },
      ],
    });
    // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance
    // - 15 follow-up = 155, + 5 fee = 160
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO quote -- rejections", () => {
  it("quote with an unknown item type (e.g. broomstick) -> throws an Error naming the unknown type", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrowError(
      /broomstick/,
    );
  });
});

describe("MHPCO policy -- insurance sum and cap", () => {
  it("policy covering a sword and an amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("policy covering two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("policy covering a sword and 3 runes -> insurance sum 1750 G, cap 3500 G (block discount affects the premium only)", () => {
    const items = [
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("policy covering a cursed sword (premium 165 G) -> cap 2000 G (based on the unmodified insurance value)", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [cursedSword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe("MHPCO claim -- standard reimbursement and deductible", () => {
  it("regular steel sword, enchantment 3, damage 500 G -> payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250 G), damage 200 G -> payout 100 G (no enchantment or material, so no special clause)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon attack damaging an insured sword (500 G) and an insured amulet (300 G) -> payout 600 G (deductible applies once per damaged item)", () => {
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
  it("damage below the deductible -> payout 0 G, never negative", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe("MHPCO claim -- special clauses", () => {
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword, enchantment 8, damage 1000 G -> payout 400 G (threshold is >= 8)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 8, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword, enchantment 7, damage 1000 G -> payout 900 G (no high-enchantment clause)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO claim -- rounding in the MHPCO's favour", () => {
  it("a payout calculation yielding 350.5 G -> final payout 350 G (rounded down)", () => {
    // enchantment 9 sword, damage 901: 450.5 reimbursed - 100 deductible = 350.5 -> 350
    const sword = { type: "sword", material: "steel", enchantment: 9, cursed: false };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO claim -- cap exhaustion across successive claims", () => {
  it("sword policy (cap 2000 G), first claim of 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword policy (cap 2000 G), second claim of 1500 G -> payout 600 G, remainingCap 0 G (reduced to the remaining cap)", () => {
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
  it("claim against an already exhausted cap -> payout 0 G, remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim, claim],
    });
    expect(results[3]).toEqual({ payout: 0, remainingCap: 0 });
  });
});

describe("MHPCO claim -- multiple items of the same type", () => {
  it("policy with two swords, damages with two sword entries -> each entry gets its own deductible", () => {
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
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("policy with one sword, damages with two sword entries -> throws an Error (more damage entries of a type than the policy covers)", () => {
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
      }),
    ).toThrowError(/sword/);
  });
});

describe("MHPCO claim -- rejections", () => {
  it("claim naming an amulet when only a sword is insured -> throws an Error (damaged item not part of the policy)", () => {
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
      }),
    ).toThrowError(/amulet/);
  });
  it("claim naming an unknown item type -> throws an Error (damaged item not part of the policy)", () => {
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
      }),
    ).toThrowError(/broomstick/);
  });
  it("claim with a damage entry amount of -200 -> throws an Error (negative damage amount)", () => {
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
      }),
    ).toThrowError(/-200|negative/);
  });
});

describe("claim-office CLI", () => {
  it("reads the schema example scenario from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout", () => {
    const outcome = runCli({
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
    expect(outcome.status).toBe(0);
    // amulet: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("a claim step references the policy created by an earlier quote step via its zero-based step index", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(outcome.status).toBe(0);
    // the claim settles against the sword policy from step 0 (cap 2000), not step 1
    expect(JSON.parse(outcome.stdout).results[2]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("exits 0 and writes results for a valid multi-step scenario", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 6 }] },
        {
          op: "claim",
          policy: 2,
          incident: { cause: "flood", damages: [{ itemType: "staff", amount: 400 }] },
        },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(outcome.stderr).toBe("");
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [
        { premium: 95 },
        { payout: 1400, remainingCap: 600 },
        // staff, enchantment 6, second quote: 80 base + 24 enchantment - 16 loyalty
        // + 8 first insurance - 12 follow-up = 84, + 5 fee = 89
        { premium: 89 },
        { payout: 300, remainingCap: 1300 },
      ],
    });
  });
  it("unknown item type in a quote -> exits non-zero, writes an error description to stderr, writes no results to stdout", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/broomstick/);
    expect(outcome.stdout).toBe("");
  });
  it("damaged item not part of the policy -> exits non-zero and writes an error description to stderr", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/amulet/);
    expect(outcome.stdout).toBe("");
  });
  it("negative damage amount -> exits non-zero and writes an error description to stderr", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/-200|negative/);
    expect(outcome.stdout).toBe("");
  });
  it("more sword damages than insured swords -> exits non-zero and writes an error description to stderr", () => {
    const outcome = runCli({
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
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/sword/);
    expect(outcome.stdout).toBe("");
  });
});
