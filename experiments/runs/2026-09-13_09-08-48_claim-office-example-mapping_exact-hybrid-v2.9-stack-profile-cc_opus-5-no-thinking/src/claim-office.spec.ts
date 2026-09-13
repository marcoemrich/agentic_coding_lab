import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums: single items ---
  it("should charge 5 G for an empty item list — only the processing fee", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
  });
  it("should quote a plain sword — 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a plain amulet — 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a plain staff — 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote a plain potion — 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
  });
  it("should quote a single rune — 25 G base + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Building block of 3 alike components ---
  it("should quote 2 runes — 50 G base premium (no block), 60 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("should quote 3 runes — 60 G base premium (block applies), 71 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote 4 runes — 100 G base premium (no block: block requires exactly 3), 115 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote 7 runes — 175 G base premium, 198 G total (197.5 rounded up)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });

  // --- "Alike" means exactly the same type ---
  it("should quote 2 runes + 1 moonstone — 75 G base premium (no block: different types), 88 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
  });
  it("should quote 3 runes + 3 moonstones — 120 G base premium (two separate blocks), 137 G total", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("should add a 50% curse surcharge — cursed sword base 100 G + 50 G curse, 165 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should add a 30% high-enchantment surcharge at exactly enchantment 5 — sword base 100 G + 30 G, 145 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
  });
  it("should not add a high-enchantment surcharge at enchantment 4 — sword base 100 G only, 115 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply both surcharges to a cursed sword with enchantment 5 — 100 G + 50 G + 30 G, 195 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("should apply a 20% loyalty discount at exactly 2 years with MHPCO — 95 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("should not apply a loyalty discount at 1 year with MHPCO — 115 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply a 10% first insurance surcharge to every item in a quote — sword + amulet, 181 G total", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 181 }] });
  });
  it("should apply a 15% follow-up discount on the customer's second contract — first quote 115 G, second quote 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // --- Modifier scope on multi-item policies ---
  it("should apply the curse surcharge only to the cursed item — cursed sword + plain amulet: base 160 G + 50 G curse = 210 G before further modifiers and fee, 231 G total", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding in MHPCO's favour ---
  it("should round a premium of 197.5 G up to 198 G — 7 runes: 175 base + 17.5 first insurance + 5 fee", () => {
    // 7 * 25 = 175 base; + 17.5 first insurance (10% of 175, kept fractional)
    // + 5 fee = 197.5, which rounds up in the MHPCO's favour.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
  });
  it("should round a payout of 350.5 G down to 350 G — 901 damage halved to 450.5, less 100 deductible", () => {
    // enchantment 9 >= 8, so 50% of 901 = 450.5 (kept fractional);
    // - 100 deductible = 350.5, which rounds DOWN in the MHPCO's favour.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Integration examples ---
  it("should quote a newcomer's cursed sword (0 years, steel, enchantment 3) — 100 base + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
    // The spec's own breakdown:
    //   100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote a long-standing customer's second contract (3 years, cursed sword, enchantment 7) — 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 160 G", () => {
    // Step 1 is the spec's example: 100 + 50 + 30 - 20 + 10 - 15 = 155, + 5 fee = 160.
    // Step 0 exists only to make step 1 a follow-up; it is the same minus the
    // 15 G follow-up discount: 100 + 50 + 30 - 20 + 10 = 170, + 5 fee = 175.
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [cursedSword] },
        { op: "quote", items: [cursedSword] },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 175 }, { premium: 160 }],
    });
  });

  // --- Claims: standard reimbursement ---
  it("should pay out 400 G for a regular sword (steel, enchantment 3) with 500 G damage — full reimbursement minus 100 G deductible, remaining cap 1600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should pay out 100 G for a rune (no enchantment, no material) with 200 G damage — no special clause applies, remaining cap 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claims: special clauses ---
  it("should pay out 400 G for a steel sword, enchantment 9, damage 1000 G — 50% clause then deductible, remaining cap 1600 G", () => {
    const scenario = {
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
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should pay out 700 G for a dragon-material sword, enchantment 5, damage 800 G — full reimbursement then deductible, remaining cap 1300 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("should pay out 400 G for a dragon-material sword, enchantment 9, damage 1000 G — the 50% rule wins, then deductible, remaining cap 1600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should pay out 400 G for a dragon-material sword at exactly enchantment 8, damage 1000 G — 50% clause then deductible, remaining cap 1600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claims: deductible per damage event ---
  it("should apply the 100 G deductible once per damaged item — sword 500 G + amulet 300 G = 600 G payout, remaining cap 2600 G", () => {
    const scenario = {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claims: insurance sum and cap ---
  it("should report the remaining cap after a claim — sword policy (cap 2000 G), damage 500 G leaves 1600 G, payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should base the cap on the unmodified insurance value — cursed sword premium 165 G but cap 2000 G, payout 400 G leaves 1600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should cap a policy covering a sword and an amulet at 3200 G (insurance sum 1600 G) — 500 G sword damage pays 400 G, leaving 2800 G", () => {
    const scenario = {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 2800 }],
    });
  });
  it("should exclude the block discount from the insurance sum — sword + 3 runes: insurance sum 1750 G, cap 3500 G, 500 G sword damage leaves 3100 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
    });
  });

  // --- Claims: cap exhaustion across successive claims ---
  it("should pay out 1400 G and leave 600 G cap for a first 1500 G claim on a sword policy — premium 115 G", () => {
    const scenario = {
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
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("should reduce a second 1500 G claim to the remaining 600 G cap, leaving 0 G — first claim pays 1400 G, second pays 600 G", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claim,
        claim,
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Multiple items of the same type ---
  it("should insure two swords — insurance sum 2000 G, cap 4000 G, premium 225 G, 500 G damage leaves 3600 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 400, remainingCap: 3600 }],
    });
  });
  it("should treat two sword damage entries as separate damages, each with its own deductible — 500 G + 300 G pays 600 G, leaving 3400 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });

  // --- Error handling ---
  it("should reject a quote containing an unknown item type (broomstick) — runScenario throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    expect(() => runScenario(scenario)).toThrow(/broomstick/i);
  });
  it("should reject a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) — runScenario throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/amulet/i);
  });
  it("should reject a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) — runScenario throws", () => {
    const scenario = {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow(/sword/i);
  });
  it("should reject a claim containing a damage entry with a negative amount (-200) — runScenario throws", () => {
    const scenario = {
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
    };

    expect(() => runScenario(scenario)).toThrow(/negative|-200/i);
  });

  // --- Multi-step scenarios ---
  it("should process steps sequentially and return results in the same order and length as the input steps — quote, claim, quote, claim", () => {
    // step 0 quote (first contract):  100 + 10 first insurance + 5 fee = 115
    // step 1 claim on policy 0:       500 - 100 = 400; cap 2000 - 400 = 1600
    // step 2 quote (follow-up):       60 + 6 first insurance - 9 follow-up + 5 = 62
    // step 3 claim on policy 2:       400 - 100 = 300; cap 1200 - 300 = 900
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 2,
          incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 400 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
        { premium: 62 },
        { payout: 300, remainingCap: 900 },
      ],
    });
  });
  it("should resolve a claim's policy reference by the zero-based index of the quote step that created it — claim names policy 1 (amulet), not policy 0 (sword)", () => {
    // Resolving policy 0 instead would throw (`damaged item not insured: amulet`),
    // and if the sword policy somehow applied its cap would be 2000, leaving 1700.
    // The amulet policy's cap is 2 * 600 = 1200, so 1200 - 300 = 900.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 400 }] },
        },
      ],
    };

    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 62 }, { payout: 300, remainingCap: 900 }],
    });
  });
});
