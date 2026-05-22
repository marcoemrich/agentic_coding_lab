import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { run } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — single item base premium
  it("quotes a sword for a first-time customer (base + first-insurance + fee)", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes an amulet for a first-time customer", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a staff for a first-time customer", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a potion for a first-time customer", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes a single component (rune) at component base premium", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });

  // Components grouping
  it("quotes three alike components as a block at the 60 G special premium", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes four alike components as one block of three plus one single", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 99 }] });
  });

  // Modifiers
  it("adds a 50% surcharge for cursed items", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds a 30% surcharge for highly enchanted items (level >= 5)", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 148 }] });
  });
  it("applies a 20% loyalty discount for long-standing customers (>= 2 years)", () => {
    const output = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies a 15% subsequent-contract discount on the second quote (no first-insurance surcharge)", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });
  it("rounds the final premium up in MHPCO's favor", () => {
    const output = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 28 }] });
  });

  // Claim
  it("pays out a regular claim minus the 100 G deductible after applying it", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 71 }, { payout: 100 }],
    });
  });
  it("reimburses damage to highly enchanted items (level >= 8) at 50%", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 148 }, { payout: 100 }],
    });
  });
  it("fully reimburses damage to items made of dragon material", () => {
    const output = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 148 }, { payout: 400 }],
    });
  });

  // CLI integration (multi-step)
  it("processes a scenario of a quote followed by a claim end-to-end", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toEqual({
      results: [{ premium: 59 }, { payout: 100 }],
    });
  });
});
