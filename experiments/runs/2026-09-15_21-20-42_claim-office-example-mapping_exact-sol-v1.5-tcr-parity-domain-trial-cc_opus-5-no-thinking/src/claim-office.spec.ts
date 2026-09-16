import { describe, expect, it } from "vitest";
import { claim, quote } from "./claim-office.js";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(scenario: unknown): { results: unknown[] } {
  const stdout = execFileSync("npx", ["tsx", CLI], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return JSON.parse(stdout);
}

// Observable failure contract (chosen reading, not stated by the spec):
// the domain layer throws an Error with a descriptive message; src/cli.ts
// translates that into a non-zero exit status plus a stderr description.

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest cases and base premiums ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
  it("quotes a single plain sword -- base 100 G + 5 G fee = 105 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(115);
  });
  it("quotes a single plain amulet -- base 60 G + 5 G fee = 65 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }], 0),
    ).toBe(71);
  });
  it("quotes a single plain staff -- base 80 G + 5 G fee = 85 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "staff", material: "oak", enchantment: 2, cursed: false }], 0),
    ).toBe(93);
  });
  it("quotes a single plain potion -- base 40 G + 5 G fee = 45 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "potion", material: "glass", enchantment: 1, cursed: false }], 0),
    ).toBe(49);
  });
  it("quotes a single rune -- base 25 G + 5 G fee = 30 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("quotes a single moonstone -- base 25 G + 5 G fee = 30 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });

  // --- Component building blocks (exactly 3 alike) ---
  it("quotes 2 runes -- 50 G base premium (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("quotes 3 runes -- 60 G base premium (block applies)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0),
    ).toBe(71);
  });
  it("quotes 4 runes -- 100 G base premium (no block; block requires exactly 3)", () => {
    const fourRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, fourRunes, 0)).toBe(115);
  });
  it("quotes 7 runes -- 175 G base premium", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- 75 G base premium (no block: different types)", () => {
    const mixed = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, mixed, 0)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- 120 G base premium (two separate blocks)", () => {
    const twoBlocks = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, twoBlocks, 0)).toBe(137);
  });

  // --- Item-specific modifiers ---
  it("applies 50% curse surcharge to the cursed item's base premium -- cursed sword base 150 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
  it("applies 30% high-enchantment surcharge at enchantment exactly 5 -- sword base 130 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5, cursed: false }], 0),
    ).toBe(145);
  });
  it("applies no high-enchantment surcharge at enchantment 4 -- sword base 100 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 4, cursed: false }], 0),
    ).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges when cursed at enchantment exactly 5 -- sword base 180 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 5, cursed: true }], 0),
    ).toBe(195);
  });
  it("scopes the curse surcharge to the cursed item only -- cursed sword + plain amulet = 210 G before policy modifiers and fee", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, policy, 0)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("applies 20% loyalty discount at exactly 2 years with MHPCO", () => {
    expect(
      quote({ yearsWithMHPCO: 2 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO", () => {
    expect(
      quote({ yearsWithMHPCO: 1 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(115);
  });
  it("applies 10% first-insurance surcharge on the policy base premium", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 0),
    ).toBe(115);
  });
  it("applies 15% follow-up discount on each contract after the customer's first", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 1),
    ).toBe(100);
  });
  it("applies the first-insurance surcharge on a follow-up contract too (each quote's items are first insurances)", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }], 1),
    ).toBe(80);
  });

  // --- Rounding (premium up, payout down, only at the end) ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes, 0)).toBe(198);
  });
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favor)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] };
    expect(claim(policy, incident).payout).toBe(350);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    // A single rune yields exactly 32.5 G before rounding (25 base + 10% first
    // insurance + 5 fee). Rounding the item premium first would lose the .5.
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
    // Three alike moonstones form a block (60 G) plus one rune (25 G) = 85 G
    // base; 85 * 1.1 + 5 = 98.5 G, rounded up once at the end.
    const blockPlusOne = [
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      { type: "rune" },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, blockPlusOne, 0)).toBe(99);
  });

  // --- Quote integration examples ---
  it("quotes newcomer with a cursed sword -- 100 base + 50 curse + 10 first = 160 + 5 fee = 165 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
  it("quotes long-standing customer's second contract, cursed sword enchantment 7 -- 155 + 5 fee = 160 G", () => {
    expect(
      quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 1),
    ).toBe(160);
  });

  // --- Quote rejection ---
  it("rejects a quote containing an unknown item type (e.g. broomstick) -- throws Error, no results written", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 0)).toThrow(/broomstick/);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out a regular sword (steel, enchantment 3) damage 500 G -- payout 400 G (500 - 100 deductible)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("pays out rune damage 200 G -- payout 100 G (no enchantment or material, so no special clause)", () => {
    const policy = [{ type: "rune" }];
    const incident = { cause: "flood", damages: [{ itemType: "rune", amount: 200 }] };
    expect(claim(policy, incident).payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G = payout 600 G", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident).payout).toBe(600);
  });

  // --- Claim: special clauses ---
  it("reimburses 50% for damage at enchantment exactly 8 -- dragon sword, damage 1000 G, payout 400 G", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }];
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("fully reimburses dragon material at enchantment 5 -- damage 800 G, payout 700 G", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }];
    const incident = { cause: "rockfall", damages: [{ itemType: "sword", amount: 800 }] };
    expect(claim(policy, incident).payout).toBe(700);
  });
  it("prefers the 50% rule over dragon material at enchantment 9 -- damage 1000 G, payout 400 G", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }];
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });
  it("applies only the high-enchantment clause for a steel sword at enchantment 9 -- damage 1000 G, payout 400 G", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(claim(policy, incident).payout).toBe(400);
  });

  // --- Claim: insurance sum and cap ---
  it("caps a policy at twice the insurance sum -- sword + amulet: sum 1600 G, cap 3200 G", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(2800);
  });
  it("bases the cap on unmodified insurance value -- cursed sword: cap 2000 G despite 165 G premium", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    // The premium reflects the curse surcharge ...
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
    // ... but the cap is twice the unmodified insurance value of 1000 G.
    const incident = { cause: "inspection", damages: [] };
    expect(claim([cursedSword], incident).remainingCap).toBe(2000);
  });
  it("excludes the block discount from the insurance sum -- sword + 3 runes: sum 1750 G", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    // The premium reflects the 60 G block discount (100 + 60 = 160 listed).
    expect(quote({ yearsWithMHPCO: 0 }, policy, 0)).toBe(181);
    // The insurance sum does not: 1000 + 3 * 250 = 1750 G, so the cap is 3500 G.
    const incident = { cause: "inspection", damages: [] };
    expect(claim(policy, incident).remainingCap).toBe(3500);
  });
  it("covers two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = { cause: "inspection", damages: [] };
    expect(claim(policy, incident).remainingCap).toBe(4000);
  });
  it("treats each damage entry of the same type as a separate damage with its own deductible", () => {
    const policy = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    const result = claim(policy, incident);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(3400);
  });
  it("reduces the payout to the remaining cap -- first claim 1500 G pays 1400 G, remaining cap 600 G", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = claim(policy, incident);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("pays only the remaining cap on a second claim -- second claim 1500 G pays 600 G, remaining cap 0 G", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    const first = claim(policy, incident);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(policy, incident, first.remainingCap);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // --- Claim rejection ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only sword insured) -- throws Error", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] };
    expect(() => claim(policy, incident)).toThrow(/amulet/);
  });
  it("rejects a claim with an unknown damaged item type -- throws Error", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] };
    expect(() => claim(policy, incident)).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers -- throws Error", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount (-200) -- throws Error", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => claim(policy, incident)).toThrow(/-200|negative/);
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "rune" }] },
      ],
    };
    expect(runCli(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 29 }] });
  });
  it("CLI processes the schema example -- quote then claim against policy 0", () => {
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
    expect(runCli(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits non-zero and writes an error description to stderr on an invalid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    let failure: { status?: number; stdout?: string; stderr?: string } | undefined;
    try {
      execFileSync("npx", ["tsx", CLI], { input: JSON.stringify(scenario), encoding: "utf8" });
    } catch (error) {
      failure = error as { status?: number; stdout?: string; stderr?: string };
    }
    expect(failure).toBeDefined();
    expect(failure?.status).not.toBe(0);
    expect(failure?.stderr).toMatch(/broomstick/);
    expect(failure?.stdout).toBe("");
  });
});
