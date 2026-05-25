import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./scenario.js";
import { Scenario } from "./types.js";

function quote(items: object[], yearsWithMHPCO = 0): number {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items: items as never }],
  };
  const r = runScenario(scenario);
  return (r.results[0] as { premium: number }).premium;
}

function claim(
  policyItems: object[],
  damages: { itemType: string; amount: number }[],
  yearsWithMHPCO = 0,
): { payout: number; remainingCap: number } {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items: policyItems as never },
      { op: "claim", policy: 0, incident: { cause: "test", damages } },
    ],
  };
  const r = runScenario(scenario);
  return r.results[1] as { payout: number; remainingCap: number };
}

describe("Item values and base premiums", () => {
  it("sword: 1000 G insurance value, 100 G base premium → quote with sword only", () => {
    // base 100 + first ins 10 = 110 + 5 = 115
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("amulet: 600 G / 60 G", () => {
    // 60 + 6 + 5 = 71
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("staff: 800 G / 80 G", () => {
    // 80 + 8 + 5 = 93
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("potion: 400 G / 40 G", () => {
    // 40 + 4 + 5 = 49
    expect(quote([{ type: "potion" }])).toBe(49);
  });
});

describe("Building block of 3 alike components", () => {
  // Per spec: base premium for components, before policy modifiers/fee.
  // To isolate: 2 runes → 50 G base; quote = 50 + 5 (first ins) + 5 = 60.
  it("2 runes → 50 G base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    // 60 + 6 + 5 = 71
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    // 4 * 25 = 100 base, +10 first ins, +5 = 115
    expect(quote([
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ])).toBe(115);
  });
  it("7 runes → 175 G base premium (no block — block requires exactly 3 alike)", () => {
    // 175 base + 17.5 first ins + 5 = 197.5 → ceil 198
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" },
    ])).toBe(198);
  });
});

describe("Alike components (❓ clarified: exactly the same type)", () => {
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // 25+25+25 = 75 base, +7.5 + 5 = 87.5 → 88
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // 60 + 60 = 120 base, +12 + 5 = 137
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
});

describe("Modifier scope on multi-item policies", () => {
  it("cursed sword + plain amulet → policy base 160 G, cursed surcharge 50 G (of cursed sword), → 210 G before further modifiers/fee", () => {
    // 160 base + 50 curse + 16 first ins + 5 = 231
    expect(quote([
      { type: "sword", cursed: true },
      { type: "amulet" },
    ])).toBe(231);
  });
});

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years with MHPCO → loyalty discount applies", () => {
    // sword: 100 base, -20 loyalty, +10 first ins, +5 fee = 95
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // 100 + 30 + 10 + 5 = 145
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("sword with exactly enchantment 5 and cursed → both surcharges apply", () => {
    // 100 + 50 (curse) + 30 (ench) + 10 + 5 = 195
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // 100 + 10 + 5 = 115
    expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("sword enchantment 4, cursed → only curse surcharge", () => {
    // 100 + 50 + 10 + 5 = 165
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe("Claim — enchantment threshold vs. dragon material", () => {
  it("dragon-material sword exactly enchantment 8, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const r = claim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(r.payout).toBe(400);
  });
  it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (both apply, 50% wins)", () => {
    const r = claim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(r.payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 G → payout 700 G (only dragon clause)", () => {
    const r = claim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    );
    expect(r.payout).toBe(700);
  });
  it("steel sword enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause)", () => {
    const r = claim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    );
    expect(r.payout).toBe(400);
  });
});

describe("Deductible per damage event", () => {
  it("dragon attack on sword (500 G) and amulet (300 G) → payout 600 G (deductible per item)", () => {
    const r = claim(
      [{ type: "sword" }, { type: "amulet" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    );
    // 500-100=400, 300-100=200 → 600
    expect(r.payout).toBe(600);
  });
});

describe("Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const r = claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    );
    expect(r.payout).toBe(400);
  });
  it("damage to a rune (insurance 250 G), damage 200 G → payout 100 G", () => {
    const r = claim(
      [{ type: "rune" }],
      [{ itemType: "rune", amount: 200 }],
    );
    expect(r.payout).toBe(100);
  });
});

describe("Multiple items of the same type", () => {
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    const r = claim(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 0 }],
    );
    // After one damage with amount 0: payout = 0, cap stays 4000.
    expect(r.remainingCap).toBe(4000);
  });
  it("dragon attack damages both swords, each is a separate damage with own deductible", () => {
    const r = claim(
      [{ type: "sword" }, { type: "sword" }],
      [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    );
    // (500-100) + (500-100) = 800
    expect(r.payout).toBe(800);
  });
  it("damages contains more entries of a type than insured → CLI exits non-zero", () => {
    const result = spawnSync(
      "npx",
      ["tsx", "src/cli.ts"],
      {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "test",
                damages: [
                  { itemType: "sword", amount: 100 },
                  { itemType: "sword", amount: 100 },
                ],
              },
            },
          ],
        }),
        encoding: "utf-8",
      },
    );
    expect(result.status).not.toBe(0);
  });
});

