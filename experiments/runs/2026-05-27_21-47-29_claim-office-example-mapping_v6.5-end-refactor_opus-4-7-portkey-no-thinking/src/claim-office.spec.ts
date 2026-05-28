import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Simplest case
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums per item type
  it("newcomer single sword → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("newcomer single amulet → premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("newcomer single staff → premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("newcomer single potion → premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 49 }] });
  });

  // Components and blocks
  it("newcomer 2 runes → premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 60 }] });
  });
  it("newcomer 3 runes → premium 71 G (60 block base + 6 first insurance + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("newcomer 4 runes → premium 115 G (100 base, no block, +10 +5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("newcomer 7 runes → premium 198 G (175 base, no block, +17.5 +5 → ceil 198)", () => {
    const items = Array(7).fill({ type: "rune" });
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(out).toEqual({ results: [{ premium: 198 }] });
  });
  it("newcomer 2 runes + 1 moonstone → premium 88 G (75 base, no block, +7.5 +5 → ceil 88)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 88 }] });
  });
  it("newcomer 3 runes + 3 moonstones → premium 137 G (120 base = 2 blocks, +12 +5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers (cursed, high enchantment)
  it("newcomer cursed sword → premium 165 G (100 + 50 curse + 10 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("newcomer sword enchantment 5 → premium 145 G (100 + 30 high-ench + 10 + 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 145 }] });
  });
  it("newcomer sword enchantment 4 → premium 115 G (no high-ench surcharge)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("newcomer cursed sword ench 5 → premium 195 G (100+50+30+10+5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("2-year customer sword → premium 95 G (100 base + 10 first ins − 20 loyalty + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 95 }] });
  });
  it("newcomer two quotes; second is follow-up → 15% follow-up discount on policy base", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Modifier scope examples
  it("newcomer cursed sword + plain amulet → premium 231 G (160 base + 50 curse + 16 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 231 }] });
  });

  // Integration examples
  it("newcomer with cursed sword (steel, ench 3) → premium 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });
  it("3-year customer, second quote, cursed sword (steel, ench 7) → premium 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // Rounding — covered by "newcomer 7 runes" above (175 base → 198 G)

  // Errors during quote
  it("unknown item type → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/unknown item type/i);
  });

  // Claims — basic
  it("regular sword (ench 3) damage 500 → payout 400, remainingCap 1600 (full minus 100 deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 → payout 100 (no special clause)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon-material sword ench 8 damage 1000 → payout 400 (50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 9 damage 1000 → payout 400 (50% wins, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword ench 5 damage 800 → payout 700 (full reimburse minus deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9 damage 1000 → payout 400 (high-enchantment clause)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  it("sword (dmg 500) + amulet (dmg 300) → total payout 600 (deductible per item)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Multi-item same type
  it("two swords both damaged → each treated as separate damage with own deductible (cap 4000)", () => {
    const out = runScenario({
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim references more sword damages than insured swords → throws", () => {
    expect(() =>
      runScenario({
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
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/i);
  });

  // Cap behaviour — sum 1600/cap 3200 covered by sword+amulet damage test above
  it("cursed sword → cap 2000 (cap based on unmodified insurance value, not modified premium)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("sword + 3 runes (block) → premium uses block discount (181), cap uses full insurance sum (3500)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4000 }] },
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 181 });
    expect(out.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("two successive 1500 claims on sword (cap 2000): first 1400 (cap 600), second 600 (cap 0)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Payout rounding
  it("payout yielding 350.5 → final 350 (rounded down in MHPCO's favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Claim errors
  it("claim references damage for item not in policy → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
    ).toThrow(/amulet/i);
  });
  it("claim damage amount negative → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(/negative|amount/i);
  });

  // CLI schema example
  it("schema example: amulet quote then fire claim → returns premium and payout/remainingCap", () => {
    const out = runScenario({
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
    });
    expect(out).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
});
