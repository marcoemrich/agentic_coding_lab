import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { processScenario } from "./claim-office.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(__dirname, "./cli.ts");

function runCli(input: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("MHPCO Claim Office - quote (premium calculation)", () => {
  it("empty item list, customer 0 years, 1st quote → premium 5 G (only the processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it("single sword (steel, enchantment 0, not cursed), customer 0 years, 1st quote → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("single amulet (silver, enchantment 0, not cursed), customer 0 years, 1st quote → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("single staff (wood, enchantment 0, not cursed), customer 0 years, 1st quote → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  it("single potion, customer 0 years, 1st quote → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  it("single rune, customer 0 years, 1st quote → premium 33 G (25 base + 2.5 first-insurance + 5 fee = 32.5 rounded up to 33)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  it("2 runes (no block), customer 0 years, 1st quote → premium 60 G (50 base + 5 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  it("3 runes (block of 3), customer 0 years, 1st quote → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("4 runes (no block, block requires exactly 3), customer 0 years, 1st quote → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("7 runes (no block), customer 0 years, 1st quote → premium 198 G (175 base + 17.5 first-insurance + 5 fee = 197.5 rounded up to 198)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  it("2 runes + 1 moonstone (no block, alike requires same type), customer 0 years, 1st quote → premium 88 G (75 base + 7.5 first-insurance + 5 fee = 87.5 rounded up)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  it("3 runes + 3 moonstones (two separate blocks of 3 alike), customer 0 years, 1st quote → premium 137 G (120 base + 12 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  it("sword with enchantment 4, not cursed, customer 0 years, 1st quote → premium 115 G (no high-enchantment surcharge below threshold)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("sword with enchantment exactly 5, not cursed, customer 0 years, 1st quote → premium 145 G (100 base + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  it("cursed sword with enchantment exactly 5, customer 0 years, 1st quote → premium 195 G (100 base + 50 curse + 30 high-enchantment + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  it("plain sword, customer with exactly 2 years (loyalty applies), 1st quote → premium 95 G (100 base + 10 first-insurance − 20 loyalty + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("policy with a cursed sword and a plain amulet, customer 0 years, 1st quote → premium 231 G (item totals 100+60+50 curse = 210, + 16 first-insurance (10% of policy base 160) + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  it("integration: newcomer (0 years, 1st contract) with a cursed sword (steel, enchantment 3) → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it("integration: long-standing customer (3 years, 2nd quote in scenario) with a cursed sword (steel, enchantment 7) → premium 160 G (100 base + 50 curse + 30 high-enchantment − 20 loyalty + 10 first-insurance − 15 follow-up + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: expect.any(Number) }, { premium: 160 }],
    });
  });
});

describe("MHPCO Claim Office - claim (payout calculation)", () => {
  it("policy with one sword (cap 2000); steel sword enchantment 3, damage 500 → payout 400 G (full reimbursement minus 100 deductible), remainingCap 1600", () => {
    const result = processScenario({
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
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it("policy with one rune (insurance value 250, cap 500); damage 200 → payout 100 G (full reimbursement minus 100 deductible), remainingCap 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
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
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  it("policy with dragon-material sword (enchantment 5); damage 800 → payout 700 G (only dragon clause: full reimbursement, then deductible), remainingCap 1300", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });

  it("policy with steel sword enchantment 9; damage 1000 → payout 400 G (only high-enchantment clause: 50% then deductible: 500-100), remainingCap 1600", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it("policy with dragon-material sword enchantment 9; damage 1000 → payout 400 G (both clauses, 50% rule wins, then deductible), remainingCap 1600", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it("policy with dragon-material sword enchantment exactly 8; damage 1000 → payout 400 G (high-enchantment clause applies at threshold, then deductible: 500-100), remainingCap 1600", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it("policy with sword + amulet (cap 3200); damages [sword 500, amulet 300] → payout 600 G (deductible applies once per damaged item: 400+200), remainingCap 2600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });

  it("policy with two swords (insurance sum 2000, cap 4000); damages [sword 500, sword 300] → payout 600 G (each entry treated as a separate damage), remainingCap 3400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 600, remainingCap: 3400 },
      ],
    });
  });

  it("cap exhaustion across two claims: sword (cap 2000); claim 1 damage 1500 → payout 1400, remainingCap 600; claim 2 damage 1500 → payout 600 (reduced to remaining cap), remainingCap 0", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
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
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  it("rounding payouts down: dragon sword enchantment 9, damage 901 → payout 350 G (50% of 901 = 450.5, minus 100 deductible = 350.5, rounded down to 350)", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });

  it("cap based on unmodified insurance value: cursed sword (insurance value 1000, premium modifiers do not raise cap) → cap is 2000 (verified via remainingCap after small claim)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 200, remainingCap: 1800 },
      ],
    });
  });

  it("block discount does not lower insurance sum: policy with sword + 3 runes → insurance sum 1750 G, cap 3500 (verified via remainingCap)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: expect.any(Number) },
        { payout: 200, remainingCap: 3300 },
      ],
    });
  });
});

describe("MHPCO Claim Office - CLI (stdin/stdout JSON)", () => {
  it("CLI reads scenario JSON from stdin and writes { results: [...] } to stdout in the same order as steps", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed).toEqual({ results: [{ premium: 115 }] });
  });

  it("CLI quote result has shape { premium: <integer> } (schema example: customer 5 yrs, single amulet quote)", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.results).toHaveLength(1);
    expect(parsed.results[0]).toEqual({ premium: expect.any(Number) });
    expect(Number.isInteger(parsed.results[0].premium)).toBe(true);
  });

  it("CLI claim result has shape { payout: <integer>, remainingCap: <integer> } (schema example: amulet claim after the quote)", () => {
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
    const parsed = JSON.parse(result.stdout);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[1]).toEqual({
      payout: expect.any(Number),
      remainingCap: expect.any(Number),
    });
    expect(Number.isInteger(parsed.results[1].payout)).toBe(true);
    expect(Number.isInteger(parsed.results[1].remainingCap)).toBe(true);
  });

  it("CLI multi-step scenario (quote then claim) returns results array of length 2 with correct shapes", () => {
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
    const parsed = JSON.parse(result.stdout);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[0]).toEqual({ premium: expect.any(Number) });
    expect(parsed.results[1]).toEqual({
      payout: expect.any(Number),
      remainingCap: expect.any(Number),
    });
  });

  it("CLI exits with non-zero status code when a quote contains an unknown item type (e.g. broomstick); writes error to stderr; does not write results to stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });

  it("CLI exits with non-zero status code when a claim references a damage entry whose item type is not part of the policy; writes error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
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
  });

  it("CLI exits with non-zero status code when a claim contains a damage entry with negative amount; writes error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -100 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  it("CLI exits with non-zero status code when a damages array contains more entries of a type than insured (e.g. two sword damages but only one sword insured); whole claim rejected", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});
