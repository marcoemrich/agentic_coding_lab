import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

import type { ClaimStep, ItemSpec, QuoteStep, Scenario } from "./office.js";
import { RejectionError } from "./office.js";
import { runScenario } from "./office.js";

function quoteStep(...items: ItemSpec[]): QuoteStep {
  return { op: "quote", items };
}

function claimStep(policy: number, damages: Array<[string, number]>): ClaimStep {
  return {
    op: "claim",
    policy,
    incident: { cause: "incident", damages: damages.map(([itemType, amount]) => ({ itemType, amount })) },
  };
}

function scenario(yearsWithMHPCO: number, steps: Array<QuoteStep | ClaimStep>): Scenario {
  return { customer: { yearsWithMHPCO }, steps };
}

function item(type: string, extra: Partial<ItemSpec> = {}): ItemSpec {
  return { type, ...extra };
}

function runCli(input: unknown) {
  return spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("MHPCO claim office -- quotes", () => {
  it("quote: empty item list charges only the 5 G processing fee -- premium 5", () => {
    const result = runScenario(scenario(0, [quoteStep()]));
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  it("quote: single sword -- premium 115 (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("sword", { material: "steel", enchantment: 3 }))
    ]));
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("quote: single amulet -- premium 71 (60 + 6 + 5)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("amulet", { material: "silver", enchantment: 2 }))
    ]));
    expect(result.results).toEqual([{ premium: 71 }]);
  });

  it("quote: single staff -- premium 93 (80 + 8 + 5)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("staff", { material: "wood", enchantment: 2 }))
    ]));
    expect(result.results).toEqual([{ premium: 93 }]);
  });

  it("quote: single potion -- premium 49 (40 + 4 + 5)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("potion"))
    ]));
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  it("quote: single rune -- premium 33 (25 + 2.5 first insurance + 5 fee = 32.5, rounded up in MHPCO's favor)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"))
    ]));
    expect(result.results).toEqual([{ premium: 33 }]);
  });

  it("quote: single moonstone -- premium 33 (25 + 2.5 + 5 = 32.5, rounded up)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("moonstone"))
    ]));
    expect(result.results).toEqual([{ premium: 33 }]);
  });

  it("quote: 2 runes -- premium 60 (base 50 + 5 first + 5 fee)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"), item("rune"))
    ]));
    expect(result.results).toEqual([{ premium: 60 }]);
  });

  it("quote: 3 runes -- premium 71 (block base 60 + 6 first + 5 fee; block applies at exactly 3)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"), item("rune"), item("rune"))
    ]));
    expect(result.results).toEqual([{ premium: 71 }]);
  });

  it("quote: 4 runes -- premium 115 (base 100, no block -- block requires exactly 3)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"), item("rune"), item("rune"), item("rune"))
    ]));
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("quote: 6 runes -- premium 170 (adopted reading: block applies only when exactly 3 alike, so 6x25 = 150 base + 15 first + 5 fee)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"), item("rune"), item("rune"), item("rune"), item("rune"), item("rune"))
    ]));
    expect(result.results).toEqual([{ premium: 170 }]);
  });

  it("quote: 7 runes -- premium 198 (base 175 + 17.5 first + 5 fee = 197.5, rounded up)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"), item("rune"), item("rune"), item("rune"), item("rune"), item("rune"), item("rune"))
    ]));
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  it("quote: 2 runes + 1 moonstone -- premium 88 (base 75, no block: different types; 75 + 7.5 + 5 = 87.5 rounded up)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"), item("rune"), item("moonstone"))
    ]));
    expect(result.results).toEqual([{ premium: 88 }]);
  });

  it("quote: 3 runes + 3 moonstones -- premium 137 (two separate blocks: base 120 + 12 + 5)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("rune"), item("rune"), item("rune"), item("moonstone"), item("moonstone"), item("moonstone"))
    ]));
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  it("quote: cursed sword + plain amulet, new customer -- premium 231 (base 160 + 50 item-scoped curse + 16 first + 5 fee; '210 before further modifiers and fee')", () => {
    const result = runScenario(scenario(0, [quoteStep(
      item("sword", { material: "steel", enchantment: 1, cursed: true }),
      item("amulet", { material: "silver", enchantment: 1 })
    )
    ]));
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  it("quote: sword with enchantment exactly 5 -- premium 145 (100 + 30 high-enchantment + 10 + 5)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("sword", { material: "steel", enchantment: 5 }))
    ]));
    expect(result.results).toEqual([{ premium: 145 }]);
  });

  it("quote: sword with enchantment 4 -- premium 115 (no high-enchantment surcharge)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("sword", { material: "steel", enchantment: 4 }))
    ]));
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("quote: cursed sword with enchantment 5 -- premium 195 (100 + 50 curse + 30 high enchantment + 10 + 5; both surcharges apply)", () => {
    const result = runScenario(scenario(0, [quoteStep(item("sword", { material: "steel", enchantment: 5, cursed: true }))
    ]));
    expect(result.results).toEqual([{ premium: 195 }]);
  });

  it("quote: sword, customer with exactly 2 years at MHPCO -- premium 95 (100 - 20 loyalty + 10 first + 5)", () => {
    const result = runScenario(scenario(2, [quoteStep(item("sword", { material: "steel", enchantment: 3 }))
    ]));
    expect(result.results).toEqual([{ premium: 95 }]);
  });

  it("quote: sword, customer with 1 year -- premium 115 (no loyalty discount)", () => {
    const result = runScenario(scenario(1, [quoteStep(item("sword", { material: "steel", enchantment: 3 }))
    ]));
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it("quote: sword, second quote step in the scenario -- premium 100 (100 + 10 first - 15 follow-up + 5); first stays 115", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "steel", enchantment: 3 })),
      quoteStep(item("sword", { material: "steel", enchantment: 3 })),
    ]));
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  it("integration: newcomer (0 years, first contract) with cursed sword (steel, enchantment 3) -- premium 165", () => {
    const result = runScenario(scenario(0, [quoteStep(item("sword", { material: "steel", enchantment: 3, cursed: true }))
    ]));
    expect(result.results).toEqual([{ premium: 165 }]);
  });

  it("integration: 3-year customer's second quote, cursed sword enchantment 7 -- premium 160 (100 + 50 + 30 - 20 + 10 - 15 + 5); first quote (plain sword) 95", () => {
    const result = runScenario(scenario(3, [
      quoteStep(item("sword", { material: "steel", enchantment: 3 })),
      quoteStep(item("sword", { material: "steel", enchantment: 7, cursed: true })),
    ]));
    expect(result.results).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  it("quote: item with unknown type broomstick -- rejected (throws a rejection error)", () => {
    expect(() =>
      runScenario(scenario(0, [quoteStep(item("broomstick"))])),
    ).toThrowError(RejectionError);
  });
});

