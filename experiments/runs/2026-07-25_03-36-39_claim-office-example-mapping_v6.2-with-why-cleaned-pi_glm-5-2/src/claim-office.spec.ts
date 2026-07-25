import { describe, it, expect } from "vitest";
import {
  policyBasePremium,
  insuranceSum,
  itemSurcharges,
  quotePremium,
  processClaim,
  processScenario,
} from "./claim-office.js";
import { runCli } from "./cli.js";

describe("Item base premiums (policyBasePremium)", () => {
  it("empty item list -> base premium 0", () => {
    expect(policyBasePremium([])).toBe(0);
  });
  it("main items price list: sword 100, amulet 60, staff 80, potion 40", () => {
    expect(policyBasePremium([{ type: "sword" }])).toBe(100);
    expect(policyBasePremium([{ type: "amulet" }])).toBe(60);
    expect(policyBasePremium([{ type: "staff" }])).toBe(80);
    expect(policyBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("components base premium 25 each: rune 25, moonstone 25", () => {
    expect(policyBasePremium([{ type: "rune" }])).toBe(25);
    expect(policyBasePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("2 runes -> 50 (no block)", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 (block applies, exactly 3)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(60);
  });
  it("4 runes -> 100 (no block, block requires exactly 3)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("7 runes -> 175", () => {
    expect(
      policyBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" }))),
    ).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 (alike = same type only, no block)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 (two separate blocks)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(120);
  });
});

describe("Insurance sum (insuranceSum, cap = 2x)", () => {
  it("sword + amulet -> 1600 (cap 3200); cursed sword -> 1000 (cap 2000, unmodified); sword + 3 runes (block) -> 1750 (cap 3500, block does not affect insurance sum)", () => {
    expect(
      insuranceSum([
        { type: "sword", material: "steel" },
        { type: "amulet", material: "silver" },
      ]),
    ).toBe(1600);
    expect(
      insuranceSum([{ type: "sword", material: "steel", cursed: true }]),
    ).toBe(1000);
    expect(
      insuranceSum([
        { type: "sword", material: "steel" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(1750);
  });
});

describe("Item-specific surcharges (itemSurcharges)", () => {
  it("cursed sword (steel, enchantment 3) -> 50 (50% of 100)", () => {
    expect(
      itemSurcharges([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]),
    ).toBe(50);
  });
  it("sword enchantment 5 -> 30 (high-enchantment surcharge at exactly 5)", () => {
    expect(
      itemSurcharges([
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ]),
    ).toBe(30);
  });
  it("sword enchantment 4 -> 0 (below threshold, no high-enchantment)", () => {
    expect(
      itemSurcharges([
        { type: "sword", material: "steel", enchantment: 4, cursed: false },
      ]),
    ).toBe(0);
  });
  it("cursed sword enchantment 5 -> 80 (both curse 50 + high enchant 30)", () => {
    expect(
      itemSurcharges([
        { type: "sword", material: "steel", enchantment: 5, cursed: true },
      ]),
    ).toBe(80);
  });
  it("modifier scope: cursed sword (100) + plain amulet (60) -> policy base 160, curse surcharge 50 (on sword only, not policy total)", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    ];
    expect(policyBasePremium(items)).toBe(160);
    expect(itemSurcharges(items)).toBe(50);
  });
});

describe("Quote premium (quotePremium)", () => {
  it("empty item list -> premium 5 G (only processing fee)", () => {
    expect(quotePremium(0, [], false)).toBe(5);
  });
  it("newcomer cursed sword (0 years, first quote) -> 165 (100 + 50 curse + 10 first + 5 fee)", () => {
    expect(
      quotePremium(
        0,
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        false,
      ),
    ).toBe(165);
  });
  it("long-standing second contract (3 years, follow-up, cursed sword enchantment 7) -> 160 (100 + 50 curse + 30 high ench - 20 loyalty + 10 first - 15 follow-up + 5 fee)", () => {
    expect(
      quotePremium(
        3,
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        true,
      ),
    ).toBe(160);
  });
  it("loyalty at exactly 2 years: sword, first quote -> 95 (100 + 10 first - 20 loyalty + 5 fee)", () => {
    expect(quotePremium(2, [{ type: "sword", material: "steel" }], false)).toBe(
      95,
    );
  });
  it("1 year with MHPCO: sword, first quote -> 115 (no loyalty: 100 + 10 first + 5 fee)", () => {
    expect(quotePremium(1, [{ type: "sword", material: "steel" }], false)).toBe(
      115,
    );
  });
  it("follow-up contract: sword, 0 years, follow-up -> 100 (100 + 10 first - 15 follow-up + 5 fee)", () => {
    expect(quotePremium(0, [{ type: "sword", material: "steel" }], true)).toBe(
      100,
    );
  });
  it("7 runes first quote -> premium 198 (197.5 rounds up in MHPCO favor)", () => {
    expect(
      quotePremium(0, Array.from({ length: 7 }, () => ({ type: "rune" })), false),
    ).toBe(198);
  });
});

describe("Claim processing (processClaim)", () => {
  it("regular sword (steel, enchantment 3), damage 500 -> payout 400, remainingCap 1600 (full - 100 deductible)", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        2000,
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune, damage 200 -> payout 100, remainingCap 400 (no enchantment/material, full - deductible)", () => {
    expect(
      processClaim(
        [{ type: "rune" }],
        { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        500,
      ),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon-material sword enchantment 8, damage 1000 -> payout 400, remainingCap 1600 (high-enchant 50% then deductible)", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        2000,
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 9, damage 1000 -> payout 400, remainingCap 1600 (both clauses, 50% wins then deductible)", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        2000,
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 -> payout 700, remainingCap 1300 (only dragon clause, full then deductible)", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        2000,
      ),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 -> payout 400, remainingCap 1600 (only high-enchant clause, 50% then deductible)", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        2000,
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon attack: sword 500 + amulet 300 -> payout 600, remainingCap 2600 (deductible per damaged item)", () => {
    expect(
      processClaim(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
        3200,
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords each damaged 500 -> payout 800, remainingCap 3200 (separate deductibles per damage entry)", () => {
    expect(
      processClaim(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ],
        {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        },
        4000,
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("cap exhaustion first claim: sword damage 1500, cap 2000 -> payout 1400, remainingCap 600", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        2000,
      ),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("cap exhaustion second claim: sword damage 1500, cap 600 -> payout 600, remainingCap 0 (reduced to remaining cap)", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        600,
      ),
    ).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("payout rounding: steel sword enchantment 9, damage 901 -> payout 350, remainingCap 1650 (350.5 rounds down)", () => {
    expect(
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        2000,
      ),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("Validation errors", () => {
  it("claim: damage itemType not part of policy (amulet damaged, only sword insured) -> throws", () => {
    expect(() =>
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
        2000,
      ),
    ).toThrow();
  });
  it("claim: damage entry with unknown itemType -> throws", () => {
    expect(() =>
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] },
        2000,
      ),
    ).toThrow();
  });
  it("claim: damage entry with amount -200 -> throws", () => {
    expect(() =>
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        2000,
      ),
    ).toThrow();
  });
  it("claim: more damage entries of a type than insured (2 sword damages, 1 sword insured) -> throws", () => {
    expect(() =>
      processClaim(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        {
          cause: "fire",
          damages: [
            { itemType: "sword", amount: 100 },
            { itemType: "sword", amount: 100 },
          ],
        },
        2000,
      ),
    ).toThrow();
  });
  it("quote: item with unknown type (broomstick) -> processScenario throws", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
});

describe("CLI (runCli)", () => {
  it("schema example: quote amulet (5 years) + claim amulet 200 -> results [{premium:59},{payout:100,remainingCap:1100}], exitCode 0", () => {
    const result = runCli(
      JSON.stringify({
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
      }),
    );
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe(
      JSON.stringify({
        results: [
          { premium: 59 },
          { payout: 100, remainingCap: 1100 },
        ],
      }),
    );
  });
  it("quote unknown item type -> non-zero exitCode, stderr non-empty, no stdout", () => {
    const result = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("claim invalid damage amount (-200) -> non-zero exitCode, stderr non-empty", () => {
    const result = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    );
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("two quote steps: first empty (5), second sword follow-up (100) -> results [{premium:5},{premium:100}]", () => {
    const result = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      }),
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe(
      JSON.stringify({ results: [{ premium: 5 }, { premium: 100 }] }),
    );
  });
});
