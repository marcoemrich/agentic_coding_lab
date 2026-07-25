import { describe, it, expect } from "vitest";
import { quote, processClaim, insuranceSum, cap, processScenario, runCli, type Policy, type Scenario } from "./claim-office.js";

// Test list for the MHPCO Claim Office Kata.
//
// Functions to be implemented under src/:
//   quote(customer, items) -> { premium: number }
//   processClaim(policy, incident, remainingCap) -> { payout, remainingCap }
//   processScenario(scenario) -> { results: Result[] }
//
// The CLI (src/cli.ts) is a thin wrapper that reads JSON from stdin,
// calls processScenario, and writes JSON to stdout. The CLI is exercised
// separately by running the built executable in tests.
//
// Ordering: simplest -> most complex.

describe("quote -- empty policy", () => {
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, []);
    expect(result.premium).toBe(5);
  });
});

describe("quote -- base premiums for main items", () => {
  it("single sword (0 years, 0 contracts) -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "sword" },
    ]);
    expect(result.premium).toBe(115);
  });
  it("single amulet (0 years, 0 contracts) -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "amulet" },
    ]);
    expect(result.premium).toBe(71);
  });
  it("single staff (0 years, 0 contracts) -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "staff" },
    ]);
    expect(result.premium).toBe(93);
  });
  it("single potion (0 years, 0 contracts) -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "potion" },
    ]);
    expect(result.premium).toBe(49);
  });
});

describe("quote -- single components", () => {
  it("single rune (0 years, 0 contracts) -> premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" },
    ]);
    expect(result.premium).toBe(33);
  });
  it("single moonstone (0 years, 0 contracts) -> premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "moonstone" },
    ]);
    expect(result.premium).toBe(33);
  });
});

describe("quote -- component building block of 3 alike components", () => {
  it("2 runes (0 years, 0 contracts) -> premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(60);
  });
  it("3 runes -> premium 71 G (60 base + 6 first insurance + 5 fee; block applies)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(71);
  });
  it("4 runes -> premium 115 G (100 base + 10 first insurance + 5 fee; block requires exactly 3)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(115);
  });
  it("7 runes -> premium 198 G (175 base + 17.5 first insurance + 5 fee, rounded up; no block since not exactly 3)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(198);
  });
  it("2 runes + 1 moonstone -> premium 88 G (75 base + 7.5 first insurance + 5 fee, rounded up; different types, no block)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ]);
    expect(result.premium).toBe(88);
  });
  it("3 runes + 3 moonstones -> premium 137 G (120 base + 12 first insurance + 5 fee; two separate blocks)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ]);
    expect(result.premium).toBe(137);
  });
});

describe("quote -- item-specific modifiers", () => {
  it("cursed sword (0 years, 0 contracts) -> premium 165 G (100 base + 50 cursed + 10 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "sword", cursed: true },
    ]);
    expect(result.premium).toBe(165);
  });
  it("cursed sword + plain amulet (0 years, 0 contracts) -> premium 231 G (160 base + 50 cursed + 16 first insurance on 160 + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ]);
    expect(result.premium).toBe(231);
  });
  it("sword enchantment 5 (0 years, 0 contracts) -> premium 145 G (100 base + 30 high-enchantment + 10 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "sword", enchantment: 5 },
    ]);
    expect(result.premium).toBe(145);
  });
  it("sword enchantment 4 (0 years, 0 contracts) -> premium 115 G (100 base + 10 first insurance + 5 fee; no high-enchantment)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "sword", enchantment: 4 },
    ]);
    expect(result.premium).toBe(115);
  });
  it("cursed sword enchantment 5 (0 years, 0 contracts) -> premium 195 G (100 + 50 cursed + 30 high-enchantment + 10 first insurance + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "sword", enchantment: 5, cursed: true },
    ]);
    expect(result.premium).toBe(195);
  });
});

