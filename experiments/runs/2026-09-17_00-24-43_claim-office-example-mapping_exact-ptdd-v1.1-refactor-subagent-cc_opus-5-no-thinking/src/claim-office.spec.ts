import { describe, expect, it } from "vitest";
import { claim, createPolicy, quote, type Customer } from "./claim-office.js";

/**
 * A customer whose history contributes no policy-wide modifier: brand new to
 * MHPCO, so neither the loyalty discount nor the follow-up contract discount
 * applies. Quotes for this customer show base premiums and the first-insurance
 * surcharge on their own.
 */
const NEWCOMER: Customer = { yearsWithMHPCO: 0, previousContracts: 0 };

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    expect(quote(NEWCOMER, [])).toBe(5);
  });

  // --- Quote: base premiums per main item type (price list catalogue) ---
  it("quotes a single sword with no modifiers -- base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    expect(quote(NEWCOMER, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single amulet with no modifiers -- base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    expect(quote(NEWCOMER, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single staff with no modifiers -- base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    expect(quote(NEWCOMER, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single potion with no modifiers -- base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    expect(quote(NEWCOMER, [{ type: "potion" }])).toBe(49);
  });

  // --- Quote: component base premiums and building blocks ---
  it("quotes a single rune -- component base premium 25 G", () => {
    // 25 base + 2.5 first insurance + 5 fee = 32.5 -> rounded up in MHPCO's favour
    expect(quote(NEWCOMER, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone -- component base premium 25 G", () => {
    expect(quote(NEWCOMER, [{ type: "moonstone" }])).toBe(33);
  });
  it("quotes 2 runes -- base premium 50 G (no block)", () => {
    // 50 base + 5 first insurance + 5 fee = 60
    expect(quote(NEWCOMER, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes -- base premium 60 G (block applies)", () => {
    // 60 block base + 6 first insurance + 5 fee = 71
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote(NEWCOMER, runes)).toBe(71);
  });
  it("quotes 4 runes -- base premium 100 G (no block; block requires exactly 3)", () => {
    // 100 base + 10 first insurance + 5 fee = 115
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote(NEWCOMER, runes)).toBe(115);
  });
  it("quotes 7 runes -- base premium 175 G (no block; 7 is not exactly 3)", () => {
    // 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198 rounded up
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(NEWCOMER, runes)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: alike means same type)", () => {
    // 75 base + 7.5 first insurance + 5 fee = 87.5 -> 88 rounded up
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote(NEWCOMER, items)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks of alike components)", () => {
    // 60 + 60 base + 12 first insurance + 5 fee = 137
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(quote(NEWCOMER, items)).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50% curse surcharge to the cursed item's base premium", () => {
    // 100 base + 50 curse + 10 first insurance (10% of the 100 G base) + 5 fee = 165
    expect(quote(NEWCOMER, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30% high-enchantment surcharge at enchantment exactly 5", () => {
    // 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145
    expect(quote(NEWCOMER, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4", () => {
    // 100 base + 10 first insurance + 5 fee = 115
    expect(quote(NEWCOMER, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
    // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee = 195
    expect(quote(NEWCOMER, [{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item, not the policy total -- cursed sword + plain amulet -> 210 G before policy modifiers and fee", () => {
    // 160 policy base + 50 curse (50% of the sword's 100, not of 160) = 210
    // + 16 first insurance (10% of 160) + 5 fee = 231
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote(NEWCOMER, items)).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    const loyal = { yearsWithMHPCO: 2, previousContracts: 0 };
    expect(quote(loyal, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO", () => {
    // 100 base + 10 first insurance + 5 fee = 115
    const newish = { yearsWithMHPCO: 1, previousContracts: 0 };
    expect(quote(newish, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 10% first-insurance surcharge to every item in every quote, regardless of customer history", () => {
    // A long-standing customer's brand-new sword is still a first insurance:
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    const longStanding = { yearsWithMHPCO: 3, previousContracts: 0 };
    expect(quote(longStanding, [{ type: "sword" }])).toBe(95);
  });
  it("applies a 15% follow-up discount on the customer's second quote", () => {
    // 100 base + 10 first insurance - 15 follow-up contract + 5 fee = 100
    const returning = { yearsWithMHPCO: 0, previousContracts: 1 };
    expect(quote(returning, [{ type: "sword" }])).toBe(100);
  });
  it("applies no follow-up discount on the customer's first quote", () => {
    // 100 base + 10 first insurance + 5 fee = 115, no follow-up discount
    expect(quote(NEWCOMER, [{ type: "sword" }])).toBe(115);
  });
  it("adds the 5 G processing fee at the very end, after all other modifiers", () => {
    // The fee is flat: it is not discounted by loyalty nor surcharged by curse.
    // 100 base - 20 loyalty + 10 first insurance = 90, then + 5 fee = 95
    const loyal = { yearsWithMHPCO: 2, previousContracts: 0 };
    expect(quote(loyal, [{ type: "sword" }])).toBe(95);
  });

  // --- Quote: rounding in MHPCO's favor ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favor)", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(NEWCOMER, runes)).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    // 1 rune: 25 base + 2.5 first insurance = 27.5 kept as a fraction, + 5 fee
    // = 32.5 -> 33. Rounding the 27.5 intermediate first would give 33 too, so
    // use a case where it differs: 3 runes + 1 moonstone = 60 + 25 = 85 base,
    // + 8.5 first insurance = 93.5, + 5 fee = 98.5 -> 99.
    const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote(NEWCOMER, items)).toBe(99);
  });

  // --- Quote: integration examples ---
  it("integration: newcomer (0 years, first contract) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    // 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote(NEWCOMER, [sword])).toBe(165);
  });
  it("integration: 3-year customer's second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first
    // insurance - 15 follow-up contract = 155, + 5 fee = 160
    const customer = { yearsWithMHPCO: 3, previousContracts: 1 };
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote(customer, [sword])).toBe(160);
  });

  // --- Quote: rejection ---
  it("rejects a quote containing an unknown item type -- domain throws, CLI exits non-zero", () => {
    // Chosen reading: the domain rejects by throwing an Error naming the
    // unknown type; the CLI adapter turns that into a non-zero exit and a
    // stderr message, as asserted by the CLI tests below.
    expect(() => quote(NEWCOMER, [{ type: "broomstick" }])).toThrow(/broomstick/);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out full damage minus the 100 G deductible for a steel sword enchantment 3, damage 500 G -- payout 400 G", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword", material: "steel", enchantment: 3 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] });
    expect(result.payout).toBe(400);
  });
  it("pays out full damage minus the 100 G deductible for a rune (no enchantment, no material), damage 200 G -- payout 100 G", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "rune" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] });
    expect(result.payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G -> payout 600 G", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }, { type: "amulet" }]);
    const result = claim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  // --- Claim: special clauses ---
  it("reimburses 50% of damage for enchantment exactly 8 -- dragon sword enchantment 8, damage 1000 G -> payout 400 G", () => {
    // high-enchantment clause halves the damage first, then the deductible
    const policy = createPolicy(NEWCOMER, [{ type: "sword", material: "dragon", enchantment: 8 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("reimburses dragon material fully -- dragon sword enchantment 5, damage 800 G -> payout 700 G", () => {
    // only the dragon-material clause applies: full reimbursement, then deductible
    const policy = createPolicy(NEWCOMER, [{ type: "sword", material: "dragon", enchantment: 5 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] });
    expect(result.payout).toBe(700);
  });
  it("prefers the 50% rule when both clauses apply -- dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    // both clauses apply; the 50% rule wins, then the deductible: 500 - 100
    const policy = createPolicy(NEWCOMER, [{ type: "sword", material: "dragon", enchantment: 9 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });
  it("applies only the high-enchantment clause for a steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword", material: "steel", enchantment: 9 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] });
    expect(result.payout).toBe(400);
  });

  // --- Claim: insurance sum and cap ---
  it("caps payout at twice the insurance sum -- single sword policy: insurance sum 1000 G, cap 2000 G", () => {
    // reimbursement 5000 - 100 = 4900 exceeds the 2000 G cap
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] });
    expect(result.payout).toBe(2000);
    expect(result.policy.remainingCap).toBe(0);
  });
  it("sums insurance values across items -- sword + amulet: insurance sum 1600 G, cap 3200 G", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }, { type: "amulet" }]);
    const result = claim(policy, {
      cause: "fire",
      damages: [
        { itemType: "sword", amount: 5000 },
        { itemType: "amulet", amount: 5000 },
      ],
    });
    expect(result.payout).toBe(3200);
  });
  it("computes insurance sum 2000 G and cap 4000 G for a policy covering two swords", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }, { type: "sword" }]);
    expect(policy.insuranceSum).toBe(2000);
    const result = claim(policy, {
      cause: "fire",
      damages: [
        { itemType: "sword", amount: 9000 },
        { itemType: "sword", amount: 9000 },
      ],
    });
    expect(result.payout).toBe(4000);
  });
  it("computes insurance sum 1750 G for a sword + 3 runes (block affects premium only)", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const policy = createPolicy(NEWCOMER, items);
    expect(policy.insuranceSum).toBe(1750);
  });
  it("bases the cap on unmodified insurance value -- cursed sword (premium 165 G) still has cap 2000 G", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword", cursed: true }]);
    expect(policy.premium).toBe(165);
    expect(policy.insuranceSum).toBe(1000);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] });
    expect(result.payout).toBe(2000);
  });
  it("reports remainingCap after a claim -- sword policy, claim 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    // insurance sum 1000 -> cap 2000; payout 1500 - 100 = 1400 leaves 600
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(result.payout).toBe(1400);
    expect(result.policy.remainingCap).toBe(600);
  });
  it("reduces a later payout to the remaining cap -- second claim of 1500 G -> payout 600 G, remainingCap 0 G", () => {
    // sword: insurance sum 1000, cap 2000. First claim takes 1400 of it.
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }]);
    const first = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(first.payout).toBe(1400);
    expect(first.policy.remainingCap).toBe(600);
    const second = claim(first.policy, {
      cause: "flood",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(second.payout).toBe(600);
    expect(second.policy.remainingCap).toBe(0);
  });

  // --- Claim: multiple items of the same type ---
  it("treats each damage entry of the same itemType as a separate damage with its own deductible -- two swords damaged", () => {
    // 2 swords insured; each 500 G damage carries its own 100 G deductible
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }, { type: "sword" }]);
    const result = claim(policy, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });
  it("rejects a claim with more damage entries of a type than the policy covers -- domain throws, CLI exits non-zero", () => {
    // two sword damages but only one sword insured: the whole claim is rejected
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }]);
    expect(() =>
      claim(policy, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toThrow(/sword/);
  });

  // --- Claim: rounding in MHPCO's favor ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favor)", () => {
    // enchantment 9 halves 901 to 450.5, less the 100 G deductible = 350.5 -> 350
    const policy = createPolicy(NEWCOMER, [{ type: "sword", enchantment: 9 }]);
    const result = claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] });
    expect(result.payout).toBe(350);
  });

  // --- Claim: rejection ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) -- domain throws", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim referencing an unknown item type -- domain throws", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim with a negative damage amount (-200) -- domain throws", () => {
    const policy = createPolicy(NEWCOMER, [{ type: "sword" }]);
    expect(() =>
      claim(policy, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(/-200/);
  });
});