describe("Cap exhaustion", () => {
  it("sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    const r = claim(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 0 }],
    );
    expect(r.remainingCap).toBe(3200);
  });
  it("cursed sword (insurance value 1000 G) → cap 2000 G (premium modifiers don't raise cap)", () => {
    const r = claim(
      [{ type: "sword", cursed: true }],
      [{ itemType: "sword", amount: 0 }],
    );
    expect(r.remainingCap).toBe(2000);
  });
  it("sword + 3 runes (a block) → insurance sum 1750 G", () => {
    const r = claim(
      [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      [{ itemType: "sword", amount: 0 }],
    );
    expect(r.remainingCap).toBe(3500); // cap = 2 * 1750
  });
  it("sword insured (cap 2000 G); two successive 1500 G claims → 1400 then 600", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const r = runScenario(scenario);
    const first = r.results[1] as { payout: number; remainingCap: number };
    const second = r.results[2] as { payout: number; remainingCap: number };
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("Rounding in the MHPCO's favor", () => {
  it("premium calc yielding 197.5 G → final premium 198 G (rounded up)", () => {
    // 7 runes: 175 base + 17.5 first ins + 5 = 197.5 → 198
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" },
    ])).toBe(198);
  });
  it("payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    // Hard to construct directly with integer amounts; verify rounding-down behavior:
    // dragon+high-ench sword, damage 1001 → 500.5 - 100 = 400.5 → 400.
    const r = claim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1001 }],
    );
    expect(r.payout).toBe(400);
  });
});

describe("Edge cases", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(quote([])).toBe(5);
  });
  it("quote with unknown item type → CLI exits non-zero, error to stderr, no results to stdout", () => {
    const result = spawnSync(
      "npx",
      ["tsx", "src/cli.ts"],
      {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
        encoding: "utf-8",
      },
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim references damage on item not in policy → CLI exits non-zero", () => {
    const result = spawnSync(
      "npx",
      ["tsx", "src/cli.ts"],
      {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
            },
          ],
        }),
        encoding: "utf-8",
      },
    );
    expect(result.status).not.toBe(0);
  });
  it("claim damage with negative amount → CLI exits non-zero", () => {
    const result = spawnSync(
      "npx",
      ["tsx", "src/cli.ts"],
      {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
        encoding: "utf-8",
      },
    );
    expect(result.status).not.toBe(0);
  });
  it("claim with unknown item type → CLI exits non-zero", () => {
    const result = spawnSync(
      "npx",
      ["tsx", "src/cli.ts"],
      {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 100 }] },
            },
          ],
        }),
        encoding: "utf-8",
      },
    );
    expect(result.status).not.toBe(0);
  });
});

describe("Integration examples", () => {
  it("Newcomer with cursed sword (steel, enchantment 3) → premium 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
  });
  it("Long-standing customer's second contract: cursed sword (steel, enchantment 7) → premium 160 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // First quote: trivial (any) to establish that the next is a follow-up.
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { premium: number }).premium).toBe(160);
  });
});

describe("CLI output format", () => {
  it("writes a results array of same length and order as steps", () => {
    const result = spawnSync(
      "npx",
      ["tsx", "src/cli.ts"],
      {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
            { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
          ],
        }),
        encoding: "utf-8",
      },
    );
    expect(result.status).toBe(0);
    const out = JSON.parse(result.stdout) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(out.results.length).toBe(2);
    expect("premium" in out.results[0]).toBe(true);
    expect("payout" in out.results[1] && "remainingCap" in out.results[1]).toBe(true);
  });
});
