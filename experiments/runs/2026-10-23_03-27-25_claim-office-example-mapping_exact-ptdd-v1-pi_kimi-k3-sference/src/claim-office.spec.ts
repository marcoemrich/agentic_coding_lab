import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
  json: { results?: Array<Record<string, number>> };
}

function runCli(scenario: unknown): CliResult {
  const proc = spawnSync("node", ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf-8",
  });
  let json: CliResult["json"] = {};
  try {
    json = JSON.parse(proc.stdout) as CliResult["json"];
  } catch {
    // leave json empty; assertions on error cases inspect status/stderr
  }
  return { status: proc.status, stdout: proc.stdout, stderr: proc.stderr, json };
}

function quoteScenario(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) {
  return { customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] };
}

function premiumOf(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0): number {
  const result = runCli(quoteScenario(items, yearsWithMHPCO));
  expect(result.status).toBe(0);
  return result.json.results![0].premium;
}

const plainSword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

describe("MHPCO claim office", () => {
  describe("quote: base premiums and component blocks", () => {
    it("quote with empty item list -> premium 5 (processing fee only)", () => {
      expect(premiumOf([])).toBe(5);
    });
    it("quote a single plain sword -> premium 115 (100 base + 10 first-insurance + 5 fee)", () => {
      expect(premiumOf([plainSword])).toBe(115);
    });
    it("quote a single plain amulet -> premium 71 (60 base + 6 + 5)", () => {
      expect(premiumOf([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }])).toBe(71);
    });
    it("quote a single plain staff -> premium 93 (80 base + 8 + 5)", () => {
      expect(premiumOf([{ type: "staff", material: "oak", enchantment: 1, cursed: false }])).toBe(93);
    });
    it("quote a single plain potion -> premium 49 (40 base + 4 + 5)", () => {
      expect(premiumOf([{ type: "potion", enchantment: 0, cursed: false }])).toBe(49);
    });
    it("quote 2 runes -> premium 60 (50 base, no block)", () => {
      expect(premiumOf([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("quote 3 runes -> premium 71 (60 block base premium)", () => {
      expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("quote 4 runes -> premium 115 (100 base, block requires exactly 3)", () => {
      expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(115);
    });
    it("quote 7 runes -> premium 198 (175 base; 197.5 rounds up in MHPCO's favor)", () => {
      const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(premiumOf(runes)).toBe(198);
    });
    it("quote 2 runes + 1 moonstone -> premium 88 (75 base, no block across different types)", () => {
      expect(premiumOf([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("quote 3 runes + 3 moonstones -> premium 137 (120 base, two separate blocks)", () => {
      const items = [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ];
      expect(premiumOf(items)).toBe(137);
    });
  });

  describe("quote: premium modifiers", () => {
    it("cursed sword + plain amulet -> premium 231 (curse surcharge applies to the cursed item's base premium only)", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ];
      expect(premiumOf(items)).toBe(231);
    });
    it("sword with enchantment 4 -> premium 115 (no high-enchantment surcharge)", () => {
      expect(premiumOf([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("sword with enchantment 5 -> premium 145 (high-enchantment surcharge at threshold)", () => {
      expect(premiumOf([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
    });
    it("cursed sword with enchantment 5 -> premium 195 (both item surcharges apply)", () => {
      expect(premiumOf([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("customer with exactly 2 years -> loyalty discount applies: plain sword premium 95", () => {
      expect(premiumOf([plainSword], 2)).toBe(95);
    });
    it("customer with 1 year -> no loyalty discount: plain sword premium 115", () => {
      expect(premiumOf([plainSword], 1)).toBe(115);
    });
    it("second quote step in a scenario -> 15% follow-up-contract discount: plain sword premium 100", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "quote", items: [plainSword] },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![0].premium).toBe(115);
      expect(result.json.results![1].premium).toBe(100);
    });
    it("newcomer with a cursed sword -> premium 165 (integration example)", () => {
      expect(premiumOf([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("long-standing customer's second contract: cursed sword enchantment 7, 3 years -> premium 160 (integration example)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].premium).toBe(160);
    });
  });

  describe("claim: reimbursement and cap", () => {
    it("steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600 (full reimbursement minus deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(400);
      expect(result.json.results![1].remainingCap).toBe(1600);
    });
    it("rune damage 200 -> payout 100, remainingCap 400 (no special clause for components)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(100);
      expect(result.json.results![1].remainingCap).toBe(400);
    });
    it("cursed sword policy -> cap 2000 based on unmodified insurance value: damage 1500 -> payout 1400, remainingCap 600", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(1400);
      expect(result.json.results![1].remainingCap).toBe(600);
    });
    it("sword + 3 runes policy -> insurance sum 1750 (block affects premium only): sword damage 500 -> payout 400, remainingCap 3100", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(400);
      expect(result.json.results![1].remainingCap).toBe(3100);
    });
    it("dragon sword enchantment 8, damage 1000 -> payout 400 (50% clause applies at threshold, then deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(400);
    });
    it("dragon sword enchantment 9, damage 1000 -> payout 400 (both clauses; the 50% rule wins)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(400);
    });
    it("dragon sword enchantment 5, damage 800 -> payout 700 (dragon material fully reimbursed, then deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(700);
    });
    it("steel sword enchantment 9, damage 1000 -> payout 400 (only high-enchantment clause)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(400);
    });
    it("steel sword enchantment 9, damage 901 -> payout 350 (350.5 rounds down in MHPCO's favor)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(350);
    });
    it("one incident damaging sword 500 and amulet 300 -> payout 600 (deductible per damaged item), remainingCap 2600", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword, { type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
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
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(600);
      expect(result.json.results![1].remainingCap).toBe(2600);
    });
    it("policy covering two swords, two sword damage entries of 500 -> payout 800 (separate deductibles), remainingCap 3200", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword, { ...plainSword }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(800);
      expect(result.json.results![1].remainingCap).toBe(3200);
    });
    it("cap exhaustion: two successive claims of 1500 on a sword -> payouts 1400 then 600, remainingCap 600 then 0", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(1400);
      expect(result.json.results![1].remainingCap).toBe(600);
      expect(result.json.results![2].payout).toBe(600);
      expect(result.json.results![2].remainingCap).toBe(0);
    });
    it("schema example: silver amulet enchantment 2, damage 200 -> payout 100, remainingCap 1100", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).toBe(0);
      expect(result.json.results![1].payout).toBe(100);
      expect(result.json.results![1].remainingCap).toBe(1100);
    });
  });

  describe("rejections", () => {
    it("quote with unknown item type (broomstick) -> non-zero exit, error on stderr, no results on stdout", () => {
      const result = runCli(quoteScenario([{ type: "broomstick" }]));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
      expect(result.stdout).not.toContain("results");
    });
    it("claim damaging an item not part of the policy -> non-zero exit, error on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("claim with damage entry of unknown type -> non-zero exit, error on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("claim with more damage entries of a type than the policy covers -> non-zero exit, error on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("claim with negative damage amount -> non-zero exit, error on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      };
      const result = runCli(scenario);
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
  });
});
