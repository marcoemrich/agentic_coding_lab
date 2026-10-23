import { describe, expect, it } from "vitest";
import { processScenario } from "./scenario.js";

describe("scenario -- single-step quote", () => {
  it("a scenario with one empty quote step yields a single result {premium: 5}", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  it("a scenario with one quote for a plain sword yields {premium: 115}", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it("a scenario with one quote for a plain amulet yields {premium: 71}", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
});

describe("scenario -- multi-step with quote then claim", () => {
  it("quote step 0: sword → premium 115; claim step 1 against policy 0: damage 500 → payout 400, remainingCap 1600", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  it("quote step 0: sword + amulet → premium 181; claim step 1 against policy 0: damages sword 500 + amulet 300 → payout 600, remainingCap 2600", () => {
    const result = processScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  it("quote step 0: plain sword → premium 115; claim step 1: damage 1500 → payout 1400, remainingCap 600; claim step 2: damage 1500 → payout 600, remainingCap 0", () => {
    const result = processScenario({
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
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
});

describe("scenario -- multiple policies via separate quote steps", () => {
  it("quote step 0: sword (cap 2000); quote step 1: amulet (cap 1200); claim step 2 against policy 0: damage 1500 → payout 1400, remainingCap 600; claim step 3 against policy 1: damage 300 → payout 200, remainingCap 1000", () => {
    // Customer is a first-time customer so the amulet quote at index 1 still
    // gets the follow-up contract discount. The integration example clarifies
    // this — first insurance always applies, follow-up is policy-wide.
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { premium: 62 },
        { payout: 1400, remainingCap: 600 },
        { payout: 200, remainingCap: 1000 },
      ],
    });
  });

  it("quote step 0 → premium 115; claim step 1 against policy 0 → payout/remainingCap independent of any other step", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
});

describe("scenario -- integration example: newcomer with cursed sword", () => {
  it("scenario: customer 0 years, no prior contract; quote step 0: cursed sword (steel, enchantment 3); yields {premium: 165}", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
});

describe("scenario -- integration example: long-standing customer's second contract", () => {
  it("scenario: customer 3 years; quote step 0 (first quote) is a cursed sword (steel, enchantment 7) yielding premium 175 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 175 }] });
  });

  it("scenario: customer 3 years; quote step 1 (the customer's second quote, the spec's integration example) is a cursed sword (steel, enchantment 7) yielding premium 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] }, // first quote, just to bump the index
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 28 }, { premium: 160 }],
    });
  });
});

describe("scenario -- error propagation", () => {
  it("an unknown item type in a quote step rejects with a thrown error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  it("a damage entry referencing an item not on the policy rejects with a thrown error", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it("a damage entry with a negative amount rejects with a thrown error", () => {
    expect(() =>
      processScenario({
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

  it("more damages of a given item type than the policy covers rejects with a thrown error", () => {
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
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
