import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / trivial quotes ---
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Single main items (base + fee + first-insurance for newcomer with no contracts) ---
  // We isolate base behavior using a long-standing customer on a follow-up contract where applicable,
  // but to keep tests focused on individual rules, we use the spec's integration examples for stacking.

  // --- Base premiums per item type (newcomer, no curse, no enchant) ---
  // For a newcomer (0 years) with one quote/item: base + 10% first insurance + 5 fee
  it("newcomer single plain sword → 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("newcomer single plain amulet → 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("newcomer single plain staff → 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("newcomer single plain potion → 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components & blocks ---
  it("2 runes → base 50 G → premium 60 G (50 + 5 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → base 60 G (block) → premium 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → base 100 G (no block, requires exactly 3) → premium 115 G", () => {
    const result = runScenario({
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
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → base 175 G → premium 198 G (175 + 17.5 + 5 = 197.5 rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("'Alike' components: 2 runes + 1 moonstone → base 75 G → premium 88 G (no block, different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("'Alike' components: 3 runes + 3 moonstones → base 120 G (two separate blocks) → premium 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet policy → 210 before further modifiers; newcomer premium 231 G (160 base + 50 curse + 16 first-ins + 5 fee)", () => {
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
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  // policy with single cursed sword for a long-standing customer on second contract from spec example below

  // --- Modifier thresholds ---
  it("customer with exactly 2 years, plain sword → premium 95 G (100 base + 10 first-ins − 20 loyalty + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("sword with exactly enchantment 5, newcomer → premium 145 G (100 + 30 high-ench + 10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("cursed sword with enchantment 5, newcomer → premium 195 G (100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("sword with enchantment 4, newcomer → premium 115 G (no high-ench surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // --- Rounding in MHPCO's favor ---
  it("premium that yields 197.5 G → final premium 198 G (rounded up) — verified via 7 runes case", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("payout that yields 350.5 G → 350 G (rounded down) — via steel sword ench 9 damage 901", () => {
    const result = runScenario({
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
            cause: "x",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    // 901/2 = 450.5, -100 = 350.5 → 350; cap 2000; remaining = 1650
    expect(r.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration examples ---
  it("newcomer (0 years) with cursed sword (steel, enchantment 3) → premium 165 G", () => {
    const result = runScenario({
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
  it("long-standing customer (3 years) second quote, cursed sword (steel, enchantment 7) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // first quote (any), used to establish that this is the second
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    // We only assert on the second step's premium for this test focus.
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({
      premium: 160,
    });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = runScenario({
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
    const r = result as { results: Array<{ payout?: number; premium?: number }> };
    expect(r.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance 250 G), damage 200 G → payout 100 G", () => {
    const result = runScenario({
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
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    // cap = 2*250 = 500; payout = 200 - 100 = 100; remaining = 400
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim processing: enchantment threshold vs. dragon material ---
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (high-ench then deductible)", () => {
    const result = runScenario({
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
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const result = runScenario({
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
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement minus deductible)", () => {
    const result = runScenario({
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
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
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
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack: insured sword damaged 500 G and amulet 300 G → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
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
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multi-items of the same type ---
  it("policy with two swords: insurance sum 2000 G, cap 4000 G (verified via small claim)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    // payout = 200-100 = 100; cap 4000; remaining = 3900
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("two swords; both damaged 500 each → payout 800 G (2 separate deductibles)", () => {
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    // cap = 4000; payout = 800; remaining = 3200
    expect(r.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim has more sword damages than policy covers → runScenario throws (CLI exits non-zero)", () => {
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
    ).toThrow();
  });

  // --- Cap exhaustion ---
  it("policy with sword + amulet: insurance sum 1600 G → cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("policy with cursed sword → cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("policy with sword + 3 runes → insurance sum 1750 G, cap 3500 G (block discount doesn't affect insurance sum)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword (cap 2000): two 1500 G claims → 1400/600 and 600/0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "y", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    const r = result as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(r.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(r.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases ---
  it("quote with unknown item type → runScenario throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy (amulet when only sword insured) → throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "x",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim references damage with unknown item type → throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "x",
              damages: [{ itemType: "broomstick", amount: 100 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim contains damage with negative amount → throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "x",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- CLI shape ---
  it("CLI reads JSON from stdin and writes JSON {results: [...]} to stdout (schema example)", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
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
    const res = spawnSync(
      "node",
      [
        "--import",
        "tsx",
        "src/cli.ts",
      ],
      { input, encoding: "utf8" },
    );
    expect(res.status).toBe(0);
    const out = JSON.parse(res.stdout);
    expect(out).toHaveProperty("results");
    expect(Array.isArray(out.results)).toBe(true);
    expect(out.results).toHaveLength(2);
    expect(typeof out.results[0].premium).toBe("number");
    expect(typeof out.results[1].payout).toBe("number");
    expect(typeof out.results[1].remainingCap).toBe("number");
  });
});
