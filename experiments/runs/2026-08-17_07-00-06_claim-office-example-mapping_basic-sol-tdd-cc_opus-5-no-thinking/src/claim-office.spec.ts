import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { type Item, runScenario } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(input: string): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("pnpm", ["exec", "tsx", CLI_PATH], {
    input,
    encoding: "utf8",
  });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("MHPCO claim office -- quote: base premiums", () => {
  it("empty item list -> premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
  it("single plain sword -> base 100 G + 10 % first insurance + 5 G fee = 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("single plain amulet -> base 60 G -> premium 71 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("single plain staff -> base 80 G -> premium 93 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("single plain potion -> base 40 G -> premium 49 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });
  it("single rune -> base 25 G -> premium 33 G (27.5 rounded up, plus fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("single moonstone -> base 25 G -> premium 33 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
});

describe("MHPCO claim office -- quote: component building blocks", () => {
  it("2 runes -> base 50 G (no block) -> premium 60 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 60 }]);
  });
  it("3 runes -> base 60 G (block applies) -> premium 71 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("4 runes -> base 100 G (no block -- block requires exactly 3) -> premium 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("7 runes -> base 175 G (no block) -> premium 198 G (192.5 rounded up, plus fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone -> base 75 G (no block: 'alike' means the same type) -> premium 88 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones -> base 120 G (two separate blocks) -> premium 137 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array(3).fill({ type: "rune" }),
            ...Array(3).fill({ type: "moonstone" }),
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 137 }]);
  });
});

describe("MHPCO claim office -- quote: premium modifiers", () => {
  it("cursed sword adds 50 % of that item's base premium -> premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment exactly 5 adds the 30 % surcharge -> premium 145 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });

    expect(results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 adds no high-enchantment surcharge -> premium 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 adds both surcharges -> premium 195 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 195 }]);
  });
  it("customer with exactly 2 years gets the 20 % loyalty discount -> premium 95 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year gets no loyalty discount -> premium 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("the second quote gets the 15 % follow-up discount, the first does not -> 115 G then 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("the 5 G processing fee is added last -- discounts never reduce it", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
});

describe("MHPCO claim office -- quote: modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet -> curse adds 50 G (the sword's share only) -> premium 231 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 231 }]);
  });

  it("policy-wide modifiers scale the policy base premium (160 G), not the surcharged total -> 2-year customer pays 199 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 199 }]);
  });
});

describe("MHPCO claim office -- quote: rounding in the MHPCO's favour", () => {
  it("a fractional premium is rounded up in the MHPCO's favour -- 5 runes yield 137.5 G -> 143 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(5).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 143 }]);
  });

  it("intermediate amounts stay fractional -- a rune with enchantment 5 yields 40 G, not 41 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", enchantment: 5 }] }],
    });

    expect(results).toEqual([{ premium: 40 }]);
  });
});

describe("MHPCO claim office -- quote: integration examples", () => {
  it("newcomer (0 years) with a cursed steel sword, enchantment 3 -> premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });

  it("3-year customer, second quote, cursed steel sword, enchantment 7 -> premium 160 G", () => {
    const sword: Item = {
      type: "sword",
      material: "steel",
      enchantment: 7,
      cursed: true,
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO claim office -- quote: rejections", () => {
  it("quote with an unknown item type throws an Error naming the type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
});

describe("MHPCO claim office -- claim: standard reimbursement", () => {
  it("steel sword, enchantment 3, damage 500 G -> payout 400 G (minus the 100 G deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment, no material), damage 200 G -> payout 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  it("damage below the deductible yields payout 0 G, never a negative payout", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 40 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe("MHPCO claim office -- claim: special clauses", () => {
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (the 50 % rule wins)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it("dragon-material sword, enchantment exactly 8, damage 1000 G -> payout 400 G (threshold inclusive)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO claim office -- claim: deductible per damage event", () => {
  it("one incident damaging a sword (500 G) and an amulet (300 G) -> payout 600 G", () => {
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
  it("two swords insured, both damaged (500 G each) -> payout 800 G, each with its own deductible", () => {
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
});

describe("MHPCO claim office -- claim: insurance sum and cap", () => {
  it("policy with a cursed sword -> cap 2000 G (premium modifiers do not raise the cap)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it("policy with a sword and 3 runes (a block) -> insurance sum 1750 G, cap 3500 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 100 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword policy (cap 2000 G), two claims of 1500 G -> 1400 G then 600 G, cap exhausted", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe("MHPCO claim office -- claim: rounding in the MHPCO's favour", () => {
  it("a payout of 350.5 G is rounded down to 350 G (enchantment 9, damage 901 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO claim office -- claim: rejections", () => {
  it("damage to an item that is not part of the policy throws an Error", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow(/amulet/);
  });

  it("damage entry with an unknown item type throws an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("more damage entries of a type than the policy covers throws an Error -- the whole claim is rejected", () => {
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
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("damage entry with a negative amount throws an Error", () => {
    expect(() =>
      runScenario({
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
      }),
    ).toThrow(/-200/);
  });

  it("claim referring to a step index that is not a quote throws an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "claim",
            policy: 7,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/7/);
  });
});

describe("MHPCO claim office -- scenario runner and CLI", () => {
  it("a claim refers to its quote by zero-based step index, even with several policies", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 1,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    expect(results).toHaveLength(3);
    expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });

  it("schema example: 5-year customer, amulet quote then a 200 G fire claim", () => {
    const results = runScenario({
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
    });

    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("CLI reads a scenario from stdin and writes {results: [...]} to stdout with exit code 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
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

    const run = runCli(JSON.stringify(scenario));

    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("CLI exits non-zero with a stderr description and no stdout results for an invalid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const run = runCli(JSON.stringify(scenario));

    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).toBe("");
  });
});
