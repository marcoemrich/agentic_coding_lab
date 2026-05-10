import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - empty and processing fee", () => {
    it("should return 5 G premium for an empty items list (processing fee only)", () => {
      const result = quote({ customer: { yearsWithMHPCO: 0, priorContracts: 0 }, items: [] });
      expect(result).toEqual({ premium: 5 });
    });
  });

  describe("quote - single item base premiums", () => {
    it("should return 105 G for a single plain sword (100 base + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 105 });
    });
    it("should return 65 G for a single plain amulet (60 base + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 65 });
    });
    it("should return 85 G for a single plain staff (80 base + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 85 });
    });
    it("should return 45 G for a single plain potion (40 base + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 45 });
    });
    it("should return 30 G for a single rune component (25 base + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "component", componentType: "rune" }],
      });
      expect(result).toEqual({ premium: 30 });
    });
  });

  describe("quote - component blocks of 3 alike", () => {
    it("should return 55 G for 2 runes (50 base + 5 fee, no block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
        ],
      });
      expect(result).toEqual({ premium: 55 });
    });
    it("should return 65 G for 3 runes (60 base block discount + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
        ],
      });
      expect(result).toEqual({ premium: 65 });
    });
    it("should return 105 G for 4 runes (100 base, no block since not exactly 3 + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
        ],
      });
      expect(result).toEqual({ premium: 105 });
    });
    it("should return 180 G for 7 runes (175 base + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
        ],
      });
      expect(result).toEqual({ premium: 180 });
    });
    it("should return 80 G for 2 runes + 1 moonstone (75 base, no block due to different types + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "moonstone" },
        ],
      });
      expect(result).toEqual({ premium: 80 });
    });
    it("should return 125 G for 3 runes + 3 moonstones (120 base, two separate blocks + 5 fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "rune" },
          { type: "component", componentType: "moonstone" },
          { type: "component", componentType: "moonstone" },
          { type: "component", componentType: "moonstone" },
        ],
      });
      expect(result).toEqual({ premium: 125 });
    });
  });

  describe("quote - item-specific modifiers", () => {
    it("should add 50% curse surcharge to a cursed sword's base premium", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      });
      expect(result).toEqual({ premium: 155 });
    });
    it("should add 30% high-enchantment surcharge for sword with enchantment exactly 5", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      });
      expect(result).toEqual({ premium: 135 });
    });
    it("should not add high-enchantment surcharge for sword with enchantment 4", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      });
      expect(result).toEqual({ premium: 105 });
    });
    it("should add both curse and high-enchantment surcharges to a cursed highly enchanted sword", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      });
      expect(result).toEqual({ premium: 185 });
    });
  });

  describe("quote - policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for customer with exactly 2 years with MHPCO", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 2, priorContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 85 });
    });
    it("should not apply loyalty discount for customer with less than 2 years", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1, priorContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 105 });
    });
    it("should add 10% first insurance surcharge per item base premium", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0, firstInsurance: true },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 115 });
    });
    it("should apply 15% follow-up contract discount on second contract", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 90 });
    });
  });

  describe("quote - modifier scope on multi-item policies", () => {
    it("should apply curse surcharge only to the cursed item, not to the policy total (cursed sword + plain amulet → 210 G before fee)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      });
      expect(result).toEqual({ premium: 215 });
    });
    it("should still apply first-insurance surcharge per item even on follow-up contract", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 1, firstInsurance: true },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      });
      expect(result).toEqual({ premium: 100 });
    });
  });

  describe("quote - integration examples", () => {
    it("should compute 165 G for newcomer (0 years, no prior) with cursed steel sword enchantment 3", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0, firstInsurance: true },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      });
      expect(result).toEqual({ premium: 165 });
    });
    it("should compute 160 G for 3-year customer's second contract with cursed steel sword enchantment 7", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 3, priorContracts: 1, firstInsurance: true },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      });
      expect(result).toEqual({ premium: 160 });
    });
  });

  describe("quote - rounding", () => {
    it("should round premium up in MHPCO favor (e.g. 197.5 G → 198 G)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 0, firstInsurance: true },
        items: [{ type: "component", componentType: "rune" }],
      });
      expect(result).toEqual({ premium: 33 });
    });
    it("should keep intermediate amounts as fractions and round only the final premium", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0, priorContracts: 1, firstInsurance: true },
        items: [{ type: "component", componentType: "rune" }],
      });
      expect(result).toEqual({ premium: 29 });
    });
  });

  describe("claim - basic single-item reimbursement", () => {
    it("should pay 400 G for standard steel sword enchantment 3 with 500 G damage (full minus 100 deductible)", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay 100 G for a rune with 200 G damage (full minus 100 deductible)", () => {
      const result = claim(
        {
          items: [{ type: "component", componentType: "rune" }],
        },
        { cause: "fire", damages: [{ itemType: "component", componentType: "rune", amount: 200 }] },
      );
      expect(result).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("should report remaining cap after a basic claim (sword cap 2000, claim 500 → remaining 1600)", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim - high enchantment clause", () => {
    it("should reimburse at 50% then deductible for steel sword enchantment 9 with 1000 G damage → payout 400 G", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply high-enchantment 50% rule at exactly enchantment 8", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim - dragon material clause", () => {
    it("should fully reimburse dragon-material sword enchantment 5 with 800 G damage → payout 700 G", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
      );
      expect(result).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should let 50% rule win for dragon sword enchantment 9 with 1000 G damage → payout 400 G", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
      );
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim - multiple items / deductible per event", () => {
    it("should apply deductible once per damaged item (sword 500 + amulet 300 → payout 600 G)", () => {
      const result = claim(
        {
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          cause: "fire",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      );
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should treat two same-type damages as separate events with own deductibles", () => {
      const result = claim(
        {
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          cause: "fire",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        },
      );
      expect(result).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("should reject claim when damages contain more entries of a type than insured", () => {
      expect(() =>
        claim(
          {
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        ),
      ).toThrow();
    });
  });

  describe("claim - cap exhaustion", () => {
    it("should cap a single claim at 2x insurance value (sword cap 2000, damage 1500 → payout 1400, remaining 600)", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      );
      expect(result).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("should reduce later claims to remaining cap (second 1500 G claim → payout 600, remaining 0)", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          remainingCap: 600,
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      );
      expect(result).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should base cap on unmodified insurance value, not on premium modifiers (cursed sword cap = 2000)", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          remainingCap: 600,
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      );
      expect(result).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should compute insurance sum from item insurance values, ignoring component block discount on cap (sword + 3 runes → cap 3500)", () => {
      const result = claim(
        {
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "component", componentType: "rune", enchantment: 0, cursed: false },
            { type: "component", componentType: "rune", enchantment: 0, cursed: false },
            { type: "component", componentType: "rune", enchantment: 0, cursed: false },
          ],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
      );
      expect(result).toEqual({ payout: 100, remainingCap: 3400 });
    });
  });

  describe("claim - error cases", () => {
    it("should reject claim where damaged item type is not part of the policy", () => {
      expect(() =>
        claim(
          { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
        ),
      ).toThrow();
    });
    it("should reject claim with negative damage amount", () => {
      expect(() =>
        claim(
          { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        ),
      ).toThrow();
    });
  });

  describe("claim - rounding", () => {
    it("should round payout down in MHPCO favor (e.g. 350.5 G → 350 G)", () => {
      const result = claim(
        {
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
      );
      expect(result).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("CLI - JSON in/out", () => {
    it("should read scenario JSON from stdin and write results JSON to stdout", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output).toEqual({ results: [] });
    });
    it("should produce a quote result with {premium} for a quote step", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output).toEqual({ results: [{ premium: 105 }] });
    });
    it("should produce a claim result with {payout, remainingCap} for a claim step", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
          {
            type: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output).toEqual({ results: [{ premium: 105 }, { payout: 400, remainingCap: 1600 }] });
    });
    it("should process steps sequentially and reference policies by step index", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
          {
            type: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            type: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output).toEqual({
        results: [
          { premium: 105 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
    it("should track customer history (yearsWithMHPCO, follow-up contract) across scenario steps", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 3, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output).toEqual({ results: [{ premium: 85 }, { premium: 70 }] });
    });
    it("should exit non-zero and write to stderr for an unknown item type in a quote", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "broomstick", material: "steel", enchantment: 0, cursed: false }],
            },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("should exit non-zero and write to stderr for a claim referencing an item not in the policy", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
          {
            type: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("should exit non-zero and write to stderr for a claim with negative damage amount", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
          {
            type: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
    it("should exit non-zero when claim has more damages of a type than insured", () => {
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0, priorContracts: 0 },
        steps: [
          {
            type: "quote",
            policy: {
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      });
      const result = spawnSync("npx", ["tsx", cliPath], { input, encoding: "utf8" });
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
    });
  });
});
