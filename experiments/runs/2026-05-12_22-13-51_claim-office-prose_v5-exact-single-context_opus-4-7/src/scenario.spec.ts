import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("MHPCO scenario runner", () => {
  it("returns no results for an empty steps list", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    expect(output).toEqual({ results: [] });
  });
  it("quotes a single plain sword for a brand-new customer", () => {
    // Sword base 100G; new customer (0 years, first contract):
    //   100 × 1.10 (first-contract surcharge) = 110, + 5G processing fee = 115G.
    const output = runScenario({
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
  it("applies the 50% cursed surcharge to a quote", () => {
    // Cursed sword: 100 × 1.5 (cursed) × 1.10 (first contract) = 165, + 5G fee = 170G.
    const output = runScenario({
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
  it("applies the 30% high-enchantment surcharge (level >= 5)", () => {
    // Sword ench 5: 100 × 1.30 × 1.10 = 143, + 5G fee = 148G.
    const output = runScenario({
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
  it("applies the 20% loyalty discount for long-standing customers (>= 2 years)", () => {
    // Sword, 5-year customer, first contract:
    //   100 × 0.80 (loyalty) = 80, × 1.10 (first contract) = 88, + 5G fee = 93G.
    const output = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies the 15% returning-contract discount instead of the first-contract surcharge on later quotes", () => {
    // Two sword quotes for a new (0y) customer:
    //   #1 (first contract): 100 × 1.10 + 5 = 115G.
    //   #2 (returning):      100 × 0.85 + 5 = 90G.
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });
  it("sums per-item premiums when quoting multiple items", () => {
    // Sword 100 + amulet 60 + staff 80 + potion 40 = 280; × 1.10 = 308, + 5 = 313G.
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            { type: "staff", material: "oak", enchantment: 0, cursed: false },
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 313 }] });
  });
  it("offers the 60G block premium for three alike components", () => {
    // Three alike components form a block at 60G base premium (vs. 3×25=75G):
    //   60 × 1.10 + 5 = 71G.
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 0,
      cursed: false,
    };
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [rune, rune, rune] },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("pays 0 on a claim against an ordinary item (no reimbursement rule applies)", () => {
    // Ordinary amulet (silver, ench 2): no reimbursement rule triggers → payout 0,
    // cap unchanged at 2×600 = 1200G.
    const output = runScenario({
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
    });
    expect(output).toEqual({
      results: [
        { premium: 58 },
        { payout: 0, remainingCap: 1200 },
      ],
    });
  });
  it("fully reimburses damage to a dragon-material item, minus the 100G deductible", () => {
    // Dragon sword (insurance 1000, cap 2000); damage 500G fully reimbursed:
    //   payout = 500 - 100 = 400, remainingCap = 2000 - 400 = 1600.
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("reimburses 50% of damage to a highly enchanted item (level >= 8), minus the 100G deductible", () => {
    // Sword ench 8 (non-cursed): premium 100 × 1.30 × 1.10 + 5 = 148G.
    // Claim damage 500G → 50% = 250, minus 100 deductible = 150 payout.
    // Cap: 2 × 1000 = 2000; remainingCap = 2000 - 150 = 1850.
    const output = runScenario({
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
            cause: "spell mishap",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 148 },
        { payout: 150, remainingCap: 1850 },
      ],
    });
  });
  it("caps total payouts at twice the insurance sum across successive claims", () => {
    // Dragon amulet (insurance 600, cap 2×600 = 1200); 5-year customer, first contract:
    //   premium = 60 × 0.80 (loyalty) × 1.10 (first contract) ceiled = 53, + 5 = 58G.
    // Claim 1: damage 800 → after 100G deductible = 700; payout 700, remainingCap 500.
    // Claim 2: damage 800 → after deductible 700; capped at remaining 500; remainingCap 0.
    // Claim 3: damage 200 → after deductible 100; capped at 0; remainingCap 0.
    const output = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "dragon", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 800 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "amulet", amount: 800 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 58 },
        { payout: 700, remainingCap: 500 },
        { payout: 500, remainingCap: 0 },
        { payout: 0, remainingCap: 0 },
      ],
    });
  });
});

import { spawnSync } from "node:child_process";

describe("claim-office CLI", () => {
  it("reads a scenario JSON from stdin and writes the results JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 115 }],
    });
  });
});
