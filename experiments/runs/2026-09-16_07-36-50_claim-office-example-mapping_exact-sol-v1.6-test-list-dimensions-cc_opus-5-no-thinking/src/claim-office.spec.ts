import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { quote, runScenario } from "./claim-office.js";

// Observable contract for rejection cases:
// The specification states that rejections cause "the CLI exits with a non-zero
// status code and writes an error description to stderr". The most defensible
// reading for the domain layer is that the scenario runner throws an Error; the
// CLI adapter catches it, writes `error.message` to stderr and exits with 1.
// The spec does not establish a specific Error subtype or message text, so the
// tests below require only a thrown Error (plus the CLI's observable exit code
// and non-empty stderr), and no specific message.

describe("MHPCO quote -- item base premiums", () => {
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a single plain sword as 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet as 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff as 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion as 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune as 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone as 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });
  it("quotes a sword and an amulet as 181 G (160 base + 16 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }])).toBe(181);
  });
});

describe("MHPCO quote -- component building block of 3 alike components", () => {
  it("quotes 2 runes at base premium 50 G (no block) -- 60 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes at base premium 60 G (block applies) -- 71 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes at base premium 100 G (no block -- requires exactly 3) -- 115 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(4).fill({ type: "rune" }))).toBe(115);
  });
  it("quotes 7 runes at base premium 175 G (no block) -- 197.5 rounded up to 198 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone at base premium 75 G (no block: different types) -- 88 G total", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones at base premium 120 G (two separate blocks) -- 137 G total", () => {
    const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });
  it("quotes 3 moonstones at base premium 60 G (block applies to moonstones too) -- 71 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(3).fill({ type: "moonstone" }))).toBe(71);
  });
  it("quotes 3 runes + 1 moonstone at base premium 85 G (block plus loose component) -- 99 G total", () => {
    const items = [...Array(3).fill({ type: "rune" }), { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(99);
  });
});

describe("MHPCO quote -- item-specific modifiers", () => {
  it("adds a 50 % curse surcharge: cursed sword -> 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment 5: sword -> 145 G (100 + 30 + 10 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4: sword -> 115 G (100 + 10 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("adds both surcharges for a cursed sword with enchantment 5 -> 195 G (100 + 50 + 30 + 10 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item: cursed sword + plain amulet -> 231 G (160 base + 50 curse + 16 first insurance + 5 fee)", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });
  it("applies the high-enchantment surcharge only to the enchanted item: sword enchantment 6 + plain amulet -> 211 G (160 base + 30 + 16 + 5)", () => {
    const items = [{ type: "sword", enchantment: 6 }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(211);
  });
  it("applies the curse surcharge to a cursed component: cursed rune -> 44.5 rounded up to 45 G (25 + 12.5 curse + 2.5 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune", cursed: true }])).toBe(45);
  });
});

describe("MHPCO quote -- policy-wide modifiers", () => {
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO: sword -> 95 G (100 - 20 + 10 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO: sword -> 115 G (100 + 10 + 5)", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge to every quote: plain sword -> 115 G (100 + 10 + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 15 % follow-up discount on the second quote of a scenario: sword -> 100 G (100 + 10 - 15 + 5)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("applies the 15 % follow-up discount on the third quote as well (each contract after the first)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
  });
  it("computes the loyalty discount from the policy base premium, not per item: sword + amulet at 2 years -> 149 G (160 + 16 - 32 + 5)", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 2 }, items)).toBe(149);
  });
});

describe("MHPCO quote -- rounding in the MHPCO's favor", () => {
  it("rounds a premium of 197.5 G up to 198 G", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium -- 3 cursed runes -> 108.5 rounded up to 109 G", () => {
    // block 60 base + 3 x 12.5 curse + 6 first insurance + 5 fee = 108.5
    const items = Array(3).fill({ type: "rune", cursed: true });
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(109);
  });
});

describe("MHPCO quote -- integration examples", () => {
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(165);
  });
  it("quotes a long-standing customer's second contract cursed sword (enchantment 7, 3 years) as 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("MHPCO quote -- rejections", () => {
  it("throws an Error when a quote item has an unknown type (e.g. broomstick)", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(Error);
  });
});