describe("MHPCO claim office -- claims", () => {
  it("claim: regular steel sword (enchantment 3), damage 500 -- payout 400, remainingCap 1600 (full reimbursement minus 100 G deductible; sword cap 2000)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "steel", enchantment: 3 })),
      claimStep(0, [["sword", 500]]),
    ]));
    expect(result.results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("claim: damage to a rune, amount 200 -- payout 100, remainingCap 400 (no enchantment or material clause; rune cap 500)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("rune")),
      claimStep(0, [["rune", 200]]),
    ]));
    expect(result.results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });

  it("claim: dragon attack damages sword (500) and amulet (300) -- payout 600, remainingCap 2600 (deductible once per damaged item; policy cap 3200)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(
        item("sword", { material: "steel", enchantment: 3 }),
        item("amulet", { material: "silver", enchantment: 1 }),
      ),
      claimStep(0, [["sword", 500], ["amulet", 300]]),
    ]));
    expect(result.results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });
  it("claim: dragon-material sword with enchantment exactly 8, damage 1000 -- payout 400, remainingCap 1600 (high-enchantment clause applies, then deductible)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "dragon", enchantment: 8 })),
      claimStep(0, [["sword", 1000]]),
    ]));
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("claim: dragon-material sword with enchantment 5, damage 800 -- payout 700, remainingCap 1300 (only dragon clause: full reimbursement minus deductible)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "dragon", enchantment: 5 })),
      claimStep(0, [["sword", 800]]),
    ]));
    expect(result.results).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });

  it("claim: dragon-material sword with enchantment 9, damage 1000 -- payout 400, remainingCap 1600 (both clauses: 50% rule wins, then deductible)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "dragon", enchantment: 9 })),
      claimStep(0, [["sword", 1000]]),
    ]));
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("claim: steel sword with enchantment 9, damage 1000 -- payout 400, remainingCap 1600 (only high-enchantment clause: 500 - 100)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "steel", enchantment: 9 })),
      claimStep(0, [["sword", 1000]]),
    ]));
    expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  it("claim: two swords insured, two sword damage entries of 500 each -- payout 800, remainingCap 3200 (each entry a separate damage with its own deductible)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(
        item("sword", { material: "steel", enchantment: 3 }),
        item("sword", { material: "steel", enchantment: 3 }),
      ),
      claimStep(0, [["sword", 500], ["sword", 500]]),
    ]));
    expect(result.results).toEqual([{ premium: 225 }, { payout: 800, remainingCap: 3200 }]);
  });

  it("claim: cursed sword policy (insurance sum 1000) -- damage 1500 gives payout 1400, remainingCap 600 (cap 2000 based on unmodified insurance value)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "steel", enchantment: 3, cursed: true })),
      claimStep(0, [["sword", 1500]]),
    ]));
    expect(result.results).toEqual([{ premium: 165 }, { payout: 1400, remainingCap: 600 }]);
  });

  it("claim: sword + 3 runes (block) policy -- insurance sum 1750, cap 3500; sword damage 1500 gives payout 1400, remainingCap 2100 (block affects premium only)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(
        item("sword", { material: "steel", enchantment: 3 }),
        item("rune"),
        item("rune"),
        item("rune"),
      ),
      claimStep(0, [["sword", 1500]]),
    ]));
    expect(result.results).toEqual([{ premium: 181 }, { payout: 1400, remainingCap: 2100 }]);
  });

  it("claim: cap exhaustion -- sword policy, two successive claims of 1500: first payout 1400 remainingCap 600, second payout 600 remainingCap 0", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "steel", enchantment: 3 })),
      claimStep(0, [["sword", 1500]]),
      claimStep(0, [["sword", 1500]]),
    ]));
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it("claim: steel sword enchantment 8, damage 901 -- payout 350, remainingCap 1650 (450.5 - 100 = 350.5, rounded down in MHPCO's favor)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "steel", enchantment: 8 })),
      claimStep(0, [["sword", 901]]),
    ]));
    expect(result.results).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });

  it("claim: sword damage of 80 (below deductible) -- payout 0, remainingCap 2000 (adopted reading: reimbursement floors at zero)", () => {
    const result = runScenario(scenario(0, [
      quoteStep(item("sword", { material: "steel", enchantment: 3 })),
      claimStep(0, [["sword", 80]]),
    ]));
    expect(result.results).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }]);
  });

  it("claim: amulet damaged when only a sword is insured -- rejected (throws a rejection error)", () => {
    expect(() =>
      runScenario(scenario(0, [
        quoteStep(item("sword", { material: "steel", enchantment: 3 })),
        claimStep(0, [["amulet", 300]]),
      ])),
    ).toThrowError(RejectionError);
  });

  it("claim: two sword damage entries but only one sword insured -- whole claim rejected (throws a rejection error)", () => {
    expect(() =>
      runScenario(scenario(0, [
        quoteStep(item("sword", { material: "steel", enchantment: 3 })),
        claimStep(0, [["sword", 500], ["sword", 300]]),
      ])),
    ).toThrowError(RejectionError);
  });

  it("claim: damage entry with amount -200 -- rejected (throws a rejection error)", () => {
    expect(() =>
      runScenario(scenario(0, [
        quoteStep(item("sword", { material: "steel", enchantment: 3 })),
        claimStep(0, [["sword", -200]]),
      ])),
    ).toThrowError(RejectionError);
  });

  it("claim: damage entry with unknown itemType broomstick -- rejected (throws a rejection error)", () => {
    expect(() =>
      runScenario(scenario(0, [
        quoteStep(item("sword", { material: "steel", enchantment: 3 })),
        claimStep(0, [["broomstick", 100]]),
      ])),
    ).toThrowError(RejectionError);
  });

  it("claim: policy index 5 with no such step -- rejected (adopted reading: policy must reference an earlier quote step)", () => {
    expect(() =>
      runScenario(scenario(0, [
        quoteStep(item("sword", { material: "steel", enchantment: 3 })),
        claimStep(5, [["sword", 100]]),
      ])),
    ).toThrowError(RejectionError);
  });

  it("claim: policy index pointing at a claim step -- rejected (adopted reading: policy must reference a quote step)", () => {
    expect(() =>
      runScenario(scenario(0, [
        quoteStep(item("sword", { material: "steel", enchantment: 3 })),
        claimStep(0, [["sword", 100]]),
        claimStep(1, [["sword", 100]]),
      ])),
    ).toThrowError(RejectionError);
  });
});

describe("MHPCO claim office -- CLI", () => {
  it("CLI: schema example (amulet quote then claim of 200) -- stdout results, exit 0", () => {
    const run = runCli({
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
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("CLI: empty item list -- stdout {results:[{premium:5}]}, exit 0", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it("CLI: quote with unknown type broomstick -- non-zero exit, error on stderr, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });

  it("CLI: claim with negative damage amount -- non-zero exit, error on stderr, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
});

void claimStep; // helper used by claim tests, kept for future cycles
void item;
void runCli;
void RejectionError;
