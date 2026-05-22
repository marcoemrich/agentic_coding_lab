import { describe, it, expect } from "vitest";
import { claimOffice } from "./claim-office.js";

describe("Claim Office", () => {
  // ─── Quote: Empty / Single Item Base Premiums ─────────────────────

  it("should return premium 5 G for an empty item list — only the processing fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it("should return premium 115 G for a single plain sword — 100 G base + 10 G first insurance + 5 G fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return premium 71 G for a single plain amulet — 60 G base + 6 G first insurance + 5 G fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  it("should return premium 93 G for a single plain staff — 80 G base + 8 G first insurance + 5 G fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "staff", material: "oak", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  it("should return premium 49 G for a single plain potion — 40 G base + 4 G first insurance + 5 G fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // ─── Quote: Component Base Premiums ───────────────────────────────

  it("should return premium 60 G for 2 runes — 50 G base (2 x 25 G) + 5 G first insurance + 5 G fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  it("should return premium 73 G for 3 runes — 60 G base (block of 3 alike) + 7.5 G first insurance (10% of 75 G raw base) + 5 G fee = 72.5 -> 73 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 73 }] });
  });

  it("should return premium 115 G for 4 runes — 100 G base (4 x 25 G, no block) + 10 G first insurance + 5 G fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should return premium 198 G for 7 runes — 175 G base (7 x 25 G, no block) + 17.5 G first insurance + 5 G fee = 197.5 -> 198 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // ─── Quote: "Alike" Components (different types) ──────────────────

  it("should return premium 88 G for 2 runes + 1 moonstone — 75 G base (no block: different types) + 7.5 G first insurance + 5 G fee = 87.5 -> 88 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  it("should return premium 140 G for 3 runes + 3 moonstones — 120 G base (two separate blocks) + 15 G first insurance (10% of 150 G raw base) + 5 G fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 140 }] });
  });

  // ─── Quote: Item-Level Modifiers ──────────────────────────────────

  it("should apply 50% cursed surcharge to the cursed item only — cursed sword (100 + 50 = 150 G) + 10 G first insurance + 5 G fee = 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it("should apply 30% high-enchantment surcharge for enchantment >= 5 — sword enchantment 5: 100 + 30 = 130 G + 10 G first insurance + 5 G fee = 145 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  it("should not apply high-enchantment surcharge for enchantment 4 — sword enchantment 4: 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should apply both cursed and high-enchantment surcharges — cursed sword enchantment 5: 100 + 50 + 30 = 180 G + 10 G first insurance + 5 G fee = 195 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // ─── Quote: Modifier Scope on Multi-Item Policies ─────────────────

  it("should apply cursed surcharge only to the cursed item in a multi-item policy — cursed sword (150 G) + plain amulet (60 G) = 210 G + 16 G first insurance (10% of 160 G policy base) + 5 G fee = 231 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // ─── Quote: Policy-Level Modifiers ────────────────────────────────

  it("should apply 20% loyalty discount for customer with >= 2 years — sword: 100 G - 20 G loyalty + 10 G first insurance + 5 G fee = 95 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("should apply loyalty discount for customer with exactly 2 years — threshold is >= 2", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  it("should apply 10% first insurance surcharge — every item in a quote is treated as first insurance", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("should apply 15% follow-up contract discount on second quote — sword on second quote: 100 G base + 10 G first insurance - 15 G follow-up + 5 G fee = 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // ─── Quote: Integration — Newcomer with Cursed Sword ──────────────

  it("should return premium 165 G for newcomer (0 years, no previous contract) with cursed sword — 100 base + 50 curse + 10 first insurance = 160 + 5 fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // ─── Quote: Integration — Long-Standing Customer's Second Contract ─

  it("should return premium 160 G for long-standing customer (3 years, second quote) with cursed sword enchantment 7 — 100 base + 50 curse + 30 enchant - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // ─── Quote: Rounding Premiums Up ──────────────────────────────────

  it("should round premium UP in MHPCO's favor — a calculation yielding 197.5 G results in 198 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // ─── Quote: Insurance Sum and Cap ─────────────────────────────────

  it("should compute insurance sum 2000 G and cap 4000 G for two swords", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 225 },
        { payout: 400, remainingCap: 3600 },
      ],
    });
  });

  it("should compute insurance sum 1600 G and cap 3200 G for a sword and an amulet", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 100, remainingCap: 3100 },
      ],
    });
  });

  it("should compute cap from unmodified insurance value — cursed sword: cap 2000 G (not affected by premium modifiers)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 165 },
        { payout: 100, remainingCap: 1900 },
      ],
    });
  });

  it("should compute insurance sum 1750 G for a sword and 3 runes (block) — block discount affects premium only, not insurance sum", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 183 },
        { payout: 100, remainingCap: 3400 },
      ],
    });
  });

  // ─── Claim: Standard Reimbursement ────────────────────────────────

  it("should return payout 400 G for regular sword (steel, enchantment 3) with 500 G damage — full reimbursement minus 100 G deductible", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it("should return payout 100 G for rune with 200 G damage — full reimbursement minus 100 G deductible", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  // ─── Claim: High-Enchantment Clause ───────────────────────────────

  it("should return payout 400 G for steel sword enchantment 9, damage 1000 G — 50% of 1000 = 500 minus 100 deductible", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // ─── Claim: Dragon Material Clause ────────────────────────────────

  it("should return payout 700 G for dragon-material sword enchantment 5, damage 800 G — dragon clause: full reimbursement 800 minus 100 deductible", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });

  // ─── Claim: Both Clauses — 50% Rule Wins ──────────────────────────

  it("should return payout 400 G for dragon-material sword enchantment 9, damage 1000 G — both clauses: 50% wins (500 - 100)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  it("should return payout 400 G for dragon-material sword enchantment 8, damage 1000 G — enchantment >= 8 triggers 50% rule even with dragon material", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // ─── Claim: Deductible per Damaged Item ───────────────────────────

  it("should return payout 600 G when dragon attack damages sword (500 G) and amulet (300 G) — deductible applies once per damaged item: (500 - 100) + (300 - 100)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });

  // ─── Claim: Multiple Items of Same Type ───────────────────────────

  it("should handle two swords in policy — two sword damage entries each get separate deductible", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 225 },
        { payout: 700, remainingCap: 3300 },
      ],
    });
  });

  // ─── Claim: Cap Exhaustion ────────────────────────────────────────

  it("should return payout 1400 G on first claim of 1500 G for insured sword (cap 2000 G) — remaining cap 600 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
      ],
    });
  });

  it("should return payout 600 G on second claim of 1500 G after first claim used 1400 G — remaining cap 0 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // ─── Claim: Rounding Payouts Down ─────────────────────────────────

  it("should round payout DOWN in MHPCO's favor — a calculation yielding 350.5 G results in 350 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    const result = claimOffice(input);
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });

  // ─── Edge Cases: Error Handling ───────────────────────────────────

  it("should exit non-zero for unknown item type in quote — e.g. type 'broomstick'", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    expect(() => claimOffice(input)).toThrow();
  });

  it("should exit non-zero when claim references item not in policy — e.g. amulet damaged but only sword insured", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: {
          cause: "fire",
          damages: [{ itemType: "amulet", amount: 200 }]
        }}
      ]
    };
    expect(() => claimOffice(input)).toThrow();
  });

  it("should exit non-zero for negative damage amount in claim — e.g. amount: -200", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: -200 }]
        }}
      ]
    };
    expect(() => claimOffice(input)).toThrow();
  });

  it("should exit non-zero when damages array has more entries of a type than policy covers — e.g. two sword damages but only one sword insured", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: {
          cause: "fire",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 }
          ]
        }}
      ]
    };
    expect(() => claimOffice(input)).toThrow();
  });
});
