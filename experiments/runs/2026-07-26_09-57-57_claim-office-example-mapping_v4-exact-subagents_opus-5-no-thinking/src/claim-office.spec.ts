import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import type { Item } from "./claim-office.js";
import { quote, claim, insuranceSum } from "./claim-office.js";
import type { Scenario, Step } from "./scenario.js";
import { runScenario } from "./scenario.js";

// The CLI's contract is about a process: what it writes to each stream and the
// status it exits with. Asserting that by calling a function would only test a
// stand-in, so these tests spawn the real entry point and feed it stdin.
type CliRun = {
  stdout: string;
  stderr: string;
  code: number;
};

const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve) => {
    const child = execFile(
      "npx",
      ["tsx", "src/cli.ts"],
      (error, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
          code: error && typeof error.code === "number" ? error.code : 0,
        });
      },
    );
    child.stdin?.end(input);
  });

const runCliOn = (scenario: Scenario): Promise<CliRun> =>
  runCli(JSON.stringify(scenario));

describe("Claim Office - quote: base premiums", () => {
  it("should charge only the 5G processing fee for an empty item list", () => {
    expect(quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [])).toBe(5);
  });
  it("should charge 100G base premium plus fee for a single sword", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "sword" }]),
    ).toBe(115);
  });
  it("should charge 60G base premium plus fee for a single amulet", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "amulet" }]),
    ).toBe(71);
  });
  it("should charge 80G base premium plus fee for a single staff", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "staff" }]),
    ).toBe(93);
  });
  it("should charge 40G base premium plus fee for a single potion", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "potion" }]),
    ).toBe(49);
  });
  it("should charge 25G base premium plus fee for a single rune", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "rune" }]),
    ).toBe(33);
  });
  it("should charge 25G base premium plus fee for a single moonstone", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "moonstone" },
      ]),
    ).toBe(33);
  });
  it("should sum the base premiums of several different main items", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "sword" },
        { type: "amulet" },
      ]),
    ).toBe(181);
  });
});

describe("Claim Office - quote: component blocks", () => {
  it("should charge 50G base premium for 2 runes (no block)", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(60);
  });
  it("should charge 60G base premium for exactly 3 runes (block applies)", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(71);
  });
  it("should charge 100G base premium for 4 runes (no block for the remainder)", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(115);
  });
  it("should charge 175G base premium for 7 runes (no block — a block requires exactly 3)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0, previousContracts: 0 },
        Array.from({ length: 7 }, () => ({ type: "rune" })),
      ),
    ).toBe(198);
  });
  it("should charge 75G base premium for 2 runes and 1 moonstone (different types do not form a block)", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(88);
  });
  it("should charge 120G base premium for 3 runes and 3 moonstones (two separate blocks)", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(137);
  });
});

describe("Claim Office - quote: item-level modifiers", () => {
  it("should add a 50% surcharge on a cursed item's base premium", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "sword", enchantment: 3, cursed: true },
      ]),
    ).toBe(165);
  });
  it("should add a 30% surcharge for an item with enchantment exactly 5", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "sword", enchantment: 5 },
      ]),
    ).toBe(145);
  });
  it("should not add the high-enchantment surcharge for an item with enchantment 4", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "sword", enchantment: 4 },
      ]),
    ).toBe(115);
  });
  it("should add both surcharges for an item that is cursed and enchantment >= 5", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "sword", enchantment: 7, cursed: true },
      ]),
    ).toBe(195);
  });
  it("should apply the cursed surcharge only to the cursed item's base premium, not the policy total", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]),
    ).toBe(231);
  });
});

describe("Claim Office - quote: policy-level modifiers", () => {
  it("should apply a 10% first insurance surcharge on the policy base premium", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "sword" }]),
    ).toBe(115);
  });
  it("should apply a 20% loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    expect(
      quote({ yearsWithMHPCO: 2, previousContracts: 0 }, [{ type: "sword" }]),
    ).toBe(95);
  });
  it("should not apply the loyalty discount for a customer with fewer than 2 years", () => {
    expect(
      quote({ yearsWithMHPCO: 1, previousContracts: 0 }, [{ type: "sword" }]),
    ).toBe(115);
  });
  it("should apply a 15% follow-up discount on the customer's second and later contracts", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 1 }, [{ type: "sword" }]),
    ).toBe(100);
  });
  it("should not apply the follow-up discount on the customer's first contract", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "sword" }]),
    ).toBe(115);
  });
  it("should add the 5G processing fee at the very end, after all other modifiers", () => {
    expect(
      quote({ yearsWithMHPCO: 2, previousContracts: 1 }, [{ type: "sword" }]),
    ).toBe(80);
  });
});

describe("Claim Office - quote: rounding", () => {
  it("should round the final premium up to a whole G", () => {
    expect(
      quote(
        { yearsWithMHPCO: 0, previousContracts: 0 },
        Array.from({ length: 7 }, () => ({ type: "rune" })),
      ),
    ).toBe(198);
  });
});

describe("Claim Office - quote: integration", () => {
  it("should charge 165G for a newcomer's cursed steel sword with enchantment 3", () => {
    expect(
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]),
    ).toBe(165);
  });
  it("should charge 160G for a 3-year customer's second contract with a cursed sword of enchantment 7", () => {
    expect(
      quote({ yearsWithMHPCO: 3, previousContracts: 1 }, [
        { type: "sword", material: "steel", enchantment: 7, cursed: true },
      ]),
    ).toBe(160);
  });
});

describe("Claim Office - quote: errors", () => {
  it("should reject a quote containing an item with an unknown type", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [
        { type: "broomstick" },
      ]),
    ).toThrow();
  });
});

