import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

/** Runs the `claim-office` CLI end to end, piping the scenario through stdin. */
const runCli = (scenario: unknown): unknown =>
  JSON.parse(
    execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    }),
  );

describe("MHPCO Claim Office", () => {
  // --- Quote: base price list, single main item, no modifiers ---
  it("quotes a plain sword for a new customer — base 100 G +10 % first insurance +5 G fee = 115 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet for a new customer — base 60 G +10 % +5 G = 71 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff for a new customer — base 80 G +10 % +5 G = 93 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion for a new customer — base 40 G +10 % +5 G = 49 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components ---
  it("quotes a single rune — base 25 G +10 % +5 G = 33 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune", material: "stone", enchantment: 1, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a single moonstone — base 25 G +10 % +5 G = 33 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "moonstone", material: "moonstone", enchantment: 0, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes two alike components separately — base 50 G +10 % +5 G = 60 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 1, cursed: false },
              { type: "rune", material: "stone", enchantment: 1, cursed: false },
            ],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes a building block of 3 alike runes at the special base premium 60 G — +10 % +5 G = 71 G", () => {
    expect(
      runScenario({
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
      }),
    ).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 alike runes as one building block plus one single — base 60+25=85 G +10 % +5 G = 99 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [rune, rune, rune, rune] }],
      }),
    ).toEqual({ results: [{ premium: 99 }] });
  });
  it("does not form a building block from 3 unalike components (2 runes + 1 moonstone) — base 75 G +10 % +5 G = 88 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    const moonstone = { type: "moonstone", material: "moonstone", enchantment: 0, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [rune, rune, moonstone] }],
      }),
    ).toEqual({ results: [{ premium: 88 }] });
  });

  // --- Quote: multiple items ---
  it("sums base premiums of several main items — sword + potion = 140 G +10 % +5 G = 159 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 159 }] });
  });
  it("quotes an empty item list — 0 G base +10 % +5 G = 5 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      }),
    ).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Quote: risk surcharges ---
  it("adds a 50 % risk surcharge for a cursed sword — 150 G +10 % +5 G = 170 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: true }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds a 30 % risk surcharge for a highly enchanted sword (enchantment 5) — 130 G +10 % +5 G = 148 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 148 }] });
  });
  it("does not add the enchantment surcharge below level 5 (enchantment 4) — 100 G +10 % +5 G = 115 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("combines cursed and high-enchantment surcharges on one item — 100 G × 1.5 × 1.3 = 195 G +10 % +5 G = 220 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 220 }] });
  });
  it("applies surcharges per item, not to the whole quote — cursed sword + plain potion = 190 G +10 % +5 G = 214 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: true },
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 214 }] });
  });

  // --- Quote: customer modifiers ---
  it("grants a 20 % loyalty discount to a customer of 2 years — sword 100 G ×0.8 ×1.1 +5 G = 93 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 93 }] });
  });
  it("grants no loyalty discount below 2 years (1 year) — 100 G ×1.1 +5 G = 115 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies a 15 % contract discount to the second quote — sword 100 G ×0.85 +5 G = 90 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
  it("applies the 15 % contract discount to every quote after the first, and the 10 % first-insurance surcharge only to the first", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }, { premium: 90 }, { premium: 90 }] });
  });
  it("combines loyalty and contract discount on a loyal customer's second quote — 100 G ×0.8 ×0.85 +5 G = 73 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      }),
    ).toEqual({ results: [{ premium: 93 }, { premium: 73 }] });
  });

  // --- Quote: rounding ---
  it("rounds the premium up to whole G in MHPCO's favour — amulet at 2 years: 60 ×0.8 ×1.1 = 52.8 → 53 +5 G = 58 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 58 }] });
  });

  // --- Claim: basics ---
  it("pays a claim minus the 100 G deductible — 300 G damage on a plain amulet pays 200 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 58 }, { payout: 200, remainingCap: 1000 }] });
  });
  it("pays nothing when the damage does not exceed the deductible — 100 G damage pays 0 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "scuff", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 58 }, { payout: 0, remainingCap: 1200 }] });
  });
  it("applies the deductible once per damage event, not per damaged item — two 200 G damages in one incident pay 300 G", () => {
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [amulet, amulet] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "collapse",
              damages: [
                { itemType: "amulet", amount: 200 },
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 111 }, { payout: 300, remainingCap: 2100 }] });
  });
  it("carries the remaining cap across successive claims on the same policy — 1200 G cap, then 1000 G, then 850 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] },
          },
        ],
      }),
    ).toEqual({
      results: [
        { premium: 58 },
        { payout: 200, remainingCap: 1000 },
        { payout: 150, remainingCap: 850 },
      ],
    });
  });

  // --- Claim: reimbursement rates ---
  it("reimburses damage to an item with enchantment 8 at 50 % — 500 G damage → 250 G, minus 100 G deductible = 150 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "backfire", damages: [{ itemType: "staff", amount: 500 }] },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 120 }, { payout: 150, remainingCap: 1450 }] });
  });
  it("reimburses damage to an item with enchantment 7 in full — 500 G damage minus 100 G = 400 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 7, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "backfire", damages: [{ itemType: "staff", amount: 500 }] },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 120 }, { payout: 400, remainingCap: 1200 }] });
  });
  it("fully reimburses damage to an item of dragon material even at enchantment 8 — 500 G damage minus 100 G = 400 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "dragon", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "backfire", damages: [{ itemType: "staff", amount: 500 }] },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 120 }, { payout: 400, remainingCap: 1200 }] });
  });

  // --- Claim: cap ---
  it("caps the payout at twice the insurance sum — sword policy cap 2000 G, 2500 G damage pays 2000 G, remainingCap 0 G", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon fire", damages: [{ itemType: "sword", amount: 2500 }] },
          },
        ],
      }),
    ).toEqual({ results: [{ premium: 115 }, { payout: 2000, remainingCap: 0 }] });
  });
  it("caps the payout across several claims on the same policy and reports the shrinking remainingCap", () => {
    const claimOf600 = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "mishap", damages: [{ itemType: "potion", amount: 600 }] },
    };
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          claimOf600,
          claimOf600,
          claimOf600,
        ],
      }),
    ).toEqual({
      results: [
        { premium: 49 },
        { payout: 500, remainingCap: 300 },
        { payout: 300, remainingCap: 0 },
        { payout: 0, remainingCap: 0 },
      ],
    });
  });
  it("pays 0 G once the policy cap is exhausted", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "shattering", damages: [{ itemType: "potion", amount: 900 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spillage", damages: [{ itemType: "potion", amount: 500 }] },
          },
        ],
      }),
    ).toEqual({
      results: [{ premium: 49 }, { payout: 800, remainingCap: 0 }, { payout: 0, remainingCap: 0 }],
    });
  });

  // --- Scenario / CLI integration ---
  it("processes a scenario of quote then claim, returning one result per step in order", () => {
    expect(
      runCli({
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
      }),
    ).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  }, 30000);
  it("routes a claim to the policy named by its zero-based step index", () => {
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            policy: 1,
            incident: { cause: "spillage", damages: [{ itemType: "potion", amount: 300 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "duel", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      }),
    ).toEqual({
      results: [
        { premium: 115 },
        { premium: 39 },
        { payout: 200, remainingCap: 600 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
});
