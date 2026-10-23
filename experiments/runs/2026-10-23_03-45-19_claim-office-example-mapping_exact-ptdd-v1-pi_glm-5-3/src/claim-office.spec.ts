import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario, type ScenarioInput } from "./claim-office";

/** Runs the claim-office CLI on a scenario; the rejection contract is the observable outcome. */
function runCli(scenario: unknown): { exitCode: number; stdout: string; stderr: string } {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", new URL("./cli.ts", import.meta.url).pathname],
    { input: JSON.stringify(scenario), encoding: "utf8" },
  );
  return { exitCode: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

// MHPCO Claim Office Kata -- complete test list (inactive).
// Ordered simple -> complex. Activated one behavior per cycle.
//
// Premium formula (from spec + integration examples):
//   policy base (sum of item base premiums; blocks where applicable)
// + item-specific surcharges (cursed +50%, enchantment >= 5 +30%, per item base)
// - loyalty discount (20% of policy base, yearsWithMHPCO >= 2)
// + first-insurance surcharge (10% of policy base; applies to EVERY quote,
//   per the integration-example clarification)
// - follow-up contract discount (15% of policy base, 2nd+ quote in scenario)
// + 5 G processing fee; final premium rounded UP (fractions kept in between).

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums and processing fee", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(5);
    });
    it("single sword, 0 years -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(115);
    });
    it("single amulet -> premium 71 G (60 + 6 + 5)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(71);
    });
    it("single staff -> premium 93 G (80 + 8 + 5)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(93);
    });
    it("single potion -> premium 49 G (40 + 4 + 5)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(49);
    });
    it("single rune -> premium 33 G (25 + 2.5 + 5)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(33);
    });
    it("single moonstone -> premium 33 G (25 + 2.5 + 5)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "moonstone" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(33);
    });
  });

  describe("quote: building block of 3 alike components", () => {
    it("2 runes -> premium 60 G (base 50: no block)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(60);
    });
    it("3 runes -> premium 71 G (base 60: block applies)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(71);
    });
    it("4 runes -> premium 115 G (base 100: no block -- block requires exactly 3)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(115);
    });
    it("6 runes -> premium 137 G (base 120: adopted reading -- count divides evenly into blocks of 3, so two blocks)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 6 }, () => ({ type: "rune" })) }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(137);
    });
    it("7 runes -> premium 198 G (base 175: no block; 197.5 rounds up)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(198);
    });
    it("2 runes + 1 moonstone -> premium 88 G (base 75: no block, different types are not alike; 87.5 rounds up)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(88);
    });
    it("3 runes + 3 moonstones -> premium 137 G (base 120: two separate blocks)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(137);
    });
    it("2 moonstones -> premium 60 G (base 50: block pricing applies to every component type)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "moonstone" }, { type: "moonstone" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(60);
    });
  });

  describe("quote: item-specific modifiers", () => {
    it("cursed sword -> premium 165 G (50% curse surcharge on the sword's 100 G base)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(165);
    });
    it("sword with enchantment 5, not cursed -> premium 145 G (30% high-enchantment surcharge)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(145);
    });
    it("sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(115);
    });
    it("cursed sword with enchantment 5 -> premium 195 G (both surcharges apply)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(195);
    });
    it("cursed sword with enchantment 4 -> premium 165 G (curse surcharge only)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(165);
    });
    it("cursed sword + plain amulet -> premium 231 G (curse surcharge adds 50 G on the sword only; policy base 160 + 50 + 16 first insurance + 5 fee)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(231);
    });
  });

  describe("quote: policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO, plain sword -> premium 95 G (20% loyalty discount: 100 - 20 + 10 + 5)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(95);
    });
    it("customer with 1 year with MHPCO, plain sword -> premium 115 G (no loyalty discount)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 1 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(115);
    });
    it("new customer (0 years), plain sword -> premium 115 G (10% first-insurance surcharge always applies)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(115);
    });
    it("second quote in the scenario (0 years, plain sword twice) -> premiums 115 G then 100 G (15% follow-up discount; first-insurance surcharge still applies)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(115);
      expect(out.results[1]?.premium).toBe(100);
    });
    it("second quote, 2-year customer, one moonstone -> premium 24 G (fractional intermediates kept: 25 - 5 + 2.5 - 3.75 + 5 = 23.75 -> 24)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "quote", items: [{ type: "moonstone" }] },
      ] } as ScenarioInput);
      expect(out.results[1]?.premium).toBe(24);
    });
  });

  describe("quote: rounding in the MHPCO's favor", () => {
    it("2-year customer, first quote, one moonstone -> premium 28 G (27.5 rounds up)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "moonstone" }] }] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(28);
    });
  });

  describe("claim: standard reimbursement and deductible", () => {
    it("regular sword (steel, enchantment 3), damage 500 -> payout 400 G, remainingCap 1600", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(400);
      expect(out.results[1]?.remainingCap).toBe(1600);
    });
    it("rune, damage 200 -> payout 100 G, remainingCap 400 (no enchantment or material: no special clause)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(100);
      expect(out.results[1]?.remainingCap).toBe(400);
    });
    it("staff, damage 900 -> payout 800 G, remainingCap 800 (insurance value 800 G, cap 1600 G)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "staff" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "staff", amount: 900 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(800);
      expect(out.results[1]?.remainingCap).toBe(800);
    });
    it("potion, damage 400 -> payout 300 G, remainingCap 500 (insurance value 400 G, cap 800 G)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "potion", amount: 400 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(300);
      expect(out.results[1]?.remainingCap).toBe(500);
    });
  });

  describe("claim: enchantment threshold vs dragon material", () => {
    it("steel sword enchantment 8, damage 600 -> payout 200 G, remainingCap 1800 (50% first: 300 - 100)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 600 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(200);
      expect(out.results[1]?.remainingCap).toBe(1800);
    });
    it("dragon-material sword enchantment 8, damage 1000 -> payout 400 G, remainingCap 1600 (high-enchantment clause applies, then deductible)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(400);
      expect(out.results[1]?.remainingCap).toBe(1600);
    });
    it("dragon-material sword enchantment 9, damage 1000 -> payout 400 G, remainingCap 1600 (both clauses; the 50% rule wins: 500 - 100)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(400);
      expect(out.results[1]?.remainingCap).toBe(1600);
    });
    it("dragon-material sword enchantment 5, damage 800 -> payout 700 G, remainingCap 1300 (only the dragon-material clause: full - 100)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(700);
      expect(out.results[1]?.remainingCap).toBe(1300);
    });
    it("steel sword enchantment 9, damage 1000 -> payout 400 G, remainingCap 1600 (only the high-enchantment clause: 500 - 100)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(400);
      expect(out.results[1]?.remainingCap).toBe(1600);
    });
    it("payout rounding: steel sword enchantment 9, damage 901 -> payout 350 G (350.5 rounds down), remainingCap 1650", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(350);
      expect(out.results[1]?.remainingCap).toBe(1650);
    });
  });

  describe("claim: deductible per damage event and multiple items", () => {
    it("sword + amulet policy, dragon attack damages sword 500 and amulet 300 -> payout 600 G, remainingCap 2600 (100 G deductible once per damaged item; cap 3200 G)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(600);
      expect(out.results[1]?.remainingCap).toBe(2600);
    });
    it("two swords policy, damages two sword entries 500 and 300 -> payout 600 G, remainingCap 3400 (each entry a separate damage with its own deductible; cap 4000 G)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(600);
      expect(out.results[1]?.remainingCap).toBe(3400);
    });
  });

  describe("claim: cap exhaustion", () => {
    it("sword insured; claim 1500 -> payout 1400, remainingCap 600; second claim 1500 -> payout 600, remainingCap 0 (desired 1400 reduced to remaining cap)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(1400);
      expect(out.results[1]?.remainingCap).toBe(600);
      expect(out.results[2]?.payout).toBe(600);
      expect(out.results[2]?.remainingCap).toBe(0);
    });
    it("cursed sword (premium 165 G), damage 2500 -> payout 2000 G, remainingCap 0 (cap based on unmodified insurance value 1000 G: 2 x 1000)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 2500 }] } },
      ] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(165);
      expect(out.results[1]?.payout).toBe(2000);
      expect(out.results[1]?.remainingCap).toBe(0);
    });
    it("sword + 3 runes (block) policy, sword damage 3700 -> payout 3500 G, remainingCap 0 (insurance sum 1750 G; block affects premium only)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 3700 }] } },
      ] } as ScenarioInput);
      expect(out.results[1]?.payout).toBe(3500);
      expect(out.results[1]?.remainingCap).toBe(0);
    });
  });

  describe("CLI: rejection contract (non-zero exit, error on stderr)", () => {
    it("quote includes an unknown type (broomstick) -> CLI exits non-zero, writes an error description to stderr, no results on stdout", async () => {
      const run = await runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
      expect(run.stdout).toBe("");
    });
    it("claim damages an amulet that is not part of the policy -> CLI exits non-zero, writes an error description to stderr", async () => {
      const run = await runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ] });
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
    });
    it("claim contains a damage entry with an unknown itemType -> CLI exits non-zero, writes an error description to stderr", async () => {
      const run = await runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] } },
      ] });
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
    });
    it("claim contains a damage entry with amount -200 -> CLI exits non-zero, writes an error description to stderr", async () => {
      const run = await runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ] });
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
    });
    it("claim has two sword damage entries but only one sword insured -> CLI exits non-zero, writes an error description to stderr", async () => {
      const run = await runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
      ] });
      expect(run.exitCode).not.toBe(0);
      expect(run.stderr).not.toBe("");
    });
  });

  describe("CLI: end-to-end schema example", () => {
    it("schema example: customer 5 years; quote amulet (silver, enchantment 2) -> premium 59; claim policy 0, amulet damage 200 -> payout 100, remainingCap 1100", async () => {
      const run = await runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ] });
      expect(run.exitCode).toBe(0);
      expect(run.stderr).toBe("");
      const parsed = JSON.parse(run.stdout) as { results: { premium?: number; payout?: number; remainingCap?: number }[] };
      expect(parsed.results[0]?.premium).toBe(59);
      expect(parsed.results[1]?.payout).toBe(100);
      expect(parsed.results[1]?.remainingCap).toBe(1100);
    });
  });

  describe("integration examples", () => {
    it("newcomer with a cursed sword (steel, enchantment 3), 0 years, no previous contract -> premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(165);
    });
    it("long-standing customer (3 years), second quote in scenario: potion -> 41 G, then cursed sword (steel, enchantment 7) -> 160 G (100 + 50 + 30 - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
      const out = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ] } as ScenarioInput);
      expect(out.results[0]?.premium).toBe(41);
      expect(out.results[1]?.premium).toBe(160);
    });
  });
});
