import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  runScenario,
  type ClaimResult,
  type ItemSpec,
  type QuoteResult,
  type ScenarioInput,
  type Step,
} from "./scenario.js";

function quoteOnly(items: ItemSpec[], years = 0, extraSteps: Step[] = []): ScenarioInput {
  return {
    customer: { yearsWithMHPCO: years },
    steps: [{ op: "quote", items }, ...extraSteps],
  };
}

function premiumOf(items: ItemSpec[], years = 0): number {
  const result = runScenario(quoteOnly(items, years))[0];
  return (result as QuoteResult).premium;
}

function claimAfterQuote(items: ItemSpec[], damages: { itemType: string; amount: number }[], years = 0): {
  payout: number;
  remainingCap: number;
} {
  const results = runScenario(
    quoteOnly(items, years, [{ op: "claim", policy: 0, incident: { cause: "incident", damages } }]),
  );
  return results[1] as ClaimResult;
}

function runCli(stdin: string): { status: number | null; stdout: string; stderr: string } {
  const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: stdin, encoding: "utf8" });
  return { status: cli.status, stdout: cli.stdout, stderr: cli.stderr };
}

describe("MHPCO Claim Office", () => {
  it("quote: empty item list yields premium 5 G (only the processing fee)", () => {
    expect(premiumOf([])).toBe(5);
  });
  it("quote: single steel sword enchantment 3, newcomer first contract -> premium 115 (100 base + 10 first-insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3 }])).toBe(115);
  });
  it("quote: single amulet -> base 60 -> premium 71 (60 + 6 first-insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "amulet", material: "silver", enchantment: 2 }])).toBe(71);
  });
  it("quote: single staff -> base 80 -> premium 93 (80 + 8 first-insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "staff", material: "oak", enchantment: 1 }])).toBe(93);
  });
  it("quote: single potion -> base 40 -> premium 49 (40 + 4 first-insurance + 5 fee)", () => {
    expect(premiumOf([{ type: "potion" }])).toBe(49);
  });
  it("quote: 2 runes -> base 50 (2 x 25, no block) -> premium 60 (50 + 5 + 5)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quote: 3 runes -> block of 3 alike applies, base 60 -> premium 71 (60 + 6 + 5)", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quote: 4 runes -> no block (block requires exactly 3), base 100 -> premium 115", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(115);
  });
  it("quote: 7 runes -> no block, base 175 -> 192.5 + 5 = 197.5 -> premium 198 (rounded up in MHPCO favor)", () => {
    expect(premiumOf(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quote: 2 runes + 1 moonstone -> alike means exactly same type, no block, base 75 -> 82.5 + 5 = 87.5 -> premium 88", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quote: 3 runes + 3 moonstones -> two separate blocks, base 120 -> premium 137 (120 + 12 + 5)", () => {
    const components = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    expect(premiumOf(components)).toBe(137);
  });
  it("quote: cursed sword + plain amulet -> cursed 50% surcharge on the cursed item's base only: 160 + 50 + 16 + 5 = 231 (spec: 210 before further modifiers and fee)", () => {
    expect(
      premiumOf([
        { type: "sword", material: "steel", enchantment: 2, cursed: true },
        { type: "amulet", material: "silver", enchantment: 1, cursed: false },
      ]),
    ).toBe(231);
  });
  it("quote: sword with exactly enchantment 5 -> high-enchantment surcharge 30% applies -> premium 145 (100 + 30 + 10 + 5)", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 5 }])).toBe(145);
  });
  it("quote: cursed sword with exactly enchantment 5 -> both surcharges apply -> premium 195 (100 + 50 + 30 + 10 + 5)", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("quote: steel sword enchantment 4 -> no high-enchantment surcharge -> premium 115", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 4 }])).toBe(115);
  });
  it("quote: cursed sword enchantment 4 -> curse surcharge applies only -> premium 165 (newcomer with cursed sword integration example)", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("quote: sword for customer with exactly 2 years at MHPCO -> loyalty discount 20% -> premium 95 (100 - 20 + 10 + 5)", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3 }], 2)).toBe(95);
  });
  it("quote: sword for customer with 1 year at MHPCO -> no loyalty discount -> premium 115", () => {
    expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3 }], 1)).toBe(115);
  });
  it("quote: second quote in scenario -> 15% follow-up contract discount -> premium 100 (100 - 15 + 10 + 5)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      ],
    });
    expect((results[1] as QuoteResult).premium).toBe(100);
  });
  it("quote integration: 3 years customer, second contract, cursed steel sword enchantment 7 -> premium 160 (100 + 50 + 30 - 20 + 10 - 15 + 5)", () => {
    const sword: ItemSpec = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect((results[1] as QuoteResult).premium).toBe(160);
  });
  it("claim: standard reimbursement - steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600 (cap 2000 - 400)", () => {
    expect(claimAfterQuote([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("quote: two swords -> insurance sum 2000, cap 4000 (verified via claim remainingCap)", () => {
    const results = claimAfterQuote(
      [{ type: "sword", material: "steel", enchantment: 2 }, { type: "sword", material: "steel", enchantment: 2 }],
      [
        { itemType: "sword", amount: 300 },
        { itemType: "sword", amount: 300 },
      ],
    );
    expect(results).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("claim: damage to a rune (insurance value 250), amount 200 -> payout 100, remainingCap 400 (full reimbursement minus 100 deductible; no special clause)", () => {
    expect(claimAfterQuote([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("claim: dragon attack damages sword (500) and amulet (300) -> deductible once per damaged item -> payout 600, remainingCap 2600 (cap 3200)", () => {
    expect(
      claimAfterQuote(
        [
          { type: "sword", material: "steel", enchantment: 2 },
          { type: "amulet", material: "silver", enchantment: 1 },
        ],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claim: dragon-material sword exactly enchantment 8, damage 1000 -> payout 400 (50% clause wins, then deductible)", () => {
    expect(
      claimAfterQuote([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword enchantment 9, damage 1000 -> payout 400 (both clauses apply, 50% wins: 500 - 100)", () => {
    expect(
      claimAfterQuote([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword enchantment 5, damage 800 -> payout 700 (only dragon clause: full minus deductible)", () => {
    expect(
      claimAfterQuote([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim: steel sword enchantment 9, damage 1000 -> payout 400 (only high-enchantment clause: 500 - 100)", () => {
    expect(
      claimAfterQuote([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: policy with two swords, two sword damages of 500 each -> each entry own deductible -> payout 800, remainingCap 3200 (cap 4000)", () => {
    expect(
      claimAfterQuote(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 },
        ],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim: policy sword + 3 runes (block) -> insurance sum 1750, cap 3500 (block discount affects premium only); sword damage 500 -> payout 400, remainingCap 3100", () => {
    expect(
      claimAfterQuote(
        [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        [{ itemType: "sword", amount: 500 }],
      ),
    ).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("claim: cursed sword policy -> cap based on unmodified insurance value 1000*2=2000; damage 1500 -> payout 1400, remainingCap 600", () => {
    expect(
      claimAfterQuote(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        [{ itemType: "sword", amount: 1500 }],
      ),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("claim: cap exhaustion - sword policy, two successive claims of 1500 -> first payout 1400 remainingCap 600, second payout 600 remainingCap 0", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("claim: payout 350.5 rounds down to 350 (steel sword enchantment 9, damage 901 -> 450.5 - 100 -> 350)", () => {
    expect(
      claimAfterQuote([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("claim: two policies keep independent caps - claim against policy 1 pays from its own cap and leaves policy 0's cap untouched", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results[2]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("error: quote with unknown item type (broomstick) -> runScenario throws Error [chosen contract: thrown Error, surfaced by CLI as non-zero exit and stderr]; no results", () => {
    expect(() => premiumOf([{ type: "broomstick" }])).toThrow(Error);
  });
  it("error: claim references a damage entry whose item is not part of the policy (amulet damaged when only sword insured) -> throws Error", () => {
    expect(() => claimAfterQuote([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "amulet", amount: 200 }])).toThrow(Error);
  });
  it("error: claim damage entry with unknown item type (broomstick) -> throws Error", () => {
    expect(() => claimAfterQuote([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "broomstick", amount: 200 }])).toThrow(Error);
  });
  it("error: claim damages array has more entries of a type than the policy covers (2 sword damages, 1 sword) -> throws Error, whole claim rejected", () => {
    expect(() =>
      claimAfterQuote(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ],
      ),
    ).toThrow(Error);
  });
  it("error: claim damage entry with amount -200 -> throws Error", () => {
    expect(() => claimAfterQuote([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
  it("CLI integration: valid scenario from stdin -> exit code 0, stdout JSON {results:[{premium:59},{payout:100,remainingCap:1100}]} for 5-year customer amulet quote + 200 claim", () => {
    const stdin = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const cli = runCli(stdin);
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI integration: quote with unknown item type -> non-zero exit code, non-empty stderr, no results on stdout", () => {
    const cli = runCli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }));
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim()).not.toBe("");
    expect(cli.stdout).not.toContain("results");
  });
});
