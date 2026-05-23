import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./engine.js";
import { Scenario } from "./types.js";

function quote(scenario: Scenario): number[] {
  return runScenario(scenario).results.map((r) => (r as any).premium);
}

function run(scenario: Scenario) {
  return runScenario(scenario);
}

function makeCustomer(years = 0) {
  return { yearsWithMHPCO: years };
}

function premiumOf(items: any[], years = 0, isFollowUp = false): number {
  const steps: any[] = [];
  if (isFollowUp) steps.push({ op: "quote", items: [{ type: "potion" }] });
  steps.push({ op: "quote", items });
  const r = run({ customer: makeCustomer(years), steps });
  return (r.results[steps.length - 1] as any).premium;
}

describe("Item values and base premiums (with fee, single newcomer)", () => {
  // For a single newcomer item:
  // premium = base + base * (curseSurcharge if cursed) + base * (highEnch if applicable) + base * 0.1 (first ins) + 5 fee
  it("single sword, newcomer → 100 base + 10 first + 5 fee = 115 G", () => {
    expect(premiumOf([{ type: "sword" }], 0)).toBe(115);
  });
  it("single amulet, newcomer → 60 base + 6 first + 5 fee = 71 G", () => {
    expect(premiumOf([{ type: "amulet" }], 0)).toBe(71);
  });
  it("single staff, newcomer → 80 base + 8 first + 5 fee = 93 G", () => {
    expect(premiumOf([{ type: "staff" }], 0)).toBe(93);
  });
  it("single potion, newcomer → 40 base + 4 first + 5 fee = 49 G", () => {
    expect(premiumOf([{ type: "potion" }], 0)).toBe(49);
  });
});

