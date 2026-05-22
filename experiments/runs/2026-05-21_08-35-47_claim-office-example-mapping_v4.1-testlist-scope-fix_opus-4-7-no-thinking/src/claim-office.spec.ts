import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";
import { execSync, spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "cli.ts");

describe("MHPCO Claim Office", () => {
  // ============================================================
  // QUOTE: Empty / fee
  // ============================================================
  it("quote with empty item list returns premium of 5 G (only the processing fee)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [] })).toEqual({ premium: 5 });
  });

  // ============================================================
  // QUOTE: Single item base premiums + first-insurance + fee
  // ============================================================
  it("quote for a single plain sword (0 years, first quote) returns 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toEqual({ premium: 115 });
  });
  it("quote for a single plain amulet (0 years, first quote) returns 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "amulet", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toEqual({ premium: 71 });
  });
  it("quote for a single plain staff (0 years, first quote) returns 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "staff", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toEqual({ premium: 93 });
  });
  it("quote for a single plain potion (0 years, first quote) returns 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "potion", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toEqual({ premium: 49 });
  });

  // ============================================================
  // QUOTE: Components — base premiums and blocks
  // ============================================================
  it("quote for 2 runes yields base premium 50 G (no block)", () => {
    expect(
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }] })
    ).toEqual({ premium: 60 });
  });
  it("quote for 3 runes yields base premium 60 G (block of 3 applies)", () => {
    expect(
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] })
    ).toEqual({ premium: 71 });
  });
  it("quote for 4 runes yields base premium 100 G (no block — block requires exactly 3)", () => {
    expect(
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] })
    ).toEqual({ premium: 115 });
  });
  it("quote for 7 runes yields base premium 175 G (per spec example)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
      })
    ).toEqual({ premium: 198 });
  });
  it("quote for 2 runes + 1 moonstone yields base premium 75 G (no block: different types)", () => {
    expect(
      quote({ customer: { yearsWithMHPCO: 0 }, items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] })
    ).toEqual({ premium: 88 });
  });
  it("quote for 3 runes + 3 moonstones yields base premium 120 G (two separate blocks: 60 + 60)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
      })
    ).toEqual({ premium: 137 });
  });

  // ============================================================
  // QUOTE: Item-specific modifiers (cursed, high enchantment)
  // ============================================================
  it("cursed sword (steel, enchantment 3), 0 years, first quote — premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      })
    ).toEqual({ premium: 165 });
  });
  it("sword with exactly enchantment 5 — high-enchantment surcharge applies (+30% of item base)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      })
    ).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 — no high-enchantment surcharge", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      })
    ).toEqual({ premium: 115 });
  });
  it("sword with exactly enchantment 5 and cursed — both surcharges apply", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      })
    ).toEqual({ premium: 195 });
  });

  // ============================================================
  // QUOTE: Policy-wide modifiers (loyalty, follow-up)
  // ============================================================
  it("customer with exactly 2 years — loyalty discount applies (-20% of policy base premium)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 2 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toEqual({ premium: 95 });
  });
  it("customer with 1 year — no loyalty discount", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toEqual({ premium: 115 });
  });
  it("first-insurance surcharge is +10% per item in the quote, regardless of customer history", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      })
    ).toEqual({ premium: 181 });
  });
  it("follow-up contract (second quote in scenario) — -15% policy-wide discount applies", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toEqual({ premium: 100 });
  });

  // ============================================================
  // QUOTE: Modifier scope on multi-item policies
  // ============================================================
  it("policy with cursed sword + plain amulet — cursed surcharge applies to sword's base only: policy base 160 G + 50 G curse = 210 G before further modifiers and fee", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "steel", enchantment: 0, cursed: false },
        ],
      })
    ).toEqual({ premium: 231 });
  });

  // ============================================================
  // QUOTE: Rounding (up, in MHPCO's favor)
  // ============================================================
  it("premium calculation yielding 197.5 G rounds up to 198 G", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
      })
    ).toEqual({ premium: 198 });
  });
  it("intermediate values are kept as fractions; only the final premium is rounded", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "moonstone", cursed: true }],
      })
    ).toEqual({ premium: 45 });
  });

  // ============================================================
  // QUOTE: Integration examples
  // ============================================================
  it("newcomer (0 years) with a cursed steel sword (enchantment 3) — premium 165 G", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      })
    ).toEqual({ premium: 165 });
  });
  it("long-standing customer (3 years), second quote in scenario, cursed steel sword (enchantment 7) — premium 160 G (100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first-insurance − 15 follow-up + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 3, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      })
    ).toEqual({ premium: 160 });
  });

  // ============================================================
  // CLAIM: Deductible
  // ============================================================
  it("regular steel sword (enchantment 3), damage 500 G — payout 400 G (500 − 100 deductible)", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        damages: [{ itemType: "sword", amount: 500 }],
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G — payout 100 G (200 − 100 deductible)", () => {
    expect(
      claim({
        items: [{ type: "rune" }],
        damages: [{ itemType: "rune", amount: 200 }],
      })
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon attack damages a sword (500 G) and an amulet (300 G) — total payout 600 G (deductible applied per damage entry: 400 + 200)", () => {
    expect(
      claim({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "steel", enchantment: 0, cursed: false },
        ],
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      })
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // ============================================================
  // CLAIM: High-enchantment (≥ 8) — 50% of damage
  // ============================================================
  it("steel sword, enchantment 9, damage 1000 G — payout 400 G (50% = 500, then − 100 deductible)", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        damages: [{ itemType: "sword", amount: 1000 }],
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ============================================================
  // CLAIM: Dragon material — full reimbursement, dragon clause wins
  // ============================================================
  it("dragon-material sword, enchantment 5, damage 800 G — payout 700 G (full reimbursement, then − 100 deductible)", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        damages: [{ itemType: "sword", amount: 800 }],
      })
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, enchantment 8, damage 1000 G — payout 400 G (high-enchantment clause applies, then deductible: 500 − 100) [per spec example]", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        damages: [{ itemType: "sword", amount: 1000 }],
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G — payout 400 G (50% rule wins, then deductible: 500 − 100) [per spec example]", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        damages: [{ itemType: "sword", amount: 1000 }],
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ============================================================
  // CLAIM: Cap (2× insurance sum, based on unmodified insurance value)
  // ============================================================
  it("policy covering sword + amulet — insurance sum 1600 G, cap 3200 G", () => {
    expect(
      claim({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
        damages: [],
      })
    ).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword (modified premium 165 G) — cap is 2000 G (based on unmodified insurance value 1000 G)", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        damages: [],
      })
    ).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy with sword + 3 runes (block) — insurance sum 1750 G (block discount does not affect insurance sum)", () => {
    expect(
      claim({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        damages: [],
      })
    ).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("sword (cap 2000 G), first claim 1500 G — payout 1400 G, remainingCap 600 G", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        damages: [{ itemType: "sword", amount: 1500 }],
      })
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000 G), two successive claims of 1500 G — second claim payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        damages: [{ itemType: "sword", amount: 1500 }],
        remainingCap: 600,
      })
    ).toEqual({ payout: 600, remainingCap: 0 });
  });

  // ============================================================
  // CLAIM: Multiple items of same type
  // ============================================================
  it("policy covers two swords — insurance sum 2000 G, cap 4000 G", () => {
    expect(
      claim({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ],
        damages: [],
      })
    ).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two swords insured, two sword damage entries — each entry is a separate damage with its own deductible", () => {
    expect(
      claim({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ],
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      })
    ).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // ============================================================
  // CLAIM: Rounding (down, in MHPCO's favor)
  // ============================================================
  it("payout calculation yielding 350.5 G rounds down to 350 G", () => {
    expect(
      claim({
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        damages: [{ itemType: "sword", amount: 901 }],
      })
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // ============================================================
  // CLI: Basic integration
  // ============================================================
  it("CLI reads JSON from stdin and writes JSON {results: [...]} to stdout", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    const output = execSync(`pnpm tsx ${cliPath}`, { input, encoding: "utf-8" });
    expect(JSON.parse(output)).toEqual({ results: [] });
  });
  it("CLI: scenario with one quote step returns {results: [{premium: <int>}]}", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    const output = execSync(`pnpm tsx ${cliPath}`, { input, encoding: "utf-8" });
    expect(JSON.parse(output)).toEqual({ results: [{ premium: 115 }] });
  });
  it("CLI: scenario with quote then claim returns {results: [{premium}, {payout, remainingCap}]}", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    const output = execSync(`pnpm tsx ${cliPath}`, { input, encoding: "utf-8" });
    expect(JSON.parse(output)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });

  // ============================================================
  // CLI: Error cases (non-zero exit, stderr message, no stdout results)
  // ============================================================
  it("CLI: quote with unknown item type (e.g. broomstick) exits non-zero and writes error to stderr; no results on stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const result = spawnSync("pnpm", ["tsx", cliPath], { input, encoding: "utf-8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick|unknown/i);
    if (result.stdout && result.stdout.trim().length > 0) {
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results).toBeUndefined();
    }
  });
  it("CLI: claim references an item not in the policy (e.g. amulet damaged when only sword insured) exits non-zero with stderr error", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    const result = spawnSync("pnpm", ["tsx", cliPath], { input, encoding: "utf-8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet|not.*polic|not.*insur/i);
    if (result.stdout && result.stdout.trim().length > 0) {
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results).toBeUndefined();
    }
  });
  it("CLI: claim contains a damage entry with negative amount exits non-zero with stderr error", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    const result = spawnSync("pnpm", ["tsx", cliPath], { input, encoding: "utf-8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|amount|invalid/i);
    if (result.stdout && result.stdout.trim().length > 0) {
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results).toBeUndefined();
    }
  });
  it("CLI: claim has more damage entries of a type than items insured (e.g. 2 sword damages, 1 sword) exits non-zero with stderr error", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }, { itemType: "sword", amount: 200 }] } },
      ],
    });
    const result = spawnSync("pnpm", ["tsx", cliPath], { input, encoding: "utf-8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/sword|exceed|more|insur/i);
    if (result.stdout && result.stdout.trim().length > 0) {
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results).toBeUndefined();
    }
  });
});
