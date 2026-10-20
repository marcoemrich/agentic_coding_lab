import { describe, it, expect } from "vitest";
import { runScenario, type Incident, type Item } from "./claim-office.js";

const quoteFor = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });

const quotesFor = (itemsPerQuote: Item[][], yearsWithMHPCO = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: itemsPerQuote.map((items) => ({ op: "quote" as const, items })),
  });

const claimFor = (items: Item[], incident: Incident, yearsWithMHPCO = 0) =>
  runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident },
    ],
  });

describe("MHPCO Claim Office - quote: base premiums", () => {
  it("should return premium 5 G for an empty item list (processing fee only)", () => {
    expect(quoteFor([])).toEqual({ results: [{ premium: 5 }] });
  });
  it("should return premium 115 G for a single plain sword (100 G base + 10 G first insurance + 5 G fee)", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    expect(quoteFor([sword])).toEqual({ results: [{ premium: 115 }] });
  });
  it("should return premium 71 G for a single plain amulet (60 G base + 6 G first insurance + 5 G fee)", () => {
    const amulet: Item = { type: "amulet", material: "silver", enchantment: 3, cursed: false };

    expect(quoteFor([amulet])).toEqual({ results: [{ premium: 71 }] });
  });
  it("should return premium 93 G for a single plain staff (80 G base + 8 G first insurance + 5 G fee)", () => {
    const staff: Item = { type: "staff", material: "oak", enchantment: 3, cursed: false };

    expect(quoteFor([staff])).toEqual({ results: [{ premium: 93 }] });
  });
  it("should return premium 49 G for a single plain potion (40 G base + 4 G first insurance + 5 G fee)", () => {
    const potion: Item = { type: "potion" };

    expect(quoteFor([potion])).toEqual({ results: [{ premium: 49 }] });
  });
  it("should return premium 33 G for a single rune (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
    const rune: Item = { type: "rune" };

    expect(quoteFor([rune])).toEqual({ results: [{ premium: 33 }] });
  });
  it("should sum the base premiums of a sword and an amulet to 181 G (160 G base + 16 G first insurance + 5 G fee)", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const amulet: Item = { type: "amulet", material: "silver", enchantment: 3, cursed: false };

    expect(quoteFor([sword, amulet])).toEqual({ results: [{ premium: 181 }] });
  });
});

describe("MHPCO Claim Office - quote: component building block", () => {
  it("should charge 50 G base premium for 2 runes (no block)", () => {
    const rune: Item = { type: "rune" };

    // 50 G base + 5 G first insurance + 5 G fee
    expect(quoteFor([rune, rune])).toEqual({ results: [{ premium: 60 }] });
  });
  it("should charge 60 G base premium for 3 runes (block applies)", () => {
    const rune: Item = { type: "rune" };

    // 60 G base + 6 G first insurance + 5 G fee
    expect(quoteFor([rune, rune, rune])).toEqual({ results: [{ premium: 71 }] });
  });
  it("should charge 100 G base premium for 4 runes (no block - block requires exactly 3)", () => {
    const rune: Item = { type: "rune" };

    // 100 G base + 10 G first insurance + 5 G fee
    expect(quoteFor([rune, rune, rune, rune])).toEqual({ results: [{ premium: 115 }] });
  });
  it("should charge 175 G base premium for 7 runes", () => {
    const rune: Item = { type: "rune" };

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G -> 198 G
    expect(quoteFor([rune, rune, rune, rune, rune, rune, rune])).toEqual({
      results: [{ premium: 198 }],
    });
  });
  it("should charge 75 G base premium for 2 runes and 1 moonstone (no block: different types)", () => {
    const rune: Item = { type: "rune" };
    const moonstone: Item = { type: "moonstone" };

    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G -> 88 G
    expect(quoteFor([rune, rune, moonstone])).toEqual({ results: [{ premium: 88 }] });
  });
  it("should charge 120 G base premium for 3 runes and 3 moonstones (two separate blocks)", () => {
    const rune: Item = { type: "rune" };
    const moonstone: Item = { type: "moonstone" };

    // 120 G base + 12 G first insurance + 5 G fee
    expect(quoteFor([rune, rune, rune, moonstone, moonstone, moonstone])).toEqual({
      results: [{ premium: 137 }],
    });
  });
});

