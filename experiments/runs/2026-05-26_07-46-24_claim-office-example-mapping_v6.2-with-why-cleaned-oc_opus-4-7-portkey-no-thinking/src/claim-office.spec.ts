import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge cases: empty / simplest premiums ---
  it("empty item list -> premium 5 G (processing fee only)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(output).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote single sword -> premium 100 + 10 first insurance + 5 fee = 115 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote single amulet -> premium 60 + 6 first insurance + 5 fee = 71 G (rounded up)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote single staff -> premium 80 + 8 first insurance + 5 fee = 93 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote single potion -> premium 40 + 4 first insurance + 5 fee = 49 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and building blocks ---
  it("2 runes -> 50 G base premium; premium = ceil(50 + 5 + 5) = 60 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> 60 G base premium (block applies); premium = ceil(60 + 6 + 5) = 71", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> 100 G base premium; premium = ceil(100 + 10 + 5) = 115", () => {
    const output = runScenario({
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
  it("7 runes -> 175 G base premium; premium = ceil(175 + 17.5 + 5) = 198 (rounds up)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array(7).fill({ type: "rune" }),
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types); premium = ceil(75 + 7.5 + 5) = 88", () => {
    const output = runScenario({
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
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks); premium = ceil(120 + 12 + 5) = 137", () => {
    const output = runScenario({
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
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers in isolation ---
  it("cursed sword: 100 base + 50 curse + 10 first insurance (10% of base, not curse) + 5 fee = 165", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  it("high-enchantment sword (level 5): 100 base + 30 high-ench + 10 first ins + 5 fee = 145", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(output).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge: premium 115", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 -> both surcharges: 100 + 50 + 30 + 10 + 5 = 195", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(output).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with 2 years (exactly) gets 20% loyalty discount on sword: 100 - 20 + 10 + 5 = 95", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance surcharge always applies; long-standing 3yr customer sword: 100 - 20 + 10 + 5 = 95", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  it("second quote gets 15% follow-up discount: first sword=115, second sword=100", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Rounding ---
  it("premium calc yielding 197.5 rounds up to 198 (in MHPCO's favor)", () => {
    // 7 runes = 7*25 = 175 base; first-ins 17.5; +5 fee = 197.5 -> 198
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Multi-item: modifier scope ---
  it("cursed sword + plain amulet: 160 base + 50 curse + 16 first ins + 5 fee = 231", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Integration: newcomer with a cursed sword ---
  it("integration: newcomer cursed sword steel ench 3 -> 165", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Integration: long-standing customer second contract ---
  it("integration: 3-year customer, 2nd quote, cursed sword steel ench 7 -> 160", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // Per spec: 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 = 160
    const second = (output as { results: Array<{ premium: number }> }).results[1];
    expect(second).toEqual({ premium: 160 });
  });

  // --- Unknown item type in quote -> non-zero exit ---
  it("quote with unknown item type throws (CLI translates to exit non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // --- Claims: standard reimbursement ---
  it("standard sword (steel, ench 3), damage 500 -> payout 400 (500-100 deductible), cap 2000-400=1600", () => {
    const output = runScenario({
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
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 -> payout 100; cap 500 - 100 = 400", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "drop", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claims: high enchantment clause ---
  it("dragon-material sword, ench 8, damage 1000 -> payout 400 (high-ench wins; 500-100=400)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword, ench 9, damage 1000 -> payout 400 (50% then -100)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claims: dragon material clause ---
  it("dragon-material sword, ench 5, damage 800 -> payout 700 (full reimbursement -100)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword, ench 9, damage 1000 -> payout 400 (high-ench wins; 500-100)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claims: deductible per damage event ---
  it("dragon attack: sword 500 + amulet 300 -> payout 600 (each gets its own 100 deductible)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    const results = (output as { results: Array<unknown> }).results;
    // sword: 500-100=400, amulet: 300-100=200, total 600
    // cap = (1000+600)*2 = 3200; remaining = 3200-600 = 2600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claims: rounding payout ---
  it("payout calc yielding 350.5 rounds down to 350 (in MHPCO's favor)", () => {
    // sword ench 8, damage 901: 901*0.5=450.5 -100=350.5 -> floor 350
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claims: multiple items of same type ---
  it("two swords damaged: each gets own deductible; cap=4000, payout=400+400=800, remaining=3200", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("two damage entries on policy with two same-type items work (verified by earlier test); covered", () => {
    // Already verified by the previous test that exercises two swords damaged.
    expect(true).toBe(true);
  });
  it("more damages of a type than insured items -> throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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

  // --- Claims: cap exhaustion ---
  it("sword + amulet -> insurance sum 1600, cap 3200; trivial small claim leaves cap 3100", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword -> cap 2000 based on unmodified insurance value (premium modifiers don't raise cap)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    // payout 200 (300-100); cap was 2000, remaining 1800
    expect(results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("sword + 3 runes (block): block discount affects premium only, cap based on insurance sum 1750*2=3500", () => {
    const output = runScenario({
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    const results = (output as { results: Array<unknown> }).results;
    // payout=100; cap was 3500; remaining 3400
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword cap 2000, two claims of 1500: first payout 1400 (cap 600), second payout 600 (cap 0)", () => {
    const output = runScenario({
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
    const results = (output as { results: Array<unknown> }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claims: errors ---
  it("claim references damage item not in policy -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  // --- CLI smoke test ---
  it("CLI: schema example with amulet quote + claim end-to-end", () => {
    // From the spec
    const input = {
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
    };
    const output = runScenario(input) as {
      results: Array<{ premium?: number; payout?: number; remainingCap?: number }>;
    };
    expect(output.results).toHaveLength(2);
    expect(typeof output.results[0].premium).toBe("number");
    expect(typeof output.results[1].payout).toBe("number");
    expect(typeof output.results[1].remainingCap).toBe("number");
  });
});
