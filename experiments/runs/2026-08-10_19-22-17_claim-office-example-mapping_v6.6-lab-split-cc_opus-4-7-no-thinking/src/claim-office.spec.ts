import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Basics: empty and simplest quotes ===
  it("empty item list → premium 5 G (only processing fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const output = runScenario(scenario);
    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword (steel, ench 3, not cursed), newcomer → premium = 100 base + 10 first + 5 fee = 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    };
    const output = runScenario(scenario);
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (silver, ench 0), newcomer → premium = 60 + 6 + 5 = 71 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    };
    const output = runScenario(scenario);
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (wood, ench 0), newcomer → premium = 80 + 8 + 5 = 93 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion, newcomer → premium = 40 + 4 + 5 = 49 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });

  // === Components ===
  it("single rune, newcomer → premium = 25 + 3 (rounded up from 2.5) + 5 = 33 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone, newcomer → premium = 25 + 3 + 5 = 33 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes, newcomer → 50 base × 1.10 + 5 fee = 60 G (no block)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes, newcomer → block base 60 × 1.10 + 5 = 71 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes, newcomer → base 100 × 1.10 + 5 = 115 G (no block)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes, newcomer → 175 base × 1.10 + 5 = 197.5 rounded up to 198 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone, newcomer → 75 base × 1.10 + 5 = 88 G (no block)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones, newcomer → 60+60 base × 1.10 + 5 = 137 G (two blocks)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // === Item-specific modifiers ===
  it("cursed sword (ench 3), newcomer → 100 + 50 curse + 10 first + 5 fee = 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword ench=5, newcomer → 100 + 30 high-ench + 10 first + 5 fee = 145 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword ench=4, newcomer → 100 + 10 first + 5 fee = 115 G (no ench surcharge)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword ench=5, newcomer → 100+50+30+10+5 = 195 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });

  // === Policy-wide modifiers ===
  it("sword, 2yr customer, first quote → 100 - 20 loyalty + 10 first + 5 fee = 95 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("sword, 1yr customer → 100 + 10 first + 5 fee = 115 G (no loyalty)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("plain sword newcomer confirms 10% first-insurance surcharge is applied → 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("2nd quote in scenario: plain sword newcomer → 100 + 10 first - 15 follow-up + 5 fee = 100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    };
    const out = runScenario(scenario);
    expect((out.results[1] as { premium: number }).premium).toBe(100);
  });

  // === Modifier scope on multi-item policies ===
  it("cursed sword + plain amulet, newcomer → 160 base * 1.10 first + 50 curse + 5 fee = 231 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // === Rounding ===
  it("premium yielding 197.5 G → rounded up to 198 G (7 runes)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("simple claim: regular sword (ench 3), damage 500 → payout 400, remainingCap 1600", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    const out = runScenario(scenario);
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // === Claim: standard reimbursement ===
  it("regular sword damage 500 → payout 400 (already covered by simple-claim test above, characterization)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    };
    const out = runScenario(scenario);
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 → payout 100, remainingCap 400", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // === Claim: cap ===
  it("two 1500 claims on sword (cap 2000): first payout 1400 cap 600, second payout 600 cap 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "a", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "b", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    const out = runScenario(scenario);
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("cursed sword: cap based on unmodified insurance value → 2000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + amulet: insurance sum 1600, cap 3200", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 10000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("sword + 3 runes: insurance sum 1750, cap 3500", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 10000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  // === Claim: enchantment threshold ===
  it("steel sword ench 9 damage 1000 → payout 400", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 8 damage 1000 → payout 400", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 9 damage 1000 → payout 400 (50% wins)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 5 damage 800 → payout 700 (dragon full)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // === Claim: deductible per damage event ===
  it("dragon attack damages sword (500) + amulet (300) → payout 600, two deductibles", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // === Multiple items of same type ===
  it("two swords: insurance sum 2000, cap 4000", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 10000 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("dragon attack on both swords: each entry has own deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages has more entries of a type than policy covers → throws (CLI exits non-zero)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 100 },
          { itemType: "sword", amount: 100 },
        ] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  // === Integration examples ===
  it("newcomer 0y cursed sword steel ench 3 → premium 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("3y customer 2nd quote cursed sword steel ench 7 → premium 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect((runScenario(scenario).results[1] as { premium: number }).premium).toBe(160);
  });

  // === CLI error handling ===
  it("quote with unknown item type → throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim references item not in policy → throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim with negative damage amount → throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