describe("MHPCO Claim Office - quote: item-specific modifiers", () => {
  it("should add a 50% curse surcharge to the cursed item's base premium", () => {
    const cursedSword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: true };

    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    expect(quoteFor([cursedSword])).toEqual({ results: [{ premium: 165 }] });
  });
  it("should add a 30% high-enchantment surcharge for a sword with exactly enchantment 5", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 5, cursed: false };

    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(quoteFor([sword])).toEqual({ results: [{ premium: 145 }] });
  });
  it("should not add a high-enchantment surcharge for a sword with enchantment 4", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 4, cursed: false };

    // 100 G base + 10 G first insurance + 5 G fee (no high-enchantment surcharge)
    expect(quoteFor([sword])).toEqual({ results: [{ premium: 115 }] });
  });
  it("should add both curse and high-enchantment surcharges for a cursed sword with enchantment 5", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 5, cursed: true };

    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    expect(quoteFor([sword])).toEqual({ results: [{ premium: 195 }] });
  });
  it("should apply the curse surcharge only to the cursed sword's base premium in a policy with a cursed sword and a plain amulet (160 G base + 50 G curse + 16 G first insurance)", () => {
    const cursedSword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const amulet: Item = { type: "amulet", material: "silver", enchantment: 3, cursed: false };

    expect(quoteFor([cursedSword, amulet])).toEqual({ results: [{ premium: 231 }] });
  });
});

describe("MHPCO Claim Office - quote: policy-wide modifiers", () => {
  it("should apply a 20% loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
    expect(quoteFor([sword], 2)).toEqual({ results: [{ premium: 95 }] });
  });
  it("should not apply a loyalty discount for a customer with 1 year with MHPCO", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    // 100 G base + 10 G first insurance + 5 G fee (no loyalty discount)
    expect(quoteFor([sword], 1)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should add a 10% first insurance surcharge on the policy base premium of every quote", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    // 100 G base + 10 G first insurance + 5 G fee
    expect(quoteFor([sword])).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply a 15% follow-up contract discount on the customer's second quote", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    // step 0: 100 G base + 10 G first insurance + 5 G fee
    // step 1: 100 G base + 10 G first insurance - 15 G follow-up + 5 G fee
    expect(quotesFor([[sword], [sword]])).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });
  it("should not apply a follow-up contract discount on the customer's first quote", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    // 100 G base + 10 G first insurance + 5 G fee (no follow-up discount)
    expect(quoteFor([sword])).toEqual({ results: [{ premium: 115 }] });
  });
  it("should add the 5 G processing fee at the very end", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    // the fee is a flat addition after all modifiers: a 2-year customer's
    // discounted premium of 90 G becomes 95 G, not 90 G * 0.8 + 5 G
    expect(quoteFor([sword], 2)).toEqual({ results: [{ premium: 95 }] });
  });
});

describe("MHPCO Claim Office - quote: rounding in MHPCO's favor", () => {
  it("should round a premium of 197.5 G up to 198 G", () => {
    const rune: Item = { type: "rune" };

    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G -> 198 G
    expect(quoteFor([rune, rune, rune, rune, rune, rune, rune])).toEqual({
      results: [{ premium: 198 }],
    });
  });
  it("should keep intermediate amounts as fractions and round only the final premium", () => {
    const rune: Item = { type: "rune" };

    // second quote for a single rune:
    //   25 G base + 2.5 G first insurance - 3.75 G follow-up + 5 G fee
    //   = 28.75 G -> 29 G
    // rounding each intermediate in MHPCO's favor instead would give
    //   25 + 3 - 3 + 5 = 30 G
    expect(quotesFor([[rune], [rune]])).toEqual({
      results: [{ premium: 33 }, { premium: 29 }],
    });
  });
});

