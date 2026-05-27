import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Empty / simplest cases ===
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results).toEqual([{ premium: 5 }]);
  });

  // === Base premiums per item type ===
  it("single sword (no modifiers, 0 years, first contract) -> 100 base + 10 first + 5 fee = 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("single amulet (no modifiers, 0 years, first contract) -> 60 base + 6 first + 5 fee = 71", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("single staff (no modifiers, 0 years, first contract) -> 80 base + 8 first + 5 fee = 93", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results).toEqual([{ premium: 93 }]);
  });
  it("single potion (no modifiers, 0 years, first contract) -> 40 base + 4 first + 5 fee = 49", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results).toEqual([{ premium: 49 }]);
  });

  // === Component building blocks ===
  it("2 runes -> 50 G base premium (+ 5 first + 5 fee = 60)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    // base 50, first-insurance 5, fee 5 = 60
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("3 runes -> 60 G base premium (block applies); + 6 first + 5 fee = 71", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("4 runes -> 100 G base premium (no block - exactly 3 required); + 10 first + 5 fee = 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("7 runes -> 175 G base premium; + 17.5 first + 5 fee = 197.5 -> 198", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    // base 175, first 17.5, fee 5 = 197.5 -> rounded up 198
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types); + 7.5 first + 5 fee = 87.5 -> 88", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks); + 12 first + 5 fee = 137", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result.results).toEqual([{ premium: 137 }]);
  });

  // === Cursed surcharge ===
  it("cursed sword (0 years, first contract) -> 165 G (100 base + 50 curse + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });

  // === Multi-item modifier scope ===
  it("cursed sword + plain amulet (0 years, first contract) -> 100+60+50 curse +16 first +5 fee = 231", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(result.results).toEqual([{ premium: 231 }]);
  });

  // === High enchantment threshold ===
  it("sword with enchantment 5 -> high-enchantment surcharge: 100+30 +13 first +5 fee = 148", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    // base 100, surcharge 30, first ins 10% of 100 = 10, fee 5 = 145
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge: 100 + 10 first + 5 fee = 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 -> both surcharges: 100+50+30 +10 first +5 fee = 195", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result.results).toEqual([{ premium: 195 }]);
  });

  // === Loyalty discount threshold ===
  it("customer with 2 years -> 20% loyalty discount: sword 100 -20 +10 first +5 fee = 95", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year -> no loyalty discount: sword 100 +10 first +5 fee = 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  // === First insurance / follow-up contracts ===
  it("second quote step -> follow-up contract 15% discount: sword 100 -15 +10 first +5 fee = 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("first insurance surcharge applies on follow-up: 3yr customer 2nd contract with plain sword -> 100 +10 first -20 loyalty -15 follow +5 fee = 80", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // first: 100 -20 loyalty +10 first +5 fee = 95
    // second: 100 -20 -15 +10 +5 = 80
    expect(result.results).toEqual([{ premium: 95 }, { premium: 80 }]);
  });

  // === Rounding ===
  it("premium calculation yielding 197.5 G -> rounded up to 198 (7 runes)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result.results).toEqual([{ premium: 198 }]);
  });

  // === Integration examples ===
  it("integration: newcomer (0 years) with cursed sword (steel, enchantment 3) -> 165", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("integration: long-standing customer's 2nd contract (3yrs, cursed sword enchant 7) -> 160", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // first: 60 -12 loyalty +6 first +5 fee = 59
    // second: 100 +50 +30 -20 +10 -15 = 155 +5 = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // === Claim processing ===
  it("regular sword (steel, enchantment 3), damage 500 -> payout 400 (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250), damage 200 -> payout 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon-material sword, enchantment 9, damage 1000 -> payout 400 (50% wins then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 -> payout 700 (dragon only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 -> payout 400 (high-enchant only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 8, damage 1000 -> payout 400 (high-enchant applies at threshold)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // === Deductible per damage event ===
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim", policy: 0, incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // sword 500-100=400, amulet 300-100=200, total 600; cap 2*(1000+600)=3200 -> remaining 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // === Multiple items of same type ===
  it("policy covers two swords -> insurance sum 2000, cap 4000 (claim 200 -> remainingCap 3900)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // 200 - 100 = 100; remainingCap = 4000 - 100 = 3900
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("both swords damaged (two sword entries, 500 each) -> 400+400=800 payout", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim", policy: 0, incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages array has more entries of type than policy covers -> throws (whole claim rejected)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim", policy: 0, incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 200 },
            ],
          },
        },
      ],
    })).toThrow();
  });

  // === Cap exhaustion ===
  it("policy with sword + amulet -> insurance sum 1600, cap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // payout 100, remainingCap 3200 - 100 = 3100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword cap is based on unmodified insurance value: cap = 2*1000 = 2000", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    // 300 - 100 = 200; cap 2000 -> remaining 1800
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("sword + 3 runes -> insurance sum 1750, cap 3500 (block discount doesn't affect insurance sum)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // payout 100; cap 3500 - 100 = 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword cap 2000: two successive claims of 1500 -> 1400 then 600 (cap exhausted)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "a", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "b", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // === Rounding for payouts ===
  it("payout calculation yielding 350.5 G -> rounded down to 350 (steel sword enchant 9, damage 901)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    // 901 * 0.5 = 450.5; -100 = 350.5 -> 350 (floor)
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // === Edge cases ===
  it("quote with unknown item type (e.g. broomstick) -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item not in the policy (amulet damage on sword-only policy) -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim references an unknown item type -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount -> throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });

  // CLI smoke test
  it("CLI: schema example - amulet quote + claim returns proper JSON shape", async () => {
    const { execSync } = await import("node:child_process");
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const out = execSync(`node --import tsx src/cli.ts`, { input }).toString();
    const parsed = JSON.parse(out);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[0]).toHaveProperty("premium");
    expect(parsed.results[1]).toHaveProperty("payout");
    expect(parsed.results[1]).toHaveProperty("remainingCap");
  });
});
