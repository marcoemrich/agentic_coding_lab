import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// MHPCO Claim Office — complete inactive test list.
// Observable contract: tests drive the `claim-office` CLI (src/cli.ts)
// via stdin/stdout JSON. Failure cases adopt the spec's contract:
// non-zero exit status, error description on stderr, no `results` on stdout.

interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

type Step =
  | { op: "quote"; items: QuoteItem[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };

function runCli(scenario: { yearsWithMHPCO: number; steps: Step[] }): { results: Record<string, number>[] } {
  const stdout = execFileSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify({ customer: { yearsWithMHPCO: scenario.yearsWithMHPCO }, steps: scenario.steps }),
    encoding: "utf-8",
  });
  return JSON.parse(stdout);
}

function quotePremium(yearsWithMHPCO: number, items: QuoteItem[]): number {
  return runCli({ yearsWithMHPCO, steps: [{ op: "quote", items }] }).results[0].premium;
}

function runCliFailure(scenario: { yearsWithMHPCO: number; steps: Step[] }): void {
  const result = spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify({ customer: { yearsWithMHPCO: scenario.yearsWithMHPCO }, steps: scenario.steps }),
    encoding: "utf-8",
  });
  expect(result.status).not.toBe(0);
  expect(result.stderr.length).toBeGreaterThan(0);
  expect(result.stdout).not.toContain("results");
}