describe("quote -- policy-wide modifiers", () => {
  it("customer with exactly 2 years (0 contracts), sword -> premium 95 G (100 base + 10 first insurance - 20 loyalty + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 2, contractCount: 0 }, [
      { type: "sword" },
    ]);
    expect(result.premium).toBe(95);
  });
  it("customer with 1 year (0 contracts), sword -> premium 115 G (100 base + 10 first insurance + 5 fee; no loyalty since 1 < 2)", () => {
    const result = quote({ yearsWithMHPCO: 1, contractCount: 0 }, [
      { type: "sword" },
    ]);
    expect(result.premium).toBe(115);
  });
  it("first insurance always applies: 5 years, 5 contracts, sword -> premium 80 G (100 base + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 5, contractCount: 5 }, [
      { type: "sword" },
    ]);
    expect(result.premium).toBe(80);
  });
  it("follow-up contract adds 15 % discount: 5 years, 1 contract, sword -> premium 80 G (100 base + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee)", () => {
    const result = quote({ yearsWithMHPCO: 5, contractCount: 1 }, [
      { type: "sword" },
    ]);
    expect(result.premium).toBe(80);
  });
});

describe("quote -- rounding", () => {
  it("premium calculation yielding 197.5 G -> final premium 198 G (rounded up)", () => {
    // Construct a scenario that yields exactly 197.5 G before rounding.
    // 5 years, 1 contract, sword = 100 + 10 - 20 - 15 + 5 = 80 (too low)
    // 0 years, 0 contracts, 7 runes = 175 + 17.5 + 5 = 197.5 (exact!)
    const result = quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" },
    ]);
    expect(result.premium).toBe(198);
  });
});

describe("quote edge cases", () => {
  it("unknown item type -> throws an error", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0, contractCount: 0 }, [
        { type: "broomstick" },
      ]),
    ).toThrow();
  });
});

describe("claim -- standard reimbursement", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full minus 100 deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3 }],
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("damage to a rune, damage 200 G -> payout 100 G (full minus 100 deductible)", () => {
    const policy: Policy = {
      items: [{ type: "rune" }],
      remainingCap: 500,
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });
});

describe("claim -- enchantment threshold vs dragon material", () => {
  it("dragon-material sword enchantment 8, damage 1000 G -> payout 400 G (50% rule wins, then deductible: 500 - 100)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 8 }],
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 G -> payout 400 G (both clauses apply, 50% wins)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 9 }],
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 G -> payout 700 G (only dragon clause applies: full, then deductible: 800 - 100)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 5 }],
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (only high-enchantment applies: 500 - 100)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9 }],
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
});

describe("claim -- deductible per damage event", () => {
  it("damages insured sword (500 G) and insured amulet (300 G) -> payout 600 G (deductible once per item)", () => {
    const policy: Policy = {
      items: [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "amulet", material: "silver", enchantment: 2 },
      ],
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(1400);
  });
});

