import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim } from "./claim-office.js";

function runCli(input: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input,
    encoding: "utf-8",
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

describe("MHPCO Claim Office", () => {
  describe("quote - empty and single-item base premiums", () => {
    it("empty item list yields premium of 5G (processing fee only)", () => {
      expect(quote({ items: [], years: 0, priorContract: false })).toEqual({ premium: 5 });
    });
    it("single sword (no modifiers, 0 years, no prior contract) yields 100G base + 10G first insurance + 5G fee = 115G", () => {
      expect(quote({ items: [{ type: "sword" }], years: 0, priorContract: false })).toEqual({ premium: 115 });
    });
    it("single amulet yields 60G base + 10G first insurance + 5G fee = 75G", () => {
      expect(quote({ items: [{ type: "amulet" }], years: 0, priorContract: false })).toEqual({ premium: 75 });
    });
    it("single staff yields 80G base + 10G first insurance + 5G fee = 95G", () => {
      expect(quote({ items: [{ type: "staff" }], years: 0, priorContract: false })).toEqual({ premium: 95 });
    });
    it("single potion yields 40G base + 10G first insurance + 5G fee = 55G", () => {
      expect(quote({ items: [{ type: "potion" }], years: 0, priorContract: false })).toEqual({ premium: 55 });
    });
  });

  describe("quote - components and building blocks", () => {
    it("single rune yields 25G base premium", () => {
      expect(quote({ items: [{ type: "rune" }], years: 0, priorContract: false })).toEqual({ premium: 40 });
    });
    it("2 runes yields 50G base premium (no block)", () => {
      expect(quote({ items: [{ type: "rune" }, { type: "rune" }], years: 0, priorContract: false })).toEqual({ premium: 75 });
    });
    it("3 runes yields 60G base premium (block applies)", () => {
      expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }], years: 0, priorContract: false })).toEqual({ premium: 95 });
    });
    it("4 runes yields 100G base premium (no block — block requires exactly 3)", () => {
      expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], years: 0, priorContract: false })).toEqual({ premium: 145 });
    });
    it("7 runes yields 175G base premium", () => {
      expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], years: 0, priorContract: false })).toEqual({ premium: 250 });
    });
    it("2 runes + 1 moonstone yields 75G base premium (no block: different types)", () => {
      expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], years: 0, priorContract: false })).toEqual({ premium: 110 });
    });
    it("3 runes + 3 moonstones yields 120G base premium (two separate blocks)", () => {
      expect(quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }], years: 0, priorContract: false })).toEqual({ premium: 185 });
    });
  });

  describe("quote - per-item modifiers", () => {
    it("cursed sword adds 50G curse surcharge (50% of sword's 100G base)", () => {
      expect(quote({ items: [{ type: "sword", cursed: true }], years: 0, priorContract: false })).toEqual({ premium: 165 });
    });
    it("sword with enchantment exactly 5 adds 30G high-enchantment surcharge", () => {
      expect(quote({ items: [{ type: "sword", enchantment: 5 }], years: 0, priorContract: false })).toEqual({ premium: 145 });
    });
    it("sword with enchantment 4 has no high-enchantment surcharge", () => {
      expect(quote({ items: [{ type: "sword", enchantment: 4 }], years: 0, priorContract: false })).toEqual({ premium: 115 });
    });
    it("cursed sword with enchantment 5 applies both curse and high-enchantment surcharges", () => {
      expect(quote({ items: [{ type: "sword", cursed: true, enchantment: 5 }], years: 0, priorContract: false })).toEqual({ premium: 195 });
    });
    it("first insurance surcharge applies per item (each item in a quote is a first insurance)", () => {
      // 2 swords: 100G + 100G base = 200G. First insurance per item: 10G + 10G = 20G. + 5G fee = 225G.
      expect(quote({ items: [{ type: "sword" }, { type: "sword" }], years: 0, priorContract: false })).toEqual({ premium: 225 });
    });
  });

  describe("quote - policy-wide modifiers", () => {
    it("customer with exactly 2 years receives 20% loyalty discount on policy base premium", () => {
      // 1 sword: 100G base - 20G loyalty (20% of 100G) + 10G first insurance + 5G fee = 95G
      expect(quote({ items: [{ type: "sword" }], years: 2, priorContract: false })).toEqual({ premium: 95 });
    });
    it("follow-up contract (second quote in scenario) applies 15% discount on policy base premium", () => {
      // 1 sword: 100G base - 15G follow-up discount (15% of 100G) + 10G first insurance + 5G fee = 100G
      expect(quote({ items: [{ type: "sword" }], years: 0, priorContract: true })).toEqual({ premium: 100 });
    });
    it("processing fee of 5G is added at the very end after all modifiers", () => {
      // 1 sword: 100G base, 2 years loyalty (-20G), prior contract (-15G), +10G first insurance, +5G fee
      // If fee were discounted: (100 - 20 - 15 + 10) * something. But fee is added flat at end.
      // 100 - 20 - 15 + 10 + 5 = 80G
      expect(quote({ items: [{ type: "sword" }], years: 2, priorContract: true })).toEqual({ premium: 80 });
    });
  });

  describe("quote - modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet: curse adds 50G (50% of cursed sword's base), not of policy total → 210G before fee/loyalty/etc", () => {
      // cursed sword: 100G + 50G curse = 150G; plain amulet: 60G; policy base = 210G
      // + 2 × 10G first insurance + 5G fee = 235G
      expect(quote({ items: [{ type: "sword", cursed: true }, { type: "amulet" }], years: 0, priorContract: false })).toEqual({ premium: 235 });
    });
  });

  describe("quote - rounding", () => {
    it("premium of 47.5G rounds UP to 48G (in MHPCO's favor)", () => {
      // 1 highly-enchanted rune: base 25G + 30% high-enchantment surcharge = 25 + 7.5 = 32.5G
      // + 10G first insurance + 5G fee = 47.5G
      // Rounds UP to 48G in MHPCO's favor
      expect(quote({ items: [{ type: "rune", enchantment: 5 }], years: 0, priorContract: false })).toEqual({ premium: 48 });
    });
  });

  describe("quote - integration examples from spec", () => {
    it("newcomer (0 years, no prior contract) with cursed sword (steel, enchantment 3) → 165G", () => {
      expect(quote({ items: [{ type: "sword", material: "steel", cursed: true, enchantment: 3 }], years: 0, priorContract: false })).toEqual({ premium: 165 });
    });
    it("3-year customer's second quote with cursed sword (steel, enchantment 7) → 160G", () => {
      expect(quote({ items: [{ type: "sword", material: "steel", cursed: true, enchantment: 7 }], years: 3, priorContract: true })).toEqual({ premium: 160 });
    });
  });

  describe("claim - basic payouts and deductible", () => {
    it("regular sword (steel, enchantment 3), damage 500G → payout 400G (full minus 100G deductible)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250G), damage 200G → payout 100G (full minus 100G deductible)", () => {
      expect(claim({
        policy: { items: [{ type: "rune" }] },
        incident: { cause: "accident", damages: [{ itemType: "rune", amount: 200 }] }
      })).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("deductible applies once per damaged item (dragon attack: sword 500G + amulet 300G → payout 600G)", () => {
      expect(claim({
        policy: { items: [{ type: "sword" }, { type: "amulet" }] },
        incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] }
      })).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim - special clauses", () => {
    it("sword with enchantment ≥ 8 reimburses 50% of damage (then deductible)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1000 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword fully reimbursed (then deductible)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "dragon", enchantment: 3 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000G → payout 400G (50% rule wins, then deductible)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1000 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 5, damage 800G → payout 700G (only dragon clause)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 800 }] }
      })).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword, enchantment 9, damage 1000G → payout 400G (only high-enchantment clause)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1000 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment exactly 8, damage 1000G → payout 400G (high-enchantment clause applies, then deductible)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1000 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim - payout cap (2x insurance sum, cumulative)", () => {
    it("policy covering sword has cap 2000G (2 × 1000G insurance value)", () => {
      expect(claim({
        policy: { items: [{ type: "sword" }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 100 }] }
      })).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("cursed sword cap is 2000G — premium modifiers do not raise cap (based on unmodified insurance value)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", cursed: true, enchantment: 5 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 300 }] }
      })).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("policy covers sword + 3 runes: insurance sum 1750G (block discount affects premium only, not insurance sum)", () => {
      // Insurance sum = 1000 (sword) + 3×250 (runes) = 1750G. Cap = 2 × 1750 = 3500G.
      // Damage 200G to sword → payout 100G (200 - 100 deductible). Remaining cap = 3500 - 100 = 3400G.
      expect(claim({
        policy: { items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 200 }] }
      })).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("two successive 1500G claims on a sword (cap 2000G): first payout 1400G (cap remaining 600G); second payout 600G (cap remaining 0G)", () => {
      const policy = { items: [{ type: "sword" }] };
      const first = claim({
        policy,
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1500 }] }
      });
      expect(first).toEqual({ payout: 1400, remainingCap: 600 });
      const second = claim({
        policy,
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 1500 }] },
        remainingCap: first.remainingCap
      });
      expect(second).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim - rounding", () => {
    it("payout of 350.5G rounds DOWN to 350G (in MHPCO's favor)", () => {
      // sword with enchantment 8, damage 901G → 50% rule: 901 × 0.5 = 450.5, - 100 deductible = 350.5
      // Rounds DOWN to 350G in MHPCO's favor
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 901 }] }
      })).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim - multiple items of the same type", () => {
    it("policy covers two swords: insurance sum 2000G, cap 4000G", () => {
      // Insurance sum = 2 × 1000 = 2000G. Cap = 2 × 2000 = 4000G.
      // Damage 500G to sword → payout 400G (500 - 100 deductible). Remaining cap = 4000 - 400 = 3600G.
      expect(claim({
        policy: { items: [{ type: "sword" }, { type: "sword" }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] }
      })).toEqual({ payout: 400, remainingCap: 3600 });
    });
    it("damages array with two sword entries on a 2-sword policy: each entry treated as separate damage with own deductible", () => {
      // Insurance sum = 2 × 1000 = 2000G. Cap = 4000G.
      // Two damages: sword 500G and sword 300G. Each gets own deductible.
      // Payout = (500 - 100) + (300 - 100) = 400 + 200 = 600G. Remaining cap = 4000 - 600 = 3400G.
      expect(claim({
        policy: { items: [{ type: "sword" }, { type: "sword" }] },
        incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] }
      })).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("CLI - scenario processing", () => {
    it("CLI reads JSON scenario from stdin and writes results array to stdout in same order as steps", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output).toHaveProperty("results");
      expect(Array.isArray(output.results)).toBe(true);
      expect(output.results).toHaveLength(2);
      expect(output.results[0]).toHaveProperty("premium");
      expect(output.results[1]).toHaveProperty("premium");
      expect(Number.isInteger(output.results[0].premium)).toBe(true);
      expect(Number.isInteger(output.results[1].premium)).toBe(true);
    });
    it("claim step references earlier quote via zero-based step index in policy field", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output.results).toHaveLength(2);
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("quote result contains integer premium field", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output.results[0]).toEqual({ premium: 115 });
      expect(Number.isInteger(output.results[0].premium)).toBe(true);
    });
    it("claim result contains integer payout and remainingCap fields", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
      expect(Number.isInteger(output.results[1].payout)).toBe(true);
      expect(Number.isInteger(output.results[1].remainingCap)).toBe(true);
    });
  });

  describe("CLI - error cases", () => {
    it("quote with unknown item type (e.g. broomstick) → non-zero exit, error to stderr, no results to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
      expect(result.stdout).toBe("");
    });
    it("claim referencing damage on item not in policy → non-zero exit, error to stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("claim referencing damage on item with unknown type → non-zero exit, error to stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("claim with negative damage amount → non-zero exit, error to stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("claim with more damage entries of a type than policy covers (e.g. two sword damages, one sword insured) → non-zero exit, whole claim rejected", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
  });
});
