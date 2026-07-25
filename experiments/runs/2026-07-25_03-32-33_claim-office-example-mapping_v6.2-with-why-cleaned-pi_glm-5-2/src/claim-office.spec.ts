import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { basePremium, processScenario } from "./claim-office.js";
import type { Scenario, QuoteItem } from "./claim-office.js";

const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

function runCli(input: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, ["--import", "tsx", cliPath], {
    input,
    encoding: "utf-8",
    cwd: projectRoot,
  });
  return { stdout: result.stdout ?? "", stderr: result.stderr ?? "", status: result.status };
}

describe("MHPCO Claim Office", () => {
  // --- Base premiums / components (simple -> complex) ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 5 }]);
  });
  it("main items base premium: sword 100, amulet 60, staff 80, potion 40", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
    expect(basePremium([{ type: "amulet" }])).toBe(60);
    expect(basePremium([{ type: "staff" }])).toBe(80);
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("2 runes -> base premium 50 G", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> base premium 60 G (block of 3 alike components)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> base premium 100 G (no block -- block requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes -> base premium 175 G (no block)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(runes)).toBe(175);
  });
  it("2 runes + 1 moonstone -> base premium 75 G (no block: different types)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks)", () => {
    const items: QuoteItem[] = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(basePremium(items)).toBe(120);
  });

  // --- Quote modifiers ---
  it("single sword -> premium 115 G (base 100 + first insurance 10 + fee 5)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 115 }]);
  });
  it("newcomer: cursed sword (steel, enchant 3), 0 years, first contract -> premium 165 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 165 }]);
  });
  it("sword enchantment 5 (not cursed) -> premium 145 G (high-enchant 30% surcharge)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 145 }]);
  });
  it("sword enchantment 4 (not cursed) -> premium 115 G (no high-enchant surcharge)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 115 }]);
  });
  it("cursed sword enchantment 5 -> premium 195 G (both curse and high-enchant surcharges)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 195 }]);
  });
  it("customer exactly 2 years -> premium 95 G (loyalty 20% discount applies)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 95 }]);
  });
  it("customer 1 year -> premium 115 G (no loyalty discount)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 115 }]);
  });
  it("second contract: cursed sword enchant 7, 3 years, 2nd quote -> premium 160 G (first insurance still applies, follow-up discount)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", enchantment: 7, cursed: true }] },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 95 }, { premium: 160 }]);
  });
  it("modifier scope: cursed sword + plain amulet -> premium 231 G (curse 50 on sword base, not policy total 160)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
      }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 231 }]);
  });
  it("7 runes -> premium 198 G (197.5 rounded up in MHPCO's favor)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([{ premium: 198 }]);
  });

  // --- Claim payouts ---
  it("payout rounding: sword enchant 8, damage 901 -> payout 350 G (350.5 rounded down)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 350, remainingCap: 1649 });
  });
  it("standard claim: sword (steel, enchant 3), damage 500 -> payout 400 G, remainingCap 1600", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 -> payout 100 G (full minus deductible; runes have no enchantment/material)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon-material sword enchant 8, damage 1000 -> payout 400 G (high-enchant clause, then deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchant 9, damage 1000 -> payout 400 G (50% rule wins over dragon material)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchant 5, damage 800 -> payout 700 G (dragon clause: full, then deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchant 9, damage 1000 -> payout 400 G (high-enchant clause only)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: multiple items, caps ---
  it("deductible per event: sword 500 + amulet 300 -> payout 600 G (deductible once per damaged item)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords damaged -> payout 800 G (each damages entry a separate damage with own deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damages than insured (2 sword damages, 1 sword insured) -> throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("cap: sword + amulet, damage 200 -> payout 100, remainingCap 3100 (cap 3200 = 2x1600)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword cap 2000 (unmodified insurance value): damage 1500 -> payout 1400, remainingCap 600", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword + 3 runes (block) insurance sum 1750: damage 200 -> payout 100, remainingCap 3400 (cap 3500, block affects premium only)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("cap exhaustion: sword, claim 1500 -> 1400 (remaining 600), claim 1500 -> 600 (remaining 0)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- Edge cases (errors) ---
  it("quote with unknown item type ({type:'broomstick'}) -> throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("claim references uncovered item (amulet damaged, only sword insured) -> throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("claim references unknown itemType -> throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("claim with negative amount (-200) -> throws", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });

  // --- CLI integration ---
  it("CLI happy path: reads JSON from stdin, writes results JSON to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI error: unknown item type -> non-zero exit, stderr message, no stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { stdout, stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).not.toBe("");
  });
});
