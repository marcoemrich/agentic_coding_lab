import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty items ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Base premiums for main items (with first insurance applied per item; assume newcomer 0 yrs) ---
  it("single sword (plain, newcomer) → 100 base + 10 first insurance + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet (plain, newcomer) → 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff (plain, newcomer) → 80 + 8 + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion (plain, newcomer) → 40 + 4 + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Components: runes and moonstones ---
  it("2 runes → 50 G base + 5 first insurance + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes → 60 G base (block) + 6 first ins + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes → 100 G base (no block) + 10 first ins + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes → 175 G base (no block — 7 ≠ 3) → 198 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- 'Alike' components clarification ---
  it("2 runes + 1 moonstone → 75 G base (no block) → 88 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones → 120 G base (two blocks) → 137 G total", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Item-specific modifiers (no policy-wide modifiers besides first insurance) ---
  it("cursed sword (newcomer) → 100 + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("sword enchantment 5 → 100 + 30 high-ench + 10 first ins + 5 fee = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword enchantment 4 → no high-ench surcharge → 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword ench 5 → 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // --- Modifier scope: cursed applies only to the cursed item in a multi-item policy ---
  it("cursed sword + plain amulet (newcomer): 160 base + 50 curse + 16 first ins + 5 fee = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // --- Policy-wide modifiers ---
  it("loyal customer (2 yrs) + plain sword: 100 - 20 loyalty + 10 first ins + 5 fee = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("2nd quote (plain sword, newcomer): 100 + 10 first ins - 15 follow-up + 5 fee = 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // --- Integration examples ---
  it("Newcomer with cursed sword (steel, ench 3): premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("Long-standing customer (3 yrs) second contract, cursed sword (steel, ench 7): premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("first insurance surcharge applies to each item even for follow-up contract", () => {
    // 2nd quote, newcomer (0 yrs): sword 100 base
    // + 10 first insurance - 15 follow-up + 5 fee = 100
    // If first insurance were omitted on follow-up, result would be 90
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // --- Rounding in MHPCO favor ---
  it("premium yielding 197.5 G → 198 G (rounded up)", () => {
    // 7 moonstones: 7×25 = 175 base + 17.5 first insurance + 5 fee = 197.5 → 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "moonstone" }) }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G", () => {
    // sword insurance value 1000, cap = 2000
    // damage 500 - 100 deductible = 400, remaining cap = 2000 - 400 = 1600
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G", () => {
    // rune insurance value 250 → cap = 500
    // damage 200 - 100 deductible = 100 payout, remaining cap = 400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fall", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: high enchantment clause ---
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    // sword ench 9 → high-enchantment clause: damage 1000 × 50% = 500, then - 100 = 400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "explosion", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Claim: dragon material clause ---
  it("dragon sword, enchantment 5, damage 800 G → payout 700 G (full minus deductible)", () => {
    // dragon material → full reimbursement (800), then - 100 deductible = 700
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(700);
  });

  // --- Claim: dragon precedence over high enchantment ---
  it("dragon sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins per spec interpretation: 500-100)", () => {
    // dragon + ench 9: per spec the 50% rule wins → 1000 × 50% = 500, then - 100 = 400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "explosion", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });
  it("dragon sword, enchantment exactly 8, damage 1000 G → payout 400 G", () => {
    // ench 8 is at threshold: high-ench clause applies → 1000 × 50% - 100 = 400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "explosion", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  // --- Claim: rounding payout down ---
  it("payout yielding 350.5 G → 350 G (rounded down)", () => {
    // sword ench 8, damage 901 → 901 × 50% = 450.5, then - 100 = 350.5 → 350 (rounded down)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(350);
  });

  // --- Claim: deductible per damage event (per damaged item) ---
  it("dragon attack damages sword (500 G) and amulet (300 G): payout = 600 G (100 deductible per item)", () => {
    // sword 500 - 100 = 400, amulet 300 - 100 = 200, total = 600
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
    expect((result.results[1] as { payout: number }).payout).toBe(600);
  });

  // --- Claim: multiple items of same type ---
  it("policy with two swords: insurance sum 2000 G, cap 4000 G", () => {
    // 2 swords: insurance sum = 2×1000 = 2000, cap = 4000
    // single sword damage 200 → payout 100, remainingCap = 4000 - 100 = 3900
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("policy with two swords; damages array with two sword entries → each gets own deductible", () => {
    // 2 swords damaged: 500 - 100 + 300 - 100 = 600 payout
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
    expect((result.results[1] as { payout: number }).payout).toBe(600);
  });
  it("damages array contains more entries of a type than policy covers → CLI exits non-zero, claim rejected", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
  });

  // --- Claim: cap ---
  it("policy covers sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    // sword (1000) + amulet (600) = 1600 → cap = 3200
    // damage 300 → payout 200, remainingCap = 3200 - 200 = 3000
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 3000 });
  });
  it("cursed sword (premium with mods 165) → cap 2000 G (based on unmodified insurance value)", () => {
    // cursed sword: insurance value still 1000 → cap = 2000 (premium modifiers don't raise cap)
    // damage 200 → payout 100, remainingCap = 2000 - 100 = 1900
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fall", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("policy covers sword + 3 runes → insurance sum 1750 G (block doesn't affect insurance sum)", () => {
    // sword (1000) + 3 runes (3×250 = 750) = 1750 → cap 3500
    // damage 200 → payout 100, remainingCap = 3500 - 100 = 3400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword cap 2000: first claim 1500 → payout 1400, remainingCap 600; second claim 1500 → payout 600, remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error cases ---
  it("quote with unknown item type (e.g. broomstick) → CLI exits non-zero, error to stderr, no results", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("claim references item not in policy → CLI exits non-zero, error to stderr", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with negative damage amount (-200) → CLI exits non-zero, error to stderr", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  // --- CLI integration ---
  it("CLI: end-to-end scenario with quote + claim produces results array of correct length and shape", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
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
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(typeof output.results[0].premium).toBe("number");
    expect(output.results[1]).toHaveProperty("payout");
    expect(output.results[1]).toHaveProperty("remainingCap");
    expect(typeof output.results[1].payout).toBe("number");
    expect(typeof output.results[1].remainingCap).toBe("number");
  });
});
