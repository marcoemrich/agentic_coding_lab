// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim, insuranceSum, cap } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ===== Quote: empty and processing fee =====
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0, previousContracts: 0 }, items: [] })).toBe(5);
  });

  // ===== Quote: single item base premiums (no modifiers, follow-up contract to neutralize first-insurance) =====
  // Use a long-standing customer's follow-up contract OR show base via integration.
  // We start with the simplest: single-item premiums combining base + first-insurance for a newcomer with no history.
  it("newcomer single sword (steel, enchantment 0, not cursed) yields premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toBe(115);
  });
  it("newcomer single amulet yields premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "amulet" }],
      })
    ).toBe(71);
  });
  it("newcomer single staff yields premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "staff" }],
      })
    ).toBe(93);
  });
  it("newcomer single potion yields premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "potion" }],
      })
    ).toBe(49);
  });
  it("newcomer single rune yields premium 33 G (25 base + 3 first-insurance + 5 fee, rounded up)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "rune" }],
      })
    ).toBe(33);
  });

  // ===== Quote: component blocks =====
  it("2 runes yield base premium 50 G (no block applies)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }],
      })
    ).toBe(60);
  });
  it("3 runes yield base premium 60 G (block of 3 alike applies)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      })
    ).toBe(71);
  });
  it("4 runes yield base premium 100 G (block requires exactly 3)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      })
    ).toBe(115);
  });
  it("7 runes yield base premium 175 G (no block)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
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
  it("2 runes + 1 moonstone yield base premium 75 G (different types, no block)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      })
    ).toBe(88);
  });
  it("3 runes + 3 moonstones yield base premium 120 G (two separate blocks)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
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

  // ===== Quote: item-specific modifiers =====
  it("cursed sword adds 50% surcharge on item base (cursed sword alone: 100 + 50 = 150 base)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      })
    ).toBe(165);
  });
  it("highly enchanted sword (enchantment 5) adds 30% surcharge on item base", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
      })
    ).toBe(145);
  });
  it("sword with enchantment 4 has no high-enchantment surcharge", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
      })
    ).toBe(115);
  });
  it("cursed sword with enchantment 5 stacks both surcharges on item base", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
      })
    ).toBe(195);
  });

  // ===== Quote: modifier scope on multi-item policies =====
  it("policy with cursed sword + plain amulet: cursed surcharge applies only to cursed item base (newcomer total 231 G)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet" },
        ],
      })
    ).toBe(231);
  });

  // ===== Quote: policy-wide modifiers =====
  it("long-standing customer (exactly 2 years) receives 20% loyalty discount on policy base", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 2, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toBe(95);
  });
  it("first insurance (newcomer, no prior contracts) adds 10% surcharge on policy base", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toBe(115);
  });
  it("follow-up contract gives 15% discount on policy base", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      })
    ).toBe(100);
  });

  // ===== Quote: rounding in MHPCO's favor =====
  it("premium calculation that yields 197.5 G rounds up to 198 G", () => {
    // 7 runes for newcomer: base 7*25 = 175, first-insurance 17.5, fee 5 → 197.5 → ceil 198
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
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
  it("intermediate amounts kept as fractions; only final premium is rounded", () => {
    // 7 runes for newcomer: policyBase = 175, first-insurance = 17.5 (kept as fraction),
    // fee = 5 → 197.5 → ceil = 198. If intermediates were rounded, we'd get 197 or 198 inconsistently.
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
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

  // ===== Quote: integration examples from spec =====
  it("newcomer with cursed sword (steel, enchantment 3) yields premium 165 G", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0, previousContracts: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      })
    ).toBe(165);
  });
  it("long-standing (3 yrs) customer's second quote with cursed sword (enchantment 7) yields premium 160 G", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 3, previousContracts: 1 },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      })
    ).toBe(160);
  });

  // ===== Claim: basic deductible =====
  it("regular sword (steel, enchantment 3), damage 500 G yields payout 400 G (full minus 100 deductible)", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          remainingCap: 2000,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 500 }],
        },
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance value 250 G), damage 200 G yields payout 100 G (full minus deductible, no special clauses)", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "rune" }],
          remainingCap: 500,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "rune", amount: 200 }],
        },
      })
    ).toEqual({ payout: 100, remainingCap: 400 });
  });

  // ===== Claim: special clauses =====
  it("steel sword enchantment 9, damage 1000 G yields payout 400 G (50% then deductible)", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          remainingCap: 2000,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 G yields payout 700 G (full minus deductible)", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          remainingCap: 2000,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 800 }],
        },
      })
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword enchantment 9, damage 1000 G yields payout 400 G (50% then deductible — both clauses apply)", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          remainingCap: 2000,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 G yields payout 400 G (50% then deductible)", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          remainingCap: 2000,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      })
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ===== Claim: deductible per damage event (multi-item incident) =====
  it("dragon attack damages sword (500 G) and amulet (300 G): payout 600 G (deductible per item)", () => {
    expect(
      claim({
        policy: {
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet" },
          ],
          remainingCap: 3200,
        },
        incident: {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      })
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // ===== Claim: rounding =====
  it("payout calculation that yields 350.5 G rounds down to 350 G", () => {
    // sword enchantment 9, damage 901 → 901*0.5 = 450.5 → -100 = 350.5 → floor 350
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          remainingCap: 2000,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 901 }],
        },
      })
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // ===== Claim: insurance sum and cap =====
  it("policy of sword + amulet: insurance sum 1600 G, cap 3200 G", () => {
    const items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }> = [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet" },
    ];
    expect(insuranceSum(items)).toBe(1600);
    expect(cap(items)).toBe(3200);
  });
  it("policy of sword + 3 runes (a block): insurance sum 1750 G (block discount affects premium only)", () => {
    const items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }> = [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    expect(insuranceSum(items)).toBe(1750);
  });
  it("cursed sword: cap 2000 G based on unmodified insurance value (premium modifiers do not raise cap)", () => {
    const items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }> = [
      { type: "sword", material: "steel", enchantment: 0, cursed: true },
    ];
    expect(cap(items)).toBe(2000);
  });

  // ===== Claim: cap exhaustion across successive claims =====
  it("sword (cap 2000 G), first claim 1500 G yields payout 1400 G, remainingCap 600 G", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          remainingCap: 2000,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      })
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000 G), after first 1500 G claim, second 1500 G claim yields payout 600 G, remainingCap 0 G", () => {
    expect(
      claim({
        policy: {
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          remainingCap: 600,
        },
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      })
    ).toEqual({ payout: 600, remainingCap: 0 });
  });

  // ===== Claim: multiple items of same type =====
  it("policy covers two swords: insurance sum 2000 G, cap 4000 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(insuranceSum(items)).toBe(2000);
    expect(cap(items)).toBe(4000);
  });
  it("dragon attack damages both insured swords: each entry treated separately with own deductible", () => {
    expect(
      claim({
        policy: {
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
          remainingCap: 4000,
        },
        incident: {
          cause: "dragon attack",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 700 },
          ],
        },
      })
    ).toEqual({ payout: 1000, remainingCap: 3000 });
  });

  // ===== CLI / scenario integration =====
  it("scenario with quote then claim returns results array of length 2 with {premium} and {payout, remainingCap}", () => {
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
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  // ===== Error cases =====
  it("quote with unknown item type (e.g. broomstick) causes CLI to exit non-zero with stderr error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/error|broomstick|unknown/i);
    expect(result.stdout).not.toContain("results");
  });
  it("claim referencing damage to an item not in the policy causes CLI to exit non-zero with stderr error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 100 }],
          },
        },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/error|amulet|not in policy/i);
    expect(result.stdout).not.toContain("results");
  });
  it("claim with damages array containing more entries of a type than insured causes CLI to exit non-zero", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/error/i);
    expect(result.stdout).not.toContain("results");
  });
  it("claim with negative damage amount causes CLI to exit non-zero with stderr error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    const result = spawnSync("tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/error/i);
    expect(result.stdout).not.toContain("results");
  });
});
