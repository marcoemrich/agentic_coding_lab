import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claimOffice.js";

function runCli(input: unknown): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const e = error as { status?: number; stdout?: string; stderr?: string };
    return { status: e.status ?? -1, stdout: e.stdout ?? "", stderr: e.stderr ?? "" };
  }
}

describe("MHPCO claim office", () => {
  describe("quote: base premiums and processing fee", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result.results).toEqual([{ premium: 5 }]);
    });
    it("single plain sword, new customer, first quote -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("single plain amulet -> 71 G (60 + 6 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("single plain staff -> 93 G (80 + 8 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(result.results).toEqual([{ premium: 93 }]);
    });
    it("single plain potion -> 49 G (40 + 4 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(result.results).toEqual([{ premium: 49 }]);
    });
  });

  describe("quote: components and building blocks", () => {
    it("single rune -> 33 G (25 + 2.50 + 5 = 32.50 rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result.results).toEqual([{ premium: 33 }]);
    });
    it("2 runes -> 60 G (50 base + 5 first insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(result.results).toEqual([{ premium: 60 }]);
    });
    it("3 runes -> 71 G (block: 60 base + 6 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("4 runes -> 115 G (no block: 100 + 10 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("7 runes -> 198 G (175 + 17.50 + 5 = 197.50 rounded up in MHPCO's favor)", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items }],
      });
      expect(result.results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone -> 88 G (no block: 75 + 7.50 + 5 = 87.50 rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
      });
      expect(result.results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones -> 137 G (two separate blocks: 120 + 12 + 5)", () => {
      const items = [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ];
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items }],
      });
      expect(result.results).toEqual([{ premium: 137 }]);
    });
  });

  describe("quote: item-specific modifiers", () => {
    it("cursed sword (steel, enchantment 3), newcomer -> 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      });
      expect(result.results).toEqual([{ premium: 165 }]);
    });
    it("sword with exactly enchantment 5 -> 145 G (high-enchantment surcharge applies: 100 + 30 + 10 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(result.results).toEqual([{ premium: 145 }]);
    });
    it("sword with enchantment 4 -> 115 G (no high-enchantment surcharge)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("cursed sword with enchantment 5 -> 195 G (both surcharges: 100 + 50 + 30 + 10 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
      });
      expect(result.results).toEqual([{ premium: 195 }]);
    });
  });

  describe("quote: policy-wide modifiers", () => {
    it("customer with exactly 2 years -> loyalty discount applies: sword 95 G (100 + 10 - 20 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results).toEqual([{ premium: 95 }]);
    });
    it("customer with 1 year -> no loyalty discount: sword 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("cursed sword + plain amulet -> 231 G (item modifier on cursed item only: 160 base + 50 curse + 16 first insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
      });
      expect(result.results).toEqual([{ premium: 231 }]);
    });
    it("second quote of a customer -> 15% follow-up discount: amulet 62 G (60 + 6 - 9 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });
      expect(result.results).toEqual([{ premium: 71 }, { premium: 62 }]);
    });
    it("integration: 3-year customer's second quote, cursed sword enchantment 7 -> 160 G (100 + 50 + 30 - 20 + 10 - 15 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim: standard reimbursement", () => {
    it("steel sword enchantment 3, damage 500 -> payout 400 G, remainingCap 1600 (cap 2000)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damage 200 -> payout 100 G, remainingCap 400 (cap 500; no special clause for components)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("staff damage 300 -> payout 200 G, remainingCap 1400 (cap 1600)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "staff" }] },
          { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "staff", amount: 300 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1400 });
    });
    it("potion damage 250 -> payout 150 G, remainingCap 650 (cap 800)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "claim", policy: 0, incident: { cause: "spill", damages: [{ itemType: "potion", amount: 250 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 650 });
    });
    it("damage below deductible -> payout 0 G (chosen reading: payout never negative), cap unchanged", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 50 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("payout 400.5 -> 400 G (rounded down in MHPCO's favor): steel sword enchantment 9, damage 1001", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1001 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim: special reimbursement clauses", () => {
    it("dragon sword enchantment 8, damage 1000 -> 400 G (50% rule wins, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon sword enchantment 9, damage 1000 -> 400 G (both clauses apply; 50% rule wins)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon sword enchantment 5, damage 800 -> 700 G (only dragon clause: full - 100)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "claws", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword enchantment 9, damage 1000 -> 400 G (only high-enchantment clause)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim: multiple damages and items", () => {
    it("sword 500 + amulet 300 in one incident -> payout 600 G (deductible once per damaged item), remainingCap 2600", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two swords policy -> cap 4000: one sword damage 500 -> payout 400, remainingCap 3600", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
    });
    it("two sword damages with two swords insured -> each own deductible: payout 800, remainingCap 3200", () => {
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
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("claim: cap", () => {
    it("cursed sword -> cap 2000 based on unmodified insurance value: damage 1500 -> payout 1400, remainingCap 600", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "curse backlash", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("sword + 3 runes (block) -> insurance sum 1750, cap 3500: sword damage 500 -> payout 400, remainingCap 3100", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("cap exhaustion: two successive claims of 1500 -> 1400 (remaining 600) then 600 (remaining 0)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("CLI error contract (chosen reading: exit code != 0, error on stderr, no results on stdout)", () => {
    it("quote with unknown item type (broomstick) -> non-zero exit, stderr error, no results on stdout", () => {
      const outcome = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(outcome.status).not.toBe(0);
      expect(outcome.stderr.length).toBeGreaterThan(0);
      expect(outcome.stdout).not.toContain("results");
    });
    it("claim damage for item not in policy (amulet damaged, only sword insured) -> non-zero exit + stderr", () => {
      const outcome = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(outcome.status).not.toBe(0);
      expect(outcome.stderr.length).toBeGreaterThan(0);
    });
    it("claim with more sword damages than insured swords -> non-zero exit + stderr, whole claim rejected", () => {
      const outcome = runCli({
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
      });
      expect(outcome.status).not.toBe(0);
      expect(outcome.stderr.length).toBeGreaterThan(0);
    });
    it("claim damage with amount -200 -> non-zero exit + stderr", () => {
      const outcome = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fraud", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      });
      expect(outcome.status).not.toBe(0);
      expect(outcome.stderr.length).toBeGreaterThan(0);
    });
  });

  describe("CLI end-to-end", () => {
    it("schema example: 5-year customer, amulet quote + fire claim 200 -> premium 59, payout 100, remainingCap 1100", () => {
      const outcome = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect(outcome.status).toBe(0);
      expect(JSON.parse(outcome.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
  });
});
