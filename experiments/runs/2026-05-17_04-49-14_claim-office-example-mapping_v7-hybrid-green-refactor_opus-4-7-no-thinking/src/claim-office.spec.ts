import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — base premiums and processing fee
  it("empty item list yields premium of 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("quote for newcomer's single plain sword (steel, enchantment 3) yields 115 G", () => {
    // 100 base + 10 first insurance (per item) = 110, + 5 fee = 115 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote for newcomer's single plain amulet yields 71 G", () => {
    // 60 + 6 first ins = 66, + 5 fee = 71
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote for newcomer's single plain staff yields 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("quote for newcomer's single plain potion yields 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Components and blocks
  it("quote for 2 runes yields 60 G (50 base + 5 first ins, rounded up + 5 fee)", () => {
    // 2 runes: 2*25 = 50 base + 5 first ins (10%) + 5 fee = 60
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("quote for 3 runes applies block, yielding 71 G", () => {
    // 3 runes block: 60 base + 6 first ins (10%) + 5 fee = 71
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quote for 4 runes yields 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quote for 7 runes yields 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array(7).fill({ type: "rune" }),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("quote for 2 runes + 1 moonstone yields 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("quote for 3 runes + 3 moonstones applies two blocks, yielding 137 G", () => {
    const result = runScenario({
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
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Item-specific modifiers
  it("cursed sword (steel, enchantment 3) for newcomer yields 165 G", () => {
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("sword with enchantment 5 adds 30% high-enchantment surcharge", () => {
    // 100 + 30 + 10 = 140 + 5 = 145
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 has no high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 5 stacks both surcharges", () => {
    // 100 + 50 + 30 + 10 = 190 + 5 = 195
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // Policy-wide modifiers
  it("customer with exactly 2 years applies 20% loyalty discount", () => {
    // sword: 100 base - 20 loyalty + 10 first ins = 90 + 5 fee = 95
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("first insurance is implicit in all single-quote tests above; verified by 115 for sword", () => {
    // sanity: this is already covered by the plain sword test
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("follow-up contract applies 15% discount on contracts after the first", () => {
    // customer with 0 years, two quotes: each item is "first insurance".
    // Second quote: 100 base + 10 first ins - 15 follow-up = 95 + 5 fee = 100
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // Multi-item modifier scope
  it("cursed surcharge applies only to the cursed item, not to whole policy", () => {
    // cursed sword (100) + amulet (60) -> 160 policy base
    // cursed surcharge: 50% of cursed sword's 100 = 50
    // first insurance: 10% of 160 = 16
    // total: 160 + 50 + 16 + 5 = 231
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // Rounding
  it("premium is rounded up to whole G (MHPCO's favor)", () => {
    // 7 runes: 7*25 = 175 base, +17.5 first ins = 192.5, +5 fee = 197.5 -> 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array(7).fill({ type: "rune" }),
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // Integration examples
  it("integration: newcomer with cursed sword yields 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("integration: long-standing customer's second contract with cursed enchanted sword yields 160 G", () => {
    // customer 3 years, 2nd quote, cursed sword (steel, enchantment 7)
    // 100 base + 50 curse + 30 high enchant - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 fee = 160
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim — basic processing
  it("claim on a regular sword with 500 G damage yields payout 400 G after deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune with 200 G damage yields payout 100 G after deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim on enchantment-9 sword (steel) with 1000 G damage yields payout 400 G", () => {
    // 50% (high enchantment) = 500, then -100 deductible = 400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a dragon-material sword with 800 G damage yields full payout 700 G", () => {
    // dragon material = full reimbursement, then -100 deductible = 700
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword with enchantment 9 and 1000 G damage yields payout 400 G", () => {
    // both clauses apply: 50% rule wins (more conservative) → 500, then -100 = 400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  it("multiple damaged items each incur their own deductible", () => {
    // sword 500 → 400, amulet 300 → 200; total 600
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
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
    // cap = 2 * (1000+600) = 3200; remaining = 3200 - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Cap
  it("payout is capped at twice the insurance sum across successive claims", () => {
    // sword, cap=2000; two claims of 1500 each
    // first: 1500-100=1400, cap remaining 2000-1400=600
    // second: 1500-100=1400 but cap=600, so payout=600, remaining 0
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("claim references unknown item rejects the claim", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
        },
      ],
    })).toThrow();
  });

  // CLI errors
  it("quote with unknown item type rejects the quote", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "broomstick" } as never] },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount is rejected", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    })).toThrow();
  });
});
