import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty policy ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(results).toEqual([{ premium: 5 }]);
  });

  // --- Base premiums for main items (single item, newcomer 0 yrs, first insurance) ---
  // These verify the base price list. Newcomer first insurance adds 10%; +5 fee.
  // To keep early tests focused on the base, we use a customer where modifiers cancel
  // or are explicitly accounted for in the description.

  it("single sword, base premium 100 G → premium with first-insurance 10% + fee = 115 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("single amulet, base premium 60 G → premium 71 G (60 +6 first +5 fee)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("single staff, base premium 80 G → premium 93 G (80 +8 first +5 fee)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("single potion, base premium 40 G → premium 49 G (40 +4 first +5 fee)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Components: 250 G value / 25 G base premium each ---
  it("single rune, base premium 25 G → premium 32.5 rounded up 33 G (25 +2.5 first +5 fee)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });
  it("single moonstone, base premium 25 G → premium 33 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(results).toEqual([{ premium: 33 }]);
  });

  // --- Building block of 3 alike components ---
  it("2 runes → 50 G base premium (60 with first +fee)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(results).toEqual([{ premium: 60 }]);
  });
  it("3 runes → 60 G base premium (block applies) → premium 71", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(results).toEqual([{ premium: 71 }]);
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3) → premium 115", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("7 runes → 175 G base premium (no block applies; 7×25) → premium 198", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });

  // --- 'Alike' = same type ---
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → premium 88", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });
    expect(results).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → premium 137", () => {
    const { results } = runScenario({
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
    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword (newcomer, ench 3): 100 base +50 curse +10 first +5 fee = 165 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment exactly 5 → high-enchantment surcharge applies (+30%) → premium 145", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    expect(results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge → premium 115", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("customer with exactly 2 years → 20% loyalty discount applies → premium 95", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(results).toEqual([{ premium: 95 }]);
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (base 100) + plain amulet (base 60): curse adds 50 (50% of cursed item base, not policy total) → premium 231", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Rounding ---
  it("premium calculation yielding 197.5 G → 198 G (rounded up)", () => {
    // 7 runes, newcomer: base 175 + 17.5 first + 5 fee = 197.5 → ceil 198
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("payout calculation yielding 350.5 G → 350 G (rounded down)", () => {
    // steel sword ench 8, damage 901: 901*0.5 = 450.5, -100 deductible = 350.5 → floor 350
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 → payout 400 (full minus 100 deductible)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("damage to a rune (value 250), damage 200 → payout 100 (full minus 100 deductible)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });

  // --- Claim: enchantment threshold ---
  it("steel sword, ench 9, damage 1000 → payout 400 (50% then deductible: 500-100)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword, ench 5, damage 800 → payout 700 (dragon full reimburse, then deductible)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });
  it("dragon-material sword, ench 9, damage 1000 → payout 400 (50% wins, then deductible)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword, ench 8, damage 1000 → payout 400 (high-ench clause then deductible)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible once per item)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });

  // --- Claim: cap ---
  it("policy covers sword + amulet → insurance sum 1600, cap 3200 (huge damage capped)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    expect(results).toEqual([{ premium: 181 }, { payout: 3200, remainingCap: 0 }]);
  });
  it("cursed sword (premium 165) → cap 2000 (based on unmodified insurance value, not premium modifiers)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 5000 }] } },
      ],
    });
    expect(results).toEqual([{ premium: 165 }, { payout: 2000, remainingCap: 0 }]);
  });
  it("policy covers sword + 3 runes (block) → insurance sum 1750 (block affects premium only, not sum)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    expect(results).toEqual([{ premium: 181 }, { payout: 3500, remainingCap: 0 }]);
  });
  it("two swords → insurance sum 2000, cap 4000 (huge damage capped)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 9000 }] },
        },
      ],
    });
    expect(results).toEqual([{ premium: 225 }, { payout: 4000, remainingCap: 0 }]);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("sword (cap 2000); two successive claims of 1500 → 1400/remaining 600, then 600/remaining 0", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- Multiple items of same type in damages ---
  it("two swords insured; damages has two sword entries → each is a separate damage with own deductible", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results).toEqual([{ premium: 225 }, { payout: 600, remainingCap: 3400 }]);
  });
  it("damages has more entries of a type than insured (two sword damages, one sword) → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- Edge cases (CLI errors) ---
  it("quote with unknown item type (broomstick) → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy (amulet damaged, only sword insured) → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim damage with amount -200 → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });

  // --- Integration examples ---
  it("newcomer cursed sword (steel ench 3): premium 165 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("long-standing (3 yrs) second contract, cursed sword (steel ench 7): premium 160 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  // --- CLI end-to-end (schema example) ---
  it("CLI: scenario with quote + claim returns results array of matching length and shape", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const out = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    const parsed = JSON.parse(out);
    expect(parsed.results).toHaveLength(2);
    expect(typeof parsed.results[0].premium).toBe("number");
    expect(typeof parsed.results[1].payout).toBe("number");
    expect(typeof parsed.results[1].remainingCap).toBe("number");
  });
});
