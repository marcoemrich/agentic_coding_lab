import { describe, it, expect } from "vitest";
import { quote, claim, policyCap } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ===== QUOTE: simplest cases =====
  describe("quote — empty and edge cases", () => {
    it("empty item list returns premium 5 G (only the processing fee)", () => {
      expect(quote({ customer: { yearsWithMHPCO: 0, previousContract: false }, items: [] })).toBe(5);
    });
  });

  // ===== QUOTE: single main items, base premiums + first-insurance + fee =====
  describe("quote — single main items (newcomer, plain)", () => {
    it("plain sword for a newcomer first insurance returns 115 G (100 base + 10 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        })
      ).toBe(115);
    });
    it("plain amulet for a newcomer first insurance returns 71 G (60 base + 6 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "amulet", material: "steel", enchantment: 3, cursed: false }],
        })
      ).toBe(71);
    });
    it("plain staff for a newcomer first insurance returns 93 G (80 base + 8 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "staff", material: "wood", enchantment: 3, cursed: false }],
        })
      ).toBe(93);
    });
    it("plain potion for a newcomer first insurance returns 49 G (40 base + 4 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        })
      ).toBe(49);
    });
  });

  // ===== QUOTE: components (runes, moonstones) =====
  describe("quote — components and building blocks", () => {
    it("2 runes for a newcomer return 60 G total (50 base + 5 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "rune" }, { type: "rune" }],
        })
      ).toBe(60);
    });
    it("3 runes for a newcomer return 71 G total (block discount: 60 base + 6 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        })
      ).toBe(71);
    });
    it("4 runes for a newcomer return 115 G total (100 base + 10 first-insurance + 5 fee, no block — block requires exactly 3)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        })
      ).toBe(115);
    });
    it("7 runes for a newcomer return 198 G total (7×25=175 base + 17.5 first-insurance + 5 fee = 197.5, rounded UP to 198)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        })
      ).toBe(198);
    });
    it("2 runes + 1 moonstone for a newcomer return 88 G total (no block - alike requires same type: 75 base + 7.5 first-insurance + 5 fee = 87.5 rounded up)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        })
      ).toBe(88);
    });
    it("3 runes + 3 moonstones for a newcomer return 137 G total (two separate blocks: 120 base + 12 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        })
      ).toBe(137);
    });
  });

  // ===== QUOTE: item-specific modifiers =====
  describe("quote — item-specific modifiers (cursed, high enchantment)", () => {
    it("cursed sword (enchantment 3) for newcomer returns 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        })
      ).toBe(165);
    });
    it("sword with exactly enchantment 5 returns 145 G for newcomer (100 base + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        })
      ).toBe(145);
    });
    it("sword with enchantment 4 returns 115 G for newcomer (no high-enchantment surcharge: 100 base + 10 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        })
      ).toBe(115);
    });
    it("cursed sword with enchantment 5 returns 195 G for newcomer (100 base + 50 curse + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        })
      ).toBe(195);
    });
  });

  // ===== QUOTE: modifier scope on multi-item policies =====
  describe("quote — modifier scope on multi-item policies", () => {
    it("policy with cursed sword + plain amulet returns 231 G for newcomer (100 sword + 50 curse + 60 amulet + 10 first-insurance sword + 6 first-insurance amulet + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "steel", enchantment: 3, cursed: false },
          ],
        })
      ).toBe(231);
    });
  });

  // ===== QUOTE: policy-wide modifiers (loyalty, first-insurance, follow-up) =====
  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years and plain sword (no previous contract) returns 95 G (100 base + 10 first-insurance - 20 loyalty + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 2, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        })
      ).toBe(95);
    });
    it("customer with 1 year and plain sword returns 115 G (no loyalty discount: 100 base + 10 first-insurance + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 1, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        })
      ).toBe(115);
    });
    it("customer with previousContract=true and plain sword returns 100 G (100 base + 10 first-insurance - 15 follow-up + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: true },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        })
      ).toBe(100);
    });
    it("customer with 5 years and previousContract=true with plain sword still pays first-insurance surcharge (10% per item) - returns 80 G (100 base + 10 first-insurance - 20 loyalty - 15 follow-up + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 5, previousContract: true },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        })
      ).toBe(80);
    });
  });

  // ===== QUOTE: rounding =====
  describe("quote — rounding", () => {
    it("premium calculation yielding 197.5 G rounds UP to 198 G (in MHPCO's favor)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        })
      ).toBe(198);
    });
    it("intermediate fractions retained until final rounding: 2 runes for 2-year loyalty + previousContract customer returns 43 G (50 base + 5 first-insurance - 10 loyalty - 7.5 follow-up + 5 fee = 42.5 ceil 43)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 2, previousContract: true },
          items: [{ type: "rune" }, { type: "rune" }],
        })
      ).toBe(43);
    });
  });

  // ===== QUOTE: integration examples =====
  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with cursed sword (steel, enchantment 3) → premium 165 G", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        })
      ).toBe(165);
    });
    it("3-year customer's second quote with cursed sword (steel, enchantment 7) → premium 160 G (100 base + 50 curse + 30 high-enchant − 20 loyalty + 10 first-insurance − 15 follow-up + 5 fee)", () => {
      expect(
        quote({
          customer: { yearsWithMHPCO: 3, previousContract: true },
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        })
      ).toBe(160);
    });
  });

  // ===== QUOTE: errors =====
  describe("quote — errors", () => {
    it("unknown item type (e.g. broomstick) throws / returns error", () => {
      expect(() =>
        quote({
          customer: { yearsWithMHPCO: 0, previousContract: false },
          items: [{ type: "broomstick" }],
        })
      ).toThrow();
    });
  });

  // ===== CLAIM: standard reimbursement =====
  describe("claim — standard reimbursement (no special clauses)", () => {
    it("regular sword (steel, enchantment 3) with damage 500 G → payout 400 G (500 − 100 deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 500 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (200 − 100 deductible)", () => {
      const policy = {
        items: [{ type: "rune" }],
        remainingCap: 500,
      };
      const result = claim(policy, { damages: [{ itemType: "rune", amount: 200 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(400);
    });
  });

  // ===== CLAIM: enchantment clause =====
  describe("claim — high-enchantment clause (≥8)", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then 100 deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 1000 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("steel sword, enchantment 8, damage 1000 G → payout 400 G (50% then 100 deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 1000 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
  });

  // ===== CLAIM: dragon material clause =====
  describe("claim — dragon material clause", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then 100 deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 800 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(700);
      expect(result.remainingCap).toBe(1300);
    });
  });

  // ===== CLAIM: dragon vs enchantment precedence =====
  describe("claim — dragon vs enchantment precedence (50% rule wins)", () => {
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both apply; 50% rule wins, then deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 1000 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
  });

  // ===== CLAIM: deductible per damage event =====
  describe("claim — deductible per damage event", () => {
    it("dragon attack damages sword (500 G) and amulet (300 G) on same policy → payout 600 G (deductible applies once per damaged item)", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "steel", enchantment: 3, cursed: false },
        ],
        remainingCap: 3200,
      };
      const result = claim(policy, {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(2600);
    });
  });

  // ===== CLAIM: multiple items of the same type =====
  describe("claim — multiple items of the same type", () => {
    it("policyCap for two swords returns 4000 G (insurance sum 2 × 1000 = 2000; cap 2 × 2000 = 4000)", () => {
      expect(policyCap([{ type: "sword" }, { type: "sword" }])).toBe(4000);
    });
    it("two sword damages on a policy with two swords → each is a separate damage with its own deductible", () => {
      const policy = {
        items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ],
        remainingCap: 4000,
      };
      const result = claim(policy, {
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 600 },
        ],
      }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(900);
      expect(result.remainingCap).toBe(3100);
    });
    it("more sword damages than insured swords → claim rejected (error)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      expect(() =>
        claim(policy, {
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        })
      ).toThrow();
    });
  });

  // ===== CLAIM: cap =====
  describe("claim — cap calculation and exhaustion", () => {
    it("policy with sword + amulet has insurance sum 1600 G and cap 3200 G", () => {
      expect(policyCap([{ type: "sword" }, { type: "amulet" }])).toBe(3200);
    });
    it("cursed sword (premium with modifiers 165 G) has cap 2000 G (based on unmodified insurance value)", () => {
      expect(policyCap([{ type: "sword", cursed: true } as { type: string }])).toBe(2000);
    });
    it("policy with sword + 3 runes has insurance sum 1750 G (block discount affects premium only)", () => {
      expect(policyCap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(3500);
    });
    it("sword insured (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 1500 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    });
    it("sword insured (cap 2000 G), after 1400 G payout (cap 600 remaining), second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 600,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 1500 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    });
  });

  // ===== CLAIM: rounding =====
  describe("claim — rounding", () => {
    it("payout calculation yielding 350.5 G rounds DOWN to 350 G (in MHPCO's favor)", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 901 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(350);
      expect(result.remainingCap).toBe(1650);
    });
  });

  // ===== CLAIM: errors =====
  describe("claim — errors", () => {
    it("claim references item not in policy (e.g. amulet damage on sword-only policy) → error", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      expect(() =>
        claim(policy, { damages: [{ itemType: "amulet", amount: 200 }] })
      ).toThrow();
    });
    it("claim references an unknown item type → error", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      expect(() =>
        claim(policy, { damages: [{ itemType: "broomstick", amount: 100 }] })
      ).toThrow();
    });
    it("claim contains a damage entry with negative amount → error", () => {
      const policy = {
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        remainingCap: 2000,
      };
      expect(() =>
        claim(policy, { damages: [{ itemType: "sword", amount: -200 }] })
      ).toThrow();
    });
  });

  // ===== Integration: claim on dragon sword with enchantment threshold =====
  describe("claim — combined scenarios from spec", () => {
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
      const policy = {
        items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        remainingCap: 2000,
      };
      const result = claim(policy, { damages: [{ itemType: "sword", amount: 1000 }] }) as { payout: number; remainingCap: number };
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
  });
});

import { spawnSync } from "node:child_process";

describe("CLI (claim-office)", () => {
  // ===== CLI: basic quote scenarios =====
  it("processes a single quote step and writes results array with one premium", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("processes a scenario with quote followed by claim and writes results in same order", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("claim step references a prior quote via policy index (zero-based)", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
  it("processes the schema example (5-year customer, amulet, then claim) producing premium and payout/remainingCap", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  // ===== CLI: errors =====
  it("quote with unknown item type → exits non-zero, writes error to stderr, no results to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim referencing item not in policy → exits non-zero, writes error to stderr", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with negative damage amount → exits non-zero, writes error to stderr", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with more damages of a type than insured items → exits non-zero, whole claim rejected", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("payout");
  });

  // ===== CLI: multi-step scenarios =====
  it("scenario with two successive claims tracks remainingCap across claims", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("scenario with multiple quote steps treats second quote as follow-up contract with 15% discount", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input,
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results[0]).toEqual({ premium: 95 });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
});
