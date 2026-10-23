import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runScenario, type Damage, type Item, type Result } from "./scenario.js";

// Inactive test list for the MHPCO claim office kata.
// Every specification example and rule has at least one entry here.
// One entry is activated per Predictive TDD cycle.

function premiumOf(items: Item[], yearsWithMHPCO = 0): number {
  const [result] = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return quotePremium(result);
}

function quotePremium(result: Result | undefined): number {
  if (result === undefined || !("premium" in result)) {
    throw new Error(`expected a quote result, received ${JSON.stringify(result)}`);
  }
  return result.premium;
}

function premiumOfSecondQuote(items: Item[], yearsWithMHPCO = 0): number {
  const results = runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items },
    ],
  });
  return quotePremium(results[1]);
}

function claimOf(items: Item[], damages: Damage[], yearsWithMHPCO = 0): Result {
  const results = runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1] as Result;
}

function payoutsOf(
  items: Item[],
  damageLists: Damage[][],
): { payout: number; remainingCap: number }[] {
  const results = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...damageLists.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  });
  return results.slice(1).map((result) => claimPayout(result));
}

const CLI_PATH = join(process.cwd(), "node_modules", ".bin", "tsx");

interface CliRun {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliRun {
  const result = spawnSync(CLI_PATH, ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function claimPayout(result: Result): { payout: number; remainingCap: number } {
  if (!("payout" in result)) {
    throw new Error(`expected a claim result, received ${JSON.stringify(result)}`);
  }
  return { payout: result.payout, remainingCap: result.remainingCap };
}

describe("quote: item catalogue and base premiums", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(premiumOf([])).toBe(5);
  });
  it("quotes a sword at 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "sword" }])).toBe(115);
  });
  it("quotes an amulet at 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a staff at 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "staff" }])).toBe(93);
  });
  it("quotes a potion at 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "potion" }])).toBe(49);
  });
  it("quotes one rune at 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(premiumOf([{ type: "rune" }])).toBe(33);
  });
  it("quotes one moonstone at 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(premiumOf([{ type: "moonstone" }])).toBe(33);
  });
});

describe("quote: building blocks of alike components", () => {
  it("quotes 2 runes at 60 G (50 G component base + 5 G first insurance + 5 G fee)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes at 71 G (60 G block base + 6 G first insurance + 5 G fee)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes at 115 G (100 G base, no block: block requires exactly 3)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(
      115,
    );
  });
  it("quotes 7 runes at 198 G (175 G base, 197.5 G rounded up in MHPCO's favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(premiumOf(sevenRunes)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone at 88 G (75 G base, no block: different types)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones at 137 G (120 G base, two separate blocks)", () => {
    const threeRunes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const threeMoonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(premiumOf([...threeRunes, ...threeMoonstones])).toBe(137);
  });
});

