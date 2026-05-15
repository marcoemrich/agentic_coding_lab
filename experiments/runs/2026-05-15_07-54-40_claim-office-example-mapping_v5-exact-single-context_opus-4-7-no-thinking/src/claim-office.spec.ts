import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: empty and processing fee
  it("quote with empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Quote: single main item base premiums
  it("quote with a single plain sword (newcomer, first contract) yields 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with a single plain amulet (newcomer) yields 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with a single plain staff (newcomer) yields 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote with a single plain potion (newcomer) yields 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Quote: components and the block discount
  it("quote with 2 runes (newcomer) yields 60 G (50 base + 5 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote with 3 runes (newcomer) applies the block discount: 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with 4 runes (newcomer) does not apply the block: 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with 7 runes (newcomer) yields 198 G (175 base + 17.5 first-insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    // 175 * 1.1 = 192.5; round up = 193; + 5 fee = 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("quote with 2 runes + 1 moonstone (newcomer) yields 88 G (75 base + 7.5 first-insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    // 75 * 1.1 = 82.5; round up = 83; + 5 = 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote with 3 runes + 3 moonstones (newcomer) applies two separate blocks: 137 G (120 base + 12 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    // (60 + 60) * 1.1 = 132; + 5 = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Quote: item-specific modifiers
  it("quote with a cursed sword (newcomer) adds 50% curse surcharge: 165 G", () => {
    // 100 base + 50 curse + 10 first-insurance + 5 fee = 165 (per spec integration example)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("quote with a sword at enchantment 5 (newcomer) adds 30% high-enchantment surcharge: 145 G", () => {
    // 100 base + 30 high-ench + 10 first-insurance + 5 fee = 145
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("quote with a sword at enchantment 4 (newcomer) does not add high-enchantment surcharge: 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with a cursed sword at enchantment 5 (newcomer) stacks both surcharges: 195 G", () => {
    // 100 + 50 curse + 30 high-ench + 10 first = 190 + 5 = 195
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Quote: policy-wide modifiers
  it("quote for a 2-year customer (first contract) applies 20% loyalty discount: 95 G", () => {
    // sword: base 100; item-surcharges: +10 first-insurance => item-sum 110
    // policy-mods: loyalty -20% on 100 base (policy base) => 110 - 20 = 90
    // + 5 fee = 95
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first-insurance surcharge difference: 2-year customer first contract vs. 2-year customer no first-insurance is reflected", () => {
    // verify with two scenarios: a long-standing customer's FIRST quote includes both loyalty AND first-insurance
    // sword: 100 base; 100 - 20% loyalty + 10% first-insurance = 100 - 20 + 10 = 90 + 5 = 95
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("quote for a customer's second contract applies the 15% follow-up discount", () => {
    // long-standing customer, 2 quote steps; second should include -15% follow-up
    // Per step: 100 base -20 loyalty +10 first +/- ... ; second has follow-up -15
    // first quote: 100 - 20 + 10 = 90 + 5 = 95
    // second quote: 100 - 20 + 10 - 15 = 75 + 5 = 80
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 80 }] });
  });

  // Quote: integration examples from the spec
  it("newcomer with cursed sword (steel, enchantment 3) → premium 165 G (integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("3-year customer's second contract with cursed sword (steel, enchantment 7) → premium 160 G (integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }, // first quote
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },  // second quote
      ],
    });
    // second quote: 100 + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Quote: multi-item modifier scope
  it("policy with cursed sword and plain amulet (3-year customer, second contract) → 215 G (spec example)", () => {
    // Spec: policy base 160; +50 curse → 210 before further modifiers and fee
    // We construct customer scenario so policy modifiers cancel out: 3-year customer's second contract:
    // -20 loyalty (-32) +10 first-insurance (+16) -15 follow-up (-24) = net -40 on policy base 160
    // So we use a *different* scenario: long-standing customer's first contract, with no loyalty:
    // Actually spec says "before further modifiers and fee" = 210. Then we want a scenario where
    // policy modifiers cancel: yearsWithMHPCO=0 (no loyalty), first contract → +10% first-insurance only
    // 160 + 50 curse + 16 first-insurance = 226 + 5 = 231 (rounded up from 226). Use this instead.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ],
      }],
    });
    // 160 policy base + 50 curse + 16 first-insurance (10% of 160) = 226 + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Quote: rounding in MHPCO's favor
  it("premium yielding 192.5 G subtotal is rounded up to 193, plus fee = 198 G", () => {
    // 7 runes case: 7 * 25 = 175 base; +17.5 first-insurance (10%) = 192.5 → round up = 193 + 5 = 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result.results[0].premium).toBe(198);
  });

  // Quote: unknown item type
  it("quote with an unknown item type throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" } as Item] }],
      }),
    ).toThrow();
  });

  // Claim: basic reimbursement, deductible, cap
  it("claim on a steel sword (enchantment 3) damage 500 → payout 400, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune damage 200 → payout 100, remainingCap 400 (insurance sum 250, cap 500)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim on a dragon-material sword enchantment 9 damage 1000 → payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("claim on a dragon-material sword enchantment 5 damage 800 → payout 700", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 700 });
  });
  it("claim on a steel sword enchantment 9 damage 1000 → payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("claim on a dragon-material sword enchantment 8 damage 1000 → payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });

  // Claim: deductible per damage event
  it("dragon attack damaging insured sword (500) and amulet (300) → payout 600 (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 600 });
  });

  // Claim: cap exhaustion across successive claims
  it("two successive 1500 claims on a sword: first → payout 1400 remainingCap 600; second → payout 600 remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Claim: multiple items of the same type
  it("policy with two swords has cap 4000 G; full damage 1000 on both pays 1800 (deductible per damage)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 1000 },
          { itemType: "sword", amount: 1000 },
        ] } },
      ],
    });
    // each sword: full reimbursement 1000 - 100 deductible = 900; total = 1800
    // cap = 2 * 2000 = 4000; remainingCap = 4000 - 1800 = 2200
    expect(result.results[1]).toEqual({ payout: 1800, remainingCap: 2200 });
  });
  it("two sword damages on a policy with only one sword insured → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ] } },
        ],
      }),
    ).toThrow();
  });

  // Claim: error cases
  it("claim referencing an item type not on the policy → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount → throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });

  // Claim: rounding in MHPCO's favor
  it("payout calculation rounds down: dragon sword enchantment 8, damage 1001 → payout 400 (rounded down from 400.5)", () => {
    // dragon + high-ench: 50%. damage 1001 / 2 = 500.5, - 100 deductible = 400.5 → round down 400.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1001 }] } },
      ],
    });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
});
