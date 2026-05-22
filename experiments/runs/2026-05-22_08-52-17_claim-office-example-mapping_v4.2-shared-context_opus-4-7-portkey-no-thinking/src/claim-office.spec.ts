import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const CLI_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "cli.ts");

function runCli(input: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input,
    encoding: "utf-8",
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

describe("MHPCO Claim Office", () => {
  describe("quote — base price list and processing fee", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
    });
    it("single sword (newcomer, plain) → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
    });
    it("single amulet (newcomer, plain) → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
    });
    it("single staff (newcomer, plain) → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
    });
    it("single potion (newcomer, plain) → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — component building block", () => {
    it("2 runes (no block) → premium 60 G (50 base + 5 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes (block applies) → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes (no block — block requires exactly 3) → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(115);
    });
    it("7 runes (block requires exactly 3, so all 7 billed individually) → premium 198 G (175 base + 17.5 first-insurance + 5 fee = 197.5 rounded up to 198)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(198);
    });
    it("2 runes + 1 moonstone (different types, no block) → premium 88 G (75 base + 7.5 first-insurance + 5 fee = 87.5 rounded up)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones (two separate blocks) → premium 137 G (120 base + 12 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(137);
    });
  });

  describe("quote — modifier thresholds", () => {
    it("loyalty threshold: customer with exactly 2 years, plain sword → premium 95 G (100 base − 20 loyalty + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
    });
    it("loyalty just below: customer with 1 year, plain sword → premium 115 G (no loyalty discount)", () => {
      expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
    });
    it("high-enchantment threshold: sword with exactly enchantment 5 → premium 145 G (100 base + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("high-enchantment just below: sword with enchantment 4 → premium 115 G (no high-enchant surcharge)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed and high-enchantment (sword enchant 5, cursed) → premium 195 G (100 base + 50 curse + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet (newcomer) → premium 231 G (policy base 160 + 50 curse on sword only + 10 first-ins sword + 6 first-ins amulet + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer with a cursed sword (steel, enchant 3), 0 years, first contract → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("long-standing customer's second contract: cursed sword (enchant 7), 3 years, second quote → premium 160 G (100 + 50 + 30 − 20 + 10 − 15 + 5)", () => {
      expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], { isFollowUp: true })).toBe(160);
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchant 3), damage 500 G → payout 400 G (full minus 100 deductible)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 3 }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune (no enchant/material), damage 200 G → payout 100 G (full minus 100 deductible)", () => {
      const policy = { items: [{ type: "rune" }] };
      const incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };
      expect(claim(policy, incident, 500)).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("claim — enchantment and dragon-material clauses", () => {
    it("dragon sword enchant exactly 8, damage 1000 G → payout 400 G (50% rule wins, then deductible: 500 − 100)", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 8 }] };
      const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon sword enchant 9, damage 1000 G → payout 400 G (both clauses; 50% wins, then deductible)", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 9 }] };
      const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon sword enchant 5, damage 800 G → payout 700 G (only dragon clause: full reimbursement, then deductible)", () => {
      const policy = { items: [{ type: "sword", material: "dragon", enchantment: 5 }] };
      const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword enchant 9, damage 1000 G → payout 400 G (only high-enchant clause: 50% first, then deductible)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 9 }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damages sword (500 G) + amulet (300 G) → payout 600 G (deductible applies once per damaged item)", () => {
      const policy = { items: [{ type: "sword", material: "dragon" }, { type: "amulet", material: "dragon" }] };
      const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] };
      expect(claim(policy, incident, 3200)).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("two-sword policy, dragon attack with two sword damage entries (500 + 400) → payout 700 G (each entry deducted: 400 + 300)", () => {
      const policy = { items: [{ type: "sword", material: "dragon" }, { type: "sword", material: "dragon" }] };
      const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 400 }] };
      expect(claim(policy, incident, 4000)).toEqual({ payout: 700, remainingCap: 3300 });
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("policy of sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
      const policy = { items: [{ type: "sword" }, { type: "amulet" }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 200 }] };
      expect(claim(policy, incident, 3200)).toEqual({ payout: 500, remainingCap: 2700 });
    });
    it("policy with cursed sword (premium 165 G after modifiers) → cap still 2000 G (based on unmodified insurance value)", () => {
      const policy = { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("policy of sword + 3 runes (block) → insurance sum 1750 G (block discount affects premium only), cap 3500 G", () => {
      const policy = { items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
      expect(claim(policy, incident, 3500)).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("cap exhaustion: sword policy (cap 2000), claim 1500 → payout 1400, remainingCap 600; claim 1500 → payout 600, remainingCap 0", () => {
      const policy = { items: [{ type: "sword" }] };
      const incident1 = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const result1 = claim(policy, incident1, 2000);
      expect(result1).toEqual({ payout: 1400, remainingCap: 600 });
      const incident2 = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const result2 = claim(policy, incident2, result1.remainingCap);
      expect(result2).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("rounding in MHPCO's favor", () => {
    it("premium 197.5 G rounds UP → final premium 198 G", () => {
      // 7 runes: 175 base + 17.5 first-insurance + 5 fee = 197.5 → ceil → 198
      const items = [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ];
      expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(198);
    });
    it("payout 350.5 G rounds DOWN → final payout 350 G (sword enchant 8, damage 901 → half=450.5 − 100 = 350.5)", () => {
      const policy = { items: [{ type: "sword", enchantment: 8 }] };
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] };
      expect(claim(policy, incident, 2000)).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("CLI — JSON in/out", () => {
    it("CLI: simple quote step → stdout contains {results: [{premium: ...}]} matching schema", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      const { stdout, status } = runCli(input);
      expect(status).toBe(0);
      const parsed = JSON.parse(stdout);
      expect(parsed).toEqual({ results: [{ premium: 115 }] });
    });
    it("CLI: scenario with quote then claim referencing policy index 0 → stdout has both results in order", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      const { stdout, status } = runCli(input);
      expect(status).toBe(0);
      const parsed = JSON.parse(stdout);
      expect(parsed).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
    });
    it("CLI: two quote steps for same customer → second quote applies follow-up contract discount (long-standing scenario E32 yields 160 G)", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      const { stdout, status } = runCli(input);
      expect(status).toBe(0);
      const parsed = JSON.parse(stdout);
      expect(parsed).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
    });
  });

  describe("CLI — error handling (exit non-zero, stderr)", () => {
    it("CLI: quote includes unknown item type (e.g. broomstick) → exits non-zero, error on stderr, no `results` on stdout", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "broomstick" }] },
        ],
      });
      const { stdout, stderr, status } = runCli(input);
      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
      expect(stdout).not.toContain("results");
    });
    it("CLI: claim references an item not in the policy (e.g. amulet damaged when only a sword insured) → exits non-zero, error on stderr", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      const { stderr, status } = runCli(input);
      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
    });
    it("CLI: claim damage entry with negative amount → exits non-zero, error on stderr", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -100 }] } },
        ],
      });
      const { stderr, status } = runCli(input);
      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
    });
    it("CLI: claim contains more damage entries of a type than the policy covers (two sword damages, one sword insured) → exits non-zero, error on stderr", () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 400 }] } },
        ],
      });
      const { stderr, status } = runCli(input);
      expect(status).not.toBe(0);
      expect(stderr.length).toBeGreaterThan(0);
    });
  });
});