describe("MHPCO Claim Office - quote: integration examples", () => {
  it("should quote 165 G for a newcomer with a cursed steel sword at enchantment 3", () => {
    const cursedSword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: true };

    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
    expect(quoteFor([cursedSword], 0)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote 160 G for a 3-year customer's second contract with a cursed steel sword at enchantment 7", () => {
    const cursedSword: Item = { type: "sword", material: "steel", enchantment: 7, cursed: true };

    // step 0: 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
    //         + 10 G first insurance = 170 G + 5 G fee = 175 G
    // step 1: 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
    //         + 10 G first insurance - 15 G follow-up = 155 G + 5 G fee = 160 G
    expect(quotesFor([[cursedSword], [cursedSword]], 3)).toEqual({
      results: [{ premium: 175 }, { premium: 160 }],
    });
  });
});

describe("MHPCO Claim Office - claim: standard reimbursement", () => {
  it("should pay out 400 G for 500 G damage to a regular steel sword at enchantment 3 (deductible 100 G)", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };

    // 500 G damage - 100 G deductible = 400 G payout; cap 2000 G - 400 G = 1600 G
    expect(claimFor([sword], incident)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should pay out 100 G for 200 G damage to a rune (no enchantment level or material)", () => {
    const rune: Item = { type: "rune" };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] };

    // 200 G damage - 100 G deductible = 100 G payout; cap 500 G - 100 G = 400 G
    expect(claimFor([rune], incident)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("should apply the 100 G deductible once per damaged item, paying 600 G for 500 G sword plus 300 G amulet damage", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const amulet: Item = { type: "amulet", material: "silver", enchantment: 3, cursed: false };
    const incident: Incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };

    // (500 G - 100 G) + (300 G - 100 G) = 600 G payout; cap 3200 G - 600 G = 2600 G
    expect(claimFor([sword, amulet], incident)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("should treat two sword damage entries as separate damages, each with its own deductible", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };

    // (500 G - 100 G) + (300 G - 100 G) = 600 G payout; cap 4000 G - 600 G = 3400 G
    expect(claimFor([sword, sword], incident)).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
});

describe("MHPCO Claim Office - claim: special clauses", () => {
  it("should pay out 400 G for 1000 G damage to a steel sword at enchantment 9 (50% first, then deductible)", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 9, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };

    // 1000 G damage * 50% = 500 G - 100 G deductible = 400 G payout; cap 2000 G - 400 G = 1600 G
    expect(claimFor([sword], incident)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should pay out 700 G for 800 G damage to a dragon-material sword at enchantment 5 (full reimbursement, then deductible)", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 5, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };

    // dragon material: full reimbursement 800 G - 100 G deductible = 700 G payout;
    // cap 2000 G - 700 G = 1300 G
    expect(claimFor([sword], incident)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("should pay out 400 G for 1000 G damage to a dragon-material sword at enchantment 9 (50% rule wins, then deductible)", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 9, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };

    // both clauses apply; the 50% rule wins: 1000 G * 50% = 500 G
    // - 100 G deductible = 400 G payout; cap 2000 G - 400 G = 1600 G
    expect(claimFor([sword], incident)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should pay out 400 G for 1000 G damage to a dragon-material sword at exactly enchantment 8", () => {
    const sword: Item = { type: "sword", material: "dragon", enchantment: 8, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };

    // the high-enchantment clause starts at exactly 8: 1000 G * 50% = 500 G
    // - 100 G deductible = 400 G payout; cap 2000 G - 400 G = 1600 G
    expect(claimFor([sword], incident)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
});

describe("MHPCO Claim Office - claim: rounding and insurance sum", () => {
  it("should round a payout of 350.5 G down to 350 G", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 9, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] };

    // 901 G damage * 50% = 450.5 G - 100 G deductible = 350.5 G -> 350 G payout;
    // cap 2000 G - 350 G = 1650 G
    expect(claimFor([sword], incident)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("should compute insurance sum 2000 G and cap 4000 G for a policy covering two swords", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 100 }],
    };

    // insurance sum 2 x 1000 G = 2000 G -> cap 4000 G
    // payout 100 G - 100 G deductible = 0 G, so remainingCap reveals the full cap
    expect(claimFor([sword, sword], incident)).toEqual({
      results: [{ premium: 225 }, { payout: 0, remainingCap: 4000 }],
    });
  });
  it("should compute insurance sum 1600 G and cap 3200 G for a policy covering a sword and an amulet", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const amulet: Item = { type: "amulet", material: "silver", enchantment: 3, cursed: false };
    const incident: Incident = {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 100 }],
    };

    // insurance sum 1000 G + 600 G = 1600 G -> cap 3200 G
    // payout 100 G - 100 G deductible = 0 G, so remainingCap reveals the full cap
    expect(claimFor([sword, amulet], incident)).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }],
    });
  });
  it("should compute insurance sum 1750 G for a policy covering a sword and 3 runes (block affects premium only)", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const rune: Item = { type: "rune" };
    const incident: Incident = {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 100 }],
    };

    // insurance sum 1000 G + 3 x 250 G = 1750 G -> cap 3500 G
    // the 3-rune block discount applies to the premium (100 G + 60 G block
    // + 16 G first insurance + 5 G fee = 181 G) but must NOT reduce the
    // insurance sum: a block-discounted sum would be 1000 + 60 = 1060 G -> cap 2120 G
    expect(claimFor([sword, rune, rune, rune], incident)).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("should compute cap 2000 G for a cursed sword (premium modifiers do not raise the cap)", () => {
    const cursedSword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const incident: Incident = {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 100 }],
    };

    // premium carries the 50% curse surcharge (165 G), but the cap is based on
    // the unmodified insurance value: 1000 G -> cap 2000 G
    expect(claimFor([cursedSword], incident)).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
});

