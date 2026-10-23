import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliResult {
  const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf-8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function quoteScenario(items: unknown[], yearsWithMHPCO = 0): unknown {
  return {
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  };
}

describe("MHPCO claim office CLI", () => {
  // --- Premium: simplest cases and component blocks ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runCli(quoteScenario([]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote of 2 runes -> premium 60 G (base 50 + 10% first insurance + 5 fee)", () => {
    const result = runCli(
      quoteScenario([{ type: "rune" }, { type: "rune" }]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote of 3 runes -> premium 71 G (block base 60 applies)", () => {
    const result = runCli(
      quoteScenario([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote of 4 runes -> premium 115 G (no block -- block requires exactly 3, base 100)", () => {
    const result = runCli(
      quoteScenario([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote of 7 runes -> premium 198 G (base 175; 197.5 total rounds up in MHPCO's favor)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runCli(quoteScenario(items));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 198 }] });
  });
  it("quote of 2 runes + 1 moonstone -> premium 88 G (base 75, no block across different types)", () => {
    const result = runCli(
      quoteScenario([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote of 3 runes + 3 moonstones -> premium 137 G (base 120, two separate blocks)", () => {
    const result = runCli(
      quoteScenario([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Main item price list ---
  it("quote of a plain sword -> premium 115 G (base 100 + 10 + 5)", () => {
    const result = runCli(
      quoteScenario([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote of a plain amulet -> premium 71 G (base 60 + 6 + 5)", () => {
    const result = runCli(
      quoteScenario([
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote of a plain staff -> premium 93 G (base 80 + 8 + 5)", () => {
    const result = runCli(
      quoteScenario([
        { type: "staff", material: "oak", enchantment: 1, cursed: false },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote of a plain potion -> premium 49 G (base 40 + 4 + 5)", () => {
    const result = runCli(quoteScenario([{ type: "potion" }]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Item-specific modifiers and thresholds ---
  it("sword with enchantment exactly 5 -> premium 145 G (high-enchantment surcharge applies)", () => {
    const result = runCli(
      quoteScenario([
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge)", () => {
    const result = runCli(
      quoteScenario([
        { type: "sword", material: "steel", enchantment: 4, cursed: false },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 -> premium 195 G (both surcharges apply)", () => {
    const result = runCli(
      quoteScenario([
        { type: "sword", material: "steel", enchantment: 5, cursed: true },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 195 }] });
  });
  it("cursed sword with enchantment 4 -> premium 165 G (curse surcharge only)", () => {
    const result = runCli(
      quoteScenario([
        { type: "sword", material: "steel", enchantment: 4, cursed: true },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Policy-wide modifiers and thresholds ---
  it("customer with exactly 2 years, plain amulet -> premium 59 G (loyalty discount applies: 60 - 12 + 6 + 5)", () => {
    const result = runCli(
      quoteScenario(
        [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        2,
      ),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }] });
  });
  it("customer with 1 year, plain amulet -> premium 71 G (no loyalty discount)", () => {
    const result = runCli(
      quoteScenario(
        [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        1,
      ),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it("second quote of a plain amulet -> premium 62 G (15% follow-up discount: 60 - 9 + 6 + 5)", () => {
    const amulet = {
      type: "amulet",
      material: "silver",
      enchantment: 2,
      cursed: false,
    };
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [amulet] },
        { op: "quote", items: [amulet] },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 71 }, { premium: 62 }],
    });
  });
  it("newcomer with a cursed sword (steel, enchantment 3) -> premium 165 G (integration example)", () => {
    const result = runCli(
      quoteScenario(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        0,
      ),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }] });
  });
  it("policy with cursed sword and plain amulet -> premium 231 G (curse applies to item base only: 160 + 50 + 16 + 5)", () => {
    const result = runCli(
      quoteScenario([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 231 }] });
  });
  it("long-standing customer's second contract: 3 years, cursed sword enchantment 7 -> premium 160 G (integration example)", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 7,
      cursed: true,
    };
    const result = runCli({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 175 }, { premium: 160 }],
    });
  });

  // --- Claims: standard reimbursement and special clauses ---
  it("claim: regular steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "goblin attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("claim: rune damage 200 -> payout 100, remainingCap 400 (no special clause for components)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "careless handling",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("claim: dragon sword enchantment exactly 8, damage 1000 -> payout 400 (50% rule, then deductible), remainingCap 1600", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("claim: dragon sword enchantment 9, damage 1000 -> payout 400 (both clauses, 50% wins)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("claim: dragon sword enchantment 5, damage 800 -> payout 700 (dragon clause only), remainingCap 1300", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("claim: steel sword enchantment 9, damage 1000 -> payout 400 (high-enchantment clause only)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("claim: steel sword enchantment 9, damage 901 -> payout 350 (350.5 rounds down in MHPCO's favor)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("claim: sword damage 500 and amulet damage 300 -> payout 600 (100 G deductible once per damaged item), remainingCap 2600", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claims: insurance sum, cap, multiple items ---
  it("policy of two swords, both damaged 500 each -> payout 800, remainingCap 3200 (sum 2000, cap 4000)", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });
  it("cursed sword, damage 1500 -> payout 1400, remainingCap 600 (cap 2000 from unmodified insurance value)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "goblin attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 165 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("policy of sword + 3 runes (block), sword damage 500 -> payout 400, remainingCap 3100 (cap 3500; block affects premium only)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "goblin attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
    });
  });
  it("cap exhaustion: two successive claims of 1500 on a sword -> 1400/600 then 600/0", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: {
        cause: "goblin attack",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        claim,
        claim,
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Rejection cases (observable contract: non-zero exit, error on stderr, no results on stdout) ---
  it("quote with unknown item type 'broomstick' -> non-zero exit, error on stderr, no results on stdout", () => {
    const result = runCli(quoteScenario([{ type: "broomstick" }]));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim damages an item not part of the policy -> non-zero exit, error on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
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
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim with damage entry of unknown item type -> non-zero exit, error on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim with more sword damages than insured swords -> non-zero exit, claim rejected", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
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
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim with negative damage amount -> non-zero exit, error on stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
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
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });

  // --- Full scenario from the schema example ---
  it("schema example: 5-year customer, amulet quote -> premium 59; fire claim 200 -> payout 100, remainingCap 1100", () => {
    const result = runCli({
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
