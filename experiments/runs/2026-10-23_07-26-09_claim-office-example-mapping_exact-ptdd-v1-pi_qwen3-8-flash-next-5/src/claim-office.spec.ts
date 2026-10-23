import { describe, expect, it } from "vitest";
import { basePremium, quotePremium } from "./premium.js";
import { execute } from "./cli.js";

describe("claim-office", () => {
  // Group A - component building-block base premium (basePremium)
  it("2 runes -> base premium 50 G (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> base premium 60 G (block of 3 applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> base premium 100 G (no block, requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes -> base premium 175 G (no block)", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("2 runes + 1 moonstone -> base premium 75 G (alike means exact type, no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -> base premium 120 G (two separate blocks)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(basePremium(items)).toBe(120);
  });

  // Group B - item catalog base premiums for staff and potion (quotePremium)
  it("staff plain, newcomer -> premium 93 G (base 80 + 10% first insurance 8 + fee 5)", () => {
    expect(quotePremium({ items: [{ type: "staff" }], yearsWithMHPCO: 0, followUpContract: false })).toBe(93);
  });
  it("potion plain, newcomer -> premium 49 G (base 40 + 10% first insurance 4 + fee 5)", () => {
    expect(quotePremium({ items: [{ type: "potion" }], yearsWithMHPCO: 0, followUpContract: false })).toBe(49);
  });

  // Group C - premium modifiers and thresholds (quotePremium)
  it("loyalty threshold: plain sword, exactly 2 years -> premium 95 G (100 + 10% first - 20% loyalty + 5 fee)", () => {
    expect(quotePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 2, followUpContract: false })).toBe(95);
  });
  it("no loyalty at 1 year: plain sword, 1 year -> premium 115 G (100 + 10% first + 5 fee)", () => {
    expect(quotePremium({ items: [{ type: "sword" }], yearsWithMHPCO: 1, followUpContract: false })).toBe(115);
  });
  it("high-ench threshold: cursed steel sword enchantment 5, newcomer -> premium 195 G (both surcharges apply)", () => {
    expect(quotePremium({ items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }], yearsWithMHPCO: 0, followUpContract: false })).toBe(195);
  });
  it("no high-ench at enchantment 4: plain steel sword e4, newcomer -> premium 115 G (no high-ench surcharge)", () => {
    expect(quotePremium({ items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }], yearsWithMHPCO: 0, followUpContract: false })).toBe(115);
  });
  it("cursed surcharge is item-scoped: cursed sword + plain amulet, newcomer -> premium 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quotePremium({ items, yearsWithMHPCO: 0, followUpContract: false })).toBe(231);
  });
  it("rounding premium up: cursed steel sword e5 + 1 rune, 2 years, first quote -> premium 198 G (197.5 rounds up)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: true }, { type: "rune" }];
    expect(quotePremium({ items, yearsWithMHPCO: 2, followUpContract: false })).toBe(198);
  });

  // Group D - claim reimbursement rules (execute)
  it("standard reimbursement: steel sword e3 damage 500 -> payout 400 (full minus 100 deductible)", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
  });
  it("rune has no enchantment/material clause: rune damage 200 -> payout 100 (full minus 100 deductible)", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(out.results[0].payout).toBeUndefined();
    expect(out.results[1].payout).toBe(100);
  });
  it("high-ench threshold: dragon sword e8 damage 1000 -> payout 400 (50% then deductible)", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
  });
  it("50% wins over dragon: dragon sword e9 damage 1000 -> payout 400 (500 - 100)", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
  });
  it("dragon only: dragon sword e5 damage 800 -> payout 700 (full minus 100)", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(700);
  });
  it("high-ench only (steel): steel sword e9 damage 1000 -> payout 400 (500 - 100)", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
  });
  it("rounding payout down: steel sword e9 damage 901 -> payout 350 (350.5 rounds down)", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(350);
  });
  it("deductible per damage event: dragon attack sword 500 + amulet 300 -> payout 600", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "amulet", material: "silver", enchantment: 2 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(600);
  });
  it("two sword damage entries each own deductible: two swords, damages two 500 -> payout 800", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(800);
  });
  it("more damage entries than insured of a type -> non-zero exit code", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.exitCode).not.toBe(0);
  });

  // Group E - insurance sum and cap (execute)
  it("two swords insurance sum 2000 cap 4000: one sword damage 500 -> payout 400 remainingCap 3600", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
    expect(out.results[1].remainingCap).toBe(3600);
  });
  it("premium modifiers do not raise cap: cursed sword damage 500 -> payout 400 remainingCap 1600", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
    expect(out.results[1].remainingCap).toBe(1600);
  });
  it("block discount affects premium not sum: sword + 3 runes (sum 1750 cap 3500) sword damage 500 -> payout 400 remainingCap 3100", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
    expect(out.results[1].remainingCap).toBe(3100);
  });
  it("rune insurance value 250: single rune damage 300 -> payout 200 remainingCap 300", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 300 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(200);
    expect(out.results[1].remainingCap).toBe(300);
  });
  it("moonstone insurance value 250: single moonstone damage 300 -> payout 200 remainingCap 300", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "moonstone", amount: 300 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(200);
    expect(out.results[1].remainingCap).toBe(300);
  });
  it("staff insurance value 800: staff damage 500 -> payout 400 remainingCap 1200", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "wood", enchantment: 1 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "staff", amount: 500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(400);
    expect(out.results[1].remainingCap).toBe(1200);
  });
  it("potion insurance value 400: potion damage 300 -> payout 200 remainingCap 600", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "potion", amount: 300 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(200);
    expect(out.results[1].remainingCap).toBe(600);
  });
  it("cap exhaustion first claim: sword damage 1500 -> payout 1400 remainingCap 600", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(1400);
    expect(out.results[1].remainingCap).toBe(600);
  });
  it("cap exhaustion second claim: two successive 1500 claims -> second payout 600 remainingCap 0", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(out.results[1].payout).toBe(1400);
    expect(out.results[2].payout).toBe(600);
    expect(out.results[2].remainingCap).toBe(0);
  });

  // Group F - edge cases and CLI contract (execute)
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const out = execute({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(out.results[0].premium).toBe(5);
  });
  it("unknown quote item type broomstick -> non-zero exit, stderr message, no results on stdout", () => {
    const out = execute({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(out.exitCode).not.toBe(0);
    expect(out.stderr.length).toBeGreaterThan(0);
    expect(out.stdout).toBe("");
  });
  it("claim references a damage entry whose item is not in the policy -> non-zero exit, stderr message", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(out.exitCode).not.toBe(0);
    expect(out.stderr.length).toBeGreaterThan(0);
  });
  it("claim references unknown item type -> non-zero exit, stderr message", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    });
    expect(out.exitCode).not.toBe(0);
    expect(out.stderr.length).toBeGreaterThan(0);
  });
  it("claim damage entry with amount -200 -> non-zero exit, stderr message", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(out.exitCode).not.toBe(0);
    expect(out.stderr.length).toBeGreaterThan(0);
  });

  // Group G - integration examples
  it("newcomer cursed steel sword e3 -> premium 165 G", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(out.results[0].premium).toBe(165);
  });
  it("long-standing second contract cursed steel sword e7, 3 years -> premium 160 G", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(out.results[1].premium).toBe(160);
  });
  it("schema example: amulet silver e2 5yr + claim amulet 200 -> premium 59 payout 100 remainingCap 1100", () => {
    const out = execute({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(out.results[0].premium).toBe(59);
    expect(out.results[1].payout).toBe(100);
    expect(out.results[1].remainingCap).toBe(1100);
  });
});