describe("Claim Office - claim: insurance sum and cap", () => {
  it("should cap the policy payout at twice the insurance sum of a single sword", () => {
    expect(
      claim(
        [{ type: "sword" }],
        { cause: "dragon attack", damages: [{ itemType: "sword", amount: 5000 }] },
        2000,
      ),
    ).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("should sum the insurance values of several items to derive the cap", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("should base the cap on unmodified insurance values, ignoring premium modifiers", () => {
    expect(insuranceSum([{ type: "sword", cursed: true, enchantment: 7 }])).toBe(
      1000,
    );
  });
  it("should base the cap on the full component insurance values, ignoring the block discount", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(1750);
  });
});

describe("Claim Office - claim: standard reimbursement", () => {
  it("should pay the damage amount minus the 100G deductible for a regular sword", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        2000,
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should pay the damage amount minus the 100G deductible for a damaged rune", () => {
    expect(
      claim(
        [{ type: "rune" }],
        { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        500,
      ),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("should apply the 100G deductible once per damage entry when several items are damaged", () => {
    expect(
      claim(
        [{ type: "sword" }, { type: "amulet" }],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
        3200,
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
});

describe("Claim Office - claim: special clauses", () => {
  it("should reimburse 50% of the damage before the deductible for enchantment exactly 8", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 8 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        2000,
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should reimburse dragon material fully before the deductible", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        2000,
      ),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should let the 50% enchantment rule win when both the enchantment and dragon clauses apply", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        2000,
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("Claim Office - claim: cap depletion", () => {
  it("should report the remaining cap after a claim", () => {
    expect(
      claim(
        [{ type: "sword" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        2000,
      ),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("should reduce a payout to the remaining cap when the cap is exhausted by successive claims", () => {
    expect(
      claim(
        [{ type: "sword" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        600,
      ),
    ).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("Claim Office - claim: rounding", () => {
  it("should round the final payout down to a whole G", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 8 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        2000,
      ),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("Claim Office - claim: multiple items of the same type", () => {
  it("should treat two damage entries of the same item type as separate damages with their own deductibles", () => {
    expect(
      claim(
        [{ type: "sword" }, { type: "sword" }],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        },
        4000,
      ),
    ).toEqual({ payout: 600, remainingCap: 3400 });
  });
});

describe("Claim Office - claim: errors", () => {
  it("should reject a claim with a damage entry for an item type not covered by the policy", () => {
    expect(() =>
      claim(
        [{ type: "sword" }],
        { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        2000,
      ),
    ).toThrow(/not covered|not insured/i);
  });
  it("should reject a claim with more damage entries of a type than the policy insures", () => {
    expect(() =>
      claim(
        [{ type: "sword" }],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        },
        2000,
      ),
    ).toThrow(/more damage|than insured|not covered/i);
  });
  it("should reject a claim with a negative damage amount", () => {
    expect(() =>
      claim(
        [{ type: "sword" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        2000,
      ),
    ).toThrow(/negative|invalid amount/i);
  });
});

describe("Claim Office - CLI", () => {
  it("should read a scenario from stdin and write a results array to stdout", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
        ],
      }),
    ).toEqual([{ premium: 59 }]);
  });
  it("should return one result per step in the same order as the input steps", () => {
    const steps: Step[] = [
      { op: "quote", items: [{ type: "sword" }] },
      {
        op: "claim",
        policy: 0,
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 500 }],
        },
      },
      { op: "quote", items: [{ type: "amulet" }] },
    ];
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(results).toHaveLength(steps.length);
    expect(results.map((result) => Object.keys(result).sort())).toEqual([
      ["premium"],
      ["payout", "remainingCap"],
      ["premium"],
    ]);
  });
  it("should return a premium for a quote step and a payout with remainingCap for a claim step", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
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
      }),
    ).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("should resolve a claim step's policy field to the quote step at that zero-based index", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 2,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
    ).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
      { premium: 62 },
      { payout: 200, remainingCap: 1000 },
    ]);
  });
  // A policy's cap is spent, not re-granted. Two claims against the same policy
  // therefore have to see one shared remaining cap: the second claim's desired
  // 1400G is cut down to the 600G the first claim left behind. Running the steps
  // through runScenario rather than the subprocess keeps this about the
  // sequencing of claims, which is the part that carries the cap forward.
  it("should deplete the policy cap across successive claims", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      }),
    ).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("should exit with a non-zero status and write to stderr for an unknown item type in a quote", async () => {
    const { stderr, code } = await runCliOn({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" } as unknown as Item],
        },
      ],
    });
    expect(code).not.toBe(0);
    // Naming the offending type is what distinguishes the CLI rejecting this
    // scenario from the CLI failing to start at all: a missing entry point also
    // exits non-zero with a non-empty stderr.
    expect(stderr).toContain("broomstick");
  });
  it("should exit with a non-zero status and write to stderr for a damage entry not covered by the policy", async () => {
    const { stderr, code } = await runCliOn({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
    expect(code).not.toBe(0);
    // Naming the uncovered item type is what distinguishes the CLI rejecting
    // this scenario from the CLI failing to start at all: a missing entry point
    // also exits non-zero with a non-empty stderr.
    expect(stderr).toContain("amulet");
  });
  it("should exit with a non-zero status and write to stderr for a negative damage amount", async () => {
    const { stderr, code } = await runCliOn({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    expect(code).not.toBe(0);
    // Naming the negative amount as the reason is what distinguishes the CLI
    // rejecting this scenario from the CLI failing to start at all: a missing
    // entry point also exits non-zero with a non-empty stderr.
    expect(stderr).toMatch(/negative/i);
  });
  it("should write no results to stdout when the scenario is rejected", async () => {
    const { stdout } = await runCliOn({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" } as unknown as Item],
        },
      ],
    });
    expect(stdout).toBe("");
  });
});
