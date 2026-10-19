import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { quote } from "./claim-office.js";
import { runScenario } from "./scenario.js";

describe("MHPCO claim office", () => {
  // --- Base premiums per item type (price list) ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a single plain sword at base 100 G -> premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet at base 60 G -> premium 71 G (60 + 6 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff at base 80 G -> premium 93 G (80 + 8 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion at base 40 G -> premium 49 G (40 + 4 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune component at base 25 G -> premium 33 G (25 + 2.5 first insurance = 27.5 -> 5 fee -> 32.5 rounded up to 33)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone component at base 25 G -> premium 33 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });

  // --- Building block of 3 alike components ---
  it("quotes 2 runes as base premium 50 G (no block)", () => {
    // observed through quote: 50 base + 5 first insurance + 5 fee = 60
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes as base premium 60 G (block applies)", () => {
    // observed through quote: 60 base + 6 first insurance + 5 fee = 71
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes)).toBe(71);
  });
  it("quotes 4 runes as base premium 100 G (no block -- block requires exactly 3)", () => {
    // observed through quote: 100 base + 10 first insurance + 5 fee = 115
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(115);
  });
  it("quotes 7 runes as base premium 175 G (no block -- block requires exactly 3)", () => {
    // observed through quote: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });

  // --- "Alike" components means exactly the same type ---
  it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: different types)", () => {
    // observed through quote: 75 base + 7.5 first insurance + 5 fee = 87.5 -> 88
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks of alike types)", () => {
    // observed through quote: 120 base + 12 first insurance + 5 fee = 137
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });

  // --- Item-specific modifiers ---
  it("adds a 50% curse surcharge to a cursed item's base premium (cursed sword: 100 + 50)", () => {
    // first insurance is 10% of the policy base premium 100 = 10 (spec integration example)
    // 150 base+curse + 10 first insurance + 5 fee = 165
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30% high-enchantment surcharge for enchantment 5 (sword: 100 + 30)", () => {
    // 130 base+surcharge + 10 first insurance (10% of base 100) + 5 fee = 145
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge for enchantment 4 (sword: base 100 only)", () => {
    // observed through quote: 100 base + 10 first insurance + 5 fee = 115
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 (100 + 50 + 30)", () => {
    // 180 base+surcharges + 10 first insurance (10% of base 100) + 5 fee = 195
    const sword = { type: "sword", cursed: true, enchantment: 5 };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(195);
  });

  // --- Modifier scope on multi-item policies ---
  it("applies the curse surcharge only to the cursed item's base premium: cursed sword + plain amulet -> 160 base + 50 curse = 210 G before policy modifiers and fee", () => {
    // policy base premium 160 (100 + 60); curse adds 50 (50% of the sword only) -> 210
    // first insurance is 10% of the policy base premium 160 = 16 -> 210 + 16 + 5 fee = 231
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20% loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
    // 100 base + 10 first insurance + 5 fee = 115
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 10% first-insurance surcharge on the policy base premium of every quote", () => {
    // each item in a quote is a first insurance regardless of customer history:
    // 3-year customer, new staff -> 80 base - 16 loyalty + 8 first insurance + 5 fee = 77
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "staff" }])).toBe(77);
  });
  it("applies a 15% follow-up discount on each contract after the customer's first quote in the scenario", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // first contract: 100 + 10 first insurance + 5 fee = 115
    // second contract: 100 - 15 follow-up + 10 first insurance + 5 fee = 100
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("adds the 5 G processing fee at the very end of every premium", () => {
    // the fee is added after all percentage modifiers, so it is never scaled by them:
    // 100 base - 20 loyalty + 10 first insurance = 90, then + 5 fee = 95
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
    // with no items there is nothing to modify, so the fee alone remains
    expect(quote({ yearsWithMHPCO: 2 }, [])).toBe(5);
  });

  // --- Rounding in MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> rounded up in MHPCO's favour
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });
  it("rounds a payout of 350.5 G down to 350 G", () => {
    // enchantment 9 sword, damage 901: 50% of 901 = 450.5, minus 100 deductible = 350.5
    // intermediate amounts stay fractional; only the final payout is rounded, downwards
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Integration premium examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as premium 165 G", () => {
    // spec integration example: 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) as premium 160 G", () => {
    // spec integration example: 100 base + 50 curse + 30 high enchantment
    // - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Insurance sum and cap ---
  it("reports a policy covering a sword and an amulet as insurance sum 1600 G with cap 3200 G", () => {
    // insurance sum 1000 + 600 = 1600, cap = 2 x 1600 = 3200
    // a 300 G amulet damage pays 200 G (minus deductible), leaving 3000 G of cap
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 200, remainingCap: 3000 });
  });
  it("reports a policy covering two swords as insurance sum 2000 G with cap 4000 G", () => {
    // insurance sum 2 x 1000 = 2000, cap 4000; a 300 G sword damage pays 200, leaving 3800
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 200, remainingCap: 3800 });
  });
  it("bases the cap on unmodified insurance values: cursed sword (premium 165 G) still has cap 2000 G", () => {
    // premium modifiers do not raise the cap: insurance sum 1000, cap 2000
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "curse backfire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("reports a policy covering a sword and 3 runes as insurance sum 1750 G (block discount affects premium only), cap 3500 G", () => {
    // insurance sum 1000 + 3 x 250 = 1750 (no block discount), cap 3500
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 200, remainingCap: 3300 });
  });

  // --- Standard claim reimbursement and deductible ---
  it("pays out 400 G for a steel sword (enchantment 3) with 500 G damage (full reimbursement minus 100 G deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays out 100 G for a rune (no enchantment or material) with 200 G damage (full reimbursement minus 100 G deductible)", () => {
    // runes have no enchantment level or material, so no special clause applies
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G damage -> payout 600 G", () => {
    // insurance sum 1600, cap 3200; (500-100) + (300-100) = 600
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats each damages entry for the same item type as a separate damage with its own deductible (two swords, 500 G each -> 800 G)", () => {
    // two swords insured: insurance sum 2000, cap 4000; (500-100) x 2 = 800
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Special claim clauses ---
  it("reimburses damage to an item with enchantment >= 8 at 50% before the deductible (steel sword enchantment 9, 1000 G -> 400 G)", () => {
    // 50% of 1000 = 500, then the deductible: 500 - 100 = 400
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the high-enchantment clause at exactly enchantment 8 (dragon sword, 1000 G damage -> 400 G)", () => {
    // spec: dragon-material sword with exactly enchantment 8, damage 1000 -> payout 400
    // (the high-enchantment clause applies, then the deductible)
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon-material damage before the deductible (dragon sword enchantment 5, 800 G -> 700 G)", () => {
    // only the dragon-material clause applies: full reimbursement, then the deductible
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50% high-enchantment rule win over dragon material (dragon sword enchantment 9, 1000 G -> 400 G)", () => {
    // both clauses apply; the 50% rule wins, then the deductible: 500 - 100 = 400
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Cap exhaustion across successive claims ---
  it("reports remainingCap after a claim: sword policy (cap 2000 G), claim 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a later payout to the remaining cap: second claim of 1500 G -> payout 600 G, remainingCap 0 G", () => {
    // successive claims share one cap: first pays 1400 (600 left), the second
    // desires 1400 but is reduced to the remaining 600
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

  // --- CLI contract ---
  it("CLI reads a scenario from stdin and writes {results:[...]} to stdout in step order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const stdout = execFileSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    // amulet: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI result for a quote step contains only premium; for a claim step contains payout and remainingCap", () => {
    const stdout = execFileSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      }),
      encoding: "utf8",
    });
    const [quoteResult, claimResult] = (JSON.parse(stdout) as { results: object[] }).results;
    expect(Object.keys(quoteResult)).toEqual(["premium"]);
    expect(Object.keys(claimResult).sort()).toEqual(["payout", "remainingCap"]);

    // a refused document exits non-zero, describes the refusal on stderr, and writes no results
    const refused = spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      encoding: "utf8",
    });
    expect(refused.status).not.toBe(0);
    expect(refused.stderr).toMatch(/broomstick/);
    expect(refused.stdout).toBe("");
  });

  // --- Rejections: CLI exits non-zero and writes an error description to stderr (adopted reading: domain throws Error, CLI maps to exit code 1 + stderr) ---
  it("rejects a quote containing an item of unknown type (e.g. broomstick) -- throws Error, CLI exits non-zero with stderr description and no results on stdout", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim whose damage item is not part of the policy (amulet damaged when only a sword is insured) -- throws Error, CLI exits non-zero with stderr description", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim whose damage item has an unknown type -- throws Error, CLI exits non-zero with stderr description", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] } },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- throws Error, CLI exits non-zero with stderr description", () => {
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
              damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("rejects a claim containing a damage entry with a negative amount (-200) -- throws Error, CLI exits non-zero with stderr description", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      }),
    ).toThrow(/-200|negative/);
  });
  it("rejects a claim referencing a policy step index that is not a quote -- throws Error, CLI exits non-zero with stderr description", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 7, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
        ],
      }),
    ).toThrow(/7/);
  });
});