describe("quote: item-specific risk surcharges", () => {
  it("quotes a cursed sword for a newcomer at 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a sword with enchantment exactly 5 at 145 G (30 G high-enchantment surcharge)", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("quotes a sword with enchantment 4 at 115 G (no high-enchantment surcharge)", () => {
    expect(premiumOf([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("quotes a cursed sword with enchantment 5 at 195 G (both surcharges apply)", () => {
    expect(premiumOf([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it(
    "quotes a cursed sword plus a plain amulet at 231 G (curse on the cursed item only: 160 + 50 + 16 + 5)",
    () => {
      expect(premiumOf([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    },
  );
});

describe("quote: policy-wide modifiers", () => {
  it("quotes a sword for a customer with exactly 2 years at 95 G (20 G loyalty discount)", () => {
    expect(premiumOf([{ type: "sword" }], 2)).toBe(95);
  });
  it("quotes a sword for a customer with 1 year at 115 G (no loyalty discount)", () => {
    expect(premiumOf([{ type: "sword" }], 1)).toBe(115);
  });
  it("quotes a second contract for a sword at 100 G (15 G follow-up discount, 10 G first insurance)", () => {
    expect(premiumOfSecondQuote([{ type: "sword" }])).toBe(100);
  });
  it(
    "quotes a cursed enchantment-7 sword as a 3-year customer's second contract at 160 G (155 + 5 fee)",
    () => {
      expect(premiumOfSecondQuote([{ type: "sword", enchantment: 7, cursed: true }], 3)).toBe(160);
    },
  );
});

describe("claim: reimbursement clauses and deductible", () => {
  it("pays 400 G for a steel enchantment-3 sword damaged 500 G, remaining cap 1600 G", () => {
    const payout = claimPayout(
      claimOf([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
    );
    expect(payout).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a damaged rune (200 G damage), remaining cap 400 G", () => {
    const payout = claimPayout(claimOf([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]));
    expect(payout).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for an enchantment-9 sword damaged 1000 G (50 % then deductible)", () => {
    const payout = claimPayout(
      claimOf([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    );
    expect(payout).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for a dragon-material enchantment-5 sword damaged 800 G (full then deductible)", () => {
    const payout = claimPayout(
      claimOf(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        [{ itemType: "sword", amount: 800 }],
      ),
    );
    expect(payout).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for a dragon-material enchantment-9 sword damaged 1000 G (50 % clause wins)", () => {
    const payout = claimPayout(
      claimOf(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
      ),
    );
    expect(payout).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for a dragon-material enchantment-8 sword damaged 1000 G (threshold is inclusive)", () => {
    const payout = claimPayout(
      claimOf(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        [{ itemType: "sword", amount: 1000 }],
      ),
    );
    expect(payout).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when a sword (500 G) and an amulet (300 G) are damaged (deductible per item)", () => {
    const payout = claimPayout(
      claimOf(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    );
    expect(payout).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 600 G when two insured swords are damaged for 500 G and 300 G (own deductible each)", () => {
    const payout = claimPayout(
      claimOf(
        [{ type: "sword" }, { type: "sword" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      ),
    );
    expect(payout).toEqual({ payout: 600, remainingCap: 3400 });
  });
});

describe("claim: cap exhaustion", () => {
  it("pays 1400 G on a 1500 G sword claim, remaining cap 600 G", () => {
    const payout = claimPayout(claimOf([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }]));
    expect(payout).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("pays 600 G on the second 1500 G claim, remaining cap 0 G", () => {
    const payouts = payoutsOf(
      [{ type: "sword" }],
      [
        [{ itemType: "sword", amount: 1500 }],
        [{ itemType: "sword", amount: 1500 }],
      ],
    );
    expect(payouts).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("caps a cursed sword policy at 2000 G (unmodified insurance value): 2500 G damage pays 2000 G", () => {
    const payout = claimPayout(
      claimOf([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 2500 }]),
    );
    expect(payout).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it(
    "caps a sword plus 3 runes policy at 3500 G (block discount does not lower insurance sum): 4000 G sword damage pays 3500 G",
    () => {
      const threeRunes = Array.from({ length: 3 }, () => ({ type: "rune" }));
      const payout = claimPayout(
        claimOf([{ type: "sword" }, ...threeRunes], [{ itemType: "sword", amount: 4000 }]),
      );
      expect(payout).toEqual({ payout: 3500, remainingCap: 0 });
    },
  );
  it("caps a sword plus amulet policy at 3200 G: 3000 G sword damage pays 2900 G, remaining 300 G", () => {
    const payout = claimPayout(
      claimOf([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 3000 }]),
    );
    expect(payout).toEqual({ payout: 2900, remainingCap: 300 });
  });
});

describe("claim: rounding in the MHPCO's favor", () => {
  it("pays 350 G for an enchantment-9 sword damaged 901 G (450.5 - 100 = 350.5, rounded down)", () => {
    const payout = claimPayout(
      claimOf([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]),
    );
    expect(payout).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("pays 701 G for two 901 G enchantment-9 damages (fractions kept until the final payout)", () => {
    const payout = claimPayout(
      claimOf(
        [{ type: "sword", enchantment: 9 }],
        [
          { itemType: "sword", amount: 901 },
          { itemType: "sword", amount: 901 },
        ],
      ),
    );
    expect(payout).toEqual({ payout: 701, remainingCap: 1299 });
  });
});

describe("cli: JSON stdin/stdout contract", () => {
  it("writes {results:[{premium:115}]} for a single sword quote and exits 0", () => {
    const cli = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(cli.status).toBe(0);
    expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it(
    "runs the schema example: amulet quote 59 G, then amulet claim payout 100 G, remainingCap 1100 G",
    () => {
      const cli = runCli({
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
      expect(cli.status).toBe(0);
      expect(cli.stderr).toBe("");
      expect(JSON.parse(cli.stdout)).toEqual({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
        ],
      });
    },
  );
  it("exits non-zero with a stderr error and no stdout results for an unknown quote item type", () => {
    const cli = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).not.toContain("results");
  });
  it.todo("exits non-zero with a stderr error when a damaged item is not part of the policy");
  it.todo("exits non-zero with a stderr error when a damage entry has an unknown item type");
  it.todo("exits non-zero with a stderr error when a damage entry has amount -200");
  it.todo(
    "exits non-zero and rejects the whole claim when there are more sword damages than insured swords",
  );
});