describe("MHPCO claim -- insurance sum and cap", () => {
  it("caps a sword policy at 2000 G (2 x insurance sum 1000 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("caps a sword + amulet policy at 3200 G (2 x insurance sum 1600 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("caps a cursed sword policy at 2000 G -- premium modifiers do not raise the cap (premium 165 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("caps a sword + 3 runes (block) policy at 3500 G -- insurance sum 1750 G; the block discount affects the premium only", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("caps a two-sword policy at 4000 G (insurance sum 2000 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
});

describe("MHPCO claim -- standard reimbursement and deductible", () => {
  it("pays 400 G for a regular steel sword (enchantment 3) with 500 G damage (500 - 100 deductible)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune with 200 G damage (runes have no enchantment or material, so no special clause)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -> payout 600 G", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 0 G when the damage amount is below the 100 G deductible (payout is not negative)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe("MHPCO claim -- special clauses", () => {
  it("reimburses 50 % for enchantment exactly 8: steel sword, damage 1000 G -> payout 400 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses in full below the enchantment threshold: steel sword enchantment 7, damage 1000 G -> payout 900 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("reimburses 50 % for a steel sword with enchantment 9, damage 1000 G -> payout 400 G (only the high-enchantment clause)", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a dragon-material sword in full: enchantment 5, damage 800 G -> payout 700 G", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50 % rule win over dragon material: dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const results = runScenario({
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
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50 % rule win at exactly enchantment 8: dragon sword, damage 1000 G -> payout 400 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe("MHPCO claim -- cap exhaustion across claims", () => {
  it("pays 1400 G for a first 1500 G claim on a sword policy and leaves 600 G cap remaining", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remaining cap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("pays 0 G with remaining cap 0 G for a third claim once the cap is exhausted", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim, claim],
    });
    expect(results[3]).toEqual({ payout: 0, remainingCap: 0 });
  });
  it("reports the full cap as remainingCap when a claim pays nothing", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "scuff", damages: [{ itemType: "amulet", amount: 100 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 1200 });
  });
});

describe("MHPCO claim -- multiple items of the same type", () => {
  it("treats two sword damage entries on a two-sword policy as separate damages, each with its own deductible -- payout 600 G", () => {
    const results = runScenario({
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("throws an Error when the damages contain more entries of a type than the policy covers (two sword damages, one sword insured)", () => {
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
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow(Error);
  });
});

describe("MHPCO claim -- rejections", () => {
  it("throws an Error when a damage entry references an item not covered by the policy (amulet damaged, only a sword insured)", () => {
    expect(() =>
      runScenario({
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
    ).toThrow(Error);
  });
  it("throws an Error when a damage entry has an unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
          },
        ],
      }),
    ).toThrow(Error);
  });
  it("throws an Error when a damage entry has a negative amount (amount: -200)", () => {
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
    ).toThrow(Error);
  });
});

describe("MHPCO claim -- rounding in the MHPCO's favor", () => {
  it("rounds a payout of 350.5 G down to 350 G", () => {
    // enchantment 8 halves 901 to 450.5; minus the 100 G deductible = 350.5
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe("MHPCO scenario runner", () => {
  it("returns one result per step in the same order as the input steps", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });
    expect(results).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
      { premium: 62 },
    ]);
  });
  it("resolves a claim's policy field to the zero-based index of the quote step that created the policy", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(results[2]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("runs the schema example: amulet quote then 200 G fire claim -> premium 59 G, payout 100 G, remainingCap 1100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
});

const execFileAsync = promisify(execFile);

interface CliOutcome {
  code: number;
  stdout: string;
  stderr: string;
}

async function runCli(input: unknown): Promise<CliOutcome> {
  const child = execFileAsync("npx", ["tsx", "src/cli.ts"]);
  child.child.stdin?.end(JSON.stringify(input));
  try {
    const { stdout, stderr } = await child;
    return { code: 0, stdout, stderr };
  } catch (error) {
    const failure = error as { code?: number; stdout?: string; stderr?: string };
    return { code: failure.code ?? 1, stdout: failure.stdout ?? "", stderr: failure.stderr ?? "" };
  }
}

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results: [...]} JSON to stdout with exit code 0", async () => {
    const { code, stdout } = await runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("exits with a non-zero status code and writes an error description to stderr for an unknown item type, writing no results to stdout", async () => {
    const { code, stdout, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(code).not.toBe(0);
    expect(stderr.trim()).not.toBe("");
    expect(stdout).toBe("");
  });
  it("exits with a non-zero status code and writes an error description to stderr for a claim on an uninsured item", async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr.trim()).not.toBe("");
  });
  it("exits with a non-zero status code and writes an error description to stderr for a negative damage amount", async () => {
    const { code, stderr } = await runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(code).not.toBe(0);
    expect(stderr.trim()).not.toBe("");
  });
});
