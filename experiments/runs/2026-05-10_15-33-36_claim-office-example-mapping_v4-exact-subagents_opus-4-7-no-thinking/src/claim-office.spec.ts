// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, createPolicy, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: empty and basic items
  it("quote with empty item list returns premium 5 (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quote with a single sword (plain, no modifiers) returns premium 115 (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
  });
  it("quote with a single amulet (plain, no modifiers) returns premium 71 (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);
  });
  it("quote with a single staff (plain, no modifiers) returns premium 93 (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff", material: "wood", enchantment: 0, cursed: false }])).toBe(93);
  });
  it("quote with a single potion (plain, no modifiers) returns premium 49 (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
  });

  // Quote: multiple items
  it("quote with two plain items sums their base premiums (sword + amulet = 100 + 60 = 160 base, +16 first insurance, +5 fee = 181)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false }
    ])).toBe(181);
  });

  // Components (runes/moonstones)
  it("quote with 2 runes returns base premium 50 (2 × 25)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" }
    ])).toBe(60);
  });
  it("quote with 3 runes applies block discount (60 base premium, not 75)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" }
    ])).toBe(71);
  });
  it("quote with 4 runes returns 100 (block requires exactly 3, no block applies)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" }
    ])).toBe(115);
  });
  it("quote with 7 runes returns 175 base premium (one block of 3 + 4 single = 60 + 100)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" }
    ])).toBe(198);
  });
  it("quote with 2 runes + 1 moonstone returns 75 base premium (no block: different types)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" }
    ])).toBe(88);
  });
  it("quote with 3 runes + 3 moonstones returns 120 base premium (two separate blocks)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
    ])).toBe(137);
  });

  // Item-specific modifiers
  it("quote with cursed sword adds 50% surcharge on item base premium (100 + 50 curse)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 0, cursed: true }
    ])).toBe(165);
  });
  it("quote with sword at enchantment 5 adds 30% surcharge on item base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 5, cursed: false }
    ])).toBe(145);
  });
  it("quote with sword at enchantment 4 does not add high-enchantment surcharge", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 4, cursed: false }
    ])).toBe(115);
  });
  it("quote with cursed sword at enchantment 5 stacks both surcharges", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 5, cursed: true }
    ])).toBe(195);
  });

  // Modifier scope on multi-item policies
  it("quote with cursed sword + plain amulet applies curse only to sword's base premium (210 before policy modifiers and fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 0, cursed: true },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false }
    ])).toBe(231);
  });

  // Policy-wide modifiers
  it("quote with customer at exactly 2 years applies 20% loyalty discount on policy total", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [
      { type: "sword", material: "steel", enchantment: 0, cursed: false }
    ])).toBe(95);
  });
  it("quote with customer at less than 2 years does not apply loyalty discount", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [
      { type: "sword", material: "steel", enchantment: 0, cursed: false }
    ])).toBe(115);
  });
  it("quote first insurance adds 10% surcharge per item on the policy", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false }
    ])).toBe(181);
  });
  it("quote follow-up contract (after first quote in scenario) applies 15% discount on policy total", () => {
    expect(quote({ yearsWithMHPCO: 0, previousContracts: 1 }, [
      { type: "sword", material: "steel", enchantment: 0, cursed: false }
    ])).toBe(100);
  });

  // Rounding
  it("premium calculation yielding 197.5 rounds up to 198", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "rune" }, { type: "rune" }, { type: "rune" }
    ])).toBe(198);
  });

  // Integration examples from spec
  it("newcomer with cursed sword (steel, enchantment 3, 0 years) returns premium 165", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 3, cursed: true }
    ])).toBe(165);
  });
  it("long-standing customer's second contract: cursed sword (enchantment 7, 3 years, 2nd quote) returns premium 160", () => {
    expect(quote({ yearsWithMHPCO: 3, previousContracts: 1 }, [
      { type: "sword", material: "steel", enchantment: 7, cursed: true }
    ])).toBe(160);
  });

  // Quote: error cases
  it("quote with unknown item type causes CLI to exit non-zero with error to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }] }
      ]
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8"
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  // Claim: basic payouts
  it("claim on regular sword (steel, enchantment 3) with damage 500 returns payout 400 (full reimbursement minus 100 deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("claim on rune (insurance value 250) with damage 200 returns payout 100 (full reimbursement minus 100 deductible)", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });

  // Claim: enchantment threshold
  it("claim on steel sword enchantment 9 with damage 1000 returns payout 400 (50% reimbursement, then 100 deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // Claim: dragon material
  it("claim on dragon-material sword enchantment 5 with damage 800 returns payout 700 (full reimbursement, then 100 deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });
  it("claim on dragon-material sword enchantment 9 with damage 1000 returns payout 400 (50% rule wins, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("claim on dragon-material sword enchantment 8 with damage 1000 returns payout 400 (high-enchantment clause applies, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // Claim: deductible per damage event
  it("claim with two damaged items (sword 500 + amulet 300) applies deductible per item: payout 600", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false }
    ]);
    const result = claim(policy, {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 }
      ]
    });
    expect(result.payout).toBe(600);
  });

  // Claim: multiple items of the same type
  it("policy covering two swords has insurance sum 2000 and cap 4000", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "sword", material: "steel", enchantment: 0, cursed: false }
    ]);
    expect(policy.cap).toBe(4000);
  });
  it("claim with two sword damages on a two-sword policy treats each as separate damage with own deductible", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "sword", material: "steel", enchantment: 0, cursed: false }
    ]);
    const result = claim(policy, {
      cause: "dragon",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 }
      ]
    });
    expect(result.payout).toBe(600);
  });
  it("claim with more sword damages than swords insured causes CLI to exit non-zero", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
      ]
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8"
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  // Claim: cap
  it("policy with sword + amulet has insurance sum 1600 and cap 3200", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false }
    ]);
    expect(policy.cap).toBe(3200);
  });
  it("policy with sword + 3 runes has insurance sum 1750 (block discount affects premium only, not cap)", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
      { type: "rune" }, { type: "rune" }, { type: "rune" }
    ]);
    expect(policy.cap).toBe(3500);
  });
  it("cap is based on unmodified insurance value (cursed sword cap = 2000)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 0, cursed: true }]);
    expect(policy.cap).toBe(2000);
  });
  it("first claim of 1500 on sword (cap 2000) returns payout 1400 with remainingCap 600", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 0, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("second claim of 1500 with remainingCap 600 returns payout 600 with remainingCap 0", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 0, cursed: false }]);
    claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    const result2 = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result2.payout).toBe(600);
    expect(result2.remainingCap).toBe(0);
  });

  // Claim: rounding
  it("payout calculation yielding 350.5 rounds down to 350", () => {
    // sword ench 8 with damage 901: 901*0.5 = 450.5, -100 = 350.5 -> 350
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 8, cursed: false }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });

  // Claim: error cases
  it("claim referencing item not in policy causes CLI to exit non-zero with error to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8"
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with negative damage amount causes CLI to exit non-zero with error to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8"
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  // CLI integration
  it("CLI reads scenario JSON from stdin and writes results JSON to stdout in step order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [] }
      ]
    };
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf-8"
    });
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed).toEqual({ results: [{ premium: 5 }] });
  });
});
