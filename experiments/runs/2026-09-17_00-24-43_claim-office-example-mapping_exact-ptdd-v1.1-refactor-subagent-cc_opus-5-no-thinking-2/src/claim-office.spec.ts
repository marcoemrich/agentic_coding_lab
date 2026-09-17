import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { claim } from "./claim.js";
import { insuranceSum, payoutCap } from "./policy-cover.js";
import { runScenario } from "./scenario.js";
import { quote } from "./quote.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // --- Quote: base premiums per main item type ---
  it("quotes a plain sword -- base premium 100 G", () => {
    // 100 G base + 10 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("quotes a plain amulet -- base premium 60 G", () => {
    // 60 G base + 6 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("quotes a plain staff -- base premium 80 G", () => {
    // 80 G base + 8 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("quotes a plain potion -- base premium 40 G", () => {
    // 40 G base + 4 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // --- Quote: component base premiums and the building block ---
  it("quotes 1 rune -- base premium 25 G", () => {
    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 -> 33 (rounded up)
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("quotes 1 moonstone -- base premium 25 G", () => {
    // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 -> 33 (rounded up)
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });
  it("quotes 2 runes -- base premium 50 G (no block)", () => {
    // 50 G base + 5 G first insurance + 5 G fee
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0),
    ).toBe(60);
  });
  it("quotes 3 runes -- base premium 60 G (block applies)", () => {
    // 60 G block base + 6 G first insurance + 5 G fee
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes, 0)).toBe(71);
  });
  it("quotes 4 runes -- base premium 100 G (no block; block requires exactly 3)", () => {
    // 100 G base + 10 G first insurance + 5 G fee
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(115);
  });
  it("quotes 7 runes -- base premium 175 G (no block; block requires exactly 3)", () => {
    // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 -> 198 (rounded up)
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: different types)", () => {
    // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 -> 88 (rounded up)
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    // 120 G base + 12 G first insurance + 5 G fee
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(137);
  });
  it("quotes 3 moonstones -- base premium 60 G (block applies per component type)", () => {
    // 60 G block base + 6 G first insurance + 5 G fee
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(quote({ yearsWithMHPCO: 0 }, moonstones, 0)).toBe(71);
  });

  // --- Quote: item-specific modifiers ---
  it("quotes a cursed sword -- adds 50 % of that item's base premium (50 G curse surcharge)", () => {
    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
  });
  it("quotes a sword with enchantment 5 -- adds 30 % high-enchantment surcharge (30 G)", () => {
    // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(145);
  });
  it("quotes a sword with enchantment 4 -- no high-enchantment surcharge", () => {
    // 100 G base + 10 G first insurance + 5 G fee
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(115);
  });
  it("quotes a cursed sword with enchantment 5 -- both surcharges apply (50 G + 30 G)", () => {
    // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(195);
  });

  // --- Quote: policy-wide modifiers ---
  it("quotes for a customer with 2 years -- 20 % loyalty discount applies (threshold inclusive)", () => {
    // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("quotes for a customer with 1 year -- no loyalty discount", () => {
    // 100 G base + 10 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("quotes for a customer with 3 years -- 20 % loyalty discount applies", () => {
    // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("quotes any item -- 10 % initial assessment surcharge applies to every quote's items", () => {
    // Each item in a quote is a first insurance regardless of customer history:
    // 100 G base - 20 G loyalty - 15 G follow-up + 10 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 5 }, [{ type: "sword" }], 2)).toBe(80);
  });
  it("quotes a second contract in the same scenario -- 15 % follow-up contract discount applies", () => {
    // 100 G base - 15 G follow-up contract + 10 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("quotes a third contract in the same scenario -- 15 % follow-up contract discount applies", () => {
    // 100 G base - 15 G follow-up contract + 10 G first insurance + 5 G fee
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 2)).toBe(100);
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("quotes a cursed sword + plain amulet -- policy base 160 G, curse surcharge only 50 G (on the cursed item)", () => {
    // 160 G policy base + 50 G curse (50 % of the sword only)
    // + 16 G first insurance (10 % of the policy base) + 5 G fee
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(231);
  });

  // --- Quote: rounding in the MHPCO's favor ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favor)", () => {
    // 7 runes: 175 G base + 17.5 G first insurance + 5 G fee = 197.5 -> 198
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("keeps intermediate premium amounts as fractions and rounds only the final premium", () => {
    // 2 runes on a follow-up contract: 50 G base + 5 G first insurance
    // - 7.5 G follow-up + 5 G fee = 52.5 -> 53.
    // Rounding each modifier instead would give 50 + 5 - 8 + 5 = 52.
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 1)).toBe(53);
  });

  // --- Quote: integration examples ---
  it("newcomer (0 years) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(165);
  });
  it("3-year customer's second quote with a cursed steel sword enchantment 7 -- premium 160 G", () => {
    // 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
    // + 10 G first insurance - 15 G follow-up contract = 155 G + 5 G fee
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [sword], 1)).toBe(160);
  });

  // --- Quote: rejection ---
  it("rejects a quote with an unknown item type (e.g. broomstick) -- CLI exits non-zero, error on stderr, no results on stdout", () => {
    // Observable contract: the domain throws; the CLI turns that into a
    // non-zero exit with the message on stderr.
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(
      /broomstick/,
    );
  });

  // --- Insurance sum and cap ---
  it("policy of one sword -- insurance sum 1000 G, cap 2000 G", () => {
    const items = [{ type: "sword" }];
    expect(insuranceSum(items)).toBe(1000);
    expect(payoutCap(items)).toBe(2000);
  });
  it("policy of a sword + amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(insuranceSum(items)).toBe(1600);
    expect(payoutCap(items)).toBe(3200);
  });
  it("policy of two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(insuranceSum(items)).toBe(2000);
    expect(payoutCap(items)).toBe(4000);
  });
  it("policy of a sword + 3 runes -- insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
    // 1000 G sword + 3 x 250 G runes; the block discount is a premium
    // concession only and does not reduce the insurance sum.
    const items = [
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    expect(insuranceSum(items)).toBe(1750);
    expect(payoutCap(items)).toBe(3500);
  });
  it("cursed sword (premium 165 G) -- cap 2000 G from the unmodified insurance value", () => {
    // Premium modifiers do not raise the cap.
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
    expect(insuranceSum([cursedSword])).toBe(1000);
    expect(payoutCap([cursedSword])).toBe(2000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("claims a steel sword enchantment 3 with damage 500 G -- payout 400 G (full minus 100 G deductible)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: 500 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(400);
  });
  it("claims a rune (no enchantment, no material) with damage 200 G -- payout 100 G (full minus deductible)", () => {
    // Runes have no enchantment level or material, so no special clause applies.
    const items = [{ type: "rune" }];
    const damages = [{ itemType: "rune", amount: 200 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(100);
  });
  it("claims damage below the deductible -- payout 0 G (never negative)", () => {
    // Reading adopted: a payout is money paid out, so the deductible can
    // reduce it to nothing but never turns it into a debt to the MHPCO.
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: 50 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(0);
  });

  // --- Claim: special clauses ---
  it("claims a steel sword enchantment 9 with damage 1000 G -- payout 400 G (50 % clause, then deductible)", () => {
    // 50 % of 1000 = 500, then the 100 G deductible.
    const items = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(400);
  });
  it("claims a steel sword enchantment 8 with damage 1000 G -- payout 400 G (threshold >= 8 inclusive)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 8, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(400);
  });
  it("claims a steel sword enchantment 7 with damage 1000 G -- payout 900 G (no high-enchantment clause)", () => {
    // Enchantment 7 is below the claim threshold of 8, unlike the premium
    // side where 5 already carries a surcharge.
    const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(900);
  });
  it("claims a dragon-material sword enchantment 5 with damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    // Only the dragon-material clause applies: full reimbursement, then deductible.
    const items = [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }];
    const damages = [{ itemType: "sword", amount: 800 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(700);
  });
  it("claims a dragon-material sword enchantment 8 with damage 1000 G -- payout 400 G (50 % rule wins, then deductible)", () => {
    // Both clauses apply; the 50 % rule wins, then the deductible.
    const items = [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(400);
  });
  it("claims a dragon-material sword enchantment 9 with damage 1000 G -- payout 400 G (50 % rule wins, then deductible)", () => {
    // Both clauses apply; the 50 % rule wins: 500 G, then the deductible.
    const items = [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(400);
  });

  // --- Claim: deductible per damage event ---
  it("claims a dragon attack damaging a sword (500 G) and an amulet (300 G) -- payout 600 G (deductible once per damaged item)", () => {
    // (500 - 100) + (300 - 100) = 600
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(600);
  });
  it("claims two sword damages on a two-sword policy -- each entry gets its own deductible", () => {
    // Each {itemType: "sword"} entry is a separate damage: (500 - 100) x 2 = 800
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(800);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("first claim of 1500 G on a 1000 G sword policy -- payout 1400 G, remainingCap 600 G", () => {
    // Insurance sum 1000 G, cap 2000 G; 1500 - 100 = 1400 is within the cap.
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = claim(items, damages, payoutCap(items));
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("second claim of 1500 G on the same policy -- payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    // The desired 1400 G is reduced to the 600 G the cap still allows.
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = claim(items, damages, 600);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
  it("claim after the cap is exhausted -- payout 0 G, remainingCap 0 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1500 }];
    const result = claim(items, damages, 0);
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(0);
  });

  // --- Claim: rounding in the MHPCO's favor ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favor)", () => {
    // Enchantment 8, damage 901: 450.5 reimbursed - 100 deductible = 350.5 -> 350
    const items = [{ type: "sword", material: "steel", enchantment: 8, cursed: false }];
    const damages = [{ itemType: "sword", amount: 901 }];
    expect(claim(items, damages, payoutCap(items)).payout).toBe(350);
  });

  // --- Claim: rejection ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) -- CLI exits non-zero, error on stderr", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "amulet", amount: 300 }];
    expect(() => claim(items, damages, payoutCap(items))).toThrow(/amulet/);
  });
  it("rejects a claim referencing an unknown item type -- CLI exits non-zero, error on stderr", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "broomstick", amount: 300 }];
    expect(() => claim(items, damages, payoutCap(items))).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- CLI exits non-zero, error on stderr", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(() => claim(items, damages, payoutCap(items))).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount (-200) -- CLI exits non-zero, error on stderr", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: -200 }];
    expect(() => claim(items, damages, payoutCap(items))).toThrow(/-200/);
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    };
    // Results are the same length and order as the steps. The second quote
    // is a follow-up contract: 60 + 6 first insurance - 9 follow-up + 5 fee.
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 115 }, { premium: 62 }],
    });
  });
  it("CLI produces {premium} for quote steps and {payout, remainingCap} for claim steps", () => {
    const scenario = {
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
    };
    // amulet 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI resolves a claim's policy field to the zero-based index of the earlier quote step", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        // policy 1 is the amulet quote, not the sword quote
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] },
        },
      ],
    };
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    const { results } = JSON.parse(stdout);
    // The amulet policy: insurance sum 600, cap 1200; 500 - 100 = 400 paid.
    expect(results[2]).toEqual({ payout: 400, remainingCap: 800 });
  });
});
