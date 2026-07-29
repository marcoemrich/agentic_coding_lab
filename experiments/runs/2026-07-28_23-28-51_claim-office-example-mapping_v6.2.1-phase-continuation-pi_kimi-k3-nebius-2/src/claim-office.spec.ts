import { spawnSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario, type QuoteItem } from "./claim-office.js";

function runCli(input: unknown): { status: number; stdout: string; stderr: string } {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return {
    status: result.status ?? -1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums and fees ---
  it("empty item list yields premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(results).toEqual([{ premium: 5 }]);
  });
  it("plain sword for new customer yields premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("price list: amulet -> 71 G, staff -> 93 G, potion -> 49 G", () => {
    const quote = (items: QuoteItem[]) =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items }],
      });
    expect(quote([{ type: "amulet" }])).toEqual([{ premium: 71 }]);
    expect(quote([{ type: "staff" }])).toEqual([{ premium: 93 }]);
    expect(quote([{ type: "potion" }])).toEqual([{ premium: 49 }]);
  });

  // --- Quote: components and building blocks ---
  it("2 runes yield premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("3 runes yield premium 71 G (block of 3: 60 base + 6 + 5)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("4 runes yield premium 115 G (no block - block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("7 runes yield premium 198 G (197.5 rounded up in MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone yield premium 88 G (no block across types; 87.5 rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones yield premium 137 G (two separate blocks)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Quote: item-specific modifiers ---
  it("cursed sword for newcomer yields premium 165 G (integration example 1)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment exactly 5 yields premium 145 G (high-enchantment surcharge applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("cursed sword with enchantment 5 yields premium 195 G (both surcharges apply)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 195 }]);
  });
  it("cursed sword with enchantment 4 yields premium 165 G (no high-enchantment surcharge)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with exactly 2 years gets loyalty discount: plain sword -> 95 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year gets no loyalty discount: plain sword -> 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword + plain amulet -> 231 G (curse surcharge applies to the sword only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(results).toEqual([{ premium: 231 }]);
  });
  it("two swords yield premium 225 G (200 base + 20 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 225 }]);
  });
  it("second quote gets 15% follow-up discount: plain sword -> 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("long-standing customer's second contract: cursed sword ench 7 -> 160 G (integration example 2)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("claim: steel sword ench 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: rune damage 200 -> payout 100, remainingCap 400", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "careless imp", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim: sword 500 + amulet 300 -> payout 600 (deductible per damaged item), remainingCap 2600", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
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
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: special clauses (enchantment >= 8 vs dragon material) ---
  it("claim: dragon sword ench exactly 8, damage 1000 -> payout 400 (50% clause, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon sword ench 9, damage 1000 -> payout 400 (50% rule wins over dragon clause)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "combat", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon sword ench 5, damage 800 -> payout 700 (dragon clause: full - deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "combat", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim: steel sword ench 9, damage 1000 -> payout 400 (only high-enchantment clause)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: steel sword ench 9, damage 901 -> payout 350 (350.5 rounded down in MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "duel", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: multiple items, caps, successive claims ---
  it("claim: two swords damaged (500, 300) -> payout 600 (each entry separate), remainingCap 3400", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("claim: cursed sword policy, damage 5000 -> payout 2000 (cap ignores premium modifiers), remainingCap 0", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "total loss", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("claim: sword + 3 runes policy, sword damage 10000 -> payout 3500 (block does not reduce insurance sum), remainingCap 0", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "total loss", damages: [{ itemType: "sword", amount: 10000 }] },
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 181 });
    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("successive claims exhaust cap: 1500 -> 1400/600, then 1500 -> 600/0", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("policy field is a zero-based step index: claim with policy 1 refers to the second step", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(results[2]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("schema example end-to-end via CLI: 5y customer, amulet quote -> 59; fire claim 200 -> 100/1100", () => {
    const { status, stdout } = runCli({
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
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 20000);
  it("staff and potion insurance values: staff damage 5000 -> capped 1600; potion damage 1000 -> capped 800", () => {
    const staffClaim = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "backfire", damages: [{ itemType: "staff", amount: 5000 }] },
        },
      ],
    });
    expect(staffClaim[1]).toEqual({ payout: 1600, remainingCap: 0 });

    const potionClaim = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spill", damages: [{ itemType: "potion", amount: 1000 }] },
        },
      ],
    });
    expect(potionClaim[1]).toEqual({ payout: 800, remainingCap: 0 });
  });

  // --- CLI error handling ---
  it("CLI: quote with unknown item type exits non-zero, writes stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  }, 20000);
  it("CLI: claim damage for item not in policy (or unknown type) exits non-zero with stderr", () => {
    const notCovered = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(notCovered.status).not.toBe(0);
    expect(notCovered.stderr.length).toBeGreaterThan(0);

    const unknownType = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
        },
      ],
    });
    expect(unknownType.status).not.toBe(0);
    expect(unknownType.stderr.length).toBeGreaterThan(0);
  }, 20000);
  it("CLI: more damage entries of a type than policy covers exits non-zero", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  }, 20000);
  it("CLI: damage amount -200 exits non-zero with stderr", () => {
    const { status, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fraud", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  }, 20000);
});
