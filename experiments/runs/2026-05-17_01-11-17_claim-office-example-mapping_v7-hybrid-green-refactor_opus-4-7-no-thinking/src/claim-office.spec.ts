import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim } from "./claim-office.js";

const runCli = (input: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });

// Per the spec: every item in every quote is treated as a "first insurance"
// (10% surcharge on the item's base premium), regardless of customer history.
// So expected premiums include the +10% per-item first-insurance surcharge.

describe("MHPCO Claim Office", () => {
  describe("quote - base premiums", () => {
    it("empty item list yields 5 G (processing fee only)", () => {
      expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [] })).toEqual({ premium: 5 });
    });
    it("single sword yields 115 G (100 base +10% first-ins +5 fee)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }]
      })).toEqual({ premium: 115 });
    });
    it("single amulet yields 71 G (60 base +10% +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }]
      })).toEqual({ premium: 71 });
    });
    it("single staff yields 93 G (80 base +10% +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }]
      })).toEqual({ premium: 93 });
    });
    it("single potion yields 49 G (40 base +10% +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }]
      })).toEqual({ premium: 49 });
    });
    it("two swords yield 225 G (200 base +10% +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false }
        ]
      })).toEqual({ premium: 225 });
    });
    it("a sword and an amulet yield 181 G (160 base +10% per item +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false }
        ]
      })).toEqual({ premium: 181 });
    });
  });

  describe("quote - components and building blocks", () => {
    it("single rune yields 33 G (25 base +10%=27.5 +5=32.5 → 33 rounded up)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }]
      })).toEqual({ premium: 33 });
    });
    it("3 runes form a block yielding 71 G (60 block +10%=66 +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }]
      })).toEqual({ premium: 71 });
    });
    it("4 runes yield 115 G (100 base +10% +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]
      })).toEqual({ premium: 115 });
    });
    it("7 runes yield 198 G (175 base +10%=192.5 +5=197.5 → 198 rounded up)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: Array.from({ length: 7 }, () => ({ type: "rune" }))
      })).toEqual({ premium: 198 });
    });
    it("2 runes + 1 moonstone yield 88 G (75 base +10%=82.5 +5=87.5 → 88 rounded up)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]
      })).toEqual({ premium: 88 });
    });
    it("3 runes + 3 moonstones yield 137 G (120 block-base +10%=132 +5)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
        ]
      })).toEqual({ premium: 137 });
    });
  });

  describe("quote - premium modifiers", () => {
    it("newcomer with cursed sword yields 165 G (integration example)", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }]
      })).toEqual({ premium: 165 });
    });
    it("highly enchanted sword (level 5) adds 30% surcharge: 145 G", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }]
      })).toEqual({ premium: 145 });
    });
    it("enchantment level 4 does not trigger high-enchantment surcharge: 115 G", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }]
      })).toEqual({ premium: 115 });
    });
    it("loyalty discount (2+ years) reduces 20% from policy base: 95 G", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 2 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }]
      })).toEqual({ premium: 95 });
    });
    it("follow-up contract gives 15% discount on policy base: 100 G", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        isFollowUp: true
      })).toEqual({ premium: 100 });
    });
    it("long-standing customer second contract with cursed enchanted sword yields 160 G", () => {
      expect(quote({
        customer: { yearsWithMHPCO: 3 },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        isFollowUp: true
      })).toEqual({ premium: 160 });
    });
  });

  describe("claim - basic payout", () => {
    it("standard sword damage 500 G yields 400 G payout", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 2000 },
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damage 200 G yields 100 G payout", () => {
      expect(claim({
        policy: { items: [{ type: "rune" }], remainingCap: 500 },
        incident: { cause: "fall", damages: [{ itemType: "rune", amount: 200 }] }
      })).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("damage to high-enchantment item (level 8+) reimbursed at 50%: payout 400 G", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }], remainingCap: 2000 },
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to dragon-material item fully reimbursed: 700 G", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }], remainingCap: 2000 },
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] }
      })).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material high-enchantment item: 50% rule wins then deductible (400 G)", () => {
      expect(claim({
        policy: { items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }], remainingCap: 2000 },
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }
      })).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("deductible applies per damaged item: sword 500 + amulet 300 -> payout 600", () => {
      expect(claim({
        policy: {
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false }
          ],
          remainingCap: 3200
        },
        incident: {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 }
          ]
        }
      })).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("payout is limited to remainingCap (second claim returns 600 G when only 600 left)", () => {
      // sword with cap 2000; first claim 1500 already eaten 1400, leaving 600.
      expect(claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 600 },
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }
      })).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("successive claims: remaining cap decreases", () => {
      // sword cap 2000; two successive claims of 1500 G each.
      const first = claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: 2000 },
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }
      }) as { payout: number; remainingCap: number };
      expect(first).toEqual({ payout: 1400, remainingCap: 600 });
      const second = claim({
        policy: { items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], remainingCap: first.remainingCap },
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }
      });
      expect(second).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("CLI", () => {
    it("processes a scenario with quote and claim steps", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }]
            }
          }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output.results).toHaveLength(2);
      expect(output.results[0]).toEqual({ premium: 115 });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("unknown item type causes non-zero exit", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "broomstick" }] }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
      expect(result.stdout).not.toContain("results");
    });
    it("claim referencing item not in policy causes non-zero exit", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("negative damage amount causes non-zero exit", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
        ]
      };
      const result = runCli(JSON.stringify(scenario));
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
  });
});