describe("claim -- cap exhaustion", () => {
  it("sword + amulet policy -> insurance sum 1600 G, cap 3200 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
    expect(cap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
  });
  it("cursed sword (insurance value 1000 G, premium 165 G) -> cap 2000 G (based on unmodified insurance value; premium modifiers do not raise cap)", () => {
    const policyItems: Item[] = [{ type: "sword", cursed: true }];
    const premiumResult = quote({ yearsWithMHPCO: 0, contractCount: 0 }, policyItems);
    expect(premiumResult.premium).toBe(165);
    expect(cap(policyItems)).toBe(2000);
  });
  it("sword + 3-rune block -> insurance sum 1750 G (block discount affects premium only, not insurance sum)", () => {
    const policyItems: Item[] = [
      { type: "sword" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ];
    expect(insuranceSum(policyItems)).toBe(1750);
    expect(cap(policyItems)).toBe(3500);
  });
  it("sword policy (cap 2000 G); first claim 1500 G -> payout 1400 G, remaining cap 600 G", () => {
    const policy: Policy = {
      items: [{ type: "sword" }],
      remainingCap: 2000,
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword policy (cap 2000 G); second claim of 1500 G after first -> payout 600 G, remaining cap 0 G", () => {
    const policy: Policy = {
      items: [{ type: "sword" }],
      remainingCap: 600, // after first claim
    };
    const result = processClaim(policy, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
});

describe("claim -- multiple items of same type", () => {
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
    expect(cap([{ type: "sword" }, { type: "sword" }])).toBe(4000);
  });
  it("dragon attack damages both swords (two damage entries) -> each treated as a separate damage with its own deductible", () => {
    const policy: Policy = {
      items: [{ type: "sword" }, { type: "sword" }],
      remainingCap: 4000,
    };
    const result = processClaim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    });
    // 500 - 100 + 300 - 100 = 600
    expect(result.payout).toBe(600);
  });
  it("damages array contains more entries of a given type than the policy actually covers -> throws error (whole claim rejected)", () => {
    // Policy has only 1 sword, but damages references 2 swords.
    const policy: Policy = {
      items: [{ type: "sword" }],
      remainingCap: 2000,
    };
    expect(() =>
      processClaim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toThrow();
  });
});

describe("claim edge cases", () => {
  it("claim references a damage entry whose item is not part of the policy -> throws error", () => {
    // Policy only covers a sword, but claim damages an amulet.
    const policy: Policy = {
      items: [{ type: "sword" }],
      remainingCap: 2000,
    };
    expect(() =>
      processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      }),
    ).toThrow();
  });
  it("claim references damage entry with unknown item type -> throws error", () => {
    const policy: Policy = {
      items: [{ type: "sword" }],
      remainingCap: 2000,
    };
    expect(() =>
      processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "broomstick", amount: 200 }],
      }),
    ).toThrow();
  });
  it("claim contains damage entry with amount -200 -> throws error", () => {
    const policy: Policy = {
      items: [{ type: "sword" }],
      remainingCap: 2000,
    };
    expect(() =>
      processClaim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      }),
    ).toThrow();
  });
});

describe("integration -- processScenario", () => {
  it("newcomer with a cursed sword: 0 years, no previous contract, item cursed sword (steel, enchantment 3) -> premium 165 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0, contractCount: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    const { results } = processScenario(scenario);
    expect(results).toHaveLength(1);
    const r0 = results[0] as { premium: number };
    expect(r0.premium).toBe(165);
  });
  it("long-standing customer's second contract: 3 years, second quote in scenario, item cursed sword (steel, enchantment 7) -> premium 160 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3, contractCount: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // 1st quote
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        }, // 2nd quote
      ],
    };
    const { results } = processScenario(scenario);
    expect(results).toHaveLength(2);
    const r1 = results[1] as { premium: number };
    expect(r1.premium).toBe(160);
  });
  it("results array length matches steps array length", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5, contractCount: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };
    const { results } = processScenario(scenario);
    expect(results).toHaveLength(3);
  });
  it("claim references a policy by zero-based quote step index", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5, contractCount: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2 }] }, // step 0
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
    const { results } = processScenario(scenario);
    expect(results).toHaveLength(2);
    const r0 = results[0] as { premium: number };
    const r1 = results[1] as { payout: number; remainingCap: number };
    // Premium for amulet: 60 + 6 first insurance - 12 loyalty + 5 fee = 59 -> ceil to 59
    // Wait: 60 + 6 - 12 + 5 = 59 (no fractional). Actually 60 + 6 - 12 + 5 = 59.
    // But loyalty rate is 0.2 of 60 = 12. So 60 + 6 - 12 + 5 = 59
    expect(r0.premium).toBe(59);
    // Claim: damage 200, no enchantment >= 8, no dragon material: full - 100 = 100
    expect(r1.payout).toBe(100);
    expect(r1.remainingCap).toBe(1100); // cap = 2 * 600 = 1200; remaining = 1200 - 100 = 1100
  });
});

describe("CLI behavior", () => {
  it("reads JSON scenario from stdin and writes JSON results to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5, contractCount: 0 },
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
    });
    const result = runCli(input);
    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0].premium).toBeDefined();
    expect(output.results[1].payout).toBe(100);
  });
  it("unknown item type in quote -> non-zero exit, error on stderr, no results on stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5, contractCount: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const result = runCli(input);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("broomstick");
  });
});
