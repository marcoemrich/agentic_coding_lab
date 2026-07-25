import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runScenario } from "./claim-office.js";

const cliPath = join(dirname(fileURLToPath(import.meta.url)), "cli.ts");

const runCli = (
  scenario: unknown,
): { status: number | null; stdout: string; stderr: string } => {
  const proc = spawnSync("npx", ["tsx", cliPath], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status: proc.status, stdout: proc.stdout, stderr: proc.stderr };
};

describe("MHPCO Claim Office", () => {
  // --- Base premiums / edge cases ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Item values and base premiums (each main item) ---
  it("sword base premium 100 G (newcomer plain sword: 100 +10% first +5 fee = 115)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("amulet base premium 60 G (newcomer: 60 +10% +5 = 71)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("staff base premium 80 G (newcomer: 80 +10% +5 = 93)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("potion base premium 40 G (newcomer: 40 +10% +5 = 49)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Components ---
  it("2 runes -> 50 G base premium (newcomer: 50 +10% +5 = 60)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes -> 60 G base premium (block applies; newcomer: 60 +10% +5 = 71)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes -> 100 G base premium (no block - requires exactly 3; newcomer: 100 +10% +5 = 115)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes -> 175 G base premium (no block; newcomer: 175 +10% +5 = 197.5 -> 198)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types; newcomer: 75 +10% +5 = 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks; newcomer: 120 +10% +5 = 137)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Premium modifiers (item-specific) ---
  it("cursed sword adds 50% risk surcharge on item base (newcomer: 100 +50 curse +10 first +5 = 165)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("highly enchanted item (enchantment >= 5) adds 30% surcharge (newcomer sword ench 5: 100 +30 +10 first +5 = 145)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies (newcomer: 145)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge (newcomer: 100 +10 first +5 = 115)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 5 -> both surcharges apply (newcomer: 100 +50 +30 +10 first +5 = 195)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // --- Premium modifiers (policy-wide) ---
  it("long-standing customer (>=2yr) receives 20% loyalty discount (5yr sword: 100 +10 first -20 loyalty +5 = 95)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("customer with exactly 2 years -> loyalty discount applies (2yr sword: 95)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("first insurance carries 10% initial assessment surcharge (newcomer sword: 100 +10 +5 = 115)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("15% discount on each contract after the first (0yr, 2nd quote sword: 100 +10 first -15 followup +5 = 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });
  it("5 G processing fee added to every premium (empty list -> 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet: base 160, curse +50 (item), then newcomer first +16, +5 fee = 231", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ] }],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // --- Rounding ---
  it("premium yielding 197.5 G -> 198 G (rounded up; 7 runes newcomer: 175 +17.5 first +5 = 197.5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("payout yielding 350.5 G -> 350 G (rounded down; high-ench sword ench 8 damage 901: 450.5-100=350.5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("intermediate amounts kept as fractions; only final rounded (ench 8 sword+amulet, damages 451 each: 125.5+125.5=251)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [
          { type: "sword", enchantment: 8 },
          { type: "amulet", enchantment: 8 },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 451 },
          { itemType: "amulet", amount: 451 },
        ] } },
      ],
    });
    // insurance sum 1600, cap 3200; payout 251 -> remaining 2949
    expect(result.results[1]).toEqual({ payout: 251, remainingCap: 2949 });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3): premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing (3yr) second contract, cursed sword (steel, ench 7): premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // 100 base +50 curse +30 high-ench -20 loyalty +10 first -15 followup +5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Insurance sum & cap ---
  it("policy covers two swords -> insurance sum 2000 G, cap 4000 G (via claim remaining)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // cap 4000; payout 100 -> remaining 3900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("policy sword + amulet -> insurance sum 1600 G, cap 3200 G (via claim remaining)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 3 },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // insurance sum 1600, cap 3200; payout 100 -> remaining 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword -> cap 2000 G (based on unmodified insurance value; premium modifiers do not raise cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // cap 2000; payout 100 -> remaining 1900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("sword + 3 runes (block) -> insurance sum 1750 G (block affects premium only; cap 3500)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // insurance sum 1000 + 3*250 = 1750, cap 3500; payout 100 -> remaining 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  // --- Claim processing: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (full minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (value 250), damage 200 -> payout 100 (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim processing: special clauses ---
  it("dragon sword ench 8 damage 1000 -> payout 400 (high-ench 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon material fully reimbursed (dragon sword ench 5 damage 800: 800-100=700)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon sword ench 9 damage 1000 -> payout 400 (both clauses, 50% wins then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 5 damage 800 -> payout 700 (only dragon clause: full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9 damage 1000 -> payout 400 (only high-ench: 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible once per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 3 },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    // insurance sum 1600, cap 3200; payout 600 -> remaining 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Multiple items of same type ---
  it("two swords, dragon attack damages both (two sword entries) -> each own deductible (payout 600)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] } },
      ],
    });
    // insurance sum 2000, cap 4000; payout 400+200=600 -> remaining 3400
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("more damage entries of a type than covered (2 sword damages, 1 sword insured) -> reject, non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ] } },
      ],
    };
    const proc = runCli(scenario);
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
  });

  // --- Cap exhaustion ---
  it("sword (cap 2000), two claims 1500 each -> first 1400/600, second capped to 600/0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Error cases ---
  it("quote with unknown item type -> non-zero exit, error on stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const proc = runCli(scenario);
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
    expect(proc.stdout).toBe("");
  });
  it("claim references item not in policy -> non-zero exit, error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const proc = runCli(scenario);
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
  });
  it("claim damage amount -200 -> non-zero exit, error on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const proc = runCli(scenario);
    expect(proc.status).not.toBe(0);
    expect(proc.stderr).not.toBe("");
  });
});
