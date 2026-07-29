import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

function runCli(scenario: Scenario): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf-8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office CLI", () => {
  // --- Quote: base premiums and fee ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it.todo("single staff -> premium 93 G (80 base + 8 first insurance + 5 fee)");
  it.todo("single potion -> premium 49 G (40 base + 4 first insurance + 5 fee)");
  it.todo("single rune -> premium 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)");
  it.todo("single moonstone -> premium 33 G (component, 250 G insured / 25 G base)");

  // --- Quote: building blocks of 3 alike components ---
  it.todo("2 runes -> premium 60 G (50 base, no block)");
  it.todo("3 runes -> premium 71 G (60 base, block applies)");
  it.todo("4 runes -> premium 115 G (100 base, no block -- block requires exactly 3)");
  it.todo("7 runes -> premium 198 G (175 base + 17.5 + 5 = 197.5, rounded up)");
  it.todo("2 runes + 1 moonstone -> premium 88 G (75 base, no block: different types)");
  it.todo("3 runes + 3 moonstones -> premium 137 G (120 base, two separate blocks)");

  // --- Quote: item-specific modifiers ---
  it.todo("cursed sword (steel, enchantment 3), newcomer -> premium 165 G (integration example)");
  it.todo("sword with enchantment exactly 5 -> premium 145 G (high-enchantment surcharge)");
  it.todo("sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge)");
  it.todo("cursed sword with enchantment 5 -> premium 195 G (both surcharges)");
  it.todo("cursed sword + plain amulet -> premium 231 G (curse applies to sword only)");

  // --- Quote: policy-wide modifiers ---
  it.todo("customer with exactly 2 years -> loyalty discount: sword premium 95 G");
  it.todo("customer with 1 year -> no loyalty discount: sword premium 115 G");
  it.todo("second quote in scenario -> 15% follow-up discount: sword premium 100 G");
  it.todo("long-standing customer's second contract: 3 years, cursed sword enchantment 7 -> premium 160 G");

  // --- Claim: standard reimbursement ---
  it.todo("claim: regular sword (steel, enchantment 3), damage 500 -> payout 400, remainingCap 1600");
  it.todo("claim: rune damage 200 -> payout 100, remainingCap 400 (no special clause for runes)");
  it.todo("claim: dragon attack damages sword 500 + amulet 300 -> payout 600, remainingCap 2600 (deductible per damaged item)");

  // --- Claim: special clauses ---
  it.todo("claim: dragon-material sword enchantment 9, damage 1000 -> payout 400 (50% rule wins over dragon clause)");
  it.todo("claim: dragon-material sword enchantment 5, damage 800 -> payout 700 (only dragon clause)");
  it.todo("claim: steel sword enchantment 9, damage 1000 -> payout 400 (only high-enchantment clause)");
  it.todo("claim: dragon-material sword enchantment exactly 8, damage 1000 -> payout 400 (threshold)");
  it.todo("claim: steel sword enchantment 8, damage 901 -> payout 350 (350.5 rounded down), remainingCap 1650");

  // --- Claim: multiple items of same type ---
  it.todo("claim: two swords insured, two sword damages of 500 -> payout 800, remainingCap 3200 (each entry separate deductible)");
  it.todo("claim: more sword damage entries than swords insured -> non-zero exit, claim rejected");

  // --- Claim: cap exhaustion ---
  it.todo("claim: two successive claims of 1500 on sword policy -> 1400/600 then 600/0 (cap exhaustion)");
  it.todo("claim: cursed sword, damage 2500 -> payout 2000, remainingCap 0 (cap based on unmodified insurance value)");
  it.todo("claim: sword + 3 runes policy (cap 3500), sword damage 4000 -> payout 3500, remainingCap 0 (block affects premium only)");

  // --- Errors / edge cases ---
  it.todo("quote with unknown item type (broomstick) -> non-zero exit, stderr, no results on stdout");
  it.todo("claim with damage to item not in policy (amulet when only sword insured) -> non-zero exit, stderr");
  it.todo("claim with unknown itemType in damages -> non-zero exit, stderr");
  it.todo("claim with damage amount -200 -> non-zero exit, stderr");
});