describe("Components - building block of 3 alike (base premium only, no surcharges/fee)", () => {
  // Need to test base premium in isolation: we can derive it from total minus fee minus first ins.
  // Simpler: test the policy base premium by constructing a follow-up scenario with loyalty so we
  // can verify directly. Easier: just verify the integer premium where modifiers are predictable.
  // For a newcomer with N runes: premium = base*1.1 + 5 = ?
  // base for 2 runes = 50; premium = 50 + 5*1.1 (each rune 25 * 0.1) = 50 + 5 + 5 = 60
  // Actually first insurance per item: 2 runes → 2 * 25 * 0.1 = 5; total = 50 + 5 + 5 = 60
  it("2 runes, base premium 50 G → newcomer premium 50 + 5 first + 5 fee = 60 G", () => {
    expect(premiumOf([{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes (block applies), base premium 60 G → newcomer premium 60 + 7.5 first + 5 fee = 73 G (rounded up)", () => {
    // 3 runes block: base 60 G. First insurance: 3 * 25 * 0.1 = 7.5
    // premium = 60 + 7.5 + 5 = 72.5 → ceil = 73
    expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(73);
  });
  it("4 runes (no block, requires exactly 3), base premium 100 G → 100 + 10 first + 5 fee = 115 G", () => {
    expect(premiumOf(
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      0,
    )).toBe(115);
  });
  it("7 runes, base premium 175 G (no block) → 175 + 17.5 first + 5 fee = 198 G (rounded up)", () => {
    const items = Array(7).fill({ type: "rune" });
    // 175 + 17.5 + 5 = 197.5 → ceil 198
    expect(premiumOf(items, 0)).toBe(198);
  });
});

describe("\"Alike\" components: only same type counts as a block", () => {
  it("2 runes + 1 moonstone → base 75 G; newcomer premium 75 + 7.5 first + 5 fee = 88 G (rounded up)", () => {
    // base = 50 (runes) + 25 (moonstone) = 75
    // first = 3 * 25 * 0.1 = 7.5 → premium = 75 + 7.5 + 5 = 87.5 → ceil 88
    expect(premiumOf(
      [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      0,
    )).toBe(88);
  });
  it("3 runes + 3 moonstones → base 120 G (two separate blocks); 120 + 15 first + 5 fee = 140 G", () => {
    // base = 60 + 60 = 120; first = 6 * 25 * 0.1 = 15
    expect(premiumOf(
      [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ],
      0,
    )).toBe(140);
  });
});

describe("Modifier scope on multi-item policies", () => {
  it("newcomer with cursed sword + plain amulet → 100 + 60 + 50 curse + 16 first + 5 fee = 231 G", () => {
    expect(premiumOf(
      [{ type: "sword", cursed: true }, { type: "amulet" }],
      0,
    )).toBe(231);
  });

  it("policy base premium before further modifiers and fee is 210 G (spec example, +loyalty test)", () => {
    // loyalty 20% applies to policy base premium (160) = 32 loyalty discount
    // 100 + 60 + 50 curse + 16 first - 32 loyalty + 5 fee = 199 G
    expect(premiumOf(
      [{ type: "sword", cursed: true }, { type: "amulet" }],
      3,
    )).toBe(199);
  });
});

describe("Modifier thresholds", () => {
  it("loyalty applies at exactly 2 years", () => {
    // single sword: base 100, first 10, loyalty = 100*0.2 = 20, fee 5
    // premium = 100 + 10 - 20 + 5 = 95
    expect(premiumOf([{ type: "sword" }], 2)).toBe(95);
  });
  it("loyalty does NOT apply at 1 year", () => {
    // 100 + 10 + 5 = 115
    expect(premiumOf([{ type: "sword" }], 1)).toBe(115);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // 100 + 30 high + 10 first + 5 fee = 145
    expect(premiumOf([{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("sword with exactly enchantment 5 AND cursed → both surcharges apply", () => {
    // 100 + 50 curse + 30 high + 10 first + 5 fee = 195
    expect(premiumOf([{ type: "sword", enchantment: 5, cursed: true }], 0)).toBe(195);
  });
  it("sword enchantment 4 → no high surcharge", () => {
    // 100 + 10 + 5 = 115
    expect(premiumOf([{ type: "sword", enchantment: 4 }], 0)).toBe(115);
  });
  it("sword enchantment 4 cursed → curse but no high surcharge", () => {
    // 100 + 50 + 10 + 5 = 165
    expect(premiumOf([{ type: "sword", enchantment: 4, cursed: true }], 0)).toBe(165);
  });
  it("dragon-material sword, enchantment exactly 8, damage 1000 G → payout 400 G (high-ench wins, then deductible)", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(400);
  });
});

describe("Deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(600);
  });
});

describe("Standard reimbursement (no special clauses)", () => {
  it("regular steel sword enchantment 3, damage 500 → payout 400 G", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(400);
  });
  it("damage to rune, damage 200 → payout 100 G (no enchantment / material)", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(100);
  });
});

describe("Enchantment threshold vs. dragon material", () => {
  it("dragon-material sword enchantment 9, damage 1000 → payout 400 G (50% rule wins)", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(400);
  });
  it("dragon-material sword enchantment 5, damage 800 → payout 700 G (only dragon clause)", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(700);
  });
  it("steel sword enchantment 9, damage 1000 → payout 400 G (only high-ench clause)", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(400);
  });
});

describe("Multiple items of the same type", () => {
  it("policy covers two swords → insurance sum 2000, cap 4000", () => {
    // Verify by exhausting cap: damage 5000 each (well beyond cap)
    const r = run({
      customer: makeCustomer(0),
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 5000 },
              { itemType: "sword", amount: 5000 },
            ],
          },
        },
      ],
    });
    // Two damages: each (5000 - 100) = 4900; total 9800; capped at 4000
    expect((r.results[1] as any).payout).toBe(4000);
    expect((r.results[1] as any).remainingCap).toBe(0);
  });
  it("dragon attack damages both swords; each damage entry treated separately with own deductible", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    // (500-100) + (300-100) = 400 + 200 = 600
    expect((r.results[1] as any).payout).toBe(600);
  });
  it("more damages of a type than insured → CLI exits non-zero (whole claim rejected)", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 200 },
            ],
          },
        },
      ],
    });
    const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(res.status).not.toBe(0);
  });
});

