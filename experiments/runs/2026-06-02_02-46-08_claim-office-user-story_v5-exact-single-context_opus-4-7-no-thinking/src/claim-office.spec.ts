import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runScenario } from "./claim-office.js";

const cliPath = join(dirname(fileURLToPath(import.meta.url)), "cli.ts");

const runCli = (input: object): unknown => {
  const stdout = execFileSync("npx", ["tsx", cliPath], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return JSON.parse(stdout);
};

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should quote a sword for a new customer (base premium + processing fee + 10% first insurance surcharge)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should quote an amulet for a new customer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should quote a staff for a new customer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should quote a potion for a new customer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should quote a single component (rune) at 25 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should quote a single moonstone component", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "moonstone", material: "stone", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should quote 3 alike components as a building block at 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should quote multiple items by summing base premiums", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("should add 50% risk surcharge for cursed items", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("should add 30% risk surcharge for highly enchanted items (enchantment >= 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should apply 15% discount on contracts after the first", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
    it("should round amounts up in MHPCO's favor (whole G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 41 }] });
    });
  });

  describe("Processing a claim", () => {
    it("should pay out damage minus 100 G deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 200, remainingCap: 1800 },
        ],
      });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "potion", amount: 1000 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
    });
    it("should reimburse damage to highly enchanted items (>= 8) at 50%", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 400 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
    });
    it("should report remaining cap after each claim", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
      expect(result.results[2]).toEqual({ payout: 150, remainingCap: 950 });
    });
  });

  describe("CLI scenario processing", () => {
    it("should process schema example 1 (quote only) and produce a results array", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should process schema example 2 (quote followed by two claims)", () => {
      const result = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] },
          },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 58 },
          { payout: 100, remainingCap: 1100 },
          { payout: 150, remainingCap: 950 },
        ],
      });
    });
  });
});
