import { describe, it, expect } from "vitest";
import { basePremium, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums for main items (price list) ---
  it("basePremium: a sword → 100 G base premium", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("basePremium: an amulet → 60 G base premium", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("basePremium: a staff → 80 G base premium", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("basePremium: a potion → 40 G base premium", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  // --- Component pricing and the building block of 3 alike components ---
  it("basePremium: a single rune → 25 G base premium", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });
  it("basePremium: 2 runes → 50 G base premium (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("basePremium: 3 runes → 60 G base premium (block applies)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("basePremium: 4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("basePremium: 7 runes → 175 G base premium", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(runes)).toBe(175);
  });

  // --- "Alike" components: block requires same type ---
  it("basePremium: 2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("basePremium: 3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(120);
  });

  // --- Processing fee and empty policy ---
  it("quote: empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0].premium).toBe(5);
  });

  // --- Individual premium modifiers ---
  it("quote: newcomer with a cursed sword (0 yrs, steel, enchantment 3) → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(165);
  });
  it("quote: high-enchantment surcharge applies at exactly enchantment 5", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(145);
  });
  it("quote: enchantment 4 → no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(115);
  });
  it("quote: cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(195);
  });
  it("quote: customer with exactly 2 years → loyalty discount applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(95);
  });

  // --- Modifier scope on multi-item policies ---
  it("quote: cursed surcharge is 50% of the cursed item's base premium, not of the policy total", () => {
    const result = runScenario({
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
    expect(result.results[0].premium).toBe(231);
  });
  it("quote: each item in a quote is treated as a first insurance regardless of customer history", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0].premium).toBe(95);
  });

  // --- Integration examples ---
  it("quote: long-standing customer's second contract, cursed sword enchantment 7 (3 yrs) → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result.results[1].premium).toBe(160);
  });

  // --- Rounding in the MHPCO's favor ---
  it("quote: a premium that yields 197.5 G → final premium 198 G (rounded up)", () => {
    // moonstone: 25 base + 2.5 first-insurance + 5 fee = 32.5 → rounds up to 33
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result.results[0].premium).toBe(33);
  });
  it("claim: a payout that yields 350.5 G → final payout 350 G (rounded down)", () => {
    // sword enchantment 9: 901 * 0.5 = 450.5, − 100 deductible = 350.5 → rounds down to 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "curse", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(350);
  });

  // --- Claim processing: standard reimbursement ---
  it("claim: regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("claim: rune (value 250 G), damage 200 G → payout 100 G (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(400);
  });

  // --- Claim processing: enchantment threshold vs dragon material ---
  it("claim: dragon-material sword enchantment 8, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(400);
  });
  it("claim: dragon-material sword enchantment 5, damage 800 G → payout 700 G (full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(700);
  });
  it("claim: steel sword enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(400);
  });
  it("claim: dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(400);
  });

  // --- Deductible per damage event ---
  it("claim: dragon attack damages sword 500 G and amulet 300 G → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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
    expect(result.results[1].payout).toBe(600);
  });

  // --- Multiple items of the same type ---
  it("claim: two swords, damages to both → each entry is a separate damage with its own deductible", () => {
    const result = runScenario({
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.results[1].payout).toBe(800);
    expect(result.results[1].remainingCap).toBe(3200);
  });
  it("claim: more damage entries of a type than the policy covers → whole claim rejected (throws)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
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
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });

  // --- Insurance sum and cap ---
  it("claim: cursed sword cap is 2000 G, based on the unmodified insurance value", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1].remainingCap).toBe(1100);
  });
  it("claim: sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    expect(result.results[1].remainingCap).toBe(3000);
  });
  it("claim: sword + 3 runes (block) → insurance sum 1750 G (block affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1].remainingCap).toBe(3400);
  });

  // --- Cap exhaustion across successive claims ---
  it("claim: sword (cap 2000 G), two 1500 G claims → 1400 G (rem 600), then 600 G (rem 0)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
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
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // --- Error handling / edge cases ---
  it("quote: unknown item type (e.g. broomstick) → throws (non-zero exit, error to stderr)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim: damage entry for an item not in the policy → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim: damage entry with a negative amount → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fraud", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  // --- End-to-end multi-step scenario (CLI shape) ---
  it("runScenario: quote then claim produces results in the same order as steps", () => {
    const result = runScenario({
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.results).toHaveLength(2);
    expect(result.results[0].premium).toBe(59);
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(1100);
  });
});
