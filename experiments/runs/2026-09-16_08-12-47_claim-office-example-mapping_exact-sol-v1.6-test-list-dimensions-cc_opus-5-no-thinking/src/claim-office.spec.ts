import { describe, expect, it } from "vitest";
import {
  createPolicy,
  quote,
  runScenario,
  settleClaim,
  type Scenario,
} from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Base premiums per item type (parallel price-list catalogue) ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a single sword -- base premium 100 G, premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single amulet -- base premium 60 G, premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single staff -- base premium 80 G, premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single potion -- base premium 40 G, premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune -- base premium 25 G, premium 33 G (25 + 2.5 first insurance + 5 fee, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone -- base premium 25 G, premium 33 G (component price list applies to moonstone too)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });

  // --- Component building block of 3 alike components ---
  it("quotes 2 runes -- base premium 50 G (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes -- base premium 60 G (block applies)", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes)).toBe(71);
  });
  it("quotes 4 runes -- base premium 100 G (no block -- block requires exactly 3)", () => {
    const fourRunes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, fourRunes)).toBe(115);
  });
  it("quotes 7 runes -- base premium 175 G (no block at 7)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: alike means same type)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks, one per type)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });

  // --- Item-specific modifiers ---
  it("quotes a cursed sword -- 50 % curse surcharge on the item base premium (100 -> 150)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("quotes a sword with enchantment 5 -- 30 % high-enchantment surcharge applies at the threshold (100 -> 130)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("quotes a sword with enchantment 4 -- no high-enchantment surcharge (100 -> 100)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("quotes a cursed sword with enchantment 5 -- both item surcharges apply (100 + 50 + 30 = 180)", () => {
    const item = { type: "sword", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [item])).toBe(195);
  });
  it("quotes a cursed sword and a plain amulet -- item surcharge applies only to the cursed item: 160 base + 50 curse = 210 before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("quotes for a customer with exactly 2 years -- 20 % loyalty discount applies on the policy base premium", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("quotes for a customer with 1 year -- no loyalty discount", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge on the policy base premium of every quote", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies a 15 % follow-up discount on the customer's second quote and no follow-up discount on the first", () => {
    const customer = { yearsWithMHPCO: 0 };
    expect(quote(customer, [{ type: "sword" }], 0)).toBe(115);
    expect(quote(customer, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies the 15 % follow-up discount to the third quote as well (each contract after the first)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 2)).toBe(100);
  });
  it("adds the 5 G processing fee at the very end, after all percentage modifiers", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 1)).toBe(80);
  });

  // --- Premium rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in the MHPCO's favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
  });
  it("rounds only the final premium, keeping intermediate amounts as fractions", () => {
    // 25 base + 2.5 first insurance - 5 loyalty - 3.75 follow-up = 18.75, + 5 fee = 23.75 -> 24
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "rune" }], 1)).toBe(24);
  });

  // --- Premium integration examples ---
  it("newcomer (0 years, first contract) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(165);
  });
  it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 1)).toBe(160);
  });

  // --- Quote rejection ---
  it("rejects a quote containing an unknown item type (e.g. broomstick) -- throws an Error (observable contract: CLI exits non-zero, error on stderr, no results on stdout)", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(
      /unknown item type: broomstick/i,
    );
  });

  // --- Insurance sum and cap ---
  it("reports cap 2000 G for a policy covering one sword (2 x insurance sum 1000 G)", () => {
    expect(createPolicy([{ type: "sword" }]).capInG).toBe(2000);
  });
  it("reports cap 3200 G for a policy covering a sword and an amulet (insurance sum 1600 G)", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSumInG).toBe(1600);
    expect(policy.capInG).toBe(3200);
  });
  it("reports cap 4000 G for a policy covering two swords (insurance sum 2000 G)", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(policy.insuranceSumInG).toBe(2000);
    expect(policy.capInG).toBe(4000);
  });
  it("reports cap 3500 G for a policy covering a sword and 3 runes -- insurance sum 1750 G (block discount does not reduce the insurance sum)", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const policy = createPolicy(items);
    expect(policy.insuranceSumInG).toBe(1750);
    expect(policy.capInG).toBe(3500);
  });
  it("reports cap 2000 G for a cursed sword -- premium modifiers do not raise the cap (unmodified insurance value)", () => {
    const cursedSword = { type: "sword", cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
    expect(createPolicy([cursedSword]).capInG).toBe(2000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("claims 500 G damage on a regular steel sword enchantment 3 -- payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(settleClaim(policy, incident).payout).toBe(400);
  });
  it("claims 200 G damage on a rune (no enchantment, no material) -- payout 100 G (no special clause applies)", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const incident = { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] };
    expect(settleClaim(policy, incident).payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -- payout 600 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(settleClaim(policy, incident).payout).toBe(600);
  });

  // --- Claim: special clauses ---
  it("claims 1000 G damage on a steel sword enchantment 9 -- payout 400 G (50 % high-enchantment clause first, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
    const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(settleClaim(policy, incident).payout).toBe(400);
  });
  it("claims 1000 G damage on a dragon-material sword enchantment 8 -- payout 400 G (high-enchantment clause at the threshold, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(settleClaim(policy, incident).payout).toBe(400);
  });
  it("claims 800 G damage on a dragon-material sword enchantment 5 -- payout 700 G (dragon clause only: full reimbursement, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] };
    expect(settleClaim(policy, incident).payout).toBe(700);
  });
  it("claims 1000 G damage on a dragon-material sword enchantment 9 -- payout 400 G (50 % rule wins over dragon material, then deductible)", () => {
    const policy = createPolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(settleClaim(policy, incident).payout).toBe(400);
  });

  // --- Claim: multiple items of the same type ---
  it("claims two sword damages against a policy covering two swords -- each damage entry gets its own deductible", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(settleClaim(policy, incident).payout).toBe(800);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- throws an Error (CLI exits non-zero)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => settleClaim(policy, incident)).toThrow(/not covered by the policy: sword/i);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("first claim of 1500 G against a sword policy -- payout 1400 G, remainingCap 600 G", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(settleClaim(policy, incident)).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("second successive claim of 1500 G against the same policy -- payout 600 G, remainingCap 0 G (desired payout reduced to remaining cap)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(settleClaim(policy, incident)).toEqual({ payout: 1400, remainingCap: 600 });
    expect(settleClaim(policy, incident)).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Payout rounding ---
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favor)", () => {
    // 901 halved by the high-enchantment clause = 450.5, minus the 100 G deductible = 350.5
    const policy = createPolicy([{ type: "sword", enchantment: 9 }]);
    const incident = { cause: "curse", damages: [{ itemType: "sword", amount: 901 }] };
    expect(settleClaim(policy, incident).payout).toBe(350);
  });

  // --- Claim rejection ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) -- throws an Error (CLI exits non-zero)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] };
    expect(() => settleClaim(policy, incident)).toThrow(/not covered by the policy: amulet/i);
  });
  it("rejects a claim whose damage entry has an unknown item type -- throws an Error (CLI exits non-zero)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] };
    expect(() => settleClaim(policy, incident)).toThrow(/not covered by the policy: broomstick/i);
  });
  it("rejects a claim with a negative damage amount (-200) -- throws an Error (CLI exits non-zero)", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => settleClaim(policy, incident)).toThrow(/negative damage amount/i);
  });

  // --- Scenario runner: sequential steps, results aligned to steps ---
  it("runs a scenario and returns results in the same length and order as the input steps", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    } satisfies Scenario;
    // amulet 60 base, +10 % first insurance - 20 % loyalty = 54, + 5 fee = 59
    // payout 200 - 100 deductible = 100; cap 1200, remaining 1100
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("resolves a claim step's policy field as the zero-based index of the quote step that created the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    } satisfies Scenario;
    const { results } = runScenario(scenario);
    // the claim settles against the amulet policy (cap 1200), not the sword policy
    expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
});
