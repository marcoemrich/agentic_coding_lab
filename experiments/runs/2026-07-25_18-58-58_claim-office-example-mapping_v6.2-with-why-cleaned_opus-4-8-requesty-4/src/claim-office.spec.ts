import { describe, it, expect } from "vitest";
import { runScenario, basePremium, premium, payout, insuranceSum } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums / price list (base premium in isolation) ---
  it("empty item list → base premium 0", () => {
    expect(basePremium([])).toBe(0);
  });
  it("single sword → base premium 100", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("single amulet → base premium 60", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("single staff → base premium 80", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("single potion → base premium 40", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("single rune (component) → base premium 25", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });

  // --- Building block of 3 alike components ---
  it("2 runes → base premium 50 (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes → base premium 60 (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes → base premium 100 (no block — block requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes → base premium 175 (no block — 7 is not exactly 3, so all singles: 7×25)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(sevenRunes)).toBe(175);
  });

  // --- "Alike" components (❓ same type, not same family) ---
  it("2 runes + 1 moonstone → base premium 75 (no block: different types)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones → base premium 120 (two separate blocks)", () => {
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

  // --- Modifier thresholds ---
  it("customer with exactly 2 years → loyalty discount applies", () => {
    expect(
      premium([{ type: "sword" }], { yearsWithMHPCO: 2, isFollowUp: false }),
    ).toBe(95);
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    expect(
      premium([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0, isFollowUp: false }),
    ).toBe(145);
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    expect(
      premium([{ type: "sword", enchantment: 4 }], { yearsWithMHPCO: 0, isFollowUp: false }),
    ).toBe(115);
  });
  it("cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply", () => {
    expect(
      premium([{ type: "sword", enchantment: 5, cursed: true }], {
        yearsWithMHPCO: 0,
        isFollowUp: false,
      }),
    ).toBe(195);
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword (100) + plain amulet (60) → curse surcharge is 50 (50% of cursed item base, not policy total)", () => {
    expect(
      premium([{ type: "sword", cursed: true }, { type: "amulet" }], {
        yearsWithMHPCO: 0,
        isFollowUp: false,
      }),
    ).toBe(231);
  });

  // --- Integration examples (full final premium incl. fee) ---
  it("newcomer (0 yrs, first contract) with cursed sword (steel, ench 3) → premium 165", () => {
    expect(
      premium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], {
        yearsWithMHPCO: 0,
        isFollowUp: false,
      }),
    ).toBe(165);
  });
  it("long-standing customer (3 yrs) second contract, cursed sword (steel, ench 7) → premium 160 (first-insurance still applies per item)", () => {
    expect(
      premium([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], {
        yearsWithMHPCO: 3,
        isFollowUp: true,
      }),
    ).toBe(160);
  });

  // --- Rounding ---
  it("premium calculation yielding a fraction → rounded UP (MHPCO favor, like spec 197.5→198)", () => {
    // single rune: base 25 + first-insurance 2.5 + fee 5 = 32.5 → ceil 33
    expect(premium([{ type: "rune" }], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(33);
  });
  it("payout calculation yielding 350.5 → final payout 350 (rounded down, MHPCO favor)", () => {
    // ench 8 → 50% of 901 = 450.5, minus 100 deductible = 350.5 → floor 350
    expect(payout([{ itemType: "sword", amount: 901 }], [{ type: "sword", enchantment: 8 }])).toBe(350);
  });

  // --- Edge cases: quote ---
  it("empty item list quote → premium 5 (processing fee only)", () => {
    expect(premium([], { yearsWithMHPCO: 0, isFollowUp: false })).toBe(5);
  });
  it("quote with unknown item type (broomstick) → throws / non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3), damage 500 → payout 400 (full minus 100 deductible)", () => {
    expect(
      payout([{ itemType: "sword", amount: 500 }], [{ type: "sword", material: "steel", enchantment: 3 }]),
    ).toBe(400);
  });
  it("rune (value 250), damage 200 → payout 100 (full minus 100 deductible, no special clause)", () => {
    expect(payout([{ itemType: "rune", amount: 200 }], [{ type: "rune" }])).toBe(100);
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("dragon sword, ench 8, damage 1000 → payout 400 (50% then deductible)", () => {
    expect(
      payout([{ itemType: "sword", amount: 1000 }], [{ type: "sword", material: "dragon", enchantment: 8 }]),
    ).toBe(400);
  });
  it("dragon sword, ench 5, damage 800 → payout 700 (dragon full reimburse, then deductible)", () => {
    expect(
      payout([{ itemType: "sword", amount: 800 }], [{ type: "sword", material: "dragon", enchantment: 5 }]),
    ).toBe(700);
  });
  it("steel sword, ench 9, damage 1000 → payout 400 (high-ench 50%, then deductible)", () => {
    expect(
      payout([{ itemType: "sword", amount: 1000 }], [{ type: "sword", material: "steel", enchantment: 9 }]),
    ).toBe(400);
  });
  it("dragon sword, ench 9, damage 1000 → payout 400 (both clauses, 50% wins, then deductible)", () => {
    expect(
      payout([{ itemType: "sword", amount: 1000 }], [{ type: "sword", material: "dragon", enchantment: 9 }]),
    ).toBe(400);
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible once per item)", () => {
    expect(
      payout(
        [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
        [{ type: "sword" }, { type: "amulet" }],
      ),
    ).toBe(600);
  });
  it("two swords both damaged → each damage entry gets its own deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 225 },
      { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("more damage entries of a type than covered → throws / non-zero exit (claim rejected)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Claim: cap ---
  it("policy of sword + amulet → insurance sum 1600, cap 3200", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("cursed sword → cap 2000 (based on unmodified insurance value)", () => {
    // premium modifiers (cursed, enchantment) do not change the insured value
    expect(insuranceSum([{ type: "sword", cursed: true, enchantment: 9 }])).toBe(1000);
  });
  it("policy of sword + 3 runes → insurance sum 1750 (block affects premium only)", () => {
    expect(
      insuranceSum([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(1750);
  });
  it("sword (cap 2000), two 1500 claims → first payout 1400 (cap left 600), second payout 600 (cap left 0)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- Claim: edge cases / errors ---
  it("claim references item not in policy (amulet when only sword insured) → throws / non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim with damage amount -200 → throws / non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