describe("Cap exhaustion", () => {
  it("policy sword + amulet → insurance sum 1600, cap 3200", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 10000 },
              { itemType: "amulet", amount: 10000 },
            ],
          },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(3200);
    expect((r.results[1] as any).remainingCap).toBe(0);
  });
  it("cursed sword → cap based on unmodified insurance value (1000) → 2000", () => {
    const r = run({
      customer: makeCustomer(0),
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 10000 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(2000);
    expect((r.results[1] as any).remainingCap).toBe(0);
  });
  it("sword + 3 runes (block) → insurance sum 1750 G; block discount doesn't affect insurance sum", () => {
    const r = run({
      customer: makeCustomer(0),
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
            cause: "x",
            damages: [
              { itemType: "sword", amount: 100000 },
              { itemType: "rune", amount: 100000 },
              { itemType: "rune", amount: 100000 },
              { itemType: "rune", amount: 100000 },
            ],
          },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(3500); // 2 * 1750
    expect((r.results[1] as any).remainingCap).toBe(0);
  });
  it("two successive claims of 1500 G on a sword (cap 2000): first 1400 (remaining 600), second 600 (remaining 0)", () => {
    const r = run({
      customer: makeCustomer(0),
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
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(1400);
    expect((r.results[1] as any).remainingCap).toBe(600);
    expect((r.results[2] as any).payout).toBe(600);
    expect((r.results[2] as any).remainingCap).toBe(0);
  });
});

describe("Rounding in MHPCO's favor", () => {
  it("premium calculation yielding 197.5 G → final premium 198 G (rounded up)", () => {
    // Use 7 runes: 175 + 17.5 + 5 = 197.5 → 198
    const items = Array(7).fill({ type: "rune" });
    expect(premiumOf(items, 0)).toBe(198);
  });
  it("payout yielding 350.5 G → final payout 350 G (rounded down)", () => {
    // Need to construct a scenario yielding 350.5.
    // Damage to high-ench sword (50%): damage*0.5 - 100 = 350.5 → damage*0.5 = 450.5 → damage = 901
    const r = run({
      customer: makeCustomer(0),
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect((r.results[1] as any).payout).toBe(350);
  });
  it("intermediate amounts are kept as fractions; only final premium rounded (no per-item rounding)", () => {
    // Single sword with cursed: 100*1.5 = 150, +10 first +5 fee = 165 — no fractions
    // Construct: 3 runes (block 60) with 30% high enchantment on each rune:
    // groupTotal = 60 + 3*(25*0.3) = 60 + 22.5 = 82.5
    // first = 7.5; total = 82.5 + 7.5 + 5 = 95 → exact whole, ceil 95
    const items = [
      { type: "rune", enchantment: 5 },
      { type: "rune", enchantment: 5 },
      { type: "rune", enchantment: 5 },
    ];
    expect(premiumOf(items, 0)).toBe(95);
  });
});

describe("Edge cases", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(premiumOf([], 0)).toBe(5);
  });

  it("quote with unknown type → CLI exits non-zero with stderr, no results on stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
    expect(res.stdout).not.toContain("results");
  });

  it("claim references a damage with item not in policy → CLI exits non-zero", () => {
    const input = JSON.stringify({
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
    });
    const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(res.status).not.toBe(0);
  });

  it("claim references an unknown item type → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    });
    const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(res.status).not.toBe(0);
  });

  it("claim with negative damage amount → CLI exits non-zero", () => {
    const input = JSON.stringify({
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
    });
    const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(res.status).not.toBe(0);
  });
});

describe("Integration examples", () => {
  it("Newcomer with a cursed sword → premium 165 G", () => {
    expect(
      premiumOf(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        0,
      ),
    ).toBe(165);
  });

  it("Long-standing customer's second contract with cursed enchanted sword → premium 160 G", () => {
    // 3 years, second contract: 100 base + 50 curse + 30 high - 20 loyalty + 10 first - 15 followup + 5 fee = 160
    const r = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // first contract (any)
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect((r.results[1] as any).premium).toBe(160);
  });

  it("Clarifying question: first insurance surcharge applies to each item in a quote regardless of customer history", () => {
    // Long-standing customer's second contract for a single plain sword:
    // 100 base - 20 loyalty + 10 first - 15 followup + 5 fee = 80
    const r = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect((r.results[1] as any).premium).toBe(80);
  });
});

describe("CLI input/output format (end-to-end)", () => {
  it("schema example: amulet quote then fire claim 200 G → premium and payout in results", () => {
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
    const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(res.status).toBe(0);
    const out = JSON.parse(res.stdout);
    expect(out.results).toHaveLength(2);
    // amulet 60 base + 6 first - 12 loyalty + 5 fee = 59
    expect(out.results[0]).toEqual({ premium: 59 });
    // amulet damage 200 → 200 - 100 = 100; cap 1200, remaining 1100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
