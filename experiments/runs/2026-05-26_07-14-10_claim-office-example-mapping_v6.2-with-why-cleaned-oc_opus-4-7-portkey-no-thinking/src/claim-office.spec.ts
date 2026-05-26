import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ---------- Quote: edge & simplest cases ----------
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // ---------- Single main item base premiums ----------
  it("single sword (steel, ench 0, not cursed), newcomer (0 yrs, first quote) -> 100 + 10 first + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet, newcomer first quote -> 60 + 6 first + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff, newcomer first quote -> 80 + 8 first + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion, newcomer first quote -> 40 + 4 first + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // ---------- Components & blocks ----------
  it("2 runes -> base 50 (no block); + 5 fee + 10% first insurance per item -> 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 25*2 = 50; first insurance 10% -> 5; +5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> base 60 (block applies); newcomer first -> 60 + 6 first + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> base 100 (no block, exactly 3 required); newcomer first -> 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> base 175 (no block); newcomer first -> 175 + 17.5 first = 192.5; +5 = 197.5; round up -> 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> 75 G base (no block, different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    // base: 25+25+25 = 75; first insurance: 7.5; total 82.5 + 5 = 87.5 -> 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> 120 G base (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })] }],
    });
    // 60 + 60 = 120 base; +12 first; +5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // ---------- Modifiers ----------
  it("cursed sword (steel, ench 3), newcomer first -> 100 + 50 curse + 10 first + 5 = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5 -> high-ench surcharge applies; 100 + 30 + 10 first + 5 = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -> no high-ench surcharge; 100 + 10 first + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 -> both surcharges; 100 + 50 + 30 + 10 first + 5 = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // ---------- Loyalty & follow-up modifiers ----------
  it("loyalty: customer with exactly 2 years -> 20% discount; sword: 100 - 20 + 10 first + 5 = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance surcharge applies even for long-standing customers (per item, not per customer)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    // 100 base - 20 loyalty + 10 first ins + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("follow-up contract: 15% discount on each contract after the first (within the scenario)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        // first contract: plain sword newcomer -> 115
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        // second contract: same plain sword - 15% follow-up on policy base of 100
        // = 100 + 10 first - 15 follow-up + 5 = 100 G
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // ---------- Multi-item policy: modifier scope ----------
  it("policy with cursed sword + plain amulet -> 160 base + 50 curse + 16 first + 5 = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] }],
    });
    // policy base 100+60=160; curse on sword 50; first ins on policy 16; +5 = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // ---------- Rounding ----------
  it("rounding: premium 197.5 G -> 198 G (rounded up); payout 350.5 G -> 350 G (rounded down)", () => {
    // 7 runes -> 197.5 -> 198 (already covered); for payout we need a fractional case
    // Use a dragon item with enchantment 8: 50% rule. damage 801 -> 400.5 -> 350.5 with deductible
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    // 901 * 0.5 = 450.5; - 100 deductible = 350.5; floor -> 350
    // Cap accounting tracks fractional value 2000 - 350.5 = 1649.5; reported floor -> 1649 (MHPCO's favor)
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1649 });
  });

  // ---------- Integration examples ----------
  it("newcomer with cursed sword (steel, ench 3) -> 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing 3-yr customer, second contract, cursed sword (steel, ench 7) -> 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // ---------- Claim: standard reimbursement ----------
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (500 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (no enchantment/material), damage 200 -> payout 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // ---------- Claim: high-enchantment clause ----------
  it("steel sword, enchantment 9, damage 1000 -> payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ---------- Claim: dragon material ----------
  it("dragon sword, enchantment 5, damage 800 -> payout 700 (full reimbursement minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon sword, enchantment 9, damage 1000 -> payout 400 (high-ench wins: 500 - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword, enchantment exactly 8, damage 1000 -> payout 400 (high-ench applies, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ---------- Multiple damages per claim ----------
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // ---------- Multiple items same type ----------
  it("policy with two swords -> insurance sum 2000, cap 4000", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] },
        // Force cap exhaustion: damage 5000 -> wanted 4900, capped at 4000
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 5000 },
          { itemType: "sword", amount: 0 },
        ] } },
      ],
    });
    // first damage 5000 -> wanted 4900, cap 4000, capped to 4000; remaining 0
    expect(result.results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("policy with two swords, damages array with two sword entries -> each treated as separate damage with own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    // two swords: insurance sum 2000, cap 4000
    // each damage 500 -> 500-100 deductible = 400 each; total 800; remainingCap = 4000-800 = 3200
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array contains more entries of a type than policy covers -> throws (rejected)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toThrow();
  });

  // ---------- Cap ----------
  it("policy: sword + amulet -> insurance sum 1600, cap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    // cap = 3200; sword damage 5000-100=4900, capped to 3200; remaining 0
    expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("cursed sword: cap 2000 (based on unmodified insurance value; modifiers do not raise cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    // cap = 2000 (1000*2, unmodified); sword 5000-100=4900, capped to 2000
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy: sword + 3 runes (block) -> insurance sum 1750 (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        // damage way more than cap; cap = 1750 * 2 = 3500
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 10000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("sword, two successive claims of 1500 each -> 1st payout 1400 (cap rem 600), 2nd payout 600 (cap rem 0)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // ---------- Error cases ----------
  it("quote item with unknown type -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references damage for item not part of policy -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with damage amount -200 -> runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fall", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // ---------- CLI integration ----------
  it("CLI reads JSON from stdin, writes JSON results to stdout (schema example)", async () => {
    const { spawnSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toHaveProperty("results");
    expect(Array.isArray(output.results)).toBe(true);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("payout");
    expect(output.results[1]).toHaveProperty("remainingCap");
  });
});