describe("MHPCO Claim Office - claim: cap exhaustion", () => {
  it("should pay out 1400 G with remainingCap 600 G for a first 1500 G claim against a sword policy", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };

    // 1500 G damage - 100 G deductible = 1400 G payout; cap 2000 G - 1400 G = 600 G
    expect(claimFor([sword], incident)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("should pay out 600 G with remainingCap 0 G for a second 1500 G claim against the same sword policy", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };

    // cap 2000 G; first claim pays 1400 G leaving 600 G, so the second claim's
    // desired 1400 G is reduced to the remaining cap of 600 G
    expect(
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "claim", policy: 0, incident },
          { op: "claim", policy: 0, incident },
        ],
      }),
    ).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
});

describe("MHPCO Claim Office - errors", () => {
  it("should reject a quote containing an item with an unknown type", () => {
    const broomstick: Item = { type: "broomstick" };

    expect(() => quoteFor([broomstick])).toThrow(/broomstick/);
  });
  it("should reject a claim whose damage entry references an item not part of the policy", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] };

    expect(() => claimFor([sword], incident)).toThrow(/amulet/);
  });
  it("should reject a claim whose damage entry has an unknown item type", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = {
      cause: "fire",
      damages: [{ itemType: "broomstick", amount: 500 }],
    };

    expect(() => claimFor([sword], incident)).toThrow(/broomstick/);
  });
  it("should reject a claim containing a damage entry with a negative amount", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };

    expect(() => claimFor([sword], incident)).toThrow(/-200/);
  });
  it("should reject a claim with more damage entries of a type than the policy covers", () => {
    const sword: Item = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const incident: Incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };

    // the policy insures ONE sword, but the claim reports TWO sword damages
    expect(() => claimFor([sword], incident)).toThrow(/sword/);
  });
});
