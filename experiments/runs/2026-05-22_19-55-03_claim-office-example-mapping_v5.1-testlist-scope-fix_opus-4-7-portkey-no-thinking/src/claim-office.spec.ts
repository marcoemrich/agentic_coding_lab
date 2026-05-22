import { describe, it, expect } from "vitest";
import { quote, createPolicy, claim } from "./claim-office.js";

describe("MHPCO Claim Office — quote", () => {
  // Simplest case
  it("empty item list → premium 5 G (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // Base premiums per item type (first insurance surcharge applies to each item)
  it("single sword, no modifiers, new customer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }], 0)).toBe(115);
  });
  it("single amulet, no modifiers, new customer → 60 base + 6 first insurance + 5 fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("single staff, no modifiers, new customer → 80 base + 8 first insurance + 5 fee = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single potion, no modifiers, new customer → 40 base + 4 first insurance + 5 fee = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // Components & building blocks of 3 alike
  it("2 runes → base 50 G, premium 60 G (50 + 5 first ins + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes → base 60 G (block applies), premium 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(71);
  });
  it("4 runes → base 100 G (no block — block requires exactly 3), premium 115 G (100 + 10 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(115);
  });
  it("7 runes → base 175 G, premium with first ins each = 175 + 17.5 + 5 = 197.5 → 198 G (rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), 0)).toBe(198);
  });

  // 'Alike' components: same type only
  it("2 runes + 1 moonstone → base 75 G (no block: different types), premium 88 G (75 + 7.5 + 5 = 87.5, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0)).toBe(88);
  });
  it("3 runes + 3 moonstones → base 120 G (two separate blocks), premium 137 G (120 + 12 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })], 0)).toBe(137);
  });

  // Item-specific modifier scope
  it("cursed sword + plain amulet (new customer, first contract) → curse adds 50 G to cursed item only; 100+50+10 + 60+6 + 5 = 231 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }], 0)).toBe(231);
  });

  // Modifier thresholds
  it("customer with exactly 2 years, single sword → 100 + 10 first ins − 20 loyalty + 5 fee = 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("sword with exactly enchantment 5 (new customer) → 100 + 30 ench + 10 first ins + 5 = 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 (new customer) → 100 + 50 curse + 30 ench + 10 first ins + 5 = 195 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }], 0)).toBe(195);
  });
  it("sword with enchantment 4 (new customer) → no high-ench surcharge; 100 + 10 + 5 = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 0)).toBe(115);
  });

  // Cursed surcharge
  it("cursed sword (steel, ench 3), new customer (0 years) → 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
  });

  // Rounding in MHPCO's favor for premiums
  it("premium calculation yielding 197.5 G → 198 G (rounded up in MHPCO's favor)", () => {
    // 7 runes: 175 + 17.5 first ins + 5 = 197.5 → 198
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), 0)).toBe(198);
  });

  // Integration example
  it("long-standing (3y) customer, second quote, cursed sword (ench 7) → 160 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 1)).toBe(160);
  });
});

describe("MHPCO Claim Office — claim", () => {
  // Standard reimbursement
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G (500 - 100 deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("rune damaged (insurance 250 G), damage 200 G → payout 100 G", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });

  // High enchantment ≥ 8: 50% reimbursement
  it("steel sword, ench 9, damage 1000 G → payout 400 G (50% rule then -100)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // Dragon material: full reimbursement
  it("dragon-material sword, ench 5, damage 800 G → payout 700 G (full - 100)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });

  // Both clauses — high-enchantment wins
  it("dragon-material sword, ench 9, damage 1000 G → payout 400 G (50% rule wins)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, ench exactly 8, damage 1000 G → payout 400 G", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack on sword (500 G) and amulet (300 G) → payout 600 G (deductible per item)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel" }, { type: "amulet" }]);
    const result = claim(policy, {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  // Multiple items of same type
  it("policy covers two swords; both damaged 500 each → payout 800 G (deductible per damage)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel" },
      { type: "sword", material: "steel" },
    ]);
    const result = claim(policy, {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });
  it("policy covers one sword but damages array has two sword entries → claim throws (rejected)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "fire",
        damages: [
          { itemType: "sword", amount: 100 },
          { itemType: "sword", amount: 100 },
        ],
      })
    ).toThrow();
  });

  // Cap exhaustion
  it("sword + amulet policy → insurance sum 1600 G, cap 3200 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.remainingCap).toBe(3200);
  });
  it("cursed sword policy → cap 2000 G (based on unmodified insurance value)", () => {
    const policy = createPolicy([{ type: "sword", cursed: true }]);
    expect(policy.insuranceSum).toBe(1000);
    expect(policy.remainingCap).toBe(2000);
  });
  it("sword + 3 runes (block) policy → insurance sum 1750 G", () => {
    const policy = createPolicy([
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(policy.insuranceSum).toBe(1750);
  });
  it("sword (cap 2000) — first claim 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const policy = createPolicy([{ type: "sword", material: "steel" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword (cap 2000) — two successive 1500 G claims → second payout 600 G, remainingCap 0 G", () => {
    const policy = createPolicy([{ type: "sword", material: "steel" }]);
    claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    const second = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // Rounding in MHPCO's favor for payouts
  it("payout calculation yielding 350.5 G → 350 G (rounded down in MHPCO's favor)", () => {
    // sword ench 9, damage 901: 50% = 450.5; -100 deductible = 350.5 → 350
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO Claim Office — CLI / errors", () => {
  it("quote with unknown item type → non-zero exit, error on stderr, no results on stdout", () => {
    const res = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(res.code).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
    expect(res.stdout).toBe("");
  });

  it("claim references item not part of policy → non-zero exit, error on stderr", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    });
    expect(res.code).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });

  it("claim references item with unknown type → non-zero exit, error on stderr", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] } },
      ],
    });
    expect(res.code).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });

  it("claim with negative damage amount → non-zero exit, error on stderr", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(res.code).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });

  it("scenario with quote then claim returns results array with premium then {payout, remainingCap}", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(res.code).toBe(0);
    const out = JSON.parse(res.stdout);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty("premium");
    expect(out.results[1]).toHaveProperty("payout");
    expect(out.results[1]).toHaveProperty("remainingCap");
  });
});

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

function runCli(input: unknown): { code: number; stdout: string; stderr: string } {
  const here = dirname(fileURLToPath(import.meta.url));
  const cliPath = resolve(here, "cli.ts");
  const res = spawnSync("npx", ["tsx", cliPath], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return { code: res.status ?? 1, stdout: res.stdout, stderr: res.stderr };
}
