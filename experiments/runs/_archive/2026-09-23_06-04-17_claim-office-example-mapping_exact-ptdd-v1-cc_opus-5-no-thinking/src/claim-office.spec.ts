import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const execFileAsync = promisify(execFile);
const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

async function runCli(input: unknown): Promise<CliRun> {
  const child = execFileAsync("npx", ["tsx", CLI]);

  child.child.stdin?.end(JSON.stringify(input));

  try {
    const { stdout, stderr } = await child;

    return { status: 0, stdout, stderr };
  } catch (error) {
    const failure = error as { code?: number; stdout?: string; stderr?: string };

    return {
      status: failure.code ?? 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

describe("MHPCO claim office", () => {
  // --- quote: processing fee and simplest cases ---
  it("quotes an empty item list as 5 G -- only the processing fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
  it("quotes a plain sword for a 0-year customer as 115 G -- 100 base + 10 first insurance + 5 fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });

  // --- quote: price list per item type (parallel catalogue, one test per entry) ---
  it("quotes a plain amulet for a 0-year customer as 71 G -- 60 base + 6 first insurance + 5 fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a plain staff for a 0-year customer as 93 G -- 80 base + 8 first insurance + 5 fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a plain potion for a 0-year customer as 49 G -- 40 base + 4 first insurance + 5 fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });
  it("quotes a single rune for a 0-year customer as 33 G -- 25 base + 2.5 first insurance + 5 fee, rounded up", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes a single moonstone for a 0-year customer as 33 G -- 25 base + 2.5 first insurance + 5 fee, rounded up", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });

  // --- quote: component building block of 3 alike components ---
  it("base premium for 2 runes is 50 G -- no block", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 base + 5 first insurance + 5 fee
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("base premium for 3 runes is 60 G -- the block applies", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 60 block base + 6 first insurance + 5 fee
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("base premium for 4 runes is 100 G -- no block, a block requires exactly 3", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("base premium for 7 runes is 175 G -- no block within 7 alike components", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 base + 17.5 first insurance + 5 fee = 197.5, rounded up
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("base premium for 2 runes + 1 moonstone is 75 G -- no block, types differ", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    // 75 base + 7.5 first insurance + 5 fee = 87.5, rounded up
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("base premium for 3 runes + 3 moonstones is 120 G -- two separate blocks", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
          ],
        },
      ],
    });

    // 120 base + 12 first insurance + 5 fee
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- quote: item-specific modifiers ---
  it("a cursed sword adds a 50 % curse surcharge to that item's base premium -- 50 G on 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });

    // 160 policy base + 50 curse on the sword + 16 first insurance + 5 fee
    expect(results).toEqual([{ premium: 231 }]);
  });
  it("a sword with enchantment 5 adds a 30 % high-enchantment surcharge -- 30 G on 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 base + 30 high enchantment + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("a sword with enchantment 4 adds no high-enchantment surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("a cursed sword with enchantment 5 adds both surcharges -- 50 G + 30 G on 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 195 }]);
  });
  it("on a policy with a cursed sword and a plain amulet the curse surcharge is 50 G -- 50 % of the cursed item only, not of the 160 G policy total", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // 160 policy base + 50 curse on the sword + 16 first insurance + 5 fee
    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- quote: policy-wide modifiers ---
  it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("a customer with 1 year with MHPCO receives no loyalty discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("the 10 % first-insurance surcharge applies on the policy base premium of every quote", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
      ],
    });

    // 160 policy base + 16 first insurance + 5 fee
    expect(results).toEqual([{ premium: 181 }]);
  });
  it("the second quote in a scenario receives the 15 % follow-up contract discount", () => {
    const sword = { op: "quote" as const, items: [{ type: "sword" }] };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [sword, sword],
    });

    // second quote: 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("the first quote in a scenario receives no follow-up contract discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    // 100 base + 10 first insurance + 5 fee, no follow-up discount
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("policy-wide modifiers apply to the sum of item base premiums, the 5 G fee is added last", () => {
    const quote = {
      op: "quote" as const,
      items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet" },
      ],
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [quote, quote],
    });

    // second quote: 160 policy base + 50 curse on the sword
    // + 16 first insurance - 32 loyalty - 24 follow-up + 5 fee
    expect(results[1]).toEqual({ premium: 175 });
  });

  // --- quote: rounding in MHPCO's favour ---
  it("a premium of 197.5 G is rounded up to 198 G -- rounding favours MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    // 175 + 17.5 + 5 = 197.5 exactly, rounded up in the MHPCO's favour
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("intermediate premium amounts stay fractional, only the final premium is rounded", () => {
    const moonstone = { op: "quote" as const, items: [{ type: "moonstone" }] };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [moonstone, moonstone],
    });

    // second quote: 25 base + 2.5 first insurance - 5 loyalty - 3.75 follow-up
    // = 18.75, + 5 fee = 23.75, rounded up once at the end
    expect(results[1]).toEqual({ premium: 24 });
  });

  // --- quote: integration examples ---
  it("newcomer with a cursed steel sword of enchantment 3 pays 165 G -- 100 + 50 curse + 10 first insurance + 5 fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("3-year customer's second quote for a cursed steel sword of enchantment 7 pays 160 G -- 100 + 50 + 30 - 20 + 10 - 15 + 5", () => {
    const sword = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [sword, sword],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- quote: insurance sum and cap ---
  it("a policy of one sword has insurance sum 1000 G and cap 2000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    // cap 2000 = 2 x 1000 insurance sum; payout 1500 - 100 deductible
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("a policy of a sword and an amulet has insurance sum 1600 G and cap 3200 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 3500 }],
          },
        },
      ],
    });

    // 3400 desired reimbursement is limited by the 3200 cap
    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("a policy of a sword and 3 runes has insurance sum 1750 G -- the block discount does not lower the insurance sum", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 2000 }],
          },
        },
      ],
    });

    // cap 3500 = 2 x 1750; payout 2000 - 100 deductible
    expect(results[1]).toEqual({ payout: 1900, remainingCap: 1600 });
  });
  it("a policy of two swords has insurance sum 2000 G and cap 4000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 4500 }],
          },
        },
      ],
    });

    // 4400 desired reimbursement is limited by the 4000 cap
    expect(results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("a cursed sword's cap stays 2000 G -- premium modifiers do not raise the cap", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 2500 }],
          },
        },
      ],
    });

    // premium is 165 G, but the cap stays 2 x 1000 insurance value
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  // --- claim: deductible and standard reimbursement ---
  it("a steel sword of enchantment 3 damaged by 500 G pays out 400 G -- full reimbursement minus the 100 G deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
  it("a rune damaged by 200 G pays out 100 G -- runes have no enchantment or material, so no special clause applies", () => {
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

    // cap 500 = 2 x 250 insurance value
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("the 100 G deductible applies once per damaged item -- 500 G sword + 300 G amulet pays out 600 G", () => {
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

    // (500 - 100) + (300 - 100); cap 3200 - 600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- claim: special clauses ---
  it("a steel sword of enchantment 9 damaged by 1000 G pays out 400 G -- 50 % high-enchantment clause, then deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
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

    // 50 % of 1000 = 500, then the 100 G deductible
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("a sword of exactly enchantment 8 is reimbursed at 50 % -- the threshold is inclusive", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
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
  it("a dragon-material sword of enchantment 5 damaged by 800 G pays out 700 G -- full reimbursement, then deductible", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
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

    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("a dragon-material sword of enchantment 9 damaged by 1000 G pays out 400 G -- the 50 % rule wins over full reimbursement", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
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
  it("a dragon-material sword of exactly enchantment 8 damaged by 1000 G pays out 400 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
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

  // --- claim: cap exhaustion across successive claims ---
  it("a first 1500 G claim on a 1000 G sword policy pays out 1400 G and leaves 600 G of cap", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("a second 1500 G claim on the same policy pays out only the remaining 600 G and leaves 0 G of cap", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });

    // the desired 1400 is reduced to the remaining cap
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("a claim beyond an exhausted cap pays out 0 G and leaves 0 G of cap", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim, claim],
    });

    expect(results[3]).toEqual({ payout: 0, remainingCap: 0 });
  });

  // --- claim: multiple items of the same type ---
  it("two sword damage entries against a two-sword policy are two separate damages, each with its own deductible", () => {
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

    // (500 - 100) twice; cap 4000 - 800
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- claim: rounding in MHPCO's favour ---
  it("a payout of 350.5 G is rounded down to 350 G -- rounding favours MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
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

    // 50 % of 901 = 450.5, - 100 deductible = 350.5, rounded down
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- claim: never negative ---
  it("a damage of 50 G below the 100 G deductible pays out 0 G, not a negative amount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- CLI: happy paths ---
  it("the CLI reads a scenario from stdin and writes one result per step to stdout in order", async () => {
    const { status, stdout } = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { premium: 80 }],
    });
  });
  it("the CLI writes a quote step result as {premium} and a claim step result as {payout, remainingCap}", async () => {
    const { status, stdout } = await runCli({
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

    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("the CLI resolves a claim's policy field as the zero-based index of the quote step that created the policy", async () => {
    const { status, stdout } = await runCli({
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

    // the claim settles against the amulet policy from step 1, cap 1200
    expect(status).toBe(0);
    expect(JSON.parse(stdout).results[2]).toEqual({
      payout: 200,
      remainingCap: 1000,
    });
  });
  it("the CLI exits with status 0 on a valid scenario", async () => {
    const { status, stderr } = await runCli({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "staff" }, { type: "potion" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "staff", amount: 400 }],
          },
        },
      ],
    });

    expect(status).toBe(0);
    expect(stderr).toBe("");
  });

  // --- CLI: rejection contract (spec fixes only exit status, stderr, and absent stdout results) ---
  it("a quote with an unknown item type such as broomstick exits non-zero, writes an error to stderr, and writes no results to stdout", async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  });
  it("a claim whose damaged item is not part of the policy exits non-zero and writes an error to stderr", async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/amulet/);
    expect(stdout).not.toMatch(/results/);
  });
  it("a claim damaging an item of an unknown type exits non-zero and writes an error to stderr", async () => {
    const { status, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 300 }],
          },
        },
      ],
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).not.toMatch(/results/);
  });
  it("a claim with more damage entries of a type than the policy covers exits non-zero and rejects the whole claim", async () => {
    const { status, stdout, stderr } = await runCli({
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
    });

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/sword/);
    expect(stdout).not.toMatch(/results/);
  });
  it("a claim with a negative damage amount of -200 exits non-zero and writes an error to stderr", async () => {
    const { status, stdout, stderr } = await runCli({
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

    expect(status).not.toBe(0);
    expect(stderr).toMatch(/-200|negative/);
    expect(stdout).not.toMatch(/results/);
  });
});
