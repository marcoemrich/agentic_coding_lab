import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import * as path from "node:path";
import { basePremium, runScenario } from "./claim-office.js";

describe("basePremium", () => {
  it("empty item list -> base premium 0", () => {
    expect(basePremium([])).toBe(0);
  });
  it("main items per price list: sword 100, amulet 60, staff 80, potion 40", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
    expect(basePremium([{ type: "amulet" }])).toBe(60);
    expect(basePremium([{ type: "staff" }])).toBe(80);
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("2 runes -> base premium 50 (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> base premium 60 (block of exactly 3 applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> base premium 100 (no block, block requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes -> base premium 175 (no block)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(sevenRunes)).toBe(175);
  });
  it("2 runes + 1 moonstone -> base premium 75 (no block, different types are not alike)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -> base premium 120 (two separate blocks)", () => {
    expect(basePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(120);
  });
});

describe("runScenario - quote (full premium)", () => {
  it("empty item list -> premium 5 (only processing fee)", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("3 runes -> premium 71 (block 60 + first insurance 6 + fee 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("7 runes -> premium 198 (175 + 17.5 first insurance + 5 fee = 197.5, rounds up in MHPCO favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: sevenRunes }],
    });
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("modifier scope: cursed sword (100) + plain amulet (60), 0 years, first quote -> premium 231 (cursed surcharge 50% of sword's 100, not policy 160)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
      }],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });
  it("loyalty threshold: 2-year customer, plain sword, first quote -> premium 95 (loyalty applies at exactly 2 years)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("loyalty boundary: 1-year customer, plain sword, first quote -> premium 115 (no loyalty)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("high-enchantment threshold: sword enchant 5 (not cursed), 0 years, first quote -> premium 145 (surcharge applies at exactly 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("high-enchantment + cursed: sword enchant 5 cursed, 0 years, first quote -> premium 195 (both surcharges apply)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("enchantment boundary: sword enchant 4 (not cursed), 0 years, first quote -> premium 115 (no high-enchantment surcharge below 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("integration newcomer: 0 years, first quote, cursed sword (steel, enchant 3) -> premium 165", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("integration long-standing: 3 years, second quote, cursed sword (steel, enchant 7) -> premium 160 (first insurance still applies on follow-up contract)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1 }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});

describe("runScenario - claim (payout and remainingCap)", () => {
  it("standard: steel sword enchant 3, damage 500 -> payout 400, remainingCap 1600 (full minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("rune damage: rune (value 250), damage 200 -> payout 100, remainingCap 400 (no special clause for runes)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("deductible per damaged item: sword 500 + amulet 300 -> payout 600, remainingCap 2600 (100 deductible once per damage entry)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet", material: "silver", enchantment: 2 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("dragon sword enchant 8, damage 1000 -> payout 400, remainingCap 1600 (high-enchantment clause applies at exactly 8, 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchant 9, damage 1000 -> payout 400, remainingCap 1600 (both clauses, 50% rule wins then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchant 5, damage 800 -> payout 700, remainingCap 1300 (only dragon-material clause, full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchant 9, damage 1000 -> payout 400, remainingCap 1600 (only high-enchantment clause, 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("payout rounding down: steel sword enchant 8, damage 901 -> payout 350, remainingCap 1650 (350.5 rounds down in MHPCO favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("two swords insured, damages [500, 500] -> payout 800, remainingCap 3200 (each damage entry separate with own deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("cap exhaustion: sword, two claims of 1500 -> first payout 1400 rem 600, second payout 600 rem 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("cursed sword cap: cursed sword (premium 165), damage 2500 -> payout 2000, remainingCap 0 (cap based on unmodified insurance value 1000, premium modifiers do not raise cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 2500 }] } },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3 runes (block) cap: damage sword 3600 -> payout 3500, remainingCap 0 (block discount affects premium only, insurance sum 1750)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 3600 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
});

describe("runScenario - errors (reject scenario)", () => {
  it("quote with unknown item type (broomstick) -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item not in policy (amulet damaged, only sword insured) -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount (-200) -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
  it("claim with more damages than insured (two sword damages, one sword insured) -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    })).toThrow();
  });
});

describe("CLI (src/cli.ts)", () => {
  const runCli = (input: string): { stdout: string; stderr: string; status: number | null } => {
    const tsx = path.join(process.cwd(), "node_modules", ".bin", "tsx");
    const result = spawnSync(tsx, ["src/cli.ts"], { input, encoding: "utf-8" });
    return { stdout: result.stdout ?? "", stderr: result.stderr ?? "", status: result.status };
  };

  it("schema example: customer 5 years, quote amulet + claim amulet 200 -> stdout JSON {premium 59},{payout 100, remainingCap 1100}, exit 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const out = runCli(JSON.stringify(scenario));
    expect(out.status).toBe(0);
    expect(JSON.parse(out.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("unknown item type -> exit code 1, stderr non-empty, stdout empty (no results written)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const out = runCli(JSON.stringify(scenario));
    expect(out.status).toBe(1);
    expect(out.stderr.length).toBeGreaterThan(0);
    expect(out.stdout).toBe("");
  });
});
