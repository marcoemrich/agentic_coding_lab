import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- simplest cases ---
  it("empty item list -- premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword, new customer with 0 years -- base 100 + 10 first insurance + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet, new customer -- base 60 + 6 first insurance + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff, new customer -- base 80 + 8 first insurance + 5 fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion, new customer -- base 40 + 4 first insurance + 5 fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- components and building blocks ---
  it("2 runes -- base premium 50 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // 50 base + 5 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -- base premium 60 G (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    // 60 base + 6 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -- base premium 100 G (no block, block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });
    // 100 base + 10 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -- base premium 175 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    // 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198 (rounded in MHPCO's favor)
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -- base premium 75 G (no block, different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });
    // 75 base + 7.5 first insurance + 5 fee = 87.5 -> 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    const result = runScenario({
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
    // 120 base + 12 first insurance + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- premium modifiers in isolation ---
  it("cursed sword adds 50 % of the item's base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 -- high-enchantment surcharge applies (threshold)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    // 100 base + 30 enchantment + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 -- both surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
      ],
    });
    // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("customer with exactly 2 years with MHPCO -- 20 % loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year -- no loyalty discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote in a scenario -- 15 % follow-up contract discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // second: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -- policy base 160 G, curse adds 50 G (item scope) = 210 G before further modifiers and fee", () => {
    const result = runScenario({
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
    // 210 + 16 first insurance (10 % of 160) + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- rounding ---
  it("premium of 197.5 G rounds up to 198 G (MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "moonstone" }) }],
    });
    // 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("payout of 350.5 G rounds down to 350 G (MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // 901 * 50 % = 450.5 - 100 = 350.5 -> 350
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  // --- integration examples ---
  it("newcomer with a cursed sword (steel, ench 3) -- premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's (3 years) second contract, cursed sword ench 7 -- premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect((result as { results: Array<{ premium: number }> }).results[1]).toEqual({
      premium: 160,
    });
  });

  // --- claims: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 G -- payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (value 250 G), damage 200 G -- payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // insurance sum 250, cap 500, payout 100 -> remaining 400
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });

  // --- claims: special clauses ---
  it("dragon-material sword, ench 5, damage 800 G -- payout 700 G (full reimbursement then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("steel sword, ench 9, damage 1000 G -- payout 400 G (50 % then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon-material sword, ench 9, damage 1000 G -- payout 400 G (50 % rule wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon-material sword, exactly ench 8, damage 1000 G -- payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // --- deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) -- payout 600 G (deductible per damaged item)", () => {
    const result = runScenario({
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
    // insurance sum 1600, cap 3200, payout 600 -> remaining 2600
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });

  // --- cap ---
  it("policy with sword + amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    // payout 0 -> remaining cap is the full cap of 3200
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 0,
      remainingCap: 3200,
    });
  });
  it("cursed sword -- cap 2000 G based on unmodified insurance value", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("policy with sword + 3 runes -- insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 0,
      remainingCap: 3500,
    });
  });
  it("sword policy, two successive 1500 G claims -- first payout 1400 G remaining 600 G, second payout 600 G remaining 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    const results = (result as { results: Array<Record<string, number>> }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- multiple items of the same type ---
  it("policy covers two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 0,
      remainingCap: 4000,
    });
  });
  it("two sword damages on a two-sword policy -- each entry gets its own deductible", () => {
    const result = runScenario({
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    // (500-100) + (300-100) = 600
    expect((result as { results: Array<Record<string, number>> }).results[1]).toEqual({
      payout: 600,
      remainingCap: 3400,
    });
  });
  it("more damage entries of a type than insured -- error (whole claim rejected)", () => {
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
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });

  // --- errors ---
  it("quote with an unknown item type -- error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim referencing an item not part of the policy -- error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim with a negative damage amount -- error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

  // --- CLI ---
  it("CLI reads scenario JSON from stdin and writes results JSON to stdout", async () => {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const run = promisify(execFile);
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    const child = run("npx", ["tsx", "src/cli.ts"]);
    child.child.stdin!.end(input);
    const { stdout } = await child;
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);
  it("CLI exits non-zero and writes to stderr on an invalid scenario", async () => {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const run = promisify(execFile);
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const child = run("npx", ["tsx", "src/cli.ts"]);
    child.child.stdin!.end(input);
    const error = await child.then(
      () => undefined,
      (reason: { code: number; stdout: string; stderr: string }) => reason,
    );
    expect(error?.code).toBeGreaterThan(0);
    expect(error?.stderr).toMatch(/broomstick/);
    expect(error?.stdout).toBe("");
  }, 30000);
});
