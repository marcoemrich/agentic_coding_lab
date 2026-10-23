import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";
import { runCli } from "./cli.js";

describe("MHPCO Claim Office", () => {
  // 1. Simplest case: Empty item list
  it("returns premium of 5 G (processing fee only) when quoting an empty item list", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(output).toEqual({ results: [{ premium: 5 }] });
  });

  // 2. Main item base premiums in isolation
  it("calculates quote for a single plain sword -- 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("calculates quote for a single plain amulet -- 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("calculates quote for a single plain staff -- 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("calculates quote for a single plain potion -- 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 49 }] });
  });

  // 3. Component base premiums and building block of 3 alike components
  it("calculates quote for 1 rune -- 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G rounded up to 33 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });
  it("calculates quote for 1 moonstone -- 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G rounded up to 33 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });
  it("calculates quote for 2 runes -- 50 G base + 5 G first insurance + 5 G fee = 60 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  it("calculates quote for 3 runes (building block of 3 alike components) -- 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("calculates quote for 4 runes (no block because block requires exactly 3) -- 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("calculates quote for 7 runes (no block) -- 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G rounded up to 198 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });
  it("calculates quote for 2 runes + 1 moonstone (no block because different component types) -- 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G rounded up to 88 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 88 }] });
  });
  it("calculates quote for 3 runes + 3 moonstones (two separate building blocks) -- 120 G base + 12 G first insurance + 5 G fee = 137 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });

  // 4. Item-specific premium modifiers and thresholds
  it("applies 50% cursed surcharge to a newcomer's cursed sword (steel, enchantment 3) -- 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G", () => {
    const output = processScenario({
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
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies 30% high-enchantment surcharge when enchantment is at threshold 5 -- sword (100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(output).toEqual({ results: [{ premium: 145 }] });
  });
  it("does not apply high-enchantment surcharge when enchantment is 4, and applies curse surcharge only if cursed -- cursed sword enchantment 4 gives 165 G", () => {
    const plainOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 4, cursed: false }] },
      ],
    });
    expect(plainOutput).toEqual({ results: [{ premium: 115 }] });

    const cursedOutput = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 4, cursed: true }] },
      ],
    });
    expect(cursedOutput).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies both high-enchantment and cursed surcharges when sword has enchantment 5 and is cursed -- 100 G base + 30 G high enchantment + 50 G curse + 10 G first insurance + 5 G fee = 195 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 195 }] });
  });
  it("applies item-specific cursed surcharge only to the cursed item on a multi-item policy -- cursed sword (100 G) and plain amulet (60 G) gives 160 G policy base + 50 G curse + 16 G first insurance + 5 G fee = 231 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });

  // 5. Customer and contract policy-wide modifiers & integration examples
  it("applies 20% loyalty discount when customer has exactly 2 years with MHPCO -- plain sword gives 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee = 95 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  it("does not apply loyalty discount when customer has 1 year with MHPCO -- plain sword gives 115 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies 15% follow-up contract discount on each contract after the first while keeping 10% first insurance surcharge -- long-standing customer (3 years) second quote with cursed sword (enchantment 7) gives 160 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 59 }, { premium: 160 }],
    });
  });

  // 6. Standard claim processing, deductibles, and insurance values / caps per item type
  it("processes standard claim on regular sword (steel, enchantment 3) with 500 G damage -- payout 400 G (500 - 100 deductible) and remainingCap 1600 G (2000 cap - 400)", () => {
    const output = processScenario({
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
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("processes standard claim on amulet with 200 G damage (schema example: 5 years customer, silver amulet enchantment 2) -- quote premium 59 G, claim payout 100 G and remainingCap 1100 G (1200 cap - 100)", () => {
    const output = processScenario({
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
    expect(output).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("processes standard claim on staff with 300 G damage -- payout 200 G and remainingCap 1400 G (1600 cap - 200)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "lightning",
            damages: [{ itemType: "staff", amount: 300 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 93 }, { payout: 200, remainingCap: 1400 }],
    });
  });
  it("processes standard claim on potion with 250 G damage -- payout 150 G and remainingCap 650 G (800 cap - 150)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "drop",
            damages: [{ itemType: "potion", amount: 250 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 49 }, { payout: 150, remainingCap: 650 }],
    });
  });
  it("processes standard claim on rune (insurance value 250 G) with 200 G damage -- payout 100 G and remainingCap 400 G (500 cap - 100)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "surge",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("processes standard claim on moonstone (insurance value 250 G) with 200 G damage -- payout 100 G and remainingCap 400 G (500 cap - 100)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "surge",
            damages: [{ itemType: "moonstone", amount: 200 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("clamps damage reimbursement to 0 G when damage after clause is less than the 100 G deductible -- sword with 50 G damage gives payout 0 G and remainingCap 2000 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
    });
  });

  // 7. Claim clauses: High enchantment (>= 8) vs dragon material and rounding down
  it("reimburses dragon-material sword with enchantment 5 at 100% minus deductible -- 800 G damage gives payout 700 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("reimburses steel sword with enchantment 9 at 50% before deductible -- 1000 G damage gives payout 400 G (500 - 100)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("reimburses dragon-material sword at exact enchantment threshold 8 at 50% before deductible -- 1000 G damage gives payout 400 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("reimburses dragon-material sword with enchantment 9 at 50% before deductible (50% rule wins over dragon material) -- 1000 G damage gives payout 400 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("reimburses steel sword with enchantment 7 at 100% before deductible (below enchantment 8 threshold) -- 500 G damage gives payout 400 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rounds fractional claim payout down in MHPCO's favor -- enchantment 8 sword with 901 G damage yields 450.5 G - 100 G = 350.5 G rounded down to 350 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // 8. Multi-item claims, multiple items of the same type, and cap exhaustion
  it("applies 100 G deductible once per damaged item in a multi-item incident -- sword (500 G damage) and amulet (300 G damage) gives payout 600 G and remainingCap 2600 G (3200 cap - 600)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
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
    expect(output).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("handles multiple insured items of the same type with separate deductibles -- policy with two swords (sum 2000 G, cap 4000 G) and two sword damages of 500 G each gives payout 800 G and remainingCap 3200 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
        },
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
    expect(output).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });
  it("matches damaged item against the policy item of that type yielding the lowest payout in MHPCO's favor when multiple items of the same type have different enchantment levels", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", enchantment: 2 },
            { type: "sword", enchantment: 9 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 1000 },
              { itemType: "sword", amount: 600 },
            ],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 255 }, { payout: 900, remainingCap: 3100 }],
    });
  });
  it("bases policy cap on unmodified insurance values regardless of cursed modifier or 3-component building block discount -- cursed sword + 3 runes has insurance sum 1750 G and cap 3500 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [{ premium: 231 }, { payout: 400, remainingCap: 3100 }],
    });
  });
  it("caps total payout across successive claims at twice the insurance sum -- sword (cap 2000 G) with two successive 1500 G claims yields payout 1400 G (remainingCap 600 G) then payout 600 G (remainingCap 0 G)", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle 1",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle 2",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(output).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // 9. Rejection / Error cases (thrown Error in domain and non-zero exit + stderr + empty stdout in CLI)
  it("rejects quote containing an unknown item type (e.g. broomstick) by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(Error);
  });
  it("rejects claim referencing an item type not covered by the policy (e.g. amulet when only sword is insured, or unknown item type) by throwing an Error", () => {
    expect(() =>
      processScenario({
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
    ).toThrow(Error);

    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("rejects claim containing more damage entries of a given type than the policy covers (e.g. two sword damages when only one sword is insured) by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("rejects claim containing a negative damage amount (e.g. amount -200) by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fraud",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("rejects claim referencing a non-existent or non-quote policy step index by throwing an Error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "claim",
            policy: 99,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/Policy not found/);
  });

  // 10. CLI end-to-end execution (stdin JSON -> stdout JSON / stderr + non-zero exit code)
  it("CLI executable src/cli.ts reads scenario JSON from stdin, writes results JSON to stdout, and exits with code 0", () => {
    const input = JSON.stringify({
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
    let stdout = "";
    let stderr = "";
    const exitCode = runCli(input, {
      writeStdout: (text) => {
        stdout += text;
      },
      writeStderr: (text) => {
        stderr += text;
      },
    });
    expect(exitCode).toBe(0);
    expect(stderr).toBe("");
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });

    const proc = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(proc.status).toBe(0);
    expect(proc.stderr).toBe("");
    expect(JSON.parse(proc.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI executable src/cli.ts exits with non-zero status code, writes error description to stderr, and writes nothing to stdout on invalid scenario", () => {
    const invalidInput = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    let stdout = "";
    let stderr = "";
    const exitCode = runCli(invalidInput, {
      writeStdout: (text) => {
        stdout += text;
      },
      writeStderr: (text) => {
        stderr += text;
      },
    });
    expect(exitCode).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr.length).toBeGreaterThan(0);

    const proc = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: invalidInput,
      encoding: "utf8",
    });
    expect(proc.status).not.toBe(0);
    expect(proc.stdout).toBe("");
    expect(proc.stderr.length).toBeGreaterThan(0);
  });
});
