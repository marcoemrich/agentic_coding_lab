import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { claim, createPolicy, quote } from "./claim-office.js";

/** Runs the claim-office CLI on a scenario, returning its stdout and status. */
function runCli(scenario: unknown): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return failure;
  }
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // --- Quote: base premiums per main item type ---
  it("quotes a single plain sword -- base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet -- base 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff -- base 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion -- base 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });

  // --- Quote: component base premiums and the building block ---
  it("quotes a single rune -- base 25 G component premium (25 + 2.5 + 5 -> 33 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone -- base 25 G component premium (25 + 2.5 + 5 -> 33 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });
  it("quotes 2 runes -- base premium 50 G (no block) (50 + 5 + 5 = 60 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes -- base premium 60 G (block applies) (60 + 6 + 5 = 71 G)", () => {
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(71);
  });
  it("quotes 4 runes -- base premium 100 G (no block: block requires exactly 3) (100 + 10 + 5 = 115 G)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(115);
  });
  it("quotes 7 runes -- base premium 175 G (no block: block requires exactly 3) (175 + 17.5 + 5 = 197.5 -> 198 G)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: different types) (75 + 7.5 + 5 = 87.5 -> 88 G)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks) (120 + 12 + 5 = 137 G)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium -- cursed sword 100 G -> 150 G (100 base + 50 curse + 10 first insurance + 5 fee = 165 G)", () => {
    const items = [{ type: "sword", cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5 -- sword 100 G -> 130 G (100 + 30 + 10 + 5 = 145 G)", () => {
    const items = [{ type: "sword", enchantment: 5 }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4 -- sword stays 100 G (100 + 10 + 5 = 115 G)", () => {
    const items = [{ type: "sword", enchantment: 4 }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 -- 100 G -> 180 G (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(195);
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("applies the curse surcharge only to the cursed item -- cursed sword + plain amulet -> 160 G base + 50 G = 210 G before further modifiers and fee (+16 first insurance + 5 fee = 231 G)", () => {
    const items = [
      { type: "sword", cursed: true },
      { type: "amulet", cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies the 10 % first insurance surcharge to every item in a quote regardless of customer history -- 3-year customer, plain sword: 100 + 10 first insurance - 20 loyalty + 5 fee = 95 G", () => {
    const items = [{ type: "sword" }];
    expect(quote({ yearsWithMHPCO: 3 }, items)).toBe(95);
  });
  it("applies the 20 % loyalty discount at exactly 2 years with MHPCO -- sword: 100 + 10 - 20 + 5 = 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO -- sword: 100 + 10 + 5 = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 15 % follow-up discount on each contract after the customer's first -- second contract, plain sword: 100 + 10 - 15 + 5 = 100 G", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 1 };
    expect(quote(customer, [{ type: "sword" }])).toBe(100);
  });
  it("applies no follow-up discount to the customer's first contract -- sword: 100 + 10 + 5 = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0, previousContracts: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("adds the 5 G processing fee at the very end of every premium -- 3-year customer, amulet: 60 + 6 - 12 = 54, + 5 fee = 59 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "amulet" }])).toBe(59);
  });

  // --- Quote: rounding in the MHPCO's favor ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favour)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium -- 3-year customer, 1 rune: 25 + 2.5 - 5 = 22.5, + 5 fee = 27.5 -> 28 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "rune" }])).toBe(28);
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) -- premium 165 G", () => {
    const customer = { yearsWithMHPCO: 0, previousContracts: 0 };
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ];
    expect(quote(customer, items)).toBe(165);
  });
  it("quotes a long-standing customer's second contract: cursed sword enchantment 7, 3 years -- premium 160 G", () => {
    const customer = { yearsWithMHPCO: 3, previousContracts: 1 };
    const items = [
      { type: "sword", material: "steel", enchantment: 7, cursed: true },
    ];
    expect(quote(customer, items)).toBe(160);
  });

  // --- Quote: rejection ---
  // Observable contract chosen here: the domain rejects by throwing an Error
  // naming the unknown type. The CLI translates that into a non-zero exit and
  // a stderr description; the spec fixes the CLI behaviour, not the mechanism.
  it("rejects a quote containing an unknown item type (e.g. broomstick) -- throws an Error naming the type", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(
      /broomstick/,
    );
  });

  // --- Claim: insurance sum and cap ---
  it("caps a single-sword policy at 2000 G (twice the 1000 G insurance sum) -- 1500 G damage pays 1400 G, 600 G cap left", () => {
    const policy = createPolicy([{ type: "sword" }]);
    expect(claim(policy, { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] })).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("sums insurance values across items -- sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 4000 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("bases the cap on unmodified insurance values -- cursed sword (premium 165 G) -> cap 2000 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ]);
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 5000 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("counts component insurance values at 250 G each -- sword + 3 runes -> insurance sum 1750 G (block affects premium only), cap 3500 G", () => {
    const policy = createPolicy([
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ]);
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 5000 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("counts two swords as insurance sum 2000 G, cap 4000 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    const incident = {
      cause: "dragon",
      damages: [{ itemType: "sword", amount: 6000 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 4000, remainingCap: 0 });
  });

  // --- Claim: standard reimbursement and deductible ---
  it("reimburses a regular steel sword (enchantment 3) damage of 500 G -- payout 400 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 500 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a rune damage of 200 G -- payout 100 G (no enchantment or material clause)", () => {
    const policy = createPolicy([{ type: "rune" }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "rune", amount: 200 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G -> payout 600 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats each damages entry of the same item type as a separate damage with its own deductible -- two damaged swords: (500-100) + (300-100) = 600 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // --- Claim: special clauses ---
  it("reimburses damage to an item with enchantment exactly 8 at 50 % -- dragon sword, damage 1000 G -> payout 400 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "dragon", enchantment: 8 },
    ]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses dragon-material damage fully -- dragon sword enchantment 5, damage 800 G -> payout 700 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "dragon", enchantment: 5 },
    ]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 800 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50 % high-enchantment rule win over full dragon reimbursement -- dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "dragon", enchantment: 9 },
    ]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the high-enchantment clause alone to a steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const policy = createPolicy([
      { type: "sword", material: "steel", enchantment: 9 },
    ]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays 1400 G on a first 1500 G claim against a 2000 G cap -- remainingCap 600 G", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap -- payout 600 G, remainingCap 0 G", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    };
    claim(policy, incident);
    expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding in the MHPCO's favor ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour) -- half-reimbursed sword, damage 901: 450.5 - 100 = 350.5", () => {
    const policy = createPolicy([{ type: "sword", enchantment: 8 }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 901 }],
    };
    expect(claim(policy, incident)).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) -- throws an Error naming the type", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "amulet", amount: 200 }],
    };
    expect(() => claim(policy, incident)).toThrow(/amulet/);
  });
  it("rejects a claim referencing an unknown item type -- throws an Error naming the type", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "broomstick", amount: 200 }],
    };
    expect(() => claim(policy, incident)).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- throws an Error naming the type", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ],
    };
    expect(() => claim(policy, incident)).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount (-200) -- throws an Error", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword", amount: -200 }],
    };
    expect(() => claim(policy, incident)).toThrow(/-200|negative|amount/);
  });

  // --- CLI: scenario orchestration and JSON contract ---
  it("reads a scenario from stdin and writes {results:[...]} to stdout in step order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("resolves a claim step's policy field to the zero-based index of the earlier quote step -- claim on step 1 settles against the second policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [
        { premium: 41 },
        { premium: 80 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("returns premium for quote results and payout + remainingCap for claim results", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    const { results } = JSON.parse(stdout) as { results: object[] };
    expect(Object.keys(results[0])).toEqual(["premium"]);
    expect(Object.keys(results[1]).sort()).toEqual(["payout", "remainingCap"]);
  });
});