describe("claim-office CLI", () => {
  // --- Quote: base premiums and fee ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium(0, [])).toBe(5);
  });
  it("single plain sword, new customer, first contract -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium(0, [{ type: "sword" }])).toBe(115);
  });
  it("single amulet -> premium 71 G (60 + 6 + 5)", () => {
    expect(quotePremium(0, [{ type: "amulet" }])).toBe(71);
  });
  it("single staff -> premium 93 G (80 + 8 + 5)", () => {
    expect(quotePremium(0, [{ type: "staff" }])).toBe(93);
  });
  it("single potion -> premium 49 G (40 + 4 + 5)", () => {
    expect(quotePremium(0, [{ type: "potion" }])).toBe(49);
  });
  it("single rune -> premium 33 G (32.5 rounded up in MHPCO's favor)", () => {
    expect(quotePremium(0, [{ type: "rune" }])).toBe(33);
  });

  // --- Quote: component building blocks ---
  it("2 runes -> premium 60 G (50 base, no block)", () => {
    expect(quotePremium(0, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes -> premium 71 G (60 base, block of 3 alike applies)", () => {
    expect(quotePremium(0, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes -> premium 115 G (100 base, block requires exactly 3)", () => {
    expect(quotePremium(0, Array(4).fill({ type: "rune" }))).toBe(115);
  });
  it("7 runes -> premium 198 G (197.5 rounded up)", () => {
    expect(quotePremium(0, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("2 runes + 1 moonstone -> premium 88 G (75 base, no block: different types; 87.5 rounded up)", () => {
    expect(quotePremium(0, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> premium 137 G (120 base, two separate blocks)", () => {
    const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
    expect(quotePremium(0, items)).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("newcomer with a cursed sword -> premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quotePremium(0, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("sword with enchantment exactly 5 -> premium 145 G (high-enchantment surcharge applies)", () => {
    expect(quotePremium(0, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge)", () => {
    expect(quotePremium(0, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("cursed sword with enchantment 5 -> premium 195 G (both surcharges apply)", () => {
    expect(quotePremium(0, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with exactly 2 years, plain sword -> premium 95 G (loyalty discount applies)", () => {
    expect(quotePremium(2, [{ type: "sword" }])).toBe(95);
  });
  it("second quote in scenario, plain sword -> premium 100 G (15% follow-up contract discount)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(output.results[1].premium).toBe(100);
  });
  it("cursed sword + plain amulet -> premium 231 G (curse surcharge only on the sword: 210 + 16 first insurance + 5 fee)", () => {
    expect(quotePremium(0, [{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("long-standing customer's second contract: 3 years, second quote, cursed sword enchantment 7 -> premium 160 G", () => {
    const output = runCli({
      yearsWithMHPCO: 3,
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(output.results[1].premium).toBe(160);
  });

  // --- Multi-step scenario from the schema example ---
  it("schema example: 5 years, quote amulet -> 59 G; claim amulet 200 -> payout 100, remainingCap 1100", () => {
    const output = runCli({
      yearsWithMHPCO: 5,
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(output.results[0].premium).toBe(59);
    expect(output.results[1].payout).toBe(100);
    expect(output.results[1].remainingCap).toBe(1100);
  });

  // --- Claim: standard reimbursement ---
  it("claim: regular steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "clumsiness", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(400);
    expect(output.results[1].remainingCap).toBe(1600);
  });
  it("claim: rune damage 200 -> payout 100, remainingCap 400 (no special clause for runes)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(100);
    expect(output.results[1].remainingCap).toBe(400);
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("claim: dragon sword enchantment exactly 8, damage 1000 -> payout 400 (50% rule wins, then deductible)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(400);
  });
  it("claim: dragon sword enchantment 9, damage 1000 -> payout 400 (both clauses, 50% wins)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(400);
  });
  it("claim: dragon sword enchantment 5, damage 800 -> payout 700, remainingCap 1300 (dragon clause only)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(700);
    expect(output.results[1].remainingCap).toBe(1300);
  });
  it("claim: steel sword enchantment 9, damage 1000 -> payout 400 (high-enchantment clause only)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(400);
  });
  it("claim: steel sword enchantment 9, damage 701 -> payout 250 (250.5 rounded down in MHPCO's favor)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 701 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(250);
  });

  // --- Claim: deductible and multiple items ---
  it("claim: sword 500 + amulet 300 in one incident -> payout 600 (deductible per damaged item), remainingCap 2600", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
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
    expect(output.results[1].payout).toBe(600);
    expect(output.results[1].remainingCap).toBe(2600);
  });
  it("policy with two swords: damage one sword 500 -> payout 400, remainingCap 3600 (insurance sum 2000, cap 4000)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(400);
    expect(output.results[1].remainingCap).toBe(3600);
  });
  it("policy with two swords, two sword damage entries -> payout 800 (each entry its own deductible), remainingCap 3200", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
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
    expect(output.results[1].payout).toBe(800);
    expect(output.results[1].remainingCap).toBe(3200);
  });

  // --- Claim: cap ---
  it("cap exhaustion: sword, two successive claims of 1500 -> payouts 1400 then 600, remainingCap 600 then 0", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(1400);
    expect(output.results[1].remainingCap).toBe(600);
    expect(output.results[2].payout).toBe(600);
    expect(output.results[2].remainingCap).toBe(0);
  });
  it("cursed sword, damage 1500 -> payout 1400, remainingCap 600 (cap from unmodified insurance value)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(1400);
    expect(output.results[1].remainingCap).toBe(600);
  });
  it("sword + 3 runes block: claim sword 500 -> payout 400, remainingCap 3100 (block affects premium only, sum 1750)", () => {
    const output = runCli({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output.results[1].payout).toBe(400);
    expect(output.results[1].remainingCap).toBe(3100);
  });

  // --- Errors: CLI exits non-zero, writes error to stderr, no results on stdout ---
  it("error: quote with unknown item type (broomstick) -> non-zero exit, stderr error, no results on stdout", () => {
    runCliFailure({ yearsWithMHPCO: 0, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
  });
  it("error: claim damages item not in policy (amulet damaged, only sword insured) -> non-zero exit, stderr error", () => {
    runCliFailure({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    });
  });
  it("error: more damage entries of a type than the policy covers -> non-zero exit, whole claim rejected", () => {
    runCliFailure({
      yearsWithMHPCO: 0,
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
    });
  });
  it("error: damage entry with amount -200 -> non-zero exit, stderr error", () => {
    runCliFailure({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
  });
  it("error: claim damage entry with unknown item type -> non-zero exit, stderr error", () => {
    runCliFailure({
      yearsWithMHPCO: 0,
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] } },
      ],
    });
  });
});
