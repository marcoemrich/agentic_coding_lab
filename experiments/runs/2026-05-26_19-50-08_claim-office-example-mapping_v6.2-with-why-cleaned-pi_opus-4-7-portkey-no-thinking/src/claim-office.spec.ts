import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  // --- Base premiums per item type (with default 0-year, first-time customer rules) ---
  // For a single first-time newcomer (0 years), with no curse/enchantment, a single item:
  // premium = base + 10% first insurance + 5 fee
  it("single plain sword for new customer -> 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("single plain amulet for new customer -> 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("single plain staff for new customer -> 80 + 8 + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("single plain potion for new customer -> 40 + 4 + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // --- Components: building block of 3 alike ---
  it("2 runes -> base 50 G (no block); with new customer = 50 + 5 + 5 = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes -> base 60 G (block applies); with new customer = 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("4 runes -> base 100 G (no block; block requires exactly 3); with new customer = 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes -> base 175 G; with new customer = 175 + 17.5 + 5 = 197.5 -> 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  // --- Alike means same type (not same family) ---
  it("2 runes + 1 moonstone -> base 75 G (different types, no block); = 75 + 7.5 + 5 = 87.5 -> 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones -> base 120 G (two separate blocks); = 120 + 12 + 5 = 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // --- Cursed surcharge (item-specific) ---
  it("cursed sword + plain amulet for new customer -> 100+60+50+16+5 = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
      }],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years -> loyalty discount applies; plain sword = 100 + 10 - 20 + 5 = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("sword enchantment exactly 5 -> high-enchantment surcharge; new customer: 100 + 30 + 10 + 5 = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("sword enchantment 5 and cursed -> both surcharges; new: 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("sword enchantment 4 (not cursed) -> no high-enchantment; new: 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("sword enchantment 4 cursed -> only curse; new: 100 + 50 + 10 + 5 = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });

  // --- Rounding (MHPCO's favor) ---
  it("fractional premium rounded up in MHPCO's favor: 1 rune new customer 25 + 2.5 + 5 = 32.5 -> 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 33 }]);
  });
  it("payout yielding 350.5 G -> rounded down to 350 G (high-ench sword, damage 901: 450.5 - 100 = 350.5 -> 350)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 2000 - 350 });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, enchantment 3), 0 years -> premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer (3 years), second contract, cursed sword (steel, enchantment 7) -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim processing: basic ---
  it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });
  it("damage to rune (no enchantment, no material), damage 200 G -> payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fall", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 500 - 100 });
  });

  // --- High enchantment clause ---
  it("steel sword enchantment 9, damage 1000 G -> payout 400 G (50% then -100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });

  // --- Dragon material clause ---
  it("dragon-material sword enchantment 5, damage 800 G -> payout 700 G (full then -100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 2000 - 700 });
  });

  // --- Both clauses: 50% wins, then deductible ---
  it("dragon-material sword enchantment 9, damage 1000 G -> payout 400 G (50% then -100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });

  // --- Deductible per damage event ---
  it("two damaged items in one claim (sword 500 + amulet 300) -> payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3200 - 600 });
  });

  // --- Multiple items of same type ---
  it("policy with two swords -> insurance sum 2000 G, cap 4000 G; two sword damages each get own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 600 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 900, remainingCap: 4000 - 900 });
  });
  it("policy with one sword but damages report two swords -> runScenario throws (CLI rejects)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "battle", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 600 },
          ] } },
        ],
      }),
    ).toThrow();
  });

  // --- Cap calculations ---
  it("policy: sword + amulet -> insurance sum 1600 G, cap 3200 G; huge damage clipped to cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword cap is 2000 G (based on unmodified insurance value); damage 5000 clipped to cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy: sword + 3 runes (block) -> insurance sum 1750 G, cap 3500 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 10000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  // --- Cap exhaustion across successive claims ---
  it("sword, two 1500 G claims: first payout 1400 G remainingCap 600 G, second payout 600 G remainingCap 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases ---
  it("quote with unknown item type -> runScenario throws (CLI rejects)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim with damage to item not in policy -> runScenario throws (CLI rejects)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with damage to unknown item type -> runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount -> runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });

  // --- CLI smoke test ---
  it("CLI reads JSON from stdin and writes results JSON to stdout (schema example)", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const proc = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(proc.status).toBe(0);
    const output = JSON.parse(proc.stdout);
    expect(output).toHaveProperty("results");
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("payout");
    expect(output.results[1]).toHaveProperty("remainingCap");
  });
});
